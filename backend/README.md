# Backend

## Setup

Sync uv project:
```bash
uv sync
```

Run backend with
```bash
uv run python -m src.main
```

Run the transit consumer with
```bash
uv run python -m src.transit_consumer
```

Provision Kafka with
```bash
uv run python -m src.provision_kafka
```

Insert geo data to Postgres with
```bash
uv run python -m src.geo_data_ingestor
```
