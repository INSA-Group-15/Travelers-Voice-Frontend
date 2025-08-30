export const ethiopianRegions = [
  "Addis Ababa",
  "Amhara",
  "Oromia",
  "Tigray",
  "SNNP",
  "Somali",
  "Afar",
  "Benishangul-Gumuz",
  "Gambella",
  "Harari",
  "Dire Dawa",
];

export const ethiopianCities = {
  "Addis Ababa": ["Addis Ababa City"],
  Amhara: [
    "Bahir Dar",
    "Gondar",
    "Dessie",
    "Debre Markos",
    "Debre Birhan",
    "Kombolcha",
    "Weldiya",
    "Debre Tabor",
  ],
  Oromia: [
    "Adama",
    "Jimma",
    "Nekemte",
    "Bishoftu",
    "Shashamane",
    "Asella",
    "Ambo",
    "Diredawa",
    "Hosaena",
    "Bale Robe",
  ],
  Tigray: ["Mekelle", "Adigrat", "Axum", "Shire", "Adwa", "Humera", "Maychew"],
  SNNP: [
    "Hawassa",
    "Arba Minch",
    "Dilla",
    "Sodo",
    "Wolaita Sodo",
    "Jinka",
    "Bonga",
    "Butajira",
  ],
  Somali: ["Jijiga", "Gode", "Kebri Dehar", "Shilabo", "Degehabur"],
  Afar: ["Semera", "Asayita", "Logiya", "Dubti"],
  "Benishangul-Gumuz": ["Assosa", "Metekel"],
  Gambella: ["Gambella"],
  Harari: ["Harar"],
  "Dire Dawa": ["Dire Dawa"],
};

export const ethiopianBusStations = [
  // Addis Ababa
  "Addis Ababa Bus Terminal (Meskel Square)",
  "Addis Ababa Bus Terminal (Autobus Terra)",
  "Addis Ababa Bus Terminal (Kality)",
  "Addis Ababa Bus Terminal (Megenagna)",
  "Addis Ababa Bus Terminal (Bole)",
  "Addis Ababa Bus Terminal (Kazanchis)",
  "Addis Ababa Bus Terminal (Lideta)",
  "Addis Ababa Bus Terminal (Merkato)",
  "Addis Ababa Bus Terminal (Piassa)",
  "Addis Ababa Bus Terminal (Arada)",

  // Amhara Region
  "Bahir Dar Bus Terminal",
  "Gondar Bus Terminal",
  "Dessie Bus Terminal",
  "Debre Markos Bus Terminal",
  "Debre Birhan Bus Terminal",
  "Kombolcha Bus Terminal",
  "Weldiya Bus Terminal",
  "Debre Tabor Bus Terminal",

  // Oromia Region
  "Adama Bus Terminal",
  "Jimma Bus Terminal",
  "Nekemte Bus Terminal",
  "Bishoftu Bus Terminal",
  "Shashamane Bus Terminal",
  "Asella Bus Terminal",
  "Ambo Bus Terminal",
  "Diredawa Bus Terminal",
  "Hosaena Bus Terminal",
  "Bale Robe Bus Terminal",

  // Tigray Region
  "Mekelle Bus Terminal",
  "Adigrat Bus Terminal",
  "Axum Bus Terminal",
  "Shire Bus Terminal",
  "Adwa Bus Terminal",
  "Humera Bus Terminal",
  "Maychew Bus Terminal",

  // SNNPR
  "Hawassa Bus Terminal",
  "Arba Minch Bus Terminal",
  "Dilla Bus Terminal",
  "Sodo Bus Terminal",
  "Wolaita Sodo Bus Terminal",
  "Jinka Bus Terminal",
  "Bonga Bus Terminal",
  "Butajira Bus Terminal",

  // Somali Region
  "Jijiga Bus Terminal",
  "Gode Bus Terminal",
  "Kebri Dehar Bus Terminal",
  "Shilabo Bus Terminal",
  "Degehabur Bus Terminal",

  // Afar Region
  "Semera Bus Terminal",
  "Asayita Bus Terminal",
  "Logiya Bus Terminal",
  "Dubti Bus Terminal",

  // Benishangul-Gumuz
  "Assosa Bus Terminal",
  "Metekel Bus Terminal",

  // Gambella
  "Gambella Bus Terminal",

  // Harari
  "Harar Bus Terminal",

  // Dire Dawa
  "Dire Dawa Bus Terminal",
];

export const reportTypes = [
  {
    value: "traffic",
    label: "Traffic Violation",
    description: "Traffic accidents, violations, or road safety issues",
  },
  {
    value: "bus",
    label: "Bus Service Issue",
    description: "Problems with bus service, scheduling, or quality",
  },
  {
    value: "overpriced_fare",
    label: "Overpriced Fare",
    description: "Bus drivers charging more than the standard fare",
  },
  {
    value: "gas_station",
    label: "Gas Station Issue",
    description: "Problems with fuel availability or service at gas stations",
  },
  {
    value: "other",
    label: "Other",
    description: "Other transportation-related issues",
  },
];
