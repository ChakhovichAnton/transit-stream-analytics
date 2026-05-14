SCHEMA_DIR = "/spark_stream_app/schemas"

def load_schema(name):
    return open(f"{SCHEMA_DIR}/{name}", "r").read()
