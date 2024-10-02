import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Navbar = ({ setMode }) => {
  // Function to handle click event
  const handleTitleClick = () => {
    setMode(null); // Reset mode to null
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "none",
        borderBottom: "1px solid rgba(58, 58, 58, 0.2)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, maxWidth: "1280px", height: "130px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: 4 }}>
              <Typography
                variant="h3"
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Marianne",
                  fontSize: "1rem",
                }}
              >
                🥖
              </Typography>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Marianne",
                  fontSize: "0.8rem",
                }}
              >
                GOUVERNEMENT
              </Typography>
              <Box sx={{ textAlign: "left", marginTop: "-0.25rem" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Marianne",
                    fontStyle: "italic",
                    display: "block",
                    lineHeight: "1",
                    fontSize: "0.6rem",
                  }}
                >
                  Liberté
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Marianne",
                    fontStyle: "italic",
                    display: "block",
                    lineHeight: "1",
                    fontSize: "0.6rem",
                  }}
                >
                  Égalité
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "Marianne",
                    fontStyle: "italic",
                    display: "block",
                    lineHeight: "1",
                    fontSize: "0.6rem",
                  }}
                >
                  Fraternité
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h7"
              noWrap
              onClick={handleTitleClick} // Add onClick event
              sx={{
                fontWeight: "bold",
                fontFamily: "Marianne",
                cursor: "pointer",
                transition: "color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  color: "#1212ff",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              departemental.info.gouv
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
