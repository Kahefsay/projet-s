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

  const formatNumber = (number) => new Intl.NumberFormat("fr-FR").format(number);

  // Compare first letter of chef-lieu (capital)
  if (correctDepartment.region === guessedDepartment.properties.region) {
    hints.push({
      indice: guessedDepartment.properties.region,
      status: "correct",
    });
  } else {
    hints.push({
      indice: guessedDepartment.properties.region,
      status: "wrong",
    });
  }

  // Compare geographical details
  const correctDetails = correctDepartment.detailsGeographiques.split("/");
  const guessedDetails = guessedDepartment.properties.detailsGeographiques.split("/");

  const intersection = correctDetails.filter((detail) => guessedDetails.includes(detail));

  if (intersection.length === correctDetails.length && intersection.length === guessedDetails.length) {
    // Exact match
    hints.push({
      indice: guessedDepartment.properties.detailsGeographiques,
      status: "correct", // green
    });
  } else if (intersection.length > 0) {
    // Partial match
    hints.push({
      indice: guessedDepartment.properties.detailsGeographiques,
      status: "medium", // orange
    });
  } else {
    // No match
    hints.push({
      indice: guessedDepartment.properties.detailsGeographiques,
      status: "wrong", // red
    });
  }

  // Compare number of communes
  const communeDiff = Math.abs(correctDepartment.nombreDeCommunes - guessedDepartment.properties.nombreDeCommunes);
  let communeHint = {};
  if (communeDiff < 50) {
    communeHint = {
      indice: formatNumber(guessedDepartment.properties.nombreDeCommunes),
      status: "correct",
    };
  } else if (communeDiff < 150) {
    communeHint = {
      indice: formatNumber(guessedDepartment.properties.nombreDeCommunes),
      status: "medium",
    };
  } else {
    communeHint = {
      indice: formatNumber(guessedDepartment.properties.nombreDeCommunes),
      status: "wrong",
    };
  }
  hints.push(communeHint);

  // Compare population
  const populationDiff = Math.abs(correctDepartment.population - guessedDepartment.properties.population);
  let populationHint = {};
  if (populationDiff < 150000) {
    populationHint = {
      indice: formatNumber(guessedDepartment.properties.population),
      status: "correct",
    };
  } else if (populationDiff < 500000) {
    populationHint = {
      indice: formatNumber(guessedDepartment.properties.population),
      status: "medium",
    };
  } else {
    populationHint = {
      indice: formatNumber(guessedDepartment.properties.population),
      status: "wrong",
    };
  }
  hints.push(populationHint);

  // Compare superficie (area)
  const superficieDiff = Math.abs(correctDepartment.superficie - guessedDepartment.properties.superficie);
  let superficieHint = {};
  if (superficieDiff < 1000) {
    superficieHint = {
      indice: formatNumber(guessedDepartment.properties.superficie),
      status: "correct",
    };
  } else if (superficieDiff < 3000) {
    superficieHint = {
      indice: formatNumber(guessedDepartment.properties.superficie),
      status: "medium",
    };
  } else {
    superficieHint = {
      indice: formatNumber(guessedDepartment.properties.superficie),
      status: "wrong",
    };
  }
  hints.push(superficieHint);

  console.log(hints);
  return hints;
};
