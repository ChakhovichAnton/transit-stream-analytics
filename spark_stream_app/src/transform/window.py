from pyspark.sql.functions import window, col, avg, min, max, count

def aggregate_transit(df):
    new_df = (
        df
        .withWatermark("timestamp", "20 minutes")
        .groupBy(
            window(col("timestamp"), "15 minutes"),
            col("road_section_id")
        )
        .agg(
            avg("speed").alias("avg_speed"),
            min("speed").alias("min_speed"),
            max("speed").alias("max_speed"),
            avg("timetable_offset").alias("avg_timetable_offset"),
            min("timetable_offset").alias("min_timetable_offset"),
            max("timetable_offset").alias("max_timetable_offset"),
            count("*").alias("count")
        )
    )
    return new_df
