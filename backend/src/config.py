from dotenv import load_dotenv
import os

ENV_PATH = "./.."
load_dotenv(f"{ENV_PATH}/.env")
load_dotenv(f"{ENV_PATH}/.env.local", override=True)
ENV = os.getenv("ENV", "development")

OSM_ROAD_GRAPH_LOCATION = os.getenv("OSM_ROAD_GRAPH_LOCATION")
OSM_CACHE_PATH = os.getenv("OSM_CACHE_PATH")
BACKEND_API_HOST = os.getenv("BACKEND_API_HOST")
BACKEND_API_PORT = int(os.getenv("BACKEND_API_PORT"))

# MQTT Broker
MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST")
MQTT_BROKER_PORT = int(os.getenv("MQTT_BROKER_PORT"))
MQTT_BROKER_TOPIC = os.getenv("MQTT_BROKER_TOPIC")

# Kafka
KAFKA_CONFIG = {"bootstrap.servers": "localhost:9094"}
RAW_PUBLIC_TRANSPORT_EVENTS_TOPIC = "raw_public_transport_events"

# Database
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_HOST = os.getenv("POSTGRES_HOST")
DB_PORT = os.getenv("POSTGRES_PORT")
DB_NAME = os.getenv("POSTGRES_DB")
DB_CONNECTION_STRING = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Frontend
FRONTEND_PORT = int(os.getenv("FRONTEND_PORT"))
FRONTEND_HOST = os.getenv("FRONTEND_HOST")
FRONTEND_URL = f"http://{FRONTEND_HOST}:{FRONTEND_PORT}"
