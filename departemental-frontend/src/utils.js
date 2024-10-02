export const calculateDistance = (coord1, coord2) => {
  // Distance calculation logic
};

export const calculateDirection = (coord1, coord2) => {
  // Direction calculation logic
};

export const getCentroid = (geometry) => {
  // Calculate centroid of a polygon
};

export const evaluateGuess = (correctDepartment, guessedDepartment) => {
  const hints = [];

  // Compare population
  if (Math.abs(correctDepartment.population - guessedDepartment.properties.population) < 50000) {
    hints.push("Population proche");
  }

  // Compare superficie
  if (Math.abs(correctDepartment.superficie - guessedDepartment.properties.superficie) < 500) {
    hints.push("Superficie similaire");
  }

  // Compare geographical details
  if (correctDepartment.detailsGeographiques === guessedDepartment.properties.detailsGeographiques) {
    hints.push("Détails géographiques similaires");
  }

  // Add other rules here...

  return hints;
};
