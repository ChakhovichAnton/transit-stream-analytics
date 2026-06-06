from datetime import datetime
from typing import Literal
from pydantic import BaseModel

class LineStringResponse(BaseModel):
    type: Literal["LineString"] = "LineString"
    coordinates: list[list[float]]

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
    geom: LineStringResponse

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

class AggregatedTransitEventResponse(BaseModel):
    id: int
    road_section_id: int
    window_start: datetime
    window_end: datetime
    avg_speed: float
    min_speed: float
    max_speed: float
    avg_timetable_offset: float
    min_timetable_offset: float
    max_timetable_offset: float
    count: int

    model_config = {"from_attributes": True}

class TransitResponse(BaseModel):
    type: Literal["TransitEventWithSectionCoords"] = "TransitEventWithSectionCoords"
    event: TransitEventResponse
    road_section: RoadSectionResponse

class AggregatedTransitResponse(BaseModel):
    type: Literal["AggregatedTransitEventWithSectionCoords"] = "AggregatedTransitEventWithSectionCoords"
    event: AggregatedTransitEventResponse
    road_section: RoadSectionResponse
