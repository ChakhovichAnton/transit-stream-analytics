from sqlalchemy import text
import osmnx as ox
import math

from src.core.database.db import get_db
from src.config import OSM_CACHE_PATH, OSM_ROAD_GRAPH_LOCATION

insert_query = text("""
    INSERT INTO road_section (
        osmid,
        highway,
        lanes,
        maxspeed,
        location_name,
        oneway,
        reversed,
        length,
        geom
    )
    VALUES (
        :osmid,
        :highway,
        :lanes,
        :maxspeed,
        :location_name,
        :oneway,
        :reversed,
        :length,
        ST_GeomFromText(:geom, 4326)
    )
""")

def to_list(value):
    return value if isinstance(value, list) else [value]

def to_number_or_none(value):
    try:
        num = int(value)
        if math.isnan(num):
            return None
        return num
    except (TypeError, ValueError):
        return None
    
def to_number_or_none_list(values):
    converted = [to_number_or_none(v) for v in values]
    return None if None in converted else converted

def to_bool_or_none(value):
    return value if isinstance(value, bool) else None

if __name__ == "__main__":
    db = next(get_db())

    # Load road graph
    print(f"Starting to load road data for {OSM_ROAD_GRAPH_LOCATION}")
    ox.settings.cache_folder = OSM_CACHE_PATH
    G = ox.graph_from_place(OSM_ROAD_GRAPH_LOCATION, network_type="drive")
    edges = ox.graph_to_gdfs(G, nodes=False)
    print("Starting geo data ingestion script")

    rows = []
    for idx, row in edges.iterrows():
        rows.append({
            "osmid": to_list(row.get("osmid")),
            "highway": to_number_or_none_list(to_list(row.get("highway"))),
            "lanes": to_number_or_none_list(to_list(row.get("lanes"))),
            "maxspeed": to_number_or_none_list(to_list(row.get("maxspeed"))),
            "location_name": to_list(row.get("name"))[0], # Always use the first name
            "oneway": to_bool_or_none(row.get("oneway")),
            "reversed": to_bool_or_none(row.get("reversed")),
            "length": to_number_or_none(row.get("length")),
            "geom": row.geometry.wkt
        })
    print(f"Inserting {len(rows)} roads to database")

    db.execute(insert_query, rows)
    db.commit()
    print(f"{len(rows)} roads inserted succesfully")
