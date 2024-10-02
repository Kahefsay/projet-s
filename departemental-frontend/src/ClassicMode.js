import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert, Autocomplete, TextField, Stack, Chip } from "@mui/material";
import { evaluateGuess } from "./utils";
import { fetchDepartmentsData } from "./data";

function ClassicMode() {
  const [department, setDepartment] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    // Fetch departments data
    fetchDepartmentsData(setDepartment, setDepartmentsList);
  }, []);

  const handleSubmit = (value) => {
    const departmentName = value || inputValue.trim();

    // Check if department is valid
    const guessedDepartment = departmentsList.find(
      (dept) => dept.properties.nom.toLowerCase() === departmentName.toLowerCase()
    );

    if (!guessedDepartment) {
      setSnackbarMessage("Veuillez entrer un département valide.");
      setSnackbarOpen(true);
      return;
    }

    // Evaluate the guess and provide hints
    const hints = evaluateGuess(department, guessedDepartment);
    setAttempts([...attempts, { name: guessedDepartment.properties.nom, hints }]);

    // Show hints to the user
    setSnackbarMessage(`Indices: ${hints.join(", ")}`);
    setSnackbarOpen(true);
  };

  return (
    <Box>
      <Autocomplete
        options={departmentsList.map((dept) => dept.properties.nom)}
        value={inputValue}
        inputValue={inputValue}
        onInputChange={(e, newValue) => setInputValue(newValue)}
        onChange={(e, newValue) => {
          if (newValue) handleSubmit(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Entrez le nom du département" variant="outlined" />}
      />
      <Button variant="contained" color="primary" onClick={() => handleSubmit(inputValue)}>
        Valider
      </Button>

      {/* Display hints */}
      <Stack spacing={1}>
        {attempts.map((attempt, index) => (
          <Chip key={index} label={`${attempt.name} - Indices: ${attempt.hints.join(", ")}`} />
        ))}
      </Stack>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ClassicMode;
