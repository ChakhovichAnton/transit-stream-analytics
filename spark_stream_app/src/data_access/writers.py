import os
import shutil

from config.constants import JDBC_OPTIONS, PUBLIC_TRANSPORT_EVENTS_DB_TABLE, PUBLIC_TRANSPORT_WINDOW_EVENTS_DB_TABLE, RESET_CHECKPOINTS, CHECKPOINT_PATHS
from logger import get_logger

logger = get_logger("checkpoint-manager")

def reset_checkpoint(path: str):
    if not RESET_CHECKPOINTS:
        logger.info(f"[CHECKPOINT] reset disabled, skipping path={path}")
        return

    logger.info(f"[CHECKPOINT] deleting path={path}")
    if os.path.exists(path):
        shutil.rmtree(path, ignore_errors=False)
        logger.info(f"[CHECKPOINT] successfully deleted path={path}")

def jdbc_writer(table: str):
    def writer(batch_df, batch_id):
        batch_df.write \
            .format("jdbc") \
            .options(**JDBC_OPTIONS) \
            .option("dbtable", table) \
            .mode("append") \
            .save()
    return writer

def write_raw_transit(df):
    query = df.writeStream \
        .foreachBatch(jdbc_writer(PUBLIC_TRANSPORT_EVENTS_DB_TABLE)) \
        .outputMode("append") \
        .option("checkpointLocation", CHECKPOINT_PATHS["raw_transit"]) \
        .start()

    return query

def write_aggregated_transit(df):
    query = df.writeStream \
        .foreachBatch(jdbc_writer(PUBLIC_TRANSPORT_WINDOW_EVENTS_DB_TABLE)) \
        .outputMode("append") \
        .option("checkpointLocation", CHECKPOINT_PATHS["transit_aggregator"]) \
        .start()

    return query
