import os

RESET_CHECKPOINTS = os.getenv("RESET_CHECKPOINTS", "false") == "true"
CHECKPOINT_PATHS = {
    "raw_transit": "/checkpoints/raw-transit",
    "transit_aggregator": "/checkpoints/transit-aggregator",
}

POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
JDBC_URL = f"jdbc:postgresql://{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
JDBC_OPTIONS = {
    "url": JDBC_URL,
    "user": POSTGRES_USER,
    "password": POSTGRES_PASSWORD,
    "driver": "org.postgresql.Driver"
}

KAFKA_HOST = "kafka"
KAFKA_PORT = 9092
KAFKA_CONFIG = {
    "kafka.bootstrap.servers": f"{KAFKA_HOST}:{KAFKA_PORT}",
    "includeHeaders": "true",
    "startingOffsets": "earliest"
}

PUBLIC_TRANSPORT_EVENTS_DB_TABLE = "public_transport_events"
PUBLIC_TRANSPORT_WINDOW_EVENTS_DB_TABLE = "public_transport_window_events"
