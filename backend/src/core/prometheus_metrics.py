from prometheus_client import Counter

mqtt_messages_received = Counter(
    "mqtt_messages_received_total",
    "Number of MQTT messages received",
)

mqtt_messages_invalid = Counter(
    "mqtt_messages_invalid_total",
    "Number of invalid MQTT messages",
)

kafka_delivery_total = Counter(
    "kafka_delivery_total",
    "Kafka delivery results",
    ["status"],
)
