# Marquez Web UI

Marquez is an open source **metadata service** for the **collection**, **aggregation**, and **visualization** of a data ecosystem's metadata.

This web UI is used to view metadata collected and cataloged by [Marquez](https://github.com/MarquezProject/marquez).

## Running with [Docker](./Dockerfile) 

1. Build image:

   ```
   $ docker build -t marquez-web .
   ```
   
2. Run image:
   
   ```
   $ docker run -p 3000:3000 -d marquez-web
   ```
   
3. Browse to http://localhost:3000