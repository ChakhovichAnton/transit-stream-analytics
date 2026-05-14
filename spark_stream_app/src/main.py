from pyspark.sql import SparkSession

from data_access.readers import consume_kafka_raw_public_transport_events
from data_access.writers import write_to_postgres
from decoding import decode_public_transport_avro
from transform.prepare_for_ingestion import prepare_public_transport_ingestion
from config.schema import load_schema

def main():
    spark = SparkSession.builder.getOrCreate()

    # Pipeline
    df = consume_kafka_raw_public_transport_events(spark)
    decoded_v1 = decode_public_transport_avro(df, load_schema("public_transport_position.avsc"))
    public_transport_df = prepare_public_transport_ingestion(decoded_v1)

    query = write_to_postgres(public_transport_df)
    query.awaitTermination()

if __name__ == "__main__":
    main()
