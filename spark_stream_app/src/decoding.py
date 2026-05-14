from pyspark.sql.avro.functions import from_avro
from pyspark.sql.functions import col

def decode_public_transport_avro(df, schema_v1):
    df_with_version = df.selectExpr(
        "value",
        """
        CAST(
            filter(headers, h -> h.key = 'schema-version')[0].value AS STRING
        ) as schema_version
        """
    )

    # If schema is updated, new streams can be split here
    df_v1 = df_with_version.filter(col("schema_version") == "1")

    # Decode avro
    decoded_v1 = df_v1.select(
        from_avro(col("value"), schema_v1).alias("data")
    )

    return decoded_v1
