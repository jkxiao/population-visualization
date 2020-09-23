"use strict";

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");

let DATABASE_NAME = "cs193x_project";

let api = express.Router();
let conn;
let db;
let Countries, Countries_Meta;
let years = [
  1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018
];
let regions;

module.exports = async (app) => {
  app.set("json spaces", 2);
  
  /* Connect to MongoDB */
  conn = await MongoClient.connect("mongodb://localhost", { useUnifiedTopology: true });
  db = conn.db(DATABASE_NAME);
  Countries = db.collection("countries");
  Countries_Meta = db.collection("countries_meta");
  regions = await Countries_Meta.distinct("Region");
  if (regions.includes("")) regions.splice(regions.indexOf(""), 1);
  regions.sort();

  /* Handle requests that start with /api using the api Router */
  app.use("/api", api);
};

api.use(cors());
api.use(bodyParser.json());

/* Confirm the API is running */
api.get("/", (req, res) => {
  res.json({ message: "API running" });
});

/* Get a list of regions */
api.get("/regions", async (req, res) => {
  res.json({ regions });
});

/* Get a list of countries and aggregates containing name and code */
api.get("/countries", async (req, res) => {
  let data = await Countries_Meta.find().toArray();
  let countries = data.map(country => {
    let code = country.Country_Code;
    let name = country.Table_Name;
    return { code, name };
  });
  countries.sort((country1, country2) => country1.name > country2.name);
  res.json({ countries });
});

/* Get a list of aggregates containing name and code */
api.get("/countries/aggregates", async (req, res) => {
  let data = await Countries_Meta.find({ Region: "" }).toArray();
  let countries = data.map(country => {
    let code = country.Country_Code;
    let name = country.Table_Name;
    return { code, name };
  });
  countries.sort((country1, country2) => country1.name > country2.name);
  res.json({ countries });
});

/* Get a list of countries in a specified region or all regions if not specified containing name and code */
api.get("/countries/regions", async (req, res) => {
  let data;
  if (!("region" in req.query)) {
    data = await Countries_Meta.find({ Region: { $in: regions } }).toArray();
  } else {
    let region = req.query.region;
    if (!regions.includes(region)) {
      res.status(400).json({ error: `No region ${region}`});
      return;
    }
    data = await Countries_Meta.find({ Region: region }).toArray();
  }
  let countries = data.map(country => {
    let code = country.Country_Code;
    let name = country.Table_Name;
    return { code, name };
  });
  countries.sort((country1, country2) => country1.name > country2.name);
  res.json({ countries });
});

/* Create a new entry with all or partial information */
api.post("/countries/new", async (req, res) => {
  let country = {
    Country_Name: req.body.name,
    Country_Code: req.body.code
  };
  if ("year" in req.body) {
    country[req.body.year] = req.body.population;
  }
  await Countries.insertOne(country);
  let countryMeta = {
    Country_Code: req.body.code,
    Region: req.body.region,
    Table_Name: req.body.name
  };
  await Countries_Meta.insertOne(countryMeta);
  regions = await Countries_Meta.distinct("Region");
  if (regions.includes("")) regions.splice(regions.indexOf(""), 1);
  regions.sort();
  res.json({ "success": true });
});

/* Middleware to look up a country */
api.use("/countries/:code", async (req, res, next) => {
  let code = req.params.code;
  let country = await Countries.findOne({ Country_Code: code });
  if (!country) {
    res.status(404).json({ error: `No country ${code}`});
    return;
  }
  let name = country.Country_Name;
  let population = {}
  for (let year of years) {
    population[year] = country[year];
  }
  let countryMeta = await Countries_Meta.findOne({ Country_Code: code });
  let region = countryMeta.Region;
  res.locals.country = { code, name, region, population };
  next();
});

/* Get the population data for the country code */
api.get("/countries/:code", async (req, res) => {
  let country = res.locals.country;
  res.json(country);
});

/* Update any data for the country code */
api.patch("/countries/:code", async (req, res) => {
  let country = res.locals.country;
  let year = req.body.year;
  let data = {};
  country.population[year] = data[year] = req.body.population;
  await Countries.updateOne(
    { Country_Code: country.code },
    { $set: data });
  res.json(country);
});
