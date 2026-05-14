from src.config import RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC, KAFKA_CONFIG
from confluent_kafka.admin import AdminClient, NewTopic

admin = AdminClient(KAFKA_CONFIG)

new_topics = [
    NewTopic(RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC, num_partitions=1, replication_factor=1)
]

fs = admin.create_topics(new_topics)

# Wait for each operation to finish
for topic, f in fs.items():
    try:
        f.result()
        print(f"Topic {topic} created")
    except Exception as e:
        print(f"Failed to create topic {topic}: {e}")
