import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import "./styles/Fonts.css";
import ModeSelection from "./ModeSelection";
import Navbar from "./Navbar";
import ContourMode from "./ContourMode";
import ClassicMode from "./ClassicMode";
import Footer from "./Footer"; // Import the Footer component

function App() {
  const [mode, setMode] = useState(null);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Pass setMode to Navbar */}
      <Navbar setMode={setMode} />
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          flexGrow: 1,
          padding: 4,
          marginTop: 5, // Add some margin to space from the navbar
        }}
      >
        {/* Display the title if no mode is selected */}
        {!mode && (
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Marianne",
              fontWeight: "bold",
              marginBottom: 4,
              alignSelf: "flex-start",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            Mode de jeu
          </Typography>
        )}
        {!mode && <ModeSelection setMode={setMode} />}
        {mode === "contour" && <ContourMode />}
        {mode === "classic" && <ClassicMode />}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
