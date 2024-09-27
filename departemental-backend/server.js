const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3001;

// Load GeoJSON data
const geoData = JSON.parse(fs.readFileSync(path.join(__dirname, "./departements.geojson"), "utf-8"));
const USED_DEPARTMENTS_FILE = path.join(__dirname, "./used_departments.json");

const departments = geoData.features.map((feature) => ({
  name: feature.properties.nom,
  code: feature.properties.code,
  geometry: feature.geometry,
}));

// Middleware
app.use(
  cors({
    origin: "https://departemental-frontend.vercel.app/", // Remplacez par l'URL de votre front-end
  })
);

app.use(express.json());

// Load or initialize the used departments file
let usedDepartments = [];

// Function to get a random unused department
function getRandomDepartment() {
  const unusedDepartments = departments.filter((dept) => !usedDepartments.includes(dept.code));
  return unusedDepartments[Math.floor(Math.random() * unusedDepartments.length)];
}

// Variable to store the department of the day
let departmentOfTheDay = null;

// Function to pick a new department of the day
function pickNewDepartment() {
  const newDept = getRandomDepartment();

  if (!newDept) {
    console.log("All departments have been used. No more new departments to select.");
    return;
  }

  // Store the new department in memory
  usedDepartments.push(newDept.code);

  departmentOfTheDay = newDept;
  console.log(`New department of the day picked: ${newDept.name}`);
}

// Pick a department for the day on server start if not set
if (!departmentOfTheDay) {
  pickNewDepartment();
}

// Endpoint to get the department of the day
app.get("/api/department-of-the-day", (req, res) => {
  res.json(departmentOfTheDay);
});

// Schedule a task to pick a new department every day at midnight
cron.schedule("0 0 * * *", () => {
  pickNewDepartment();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
