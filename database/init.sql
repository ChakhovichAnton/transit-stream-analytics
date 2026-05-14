CREATE TABLE road_section (
    id SERIAL PRIMARY KEY,
    osmid BIGINT[] NOT NULL,
    highway TEXT[],
    lanes INTEGER[],
    maxspeed INTEGER[],
    location_name TEXT,
    oneway BOOLEAN,
    reversed BOOLEAN,
    length NUMERIC NOT NULL,
    geom GEOMETRY(LINESTRING, 4326) NOT NULL
);

CREATE INDEX road_section_geom_idx ON road_section USING GIST (geom);

CREATE DOMAIN direction AS INTEGER
CHECK (VALUE IN (1, 2));

CREATE TABLE public_transport_events (
    id SERIAL PRIMARY KEY,
    road_section_id INTEGER NOT NULL,
    direction direction NOT NULL,
    speed NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    vehicle_id INTEGER NOT NULL,
    lat NUMERIC NOT NULL,
    lon NUMERIC NOT NULL,
    timetable_offset NUMERIC NOT NULL,
    doors_open BOOLEAN NOT NULL,
    route TEXT NOT NULL,
    line TEXT NOT NULL,
    FOREIGN KEY (road_section_id) REFERENCES road_section(id)
);
