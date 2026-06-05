def consume_kafka_raw_public_transport_events(spark):
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "kafka:9092") \
        .option("subscribe", "raw_public_transport_events") \
        .option("includeHeaders", "true") \
        .option("startingOffsets", "earliest") \
        .load()
    
    return df
