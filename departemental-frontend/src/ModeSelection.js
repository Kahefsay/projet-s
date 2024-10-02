import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, Box, Snackbar, Alert } from "@mui/material";

function ModeSelection({ setMode }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const modes = [
    {
      title: "CLASSIQUE",
      description:
        "Le mode classique consiste à deviner le bon département en recevant des indices après chaque tentative.",
      value: "classic",
    },
    {
      title: "CONTOUR",
      description: "Le mode contour consite à deviner le département à partir de son contour géographique.",
      value: "contour",
    },
    {
      title: "SATELLITE",
      description: "Le mode satellite consite à deviner le département à partir d'une image satellite.",
      value: "satelitte",
    },
    {
      title: "???",
      description: "Le mode ??? consite à deviner le département à partir de ???.",
      value: "???",
    },
    {
      title: "???",
      description: "Le mode ??? consite à deviner le département à partir de ???.",
      value: "???",
    },
  ];

  const handleModeClick = (mode) => {
    if (mode.value !== "contour") {
      // Show snackbar if "Classique" is clicked
      setSnackbarOpen(true);
    } else {
      // Change the mode if any other mode is clicked
      setMode(mode.value);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={4} justifyContent="center" sx={{ paddingLeft: "24px", paddingRight: "24px" }}>
        {modes.map((mode) => (
          <Grid item xs={12} sm={6} key={mode.value}>
            <Card
              elevation={4}
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 8 },
                p: 2,
              }}
              onClick={() => handleModeClick(mode)}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontFamily: "Marianne", fontWeight: "bold" }}>
                  {mode.title}
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body1" sx={{ fontFamily: "Marianne" }}>
                    {mode.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for unavailable mode */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: "100%" }}>
          Ce mode n'est pas disponible pour le moment.
        </Alert>
      </Snackbar>
    </>
  );
}

export default ModeSelection;
