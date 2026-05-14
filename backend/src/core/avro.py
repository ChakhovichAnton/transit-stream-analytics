import io
import json
from fastavro import parse_schema, schemaless_writer

with open("../schemas/public_transport_position.avsc") as f:
    public_transport_position_schema = json.load(f)

parsed_schema = parse_schema(public_transport_position_schema)

def get_avro_payload(obj, schema_version):
    if schema_version == "1":
        buf = io.BytesIO()
        schemaless_writer(buf, parsed_schema, obj)
        payload = buf.getvalue()
        return payload
    else:
        raise RuntimeError(f"Schema version {schema_version} not available")
