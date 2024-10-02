const fs = require("fs");

// Charger les fichiers
const departementsGeojson = JSON.parse(fs.readFileSync("./departements.geojson", "utf-8"));
const departementsInfo = [
  {
    "01": {
      nom: "Ain",
      superficie: 5762,
      population: 652432,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 393,
    },
    "02": {
      nom: "Aisne",
      superficie: 7369,
      population: 531345,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "L",
      nombreDeCommunes: 800,
    },
    "03": {
      nom: "Allier",
      superficie: 7340,
      population: 335875,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "M",
      nombreDeCommunes: 317,
    },
    "04": {
      nom: "Alpes-de-Haute-Provence",
      superficie: 6925,
      population: 164708,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "D",
      nombreDeCommunes: 198,
    },
    "05": {
      nom: "Hautes-Alpes",
      superficie: 5549,
      population: 141107,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "G",
      nombreDeCommunes: 162,
    },
    "06": {
      nom: "Alpes-Maritimes",
      superficie: 4299,
      population: 1085935,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "N",
      nombreDeCommunes: 163,
    },
    "07": {
      nom: "Ardèche",
      superficie: 5529,
      population: 328278,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "P",
      nombreDeCommunes: 335,
    },
    "08": {
      nom: "Ardennes",
      superficie: 5229,
      population: 275978,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 449,
    },
    "09": {
      nom: "Ariège",
      superficie: 4890,
      population: 152108,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "F",
      nombreDeCommunes: 327,
    },
    10: {
      nom: "Aube",
      superficie: 6004,
      population: 306429,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "T",
      nombreDeCommunes: 431,
    },
    11: {
      nom: "Aude",
      superficie: 6139,
      population: 375065,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 433,
    },
    12: {
      nom: "Aveyron",
      superficie: 8736,
      population: 278035,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "R",
      nombreDeCommunes: 285,
    },
    13: {
      nom: "Bouches-du-Rhône",
      superficie: 5087,
      population: 2036712,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "M",
      nombreDeCommunes: 119,
    },
    14: {
      nom: "Calvados",
      superficie: 5550,
      population: 694905,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 528,
    },
    15: {
      nom: "Cantal",
      superficie: 5726,
      population: 145851,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "A",
      nombreDeCommunes: 246,
    },
    16: {
      nom: "Charente",
      superficie: 5956,
      population: 353948,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "A",
      nombreDeCommunes: 363,
    },
    17: {
      nom: "Charente-Maritime",
      superficie: 6864,
      population: 656157,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "L",
      nombreDeCommunes: 463,
    },
    18: {
      nom: "Cher",
      superficie: 7235,
      population: 302306,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 287,
    },
    19: {
      nom: "Corrèze",
      superficie: 5857,
      population: 240072,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "T",
      nombreDeCommunes: 279,
    },
    "2A": {
      nom: "Corse-du-Sud",
      superficie: 4014,
      population: 158507,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "A",
      nombreDeCommunes: 124,
    },
    "2B": {
      nom: "Haute-Corse",
      superficie: 4666,
      population: 182639,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 236,
    },
    21: {
      nom: "Côte-d'Or",
      superficie: 8763,
      population: 533213,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "D",
      nombreDeCommunes: 698,
    },
    22: {
      nom: "Côtes-d'Armor",
      superficie: 6878,
      population: 598814,
      detailsGeographiques: "côtier",
      chefLieuPremiereLettre: "S",
      nombreDeCommunes: 348,
    },
    23: {
      nom: "Creuse",
      superficie: 5565,
      population: 116617,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "G",
      nombreDeCommunes: 256,
    },
    24: {
      nom: "Dordogne",
      superficie: 9060,
      population: 416971,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "P",
      nombreDeCommunes: 505,
    },
    25: {
      nom: "Doubs",
      superficie: 5234,
      population: 541597,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 573,
    },
    26: {
      nom: "Drôme",
      superficie: 6530,
      population: 527989,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "V",
      nombreDeCommunes: 363,
    },
    27: {
      nom: "Eure",
      superficie: 6040,
      population: 599527,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "E",
      nombreDeCommunes: 585,
    },
    28: {
      nom: "Eure-et-Loir",
      superficie: 5880,
      population: 432456,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 365,
    },
    29: {
      nom: "Finistère",
      superficie: 6733,
      population: 915090,
      detailsGeographiques: "côtier",
      chefLieuPremiereLettre: "Q",
      nombreDeCommunes: 277,
    },
    30: {
      nom: "Gard",
      superficie: 5853,
      population: 748437,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "N",
      nombreDeCommunes: 353,
    },
    31: {
      nom: "Haute-Garonne",
      superficie: 6309,
      population: 1476820,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "T",
      nombreDeCommunes: 586,
    },
    32: {
      nom: "Gers",
      superficie: 6257,
      population: 191091,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "A",
      nombreDeCommunes: 462,
    },
    33: {
      nom: "Gironde",
      superficie: 10000,
      population: 1629366,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 535,
    },
    34: {
      nom: "Hérault",
      superficie: 6224,
      population: 1175237,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "M",
      nombreDeCommunes: 342,
    },
    35: {
      nom: "Ille-et-Vilaine",
      superficie: 6775,
      population: 1080865,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "R",
      nombreDeCommunes: 333,
    },
    36: {
      nom: "Indre",
      superficie: 6791,
      population: 216275,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 241,
    },
    37: {
      nom: "Indre-et-Loire",
      superficie: 6127,
      population: 617413,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "T",
      nombreDeCommunes: 272,
    },
    38: {
      nom: "Isère",
      superficie: 7431,
      population: 1275181,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "G",
      nombreDeCommunes: 512,
    },
    39: {
      nom: "Jura",
      superficie: 4999,
      population: 260517,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "L",
      nombreDeCommunes: 494,
    },
    40: {
      nom: "Landes",
      superficie: 9243,
      population: 414974,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "M",
      nombreDeCommunes: 327,
    },
    41: {
      nom: "Loir-et-Cher",
      superficie: 6343,
      population: 329173,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "B",
      nombreDeCommunes: 267,
    },
    42: {
      nom: "Loire",
      superficie: 4781,
      population: 762659,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "S",
      nombreDeCommunes: 323,
    },
    43: {
      nom: "Haute-Loire",
      superficie: 4977,
      population: 227283,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "L",
      nombreDeCommunes: 257,
    },
    44: {
      nom: "Loire-Atlantique",
      superficie: 6815,
      population: 1436736,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "N",
      nombreDeCommunes: 207,
    },
    45: {
      nom: "Loiret",
      superficie: 6775,
      population: 686362,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "O",
      nombreDeCommunes: 325,
    },
    46: {
      nom: "Lot",
      superficie: 5217,
      population: 173420,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "C",
      nombreDeCommunes: 313,
    },
    47: {
      nom: "Lot-et-Garonne",
      superficie: 5361,
      population: 331977,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "A", // Agen
      nombreDeCommunes: 319,
    },
    48: {
      nom: "Lozère",
      superficie: 5167,
      population: 76052,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "M", // Mende
      nombreDeCommunes: 152,
    },
    49: {
      nom: "Maine-et-Loire",
      superficie: 7166,
      population: 819896,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "A", // Angers
      nombreDeCommunes: 177,
    },
    50: {
      nom: "Manche",
      superficie: 5938,
      population: 495045,
      detailsGeographiques: "côtier",
      chefLieuPremiereLettre: "S", // Saint-Lô
      nombreDeCommunes: 446,
    },
    51: {
      nom: "Marne",
      superficie: 8162,
      population: 566522,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "C", // Châlons-en-Champagne
      nombreDeCommunes: 613,
    },
    52: {
      nom: "Haute-Marne",
      superficie: 6211,
      population: 172512,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "C", // Chaumont
      nombreDeCommunes: 426,
    },
    53: {
      nom: "Mayenne",
      superficie: 5175,
      population: 307687,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "L", // Laval
      nombreDeCommunes: 240,
    },
    54: {
      nom: "Meurthe-et-Moselle",
      superficie: 5246,
      population: 733760,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "N", // Nancy
      nombreDeCommunes: 591,
    },
    55: {
      nom: "Meuse",
      superficie: 6211,
      population: 184083,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "B", // Bar-le-Duc
      nombreDeCommunes: 499,
    },
    56: {
      nom: "Morbihan",
      superficie: 6823,
      population: 766375,
      detailsGeographiques: "côtier",
      chefLieuPremiereLettre: "V", // Vannes
      nombreDeCommunes: 249,
    },
    57: {
      nom: "Moselle",
      superficie: 6216,
      population: 1048207,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "M", // Metz
      nombreDeCommunes: 725,
    },
    58: {
      nom: "Nièvre",
      superficie: 6817,
      population: 204313,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "N", // Nevers
      nombreDeCommunes: 309,
    },
    59: {
      nom: "Nord",
      superficie: 5743,
      population: 2605924,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "L", // Lille
      nombreDeCommunes: 648,
    },
    60: {
      nom: "Oise",
      superficie: 5860,
      population: 834105,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "B", // Beauvais
      nombreDeCommunes: 679,
    },
    61: {
      nom: "Orne",
      superficie: 6103,
      population: 279942,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "A", // Alençon
      nombreDeCommunes: 385,
    },
    62: {
      nom: "Pas-de-Calais",
      superficie: 6671,
      population: 1468200,
      detailsGeographiques: "côtier, plaine",
      chefLieuPremiereLettre: "A", // Arras
      nombreDeCommunes: 891,
    },
    63: {
      nom: "Puy-de-Dôme",
      superficie: 7970,
      population: 660167,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "C", // Clermont-Ferrand
      nombreDeCommunes: 464,
    },
    64: {
      nom: "Pyrénées-Atlantiques",
      superficie: 7645,
      population: 682621,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "P", // Pau
      nombreDeCommunes: 546,
    },
    65: {
      nom: "Hautes-Pyrénées",
      superficie: 4464,
      population: 229567,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "T", // Tarbes
      nombreDeCommunes: 469,
    },
    66: {
      nom: "Pyrénées-Orientales",
      superficie: 4116,
      population: 481691,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "P", // Perpignan
      nombreDeCommunes: 226,
    },
    67: {
      nom: "Bas-Rhin",
      superficie: 4755,
      population: 1152425,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "S", // Strasbourg
      nombreDeCommunes: 514,
    },
    68: {
      nom: "Haut-Rhin",
      superficie: 3524,
      population: 767842,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "C", // Colmar
      nombreDeCommunes: 366,
    },
    69: {
      nom: "Rhône",
      superficie: 3249,
      population: 1891445,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "L", // Lyon
      nombreDeCommunes: 208,
    },
    70: {
      nom: "Haute-Saône",
      superficie: 5360,
      population: 234685,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "V", // Vesoul
      nombreDeCommunes: 539,
    },
    71: {
      nom: "Saône-et-Loire",
      superficie: 8575,
      population: 549220,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "M", // Mâcon
      nombreDeCommunes: 565,
    },
    72: {
      nom: "Sarthe",
      superficie: 6206,
      population: 567968,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "L", // Le Mans
      nombreDeCommunes: 354,
    },
    73: {
      nom: "Savoie",
      superficie: 6028,
      population: 431174,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "C", // Chambéry
      nombreDeCommunes: 273,
    },
    74: {
      nom: "Haute-Savoie",
      superficie: 4388,
      population: 826094,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "A", // Annecy
      nombreDeCommunes: 279,
    },
    75: {
      nom: "Paris",
      superficie: 105,
      population: 2165423,
      detailsGeographiques: "urbain",
      chefLieuPremiereLettre: "P", // Paris
      nombreDeCommunes: 1,
    },
    76: {
      nom: "Seine-Maritime",
      superficie: 6278,
      population: 1261466,
      detailsGeographiques: "côtier",
      chefLieuPremiereLettre: "R", // Rouen
      nombreDeCommunes: 708,
    },
    77: {
      nom: "Seine-et-Marne",
      superficie: 5915,
      population: 1417480,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "M", // Melun
      nombreDeCommunes: 507,
    },
    78: {
      nom: "Yvelines",
      superficie: 2284,
      population: 1460437,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "V", // Versailles
      nombreDeCommunes: 259,
    },
    79: {
      nom: "Deux-Sèvres",
      superficie: 5999,
      population: 374392,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "N", // Niort
      nombreDeCommunes: 256,
    },
    80: {
      nom: "Somme",
      superficie: 6170,
      population: 571211,
      detailsGeographiques: "côtier, plateaux",
      chefLieuPremiereLettre: "A", // Amiens
      nombreDeCommunes: 772,
    },
    81: {
      nom: "Tarn",
      superficie: 5758,
      population: 387099,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "A", // Albi
      nombreDeCommunes: 314,
    },
    82: {
      nom: "Tarn-et-Garonne",
      superficie: 3718,
      population: 259107,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "M", // Montauban
      nombreDeCommunes: 195,
    },
    83: {
      nom: "Var",
      superficie: 5973,
      population: 1088162,
      detailsGeographiques: "côtier, montagneux",
      chefLieuPremiereLettre: "T", // Toulon
      nombreDeCommunes: 153,
    },
    84: {
      nom: "Vaucluse",
      superficie: 3567,
      population: 565264,
      detailsGeographiques: "plateaux, montagneux",
      chefLieuPremiereLettre: "A", // Avignon
      nombreDeCommunes: 151,
    },
    85: {
      nom: "Vendée",
      superficie: 6720,
      population: 685442,
      detailsGeographiques: "côtier, plaine",
      chefLieuPremiereLettre: "L", // La Roche-sur-Yon
      nombreDeCommunes: 255,
    },
    86: {
      nom: "Vienne",
      superficie: 6990,
      population: 439151,
      detailsGeographiques: "plateaux",
      chefLieuPremiereLettre: "P", // Poitiers
      nombreDeCommunes: 266,
    },
    87: {
      nom: "Haute-Vienne",
      superficie: 5520,
      population: 372359,
      detailsGeographiques: "montagneux, plateaux",
      chefLieuPremiereLettre: "L", // Limoges
      nombreDeCommunes: 195,
    },
    88: {
      nom: "Vosges",
      superficie: 5874,
      population: 364499,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "E", // Épinal
      nombreDeCommunes: 507,
    },
    89: {
      nom: "Yonne",
      superficie: 7428,
      population: 335707,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "A", // Auxerre
      nombreDeCommunes: 428,
    },
    90: {
      nom: "Territoire de Belfort",
      superficie: 609,
      population: 144318,
      detailsGeographiques: "montagneux",
      chefLieuPremiereLettre: "B", // Belfort
      nombreDeCommunes: 102,
    },
    91: {
      nom: "Essonne",
      superficie: 1814,
      population: 1301292,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "É", // Évry
      nombreDeCommunes: 194,
    },
    92: {
      nom: "Hauts-de-Seine",
      superficie: 176,
      population: 1630165,
      detailsGeographiques: "urbain",
      chefLieuPremiereLettre: "N", // Nanterre
      nombreDeCommunes: 36,
    },
    93: {
      nom: "Seine-Saint-Denis",
      superficie: 236,
      population: 1659443,
      detailsGeographiques: "urbain",
      chefLieuPremiereLettre: "B", // Bobigny
      nombreDeCommunes: 40,
    },
    94: {
      nom: "Val-de-Marne",
      superficie: 245,
      population: 1402360,
      detailsGeographiques: "urbain",
      chefLieuPremiereLettre: "C", // Créteil
      nombreDeCommunes: 47,
    },
    95: {
      nom: "Val-d'Oise",
      superficie: 1246,
      population: 1260660,
      detailsGeographiques: "plaine",
      chefLieuPremiereLettre: "C", // Cergy
      nombreDeCommunes: 185,
    },
  },
];

console.log(departementsInfo);

// Fonction pour compléter les propriétés des départements
function completeGeojsonProperties(geojson, info) {
  // Parcourir chaque feature du geojson
  geojson.features.forEach((feature) => {
    // Récupérer le code du département
    const code = feature.properties.code;
    // Chercher les informations correspondantes dans departementsInfo
    const deptInfo = info.find((dept) => dept[code]);

    if (deptInfo) {
      // Ajouter les propriétés supplémentaires
      feature.properties = {
        ...feature.properties,
        ...deptInfo[code],
      };
    }
  });

  return geojson;
}

// Compléter les propriétés
const completedGeojson = completeGeojsonProperties(departementsGeojson, departementsInfo);

// Sauvegarder le nouveau fichier
fs.writeFileSync("departements-completed.geojson", JSON.stringify(completedGeojson, null, 2));

console.log("Fichier geojson complété généré: départements-completed.geojson");
