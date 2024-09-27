import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";

function App() {
  const [department, setDepartment] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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

    // Determine the main direction based on the latitude and longitude differences
    if (Math.abs(dLat) > Math.abs(dLon)) {
      // Mainly north or south
      if (dLat > 0) {
        return dLon > 0 ? "↗️ Nord-Est" : dLon < 0 ? "↖️ Nord-Ouest" : "⬆️ Nord";
      } else {
        return dLon > 0 ? "↘️ Sud-Est" : dLon < 0 ? "↙️ Sud-Ouest" : "⬇️ Sud";
      }
    } else {
      // Mainly east or west
      if (dLon > 0) {
        return dLat > 0 ? "↗️ Nord-Est" : dLat < 0 ? "↘️ Sud-Est" : "➡️ Est";
      } else {
        return dLat > 0 ? "↖️ Nord-Ouest" : dLat < 0 ? "↙️ Sud-Ouest" : "⬅️ Ouest";
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
    // Fetch the department of the day
    fetch("https://departemental-backend-j86rmcfaa-kahefsays-projects.vercel.app/api/department-of-the-day")
      .then((res) => res.json())
      .then((data) => {
        const storedDepartmentCode = localStorage.getItem("departmentCode");

        if (storedDepartmentCode !== data.code) {
          localStorage.setItem("departmentCode", data.code);
          localStorage.removeItem("attempts");
          setAttempts([]);
        } else {
          const savedAttempts = JSON.parse(localStorage.getItem("attempts")) || [];
          setAttempts(savedAttempts);
        }

        setDepartment(data);
      });

    // Load all department names for autocomplete
    fetch("/departments_list.geojson") // GeoJSON file with all department data
      .then((res) => res.json())
      .then((data) => setDepartmentsList(data.features));
  }, []);

  const handleSubmit = (value) => {
    const departmentName = value || inputValue.trim();
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
    const shareMessage = `#départemental #1 \n${attemptsString}\nhttps://www.départemental.fr`;
    navigator.clipboard.writeText(shareMessage);

    setSnackbarMessage("Résultat copié dans le presse-papier");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const gameEnded = attempts.length >= MAX_ATTEMPTS || attempts.some((attempt) => attempt.correct);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: 4,
      }}
    >
      <Card elevation={8} sx={{ p: 3, textAlign: "center", maxWidth: 600, width: "100%" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Départemental
          </Typography>

          {department && (
            <Box sx={{ height: "400px", mb: 3 }}>
              <MapContainer
                center={[46.603354, 1.888334]}
                zoom={6}
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

          <Box sx={{ mb: 2 }}>
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

                <Button variant="contained" color="primary" onClick={() => handleSubmit(inputValue)}>
                  Valider
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
                  {`Bonne réponse: ${department.name}`}
                </Typography>
                <Typography variant="h6" gutterBottom>
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
            <Button variant="outlined" color="secondary" onClick={handleShare}>
              Partager le résultat
            </Button>
          )}
        </CardContent>
      </Card>

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
    </Container>
  );
}

export default App;
