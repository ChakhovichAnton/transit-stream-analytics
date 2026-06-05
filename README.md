# Transit Stream Analytics

## Features

The transit data is from Digitransit and the documentation of the live vehicle positioning API can be found [here](https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/). In the app, the following values are used:
- `dir`: route direction of the trip: "1" or "2"
- `spd`: Speed of vehicle in m/s
- `tst`: Timestamp
- `veh`: Vehicle number
- `lat`: The latitude of the vehicle
- `long`: The longitude of the vehicle
- `dl`: The timetable offset of the vehicle in seconds. Negative if vehicle is behind schedule
- `drst`: 1 if any of the doors is open, otherwise 0
- `desi`: Route number visible to passengers
- `route`: ID of the route the vehicle is currently running on

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
