**Running the Luxembourg Population API with Docker** **

**Prerequisites**
Make sure you have Docker installed:

You can download and install Docker from [here](https://www.docker.com/products/docker-desktop/).

**1. Build the Docker Image**
Navigate to the project directory (where the _Dockerfile_ is located) and build the Docker image:

bash
```bash 
docker build -t luxembourg-population-api .
```
This will build the Docker image with the tag luxembourg-population-api.

**2. Run the Docker Container**
Run the container with the following command:

```bash 
docker run -p 8000:8000 luxembourg-population-api
```
This will start the server, and the application will be accessible at `http://localhost:8000`.

**3. Access the Application**
You can now access the application by sending a GET request to the /population/:year endpoint. 

_Example using curl:_

```bash 
curl http://localhost:8000/population/2020
```
_Accessing through your browser:_
Simply open your browser and visit the URL: `http://localhost:8000/population/2020`

You should see a JSON response with population data for the specified year.

Example response:
```json
     {
         "year": 2020,
         "data": {
             "year": 2020,
             "total_population": "634730",
             "total_males": "319456",
             "total_females": "170248",
             "luxembourgish_males": "165056",
             "foreign_males": "154400",
             "luxembourgish_females": "145026",
             "foreign_females": "315274"
         }
     }
```

**Stopping the Application**
To stop the running container, use the following command:

```bash 
docker stop luxembourg-population-api
```
This will stop the container, and the server will no longer be accessible.

Alternatively, you can stop the container by identifying its container ID. First, run the following command to list all running containers:

```bash 
docker ps
```
Find the container ID for the luxembourg-population-api container, then use this command to stop it:

```bash 
docker stop <first 4 characters of containerId>
```
