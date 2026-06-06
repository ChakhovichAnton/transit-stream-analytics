from pyspark.sql import SparkSession
from pyspark.sql.functions import col

from data_access.readers import consume_kafka_stream
from data_access.writers import reset_checkpoint, write_raw_transit, write_aggregated_transit
from decoding import decode_public_transport_avro
from transform.prepare_for_ingestion import prepare_public_transport_aggregated_ingestion, prepare_public_transport_ingestion
from transform.window import aggregate_transit
from config.schema import load_schema
from config.constants import CHECKPOINT_PATHS

def main():
    spark = SparkSession.builder.getOrCreate()

    # Reset checkpoints
    reset_checkpoint(CHECKPOINT_PATHS["raw_transit"])
    reset_checkpoint(CHECKPOINT_PATHS["transit_aggregator"])

    # Pipeline
    df = consume_kafka_stream(spark, "raw_public_transport_events")
    decoded_v1 = decode_public_transport_avro(df, load_schema("public_transport_position.avsc"))
    public_transport_df = prepare_public_transport_ingestion(decoded_v1)
    
    # Filter busses with doors open
    filtered_v1 = public_transport_df.filter(col("doors_open") == False)
    agg_df = aggregate_transit(filtered_v1)
    result = prepare_public_transport_aggregated_ingestion(agg_df)

    raw_query = write_raw_transit(public_transport_df)
    aggregated_query = write_aggregated_transit(result)

    raw_query.awaitTermination()
    aggregated_query.awaitTermination()

if __name__ == "__main__":
    main()
