# Transit Stream Analytics

## Features

## Technologies

### Backend

### Frontend

## Setup

The application has been tested with the following versions:
- Docker `v29.4.0`
- Docker Compose `v5.1.2`

Start containers
```bash
docker compose up -d
```

Run Spark job:
```bash
docker exec -it spark /opt/spark/bin/spark-submit /spark_stream_app/src/main.py
```
