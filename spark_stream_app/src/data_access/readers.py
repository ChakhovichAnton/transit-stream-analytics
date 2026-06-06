from config.constants import KAFKA_CONFIG

def consume_kafka_stream(spark, topic: str):
    return (
        spark.readStream
        .format("kafka")
        .options(**KAFKA_CONFIG)
        .option("subscribe", topic)
        .load()
    )
