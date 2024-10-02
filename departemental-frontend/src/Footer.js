// Footer.js
import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#F5F5FE",
        padding: "16px 0",
        marginTop: "auto",
        width: "100%",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: "Marianne" }}>
          &copy; Bebou Prod. Tous droits réservés.
        </Typography>
        {/* Add more footer content as necessary */}
        <Typography variant="body2" sx={{ fontFamily: "Marianne", marginTop: 1 }}>
          Ce site est géré par le Service d’Information du Gouvernement (SIG).
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
