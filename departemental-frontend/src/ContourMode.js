import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles/App.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
  Container,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";

function ContourMode() {
  const [department, setDepartment] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const MAX_ATTEMPTS = 5;

  const FitToBounds = ({ geometry }) => {
    const map = useMap();

    useEffect(() => {
      if (geometry) {
        const geoJsonLayer = L.geoJSON(geometry);
        map.fitBounds(geoJsonLayer.getBounds());
      }
    }, [geometry, map]);

    return null;
  };

  const toRadians = (degree) => (degree * Math.PI) / 180;

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(coord2[0] - coord1[0]);
    const dLon = toRadians(coord2[1] - coord1[1]);
    const lat1 = toRadians(coord1[0]);
    const lat2 = toRadians(coord2[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const calculateDirection = (coord1, coord2) => {
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const latAbs = Math.abs(dLat);
    const lonAbs = Math.abs(dLon);

    // Define a threshold to determine whether to consider a combined direction (NE, NW, SE, SW)
    const threshold = 0.7; // Adjust this threshold as necessary (in degrees)

    // Determine the main direction based on the latitude and longitude differences
    if (latAbs > lonAbs) {
      // Mainly north or south
      if (latAbs < threshold) {
        // If latitude difference is small, consider only E or W
        return dLon > 0 ? "➡️ Est" : "⬅️ Ouest";
      }
      if (dLat > 0) {
        return lonAbs >= threshold ? (dLon > 0 ? "↗️ Nord-Est" : "↖️ Nord-Ouest") : "⬆️ Nord";
      } else {
        return lonAbs >= threshold ? (dLon > 0 ? "↘️ Sud-Est" : "↙️ Sud-Ouest") : "⬇️ Sud";
      }
    } else {
      // Mainly east or west
      if (lonAbs < threshold) {
        // If longitude difference is small, consider only N or S
        return dLat > 0 ? "⬆️ Nord" : "⬇️ Sud";
      }
      if (dLon > 0) {
        return latAbs >= threshold ? (dLat > 0 ? "↗️ Nord-Est" : "↘️ Sud-Est") : "➡️ Est";
      } else {
        return latAbs >= threshold ? (dLat > 0 ? "↖️ Nord-Ouest" : "↙️ Sud-Ouest") : "⬅️ Ouest";
      }
    }
  };

  const getCentroid = (geometry) => {
    let totalX = 0;
    let totalY = 0;
    let totalPoints = 0;

    // Handle Polygon and MultiPolygon cases
    const coordinates = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

    // Loop through all coordinate arrays (for each polygon in the multipolygon)
    coordinates.forEach((polygon) => {
      polygon[0].forEach((coord) => {
        totalX += coord[1]; // Latitude
        totalY += coord[0]; // Longitude
        totalPoints++;
      });
    });

    if (totalPoints === 0) return [0, 0]; // Fallback if something goes wrong
    return [totalX / totalPoints, totalY / totalPoints]; // [latitude, longitude]
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the department of the day from the API
      const departmentResponse = await fetch("https://departemental-backend.vercel.app/api/department-of-the-day");
      // const departmentResponse = await fetch("http://localhost:3001/api/department-of-the-day/contour");
      const departmentData = await departmentResponse.json();

      // Retrieve existing attempts from localStorage
      const storedAttempts = JSON.parse(localStorage.getItem("attempts") || "[]");

      // If department in localStorage is different from the one from the API, clear localStorage
      const storedDepartment = localStorage.getItem("department");
      if (storedDepartment !== departmentData.name) {
        localStorage.removeItem("attempts"); // Clear the attempts
        localStorage.setItem("department", departmentData.name); // Update with new department name
        setAttempts([]); // Clear attempts state as well
      } else {
        setAttempts(storedAttempts); // Load attempts from localStorage
      }

      // Fetch departments list
      const deptListResponse = await fetch("/departments_list.geojson");
      const deptListData = await deptListResponse.json();
      setDepartmentsList(deptListData.features);

      // Set the current department of the day
      setDepartment(departmentData);

      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, []);

  const handleSubmit = (value) => {
    const departmentName = value || inputValue.trim();

    // Check if the department has already been guessed
    if (attempts.some((attempt) => attempt.name.toLowerCase() === departmentName.toLowerCase())) {
      setSnackbarMessage("Vous avez déjà deviné ce département.");
      setSnackbarOpen(true);
      return;
    }

    const guessedDepartment = departmentsList.find(
      (dept) => dept.properties.nom.toLowerCase() === departmentName.toLowerCase()
    );

    if (!departmentName || !guessedDepartment) {
      setSnackbarMessage("Veuillez entrer un département valide.");
      setSnackbarOpen(true);
      return;
    }

    let newAttempts;
    const correctCentroid = getCentroid(department.geometry);
    const guessedCentroid = getCentroid(guessedDepartment.geometry);

    if (departmentName.toLowerCase() === department.name.toLowerCase()) {
      newAttempts = [...attempts, { name: departmentName, correct: true }];
      setSnackbarMessage("Bravo ! Vous avez trouvé le département !");
    } else {
      const distance = calculateDistance(correctCentroid, guessedCentroid).toFixed(2);
      const direction = calculateDirection(guessedCentroid, correctCentroid);
      newAttempts = [...attempts, { name: departmentName, distance, direction, correct: false }];

      setSnackbarMessage(`Vous êtes à ${distance} km vers le ${direction} du bon département.`);
    }

    setSnackbarOpen(true);
    setAttempts(newAttempts);
    localStorage.setItem("attempts", JSON.stringify(newAttempts));
  };

  const handleShare = () => {
    const attemptsString = attempts.map((attempt) => (attempt.correct ? "🟩" : "❌")).join("");
    const shareMessage = `#departemental-contour \n ${attemptsString}\n https://departemental-frontend.vercel.app/`;
    navigator.clipboard.writeText(shareMessage);

    setSnackbarMessage("Résultat copié dans le presse-papier");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const gameEnded = attempts.length >= MAX_ATTEMPTS || attempts.some((attempt) => attempt.correct);

  return (
    <Container maxWidth="sm" sx={{ mt: 0 }}>
      {loading ? (
        // Loader to show while data is fetching
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" sx={{ mb: 1, fontFamily: "Marianne", fontWeight: "bold" }}>
              CONTOUR
            </Typography>

            {department && (
              <Box sx={{ height: "300px", width: "100%", mb: 0 }}>
                <MapContainer
                  center={[46.603354, 1.888334]}
                  zoom={2}
                  style={{ height: "100%", width: "100%", backgroundColor: "white" }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  attributionControl={false}
                >
                  <GeoJSON data={department.geometry} style={{ color: "black", weight: 2 }} />
                  <FitToBounds geometry={department.geometry} />
                </MapContainer>
              </Box>
            )}

            <Box sx={{ mb: 2, textAlign: "center" }}>
              {attempts.length < MAX_ATTEMPTS && !gameEnded ? (
                <Box>
                  <Autocomplete
                    options={
                      inputValue.length > 0
                        ? departmentsList
                            .map((dept) => dept.properties.nom)
                            .filter(
                              (nom) =>
                                nom.toLowerCase().startsWith(inputValue.toLowerCase()) &&
                                !attempts.some((attempt) => attempt.name.toLowerCase() === nom.toLowerCase())
                            )
                        : []
                    }
                    value={inputValue}
                    inputValue={inputValue}
                    onInputChange={(e, newValue) => setInputValue(newValue)}
                    onChange={(e, newValue) => {
                      // Handle selection from dropdown
                      if (newValue) {
                        handleSubmit(newValue);
                        setInputValue("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Entrez le nom du département"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    )}
                  />

                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ backgroundColor: "#000091", "&:hover": { backgroundColor: "#1212ff" } }}
                      onClick={() => handleSubmit(inputValue)}
                    >
                      Valider
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }} gutterBottom>
                    {`Bonne réponse: ${department.name}`}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
                    {attempts.some((attempt) => attempt.correct) ? `Trop fort 💪` : `Trop nul 🤣 🫵`}
                  </Typography>
                </>
              )}
            </Box>

            {attempts.length > 0 && (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {attempts.map((attempt, index) => (
                  <Chip
                    key={index}
                    label={
                      attempt.correct
                        ? `${attempt.name.toUpperCase()}🎉`
                        : `${attempt.name.toUpperCase()} | ${attempt.distance} km | ${attempt.direction}`
                    }
                    style={{ backgroundColor: "#F5F5F5" }}
                  />
                ))}
              </Stack>
            )}

            {gameEnded && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button variant="outlined" sx={{ borderColor: "#000091", color: "#000091" }} onClick={handleShare}>
                  Partager le résultat
                </Button>
              </Box>
            )}
          </CardContent>

          <CardActions>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </CardActions>
        </Card>
      )}
    </Container>
  );
}

export default ContourMode;
