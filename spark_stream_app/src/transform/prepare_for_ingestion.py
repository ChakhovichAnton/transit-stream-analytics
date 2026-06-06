from pyspark.sql.functions import col

def prepare_public_transport_ingestion(df):
    new_df = df.select(
        col("data.road_section_id").alias("road_section_id"),
        col("data.direction").alias("direction"),
        col("data.speed").alias("speed"),
        col("data.timestamp").cast("timestamp").alias("timestamp"),
        col("data.vehicle_id").alias("vehicle_id"),
        col("data.lat").alias("lat"),
        col("data.lon").alias("lon"),
        col("data.timetable_offset").alias("timetable_offset"),
        col("data.doors_open").alias("doors_open"),
        col("data.route").alias("route"),
        col("data.line").alias("line")
    )

    return new_df

def prepare_public_transport_aggregated_ingestion(df):
    new_df = df.select(
        col("road_section_id").alias("road_section_id"),
        col("window.start").alias("window_start"),
        col("window.end").alias("window_end"),
        col("avg_speed"),
        col("min_speed"),
        col("max_speed"),
        col("avg_timetable_offset"),
        col("min_timetable_offset"),
        col("max_timetable_offset"),
        col("count")
    )
    return new_df
