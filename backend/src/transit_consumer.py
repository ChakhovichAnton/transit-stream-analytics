import json
import ssl
import signal
import sys
import paho.mqtt.client as mqtt
from confluent_kafka import Producer
import structlog

from src.core.utils import iso_to_millis
from src.core.avro import get_avro_payload
from src.crud.road_section import get_nearby_road
from src.core.database import get_db
from src.config import KAFKA_CONFIG, RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC, MQTT_BROKER_HOST, MQTT_BROKER_PORT, MQTT_BROKER_TOPIC
from src.logger import configure_logging

log = structlog.get_logger(__name__)

FLUSH_TIMEOUT = 10
MQTT_KEEPALIVE_INTERVAL = 60
AVRO_SCHEMA_VERSION = "1"

def delivery_report(err, msg):
    # TODO: increment success and error counters
    if err:
        log.error(f"Kafka delivery failed: {err}")
    else:
        log.info(f"Delivered message to {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")

def on_connect(client, userdata, flags, reason_code, properties):
    log.info(f"Connected: {reason_code}")
    client.subscribe(MQTT_BROKER_TOPIC)

def on_message(client, userdata, msg):
    producer = userdata["producer"]
    db = userdata["db"]

    payload = json.loads(msg.payload.decode())
    vp = payload.get("VP", {})

    line = vp.get("desi")
    direction = vp.get("dir")
    if line == "42" and direction.isdigit():
        direction_int = int(direction)
        doors_open = vp.get("drst")

        if direction_int in (1, 2):
            lat = vp.get("lat")
            lon = vp.get("long")

            road_section = get_nearby_road(db, lon, lat)
            if len(road_section) < 1:
                return
            
            # TODO: data validation

            data = {
                "direction": direction_int,
                "speed": vp.get("spd"),
                "timestamp": iso_to_millis(vp.get("tst")),
                "vehicle_id": vp.get("veh"),
                "lat": lat,
                "lon": lon,
                "timetable_offset": vp.get("dl"),
                "doors_open": doors_open == 1,
                "route": vp.get("route"),
                "line": line,
                "road_section_id": road_section[0]["id"]
            }
            
            producer.produce(
                topic=RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC,
                value=get_avro_payload(data, AVRO_SCHEMA_VERSION),
                headers={"schema-version": AVRO_SCHEMA_VERSION},
                callback=delivery_report,
            )
            producer.poll(0)


def main():
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
