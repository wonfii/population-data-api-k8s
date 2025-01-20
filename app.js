const express = require("express");
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const app = express();
const PORT = 8000;

const GetResponseStatus = Object.freeze({
    badRequest: 400,
    server: 500,
});

const fetchYearData = async (year) => {
  try {
    const nextYear = parseInt(year) + 1;
    const url = `https://lustat.statec.lu/rest/data/LU1,DF_B1100,1.0/.A?startPeriod=${year}&endPeriod=${nextYear}&dimensionAtObservation=AllDimensions`;
    const response = await axios.get(url, { headers: { Accept: "application/xml" } });

    // Parsing the XML response into JSON
    const parsedData = await parseStringPromise(response.data);

     // Extracting the relevant data from the parsed response
    const gen_data = parsedData["message:GenericData"];
    if (!gen_data || !gen_data["message:DataSet"]) return null;

    const dataSet = gen_data["message:DataSet"][0];
    if (!dataSet["generic:Obs"]) return null;

    // Filtering observations for the specific year
    const observations = dataSet["generic:Obs"].filter((obs) => {
      const time_period = obs["generic:ObsKey"]?.[0]["generic:Value"]?.find(
        (v) => v["$"].id === "TIME_PERIOD"
      );
      return time_period && time_period["$"].value.startsWith(year);
    });

    if (observations.length === 0) return null;

    let total_population = null;
    let total_males = null;
    let total_females = null;
    let luxembourgish_males = null;
    let foreign_males = null;
    let luxembourgish_females = null;
    let foreign_females = null;

    observations.forEach((obs) => {
      const specification = obs["generic:ObsKey"]?.[0]["generic:Value"]?.find(
        (v) => v["$"].id === "SPECIFICATION"
      )?.["$"].value;

      const value = obs["generic:ObsValue"]?.[0]?.["$"]?.value;

      if (specification && value) {
        switch (specification) {
          case "C01":
            total_population = value;
            break;
          case "C03":
            total_males = value;
            break;
          case "C07":
            total_females = value;
            break;
          case "C04":
            luxembourgish_males = value;
            break;
          case "C05":
            foreign_males = value;
            break;
          case "C08":
            luxembourgish_females = value;
            break;
          case "C06":
            foreign_females = value;
            break;
          default:
            break;
        }
      }
    });

    return {
      year,
      total_population,
      total_males,
      total_females,
      luxembourgish_males,
      foreign_males,
      luxembourgish_females,
      foreign_females,
    };
  } catch (error) {
    return null;
  }
};

const findClosestYears = async (year) => {
  let offset = 1;
  let earlierYear = null;
  let laterYear = null;

  while (!earlierYear || !laterYear) {
    if (!earlierYear) {
      const data = await fetchYearData(year - offset);
      if (data) earlierYear = data;
    }
    if (!laterYear) {
      const data = await fetchYearData(year + offset);
      if (data) laterYear = data;
    }
    offset++;
  }

  return { earlierYear, laterYear };
};

app.get("/population/:year", async (req, res) => {
  const year = parseInt(req.params.year);

  if (isNaN(year) || year.toString().length !== 4) {
    return res.status(GetResponseStatus.badRequest).json({ error: "Invalid year format." });
  }

  try {

    const data = await fetchYearData(year);
    if (data) {
      return res.json({ year: data.year, data });
    }


    const { earlierYear, laterYear } = await findClosestYears(year);

    res.json({
      message: `No data available for the year ${year}. Showing the closest available years.`,
      closest_years: {
        earlierYear,
        laterYear,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(GetResponseStatus.server).json({ error: "Failed to fetch population data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
