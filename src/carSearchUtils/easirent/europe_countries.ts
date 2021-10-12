export const EuropeCountries = ['AT',
    'BE',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IT',
    'LV',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE',
]

export const isAnEuropeCountry = (countryAbbreviature: string) => {
    return EuropeCountries.includes(countryAbbreviature);
}

export const isIreland = (countryAbbreviature: string) => {
    return countryAbbreviature === "IE";
}

export const isUk = (countryAbbreviature: string) => {
    return countryAbbreviature === "GB";
}

export const isUsa = (countryAbbreviature: string) => {
    return countryAbbreviature === "US";
}

export default EuropeCountries;