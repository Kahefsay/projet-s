import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
  Stack,
  Container,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { fetchDepartmentsData } from "./data";
import { evaluateGuess } from "./utils";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./styles/ClassicMode.css";

function ClassicMode() {
  const [department, setDepartment] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [departmentsList, setDepartmentsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch departments data and the department of the day
    const initializeGame = async () => {
      setLoading(true);

      try {
        // Fetch departments and department of the day
        await fetchDepartmentsData(setDepartment, setDepartmentsList);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Erreur lors du chargement des données.");
        setSnackbarOpen(true);
      }
    };

    initializeGame();
  }, []);

  useEffect(() => {
    // Once department and departmentsList are loaded, handle attempts
    if (department && departmentsList.length > 0) {
      const storedAttempts = JSON.parse(localStorage.getItem("classicAttempts") || "[]");
      const storedDepartment = localStorage.getItem("classicDepartment");

      // Check if the stored department is the same as the current one
      if (storedDepartment !== department.name) {
        // If the department has changed, reset attempts
        localStorage.removeItem("classicAttempts");
        localStorage.setItem("classicDepartment", department.name);
        setAttempts([]);
      } else {
        // Use the saved attempts
        setAttempts(storedAttempts);
      }
      setLoading(false);
    }
  }, [department, departmentsList]);

  const handleSubmit = (value) => {
    const departmentName = value || inputValue.trim();

    // Check if the department has already been guessed
    if (attempts.some((attempt) => attempt.name.toLowerCase() === departmentName.toLowerCase())) {
      setSnackbarMessage("Vous avez déjà deviné ce département.");
      setSnackbarOpen(true);
      return;
    }

    // Check if department is valid
    const guessedDepartment = departmentsList.find(
      (dept) => dept.properties.nom.toLowerCase() === departmentName.toLowerCase()
    );

    if (!guessedDepartment) {
      setSnackbarMessage("Veuillez entrer un département valide.");
      setSnackbarOpen(true);
      return;
    }

    // Ensure department is not null before comparing names
    if (!department) {
      setSnackbarMessage("Département non chargé, veuillez réessayer.");
      setSnackbarOpen(true);
      return;
    }

    // Evaluate the guess and provide hints
    const hints = evaluateGuess(department, guessedDepartment);
    const correctGuess = departmentName.toLowerCase() === department.name.toLowerCase();

    const newAttempt = {
      name: guessedDepartment.properties.nom,
      hints,
      correct: correctGuess,
    };

    const newAttempts = [newAttempt, ...attempts];

    setAttempts(newAttempts);
    setInputValue("");
    // Save attempts in localStorage
    localStorage.setItem("classicAttempts", JSON.stringify(newAttempts));

    if (correctGuess) {
      setSnackbarMessage("Bravo ! Vous avez trouvé le département !");
    } else {
      setSnackbarMessage("Mauvaise réponse, essayez encore !");
    }
    setSnackbarOpen(true);
  };

  const handleShare = () => {
    const attemptsCount = attempts.length;
    const shareMessage = `#departemental-classique \n Vous avez trouvé le département en ${attemptsCount} tentative(s).\n https://departemental-frontend.vercel.app/`;
    navigator.clipboard.writeText(shareMessage);

    setSnackbarMessage("Résultat copié dans le presse-papier");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const gameEnded = attempts.some((attempt) => attempt.correct);

  // Render hint cells with color coding based on status
  const renderHintCell = (hint) => {
    // Determine the color class based on the status property
    let colorClass = "neutral";

    switch (hint.status) {
      case "correct":
        colorClass = "correct"; // Green for correct matches
        break;
      case "medium":
        colorClass = "medium"; // Orange for medium matches
        break;
      case "wrong":
        colorClass = "incorrect"; // Red for wrong matches
        break;
      default:
        colorClass = "neutral"; // Fallback color (gray)
    }

    return (
      <Box key={hint.indice} className={`hint-cell ${colorClass}`}>
        {hint.indice}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0 }}>
      {loading || !department ? (
        // Loader while data is fetching or department is not yet set
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontFamily: "Marianne", fontWeight: "bold" }}>
              CLASSIQUE
            </Typography>

            <Box sx={{ mb: 2, textAlign: "center" }}>
              {!gameEnded ? (
                <>
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
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: "#000091", "&:hover": { backgroundColor: "#1212ff" } }}
                    onClick={() => handleSubmit(inputValue)}
                  >
                    Valider
                  </Button>
                </>
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

            {/* Display attempts and hints with color coding */}
            <Box
              sx={{
                overflowX: { xs: "auto", md: "unset" },
              }}
            >
              <Stack spacing={1} sx={{ mb: 2 }}>
                {/* Header row */}
                <Box className="attempt-header">
                  <Box className="header-cell">Département</Box>
                  <Box className="header-cell">Région</Box>
                  <Box className="header-cell">Paysage</Box>
                  <Box className="header-cell">Nbre Communes</Box>
                  <Box className="header-cell">Population</Box>
                  <Box className="header-cell">Superficie</Box>
                </Box>

                {/* Use TransitionGroup and CSSTransition for attempts */}
                <TransitionGroup>
                  {attempts.map((attempt, index) => (
                    <CSSTransition key={index} timeout={500} classNames="attempt">
                      <Box className="attempt-row">
                        <Box className="attempt-cell attempt-name neutral">{attempt.name.toUpperCase()}</Box>

                        {/* Assuming `hints` array contains the relevant data in order */}
                        {attempt.hints.map((hint, hintIndex) => (
                          <Box key={hintIndex} className="attempt-cell">
                            {renderHintCell(hint)}
                          </Box>
                        ))}
                      </Box>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </Stack>
            </Box>

            {/* Share button */}
            {gameEnded && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button variant="outlined" sx={{ borderColor: "#000091", color: "#000091" }} onClick={handleShare}>
                  Partager le résultat
                </Button>
              </Box>
            )}

            {/* Snackbar for messages */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: "100%" }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default ClassicMode;
