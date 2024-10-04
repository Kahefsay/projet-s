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

const departments = geoData.features.map((feature) => ({
  name: feature.properties.nom,
  code: feature.properties.code,
  superficie: feature.properties.superficie,
  population: feature.properties.population,
  detailsGeographiques: feature.properties.detailsGeographiques,
  region: feature.properties.region,
  chefLieuPremiereLettre: feature.properties.chefLieuPremiereLettre,
  nombreDeCommunes: feature.properties.nombreDeCommunes,
  geometry: feature.geometry,
}));

// Function to connect to MongoDB and get the used departments collection
async function getUsedDepartmentsCollection(mode) {
  try {
    await client.connect();
    const db = client.db("departemental");
    return db.collection(mode === "classic" ? "usedClassic" : "usedContour");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
}

// Function to get a random unused department based on the mode
async function getRandomDepartment(mode) {
  const usedDepartmentsCollection = await getUsedDepartmentsCollection(mode);
  const usedDepartmentsDocs = await usedDepartmentsCollection.find().toArray();
  const usedDepartmentCodes = usedDepartmentsDocs.map((doc) => doc.code);

  const unusedDepartments = departments.filter((dept) => !usedDepartmentCodes.includes(dept.code));
  return unusedDepartments[Math.floor(Math.random() * unusedDepartments.length)];
}

// Function to pick a new department of the day for a given mode
async function pickNewDepartment(mode) {
  const newDept = await getRandomDepartment(mode);
  if (!newDept) {
    console.log(`All departments have been used for mode: ${mode}. No more new departments to select.`);
    return;
  }

  const usedDepartmentsCollection = await getUsedDepartmentsCollection(mode);
  // Store the new department in MongoDB
  await usedDepartmentsCollection.insertOne({
    code: newDept.code,
    date: new Date().toISOString().split("T")[0], // Store the date in 'YYYY-MM-DD' format
  });
  console.log(`New department of the day picked for mode ${mode}: ${newDept.name}`);
  return newDept;
}

// Function to clear all used departments for a specific mode
async function clearUsedDepartments(mode) {
  const usedDepartmentsCollection = await getUsedDepartmentsCollection(mode);
  await usedDepartmentsCollection.deleteMany({});
  console.log(`Cleared all used departments for mode: ${mode}`);
}

// Endpoint to get the department of the day for a specific mode
app.get("/api/department-of-the-day/:mode", async (req, res) => {
  const mode = req.params.mode;
  if (!["classic", "contour"].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode. Use 'classic' or 'contour'." });
  }

  const usedDepartmentsCollection = await getUsedDepartmentsCollection(mode);
  const todayDate = new Date().toISOString().split("T")[0];

  // Find if today's department is already picked
  const todayDepartment = await usedDepartmentsCollection.findOne({ date: todayDate });

  if (todayDepartment) {
    const departmentInfo = departments.find((dept) => dept.code === todayDepartment.code);
    res.json(departmentInfo);
  } else {
    // Pick a new department if none found for today
    const newDept = await pickNewDepartment(mode);
    res.json(newDept);
  }
});

// Schedule a task to pick a new department every day at midnight for both modes
cron.schedule("0 0 * * *", async () => {
  await pickNewDepartment("classic");
  await pickNewDepartment("contour");
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Clear all used departments and pick new ones for both modes
  await clearUsedDepartments("classic");
  await clearUsedDepartments("contour");
  await pickNewDepartment("classic");
  await pickNewDepartment("contour");
});
