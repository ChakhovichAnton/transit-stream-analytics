from sqlalchemy.orm import Session

from src.utils.coords import convert_coords
from src.crud.transit import latest_transit_data

def handle_latest_transit_data(db: Session):
    data = latest_transit_data(db)
    result = []
    for d in data:
        result.append({
            **d,
            "road_section": {
                **d["road_section"],
                "geom": convert_coords(d["road_section"]["geom"])
            }
        })
    return result
    