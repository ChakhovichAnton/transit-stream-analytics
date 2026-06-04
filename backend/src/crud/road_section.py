from sqlalchemy import text
from sqlalchemy.orm import Session

def get_nearby_road(db: Session, lon: float, lat: float):
    query = text("""
        SELECT *
        FROM road_section
        ORDER BY geom <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
        LIMIT 1;
    """)
    return db.execute(query, { "lon": lon, "lat": lat }).mappings().fetchall()
