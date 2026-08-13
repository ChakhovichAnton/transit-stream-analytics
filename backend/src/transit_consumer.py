import json
import ssl
import signal
import sys
import paho.mqtt.client as mqtt
from confluent_kafka import Producer
from pydantic import ValidationError
import structlog
from prometheus_client import start_http_server

from src.schemas.transit_vehicle_pos import DigiTransitVehiclePos
from src.core.avro import get_avro_payload
from src.crud.road_section import get_nearby_road
from src.core.database import get_db
from src.config import (
    KAFKA_CONFIG,
    PROMETHEUS_INGESTION_PORT,
    RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC,
    MQTT_BROKER_HOST,
    MQTT_BROKER_PORT,
    MQTT_BROKER_TOPIC
)
from src.logger import configure_logging
from src.core.prometheus_metrics import (
    mqtt_messages_received, mqtt_messages_invalid, kafka_delivery_total
)

log = structlog.get_logger(__name__)

FLUSH_TIMEOUT = 10
MQTT_KEEPALIVE_INTERVAL = 60
AVRO_SCHEMA_VERSION = "1"

def delivery_report(err, msg):
    if err:
        kafka_delivery_total.labels(status="error").inc()
        log.error(f"Kafka delivery failed: {err}")
    else:
        kafka_delivery_total.labels(status="success").inc()

def on_connect(client, userdata, flags, reason_code, properties):
    log.info(f"Connected: {reason_code}")
    client.subscribe(MQTT_BROKER_TOPIC)

def on_message(client, userdata, msg):
    producer = userdata["producer"]
    db = userdata["db"]
    mqtt_messages_received.inc()

    # Data validation
    try:
        payload = json.loads(msg.payload.decode())
        vp = payload.get("VP")
        if not isinstance(vp, dict):
            raise ValueError("Missing or invalid VP")
        vp = DigiTransitVehiclePos.model_validate(vp)
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError, ValidationError) as exc:
        mqtt_messages_invalid.inc()
        log.warning("Invalid MQTT message: topic=%s error=%s", msg.topic, exc)
        return

    lat = vp.lat
    lon = vp.long
    if lat is None or lon is None:
        mqtt_messages_invalid.inc()
        log.warning(
            "Vehicle position missing coordinates",
            topic=msg.topic,
            vehicle=vp.veh,
            lat=lat,
            lon=lon,
        )
        return

    road_section = get_nearby_road(db, lon, lat)
    if not road_section:
        mqtt_messages_invalid.inc()
        log.warning(
            "No nearby road section found for vehicle position",
            topic=msg.topic,
            vehicle=vp.veh,
            latitude=lat,
            longitude=lon,
        )
        return

    if vp.spd is None:
        log.warning("Invalid speed", topic=msg.topic,vehicle=vp.veh, spd=vp.spd)
        return

    data = {
        "direction": int(vp.dir),
        "speed": vp.spd,
        "timestamp": int(vp.tst.timestamp() * 1000),
        "vehicle_id": vp.veh,
        "lat": lat,
        "lon": lon,
        "timetable_offset": vp.dl,
        "doors_open": vp.drst == 1,
        "route": vp.route,
        "line": vp.desi,
        "road_section_id": road_section[0]["id"]
    }

    try:
        producer.produce(
            topic=RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC,
            value=get_avro_payload(data, AVRO_SCHEMA_VERSION),
            headers={"schema-version": AVRO_SCHEMA_VERSION},
            callback=delivery_report,
        )
        producer.poll(0)
    except Exception:
        log.error("Failed to process valid MQTT message", topic=msg.topic())


def main():
    start_http_server(PROMETHEUS_INGESTION_PORT)
    producer = Producer(KAFKA_CONFIG)
    db = next(get_db())
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    def shutdown(signum, frame):
        log.info("Shutting down")
        try:
            producer.flush(FLUSH_TIMEOUT)
        except Exception:
            log.error("Kafka flush error")
        try:
            client.disconnect()
        except Exception:
            log.error("MQTT disconnect error")

        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    client.on_connect = on_connect
    client.on_message = on_message
    client.user_data_set({"producer": producer, "db": db})
    client.tls_set(cert_reqs=ssl.CERT_NONE)
    client.tls_insecure_set(True)
    client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, MQTT_KEEPALIVE_INTERVAL)

    client.loop_forever()

if __name__ == "__main__":
    configure_logging()
    main()
