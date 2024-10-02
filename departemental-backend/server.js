require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Load GeoJSON data
const geoData = JSON.parse(fs.readFileSync(path.join(__dirname, "./departements.geojson"), "utf-8"));

/*
  "superficie": 7369,
  "population": 531345,
  "detailsGeographiques": "plateaux",
  "chefLieuPremiereLettre": "L",
  "nombreDeCommunes": 800
  */

const departments = geoData.features.map((feature) => ({
  name: feature.properties.nom,
  code: feature.properties.code,
  superficie: feature.properties.superficie,
  population: feature.properties.population,
  detailsGeographiques: feature.properties.detailsGeographiques,
  chefLieuPremiereLettre: feature.properties.chefLieuPremiereLettre,
  nombreDeCommunes: feature.properties.nombreDeCommunes,
  geometry: feature.geometry,
}));

// Function to connect to MongoDB and get the used departments collection
async function getUsedDepartmentsCollection() {
  try {
    await client.connect(); // Utilisez await pour s'assurer que la connexion est bien établie
    const db = client.db("departemental");
    return db.collection("usedDepartments");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error; // Rethrow error for better debugging
  }
}

// Function to get a random unused department
async function getRandomDepartment() {
  const usedDepartmentsCollection = await getUsedDepartmentsCollection();
  const usedDepartmentsDocs = await usedDepartmentsCollection.find().toArray();
  const usedDepartmentCodes = usedDepartmentsDocs.map((doc) => doc.code);

  const unusedDepartments = departments.filter((dept) => !usedDepartmentCodes.includes(dept.code));
  return unusedDepartments[Math.floor(Math.random() * unusedDepartments.length)];
}

// Function to pick a new department of the day
async function pickNewDepartment() {
  const newDept = await getRandomDepartment();
  if (!newDept) {
    console.log("All departments have been used. No more new departments to select.");
    return;
  }

  const usedDepartmentsCollection = await getUsedDepartmentsCollection();
  // Store the new department in MongoDB
  const res = await usedDepartmentsCollection.insertOne({
    code: newDept.code,
    date: new Date().toISOString().split("T")[0], // Store the date in 'YYYY-MM-DD' format
  });
  console.log(`New department of the day picked: ${newDept.name}`);
  return newDept;
}

// Function to clear all used departments
async function clearUsedDepartments() {
  const usedDepartmentsCollection = await getUsedDepartmentsCollection();
  await usedDepartmentsCollection.deleteMany({});
  console.log("Cleared all used departments.");
}

// Endpoint to get the department of the day
app.get("/api/department-of-the-day", async (req, res) => {
  const usedDepartmentsCollection = await getUsedDepartmentsCollection();
  const todayDate = new Date().toISOString().split("T")[0];

  // Find if today's department is already picked
  const todayDepartment = await usedDepartmentsCollection.findOne({ date: todayDate });

  if (todayDepartment) {
    const departmentInfo = departments.find((dept) => dept.code === todayDepartment.code);
    res.json(departmentInfo);
  } else {
    // Pick a new department if none found for today
    const newDept = await pickNewDepartment();
    console.log(newDept);
    res.json(newDept);
  }
});

// Schedule a task to pick a new department every day at midnight
cron.schedule("0 0 * * *", async () => {
  await pickNewDepartment();
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Clear all used departments and pick a new one
  await clearUsedDepartments();
  await pickNewDepartment();
});
