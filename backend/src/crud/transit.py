from datetime import datetime
from sqlalchemy import text
from sqlalchemy.orm import Session

def latest_transit_data(db: Session):
    query = text("""
        SELECT DISTINCT ON (e.road_section_id)
            row_to_json(e) AS event,
            row_to_json(rs) AS road_section
        FROM public_transport_events e
        JOIN (SELECT *, ST_AsGeoJSON(geom)::json AS geometry FROM road_section) rs
            ON rs.id = e.road_section_id
        ORDER BY e.road_section_id, e.timestamp DESC, e.id DESC;
    """)

    result = db.execute(query)
    return result.mappings().all()

def latest_aggregated_transit_data(db: Session):
    query = text("""
        SELECT DISTINCT ON (e.road_section_id)
            row_to_json(e) AS event,
            row_to_json(rs) AS road_section
        FROM public_transport_window_events e
        JOIN (SELECT *, ST_AsGeoJSON(geom)::json AS geometry FROM road_section) rs
            ON rs.id = e.road_section_id
        ORDER BY e.road_section_id, e.window_end DESC, e.id DESC;
    """)

    result = db.execute(query)
    return result.mappings().all()

def window_length(db: Session):
    query = text("""
        SELECT DISTINCT window_end - window_start AS window_size_s
        FROM public_transport_window_events;
    """)

    result = db.execute(query)
    return result.mappings().all()

def window_available_dates(db: Session, window_length: int):
    query = text("""
        SELECT DATE(window_start) AS day, array_agg(DISTINCT window_start ORDER BY window_start) AS times
        FROM public_transport_window_events
        WHERE ABS(EXTRACT(EPOCH FROM (window_end - window_start)) - :window_length) < 1
        GROUP BY DATE(window_start)
        ORDER BY day;
    """)

    result = db.execute(query, {"window_length": window_length})
    return result.mappings().all()

def aggregated_data_for_date(db: Session, window_length: int, start_timestamp: datetime):
    query = text("""
        SELECT DISTINCT ON (e.road_section_id)
            row_to_json(e) AS event,
            row_to_json(rs) AS road_section
        FROM public_transport_window_events e
        JOIN (SELECT *, ST_AsGeoJSON(geom)::json AS geometry FROM road_section) rs
            ON rs.id = e.road_section_id
        WHERE
            e.window_start = :start_timestamp
            AND ABS(EXTRACT(EPOCH FROM (e.window_end - e.window_start)) - :window_length) < 1
        ORDER BY e.road_section_id, e.window_end DESC, e.id DESC;
    """)

    result = db.execute(query, {"window_length": window_length, "start_timestamp": start_timestamp})
    return result.mappings().all()
