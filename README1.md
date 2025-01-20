
# Luxembourg Population Data Service

This web service provides population data for Luxembourg for a specified year using the [Statec API](https://lustat.statec.lu/vis?fs[0]=Topics%2C1%7CPopulation%20and%20employment%23B%23%7CPopulation%20structure%23B1%23&pg=0&fc=Topics&lc=en&df[ds]=ds-release&df[id]=DF_B1100&df[ag]=LU1&df[vs]=1.0&pd=%2C&dq=.A&vw=tb&lo=5). The service can return the total population, gender-specific breakdowns, and a distinction between Luxembourgish and foreign residents. If the requested year does not have available data, the service will return the closest years with available data.

---

## How to Use the Service

The service is accessible via a single HTTP GET endpoint. Below is a guide to using the service.

### Endpoint

**`GET /population/:year`**

- **:year**: A 4-digit year for which population data is requested.

### Examples of Usage

#### 1. Testing with POSTMAN

1. **Open POSTMAN**:
   - Download and install POSTMAN if you don't have it from [here](https://www.postman.com/downloads/).

2. **Create a New Request**:
   - Click on the **New** button, then select **Request**.

3. **Enter the Request Details**:
   - **HTTP Method**: `GET`
   - **Example URL**: `http://localhost:8000/population/2020`

4. **Send the Request**:
   - Click the **Send** button.

5. **Check the Response**:
   - Example Response:
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

---

#### 2. Testing with `curl` in the Console

1. **Open the Terminal/Console**:
   - On macOS/Linux: Open the Terminal.
   - On Windows: Open Command Prompt or PowerShell.

2. **Run the `curl` Command**:
   - Example for testing the year `2020`:
     ```bash
     curl http://localhost:8000/population/2020
     ```

3. **Check the Response**:
   - Example Output:
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

---

## Handling Input Errors

The service includes robust input validation:

- **Valid Years**: Must be 4-digit numbers (e.g., 2020, 1995).
- **Invalid Inputs**: Strings, non-numeric inputs, or missing years will return an appropriate error message.

### Example Error Scenarios

1. **Invalid Year Format**:
   - **Request**: `GET /population/abcd`
   - **Response**:
     ```json
     {
         "error": "Invalid year format."
     }
     ```

2. **Year with No Data**:
   - **Request**: `GET /population/1915`
   - **Response**:
     ```json
     {
         "message": "No data available for the year 1915. Showing the closest available years.",
         "closest_years": {
             "earlierYear": {
                 "year": 1910,
                 "total_population": "259027",
                 "total_males": "134101",
                 "total_females": "110201",
                 "luxembourgish_males": "109967",
                 "foreign_males": "24134",
                 "luxembourgish_females": "15589",
                 "foreign_females": "125790"
             },
             "laterYear": {
                 "year": 1916,
                 "total_population": "263490",
                 "total_males": "130514",
                 "total_females": null,
                 "luxembourgish_males": null,
                 "foreign_males": null,
                 "luxembourgish_females": null,
                 "foreign_females": "133310"
             }
         }
     }
     ```

---

## Setting Up the Service

### Navigate to the Project Directory
Ensure you are in the correct directory where the project is stored. For this project, it is in the folder `luxembourg-population-api`.

```bash
cd luxembourg-population-api
```

Install Dependencies

```bash 
npm install
```

Start the Server
```bash 
node app.js
```