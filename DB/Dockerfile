FROM mysql:lts

ENV BACKUP_FILE=medcard_backup.sql
ENV BACKUP_DIR=backup
ENV BACKUP_PATH=/docker-entrypoint-initdb.d

# Copy the SQL backup file into the container
COPY ${BACKUP_DIR}/${BACKUP_FILE} ${BACKUP_PATH}/

EXPOSE ${PORT}
