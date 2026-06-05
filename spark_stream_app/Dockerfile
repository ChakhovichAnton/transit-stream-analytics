FROM apache/spark-py:v3.4.0

ARG SPARK_UID=185
ARG CHECKPOINTS_DIR=/checkpoints
ARG SPARK_WORKER_DIR=${SPARK_HOME}/work
ENV SPARK_WORKER_DIR=${SPARK_WORKER_DIR}

USER root

# Make ivy directory and change ownership to SPARK_UID
ARG IVY_HOME_DIR=${SPARK_HOME}/.ivy2
ENV SPARK_SUBMIT_OPTS="-Divy.home=${IVY_HOME_DIR}"
RUN mkdir -p ${IVY_HOME_DIR} \
    && chown -R ${SPARK_UID} ${IVY_HOME_DIR}

# Make SPARK_WORKER_DIR and change ownership to SPARK_UID
RUN mkdir -p ${SPARK_WORKER_DIR} \
    && chown -R ${SPARK_UID} ${SPARK_WORKER_DIR}

# Download PostgreSQL JDBC driver
ARG POSTGRESQL_DRIVER_FILE_NAME=postgresql-42.6.0.jar
ARG SPARK_JARS=${SPARK_HOME}/jars
RUN curl -L -o ${SPARK_JARS}/${POSTGRESQL_DRIVER_FILE_NAME} https://jdbc.postgresql.org/download/${POSTGRESQL_DRIVER_FILE_NAME}

# Make checkpoints directory
RUN mkdir -p ${CHECKPOINTS_DIR} && chown -R ${SPARK_UID} ${CHECKPOINTS_DIR}

USER ${SPARK_UID}
