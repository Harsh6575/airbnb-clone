import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region,
})); // format the countries array to be used in the app. 

const useCountries = () => {
  const getAll = () => formattedCountries; // return the formatted countries array. 

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value);
  }; // return the country object with the value property equal to the value passed to the function.

  return {
    getAll,
    getByValue,
  }; // return the getAll and getByValue functions.
};

export default useCountries;