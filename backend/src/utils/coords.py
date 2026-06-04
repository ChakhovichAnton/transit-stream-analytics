from src.schemas.transit import LineStringResponse

def convert_coords(row: LineStringResponse):
    return LineStringResponse(
        type=row["type"],
        coordinates=[[lat, lng] for lng, lat in row["coordinates"]]
    )
