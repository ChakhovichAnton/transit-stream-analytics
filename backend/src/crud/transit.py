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
