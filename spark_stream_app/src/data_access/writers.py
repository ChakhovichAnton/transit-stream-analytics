from config.constants import JDBC_URL, POSTGRES_USER, POSTGRES_PASSWORD, PUBLIC_TRANSPORT_EVENTS_DB_TABLE

def write_batch_to_postgres(batch_df, batch_id):
    batch_df.write \
        .format("jdbc") \
        .option("url", JDBC_URL) \
        .option("dbtable", PUBLIC_TRANSPORT_EVENTS_DB_TABLE) \
        .option("user", POSTGRES_USER) \
        .option("password", POSTGRES_PASSWORD) \
        .option("driver", "org.postgresql.Driver") \
        .mode("append") \
        .save()
    
def write_to_postgres(df):
    query = df.writeStream \
        .foreachBatch(write_batch_to_postgres) \
        .outputMode("append") \
        .start()

    return query
