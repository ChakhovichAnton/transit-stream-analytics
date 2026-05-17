from confluent_kafka.admin import AdminClient, NewTopic
import structlog

from src.config import RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC, KAFKA_CONFIG
from src.logger import configure_logging

log = structlog.get_logger(__name__)

def main():
    admin = AdminClient(KAFKA_CONFIG)
    new_topics = [
        NewTopic(RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC, num_partitions=1, replication_factor=1)
    ]

    fs = admin.create_topics(new_topics)

    # Wait for each operation to finish
    for topic, f in fs.items():
        try:
            f.result()
            log.info("Topic {topic} created")
        except Exception as e:
            log.error(f"Failed to create topic {topic}: {e}")

if __name__ == "__main__":
    configure_logging()
    main()
