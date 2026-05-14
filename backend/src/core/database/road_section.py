from sqlalchemy import text

def get_nearby_road(db, lon, lat):
    query = text("""
        SELECT *
        FROM road_section
        ORDER BY geom <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
        LIMIT 1;
    """)
    return db.execute(query, { "lon": lon, "lat": lat }).mappings().fetchall()
