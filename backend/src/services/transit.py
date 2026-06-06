from datetime import datetime
from sqlalchemy.orm import Session

from src.utils.coords import convert_coords
from src.crud.transit import aggregated_data_for_date, latest_transit_data, latest_aggregated_transit_data, window_available_dates, window_length

def handle_latest_transit_data(db: Session):
    data = latest_transit_data(db)
    result = []
    for d in data:
        result.append({
            **d,
            "road_section": {
                **d["road_section"],
                "geom": convert_coords(d["road_section"]["geom"])
            },
            "event": {
                **d["event"],
                "speed": d["event"]["speed"] * 3.6, # Convert from m/s to km/h
            }
        })
    return result

def handle_latest_aggregated_transit_data(db: Session):
    data = latest_aggregated_transit_data(db)
    result = []
    for d in data:
        result.append({
            **d,
            "road_section": {
                **d["road_section"],
                "geom": convert_coords(d["road_section"]["geom"])
            },
            "event": {
                **d["event"],
                # Convert speed from m/s to km/h
                "avg_speed": d["event"]["avg_speed"] * 3.6,
                "min_speed": d["event"]["min_speed"] * 3.6,
                "max_speed": d["event"]["max_speed"] * 3.6,
            }
        })
    return result

def handle_get_window_length(db: Session):
    data = window_length(db)
    return [int(d["window_size_s"].total_seconds()) for d in data]

def handle_available_dates(db: Session, window: int):
    return window_available_dates(db, window)

def handle_aggregated_data_for_date(db: Session, window: int, start_timestamp: datetime):
    data = aggregated_data_for_date(db, window, start_timestamp)
    result = []
    for d in data:
        result.append({
            **d,
            "road_section": {
                **d["road_section"],
                "geom": convert_coords(d["road_section"]["geom"])
            },
            "event": {
                **d["event"],
                # Convert speed from m/s to km/h
                "avg_speed": d["event"]["avg_speed"] * 3.6,
                "min_speed": d["event"]["min_speed"] * 3.6,
                "max_speed": d["event"]["max_speed"] * 3.6,
            }
        })
    return result
