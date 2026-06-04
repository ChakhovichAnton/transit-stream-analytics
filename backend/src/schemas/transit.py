from datetime import datetime
from pydantic import BaseModel

class RoadSectionResponse(BaseModel):
    id: int
    osmid: list[int]
    highway: list[str] | None = None
    lanes: list[int] | None = None
    maxspeed: list[int] | None = None
    location_name: str | None = None
    oneway: bool | None = None
    reversed: bool | None = None
    length: float

    model_config = {"from_attributes": True}

class TransitEventResponse(BaseModel):
    id: int
    road_section_id: int
    direction: int
    speed: float
    timestamp: datetime
    vehicle_id: int
    lat: float
    lon: float
    timetable_offset: float
    doors_open: bool
    route: str
    line: str

    model_config = {"from_attributes": True}


class TransitResponse(BaseModel):
    event: TransitEventResponse
    road_section: RoadSectionResponse
