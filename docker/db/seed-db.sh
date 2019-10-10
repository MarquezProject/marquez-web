#!/bin/bash
#
# Usage: $ ./seed-db.sh

# DATA SOURCE (SHARED)

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/datasources \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "analytics_db",
        "connectionUrl": "jdbc:postgresql://${MARQUEZ_HOST}:5431/analytics"
      }' 

# DATAENG META

curl -X PUT http://${MARQUEZ_HOST}:5000/api/v1/namespaces/dataeng \
  -H 'Content-Type: application/json' \
  -d '{
        "owner": "dataplatform",
        "description": "Contains data pipelines for data enrichment, etc."
      }'

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/namespaces/dataeng/datasets \
  -H 'Content-Type: application/json' \
  -d '{ 
        "name": "public.raw_office_room_bookings",
        "datasourceUrn": "urn:datasource:postgresql:analytics_db",
        "description": "Raw room bookings for each office."
      }'

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/namespaces/dataeng/datasets \
  -H 'Content-Type: application/json' \
  -d '{ 
        "name": "public.office_room_bookings",
        "datasourceUrn": "urn:datasource:postgresql:analytics_db",
        "description": "All room bookings for each office."
      }'

curl -X PUT http://${MARQUEZ_HOST}:5000/api/v1/namespaces/dataeng/jobs/etl_room_bookings \
  -H 'Content-Type: application/json' \
  -d '{
        "inputDatasetUrns": ["urn:dataset:analytics_db:public.raw_office_room_bookings"],
        "outputDatasetUrns": ["urn:dataset:analytics_db:public.office_room_bookings"],
        "location": "https://github.com/wework/jobs/commit/124f6089ad4c5fcbb1d7b33cbb5d3a9521c5d32c",
        "description": "Raw room booking ETL."
      }'

# DATASCIENCE META

curl -X PUT http://${MARQUEZ_HOST}:5000/api/v1/namespaces/datascience \
  -H 'Content-Type: application/json' \
  -d '{
        "owner": "cda",
        "description": "Contains datasets such as room bookings for each office."
      }'

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/namespaces/datascience/datasets \
  -H 'Content-Type: application/json' \
  -d '{ 
        "name": "public.locations",
        "datasourceUrn": "urn:datasource:postgresql:analytics_db",
        "description": "All office locations."
      }'

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/namespaces/datascience/datasets \
  -H 'Content-Type: application/json' \
  -d '{ 
        "name": "public.members",
        "datasourceUrn": "urn:datasource:postgresql:analytics_db",
        "description": "All wework members."
      }'

curl -X POST http://${MARQUEZ_HOST}:5000/api/v1/namespaces/datascience/datasets \
  -H 'Content-Type: application/json' \
  -d '{ 
        "name": "public.weekly_office_room_bookings",
        "datasourceUrn": "urn:datasource:postgresql:analytics_db",
        "description": "Weekly room bookings by location."
      }'

curl -X PUT http://${MARQUEZ_HOST}:5000/api/v1/namespaces/datascience/jobs/room_bookings_7_days \
  -H 'Content-Type: application/json' \
  -d '{
        "inputDatasetUrns": ["urn:dataset:analytics_db:public.members", "urn:dataset:analytics_db:public.locations", "urn:dataset:analytics_db:public.office_room_bookings"],
        "outputDatasetUrns": ["urn:dataset:analytics_db:public.weekly_office_room_bookings"],
        "location": "https://github.com/wework/jobs/commit/124f6089ad4c5fcbb1d7b33cbb5d3a9521c5d32c",
        "description": "Determine weekly room booking occupancy patterns."
      }'
