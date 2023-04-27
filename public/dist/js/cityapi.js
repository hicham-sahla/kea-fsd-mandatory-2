const endpoint = "https://api.countrystatecity.in/v1"; // base URL
const apiKey = "UU91cms3ODF1NjFNdjNDTVhVQ0ZoeElpNmRWZU5pS2VXRTlnZ0pPbA==";
const country = "NL"; // country I would like to select a state from (Netherlands), looked up at https://www.iban.com/country-codes
const state = "NH"; // state I would like to see the cities from (Noord-Holland), looked up at https://www.iso.org/obp/ui/#iso:code:3166:NL
const apiUrl = `${endpoint}/countries/${country}/states/${state}/cities`; // assembled API url

let headers = new Headers(); // copypasted below code from 'Example Usage' in the api docs https://countrystatecity.in/docs/api/cities-by-state-country/
headers.append("X-CSCAPI-KEY", apiKey);
const requestOptions = {
  method: "GET",
  headers: headers,
  redirect: "follow",
};

fetch(apiUrl, requestOptions) 
  .then((res) => res.json()) 
  .then((data) => retrieveData(data)) 
  .then((data) => renderCities(data)); 

function retrieveData(data) {
  return data.map((data) => {
    return {
      name: data.name, 
    };
  });
}

function renderCities(data) {
  const cities = document.getElementById("cities"); 
  return data.map((data) => {
    // loop through the data
    cities.innerHTML +=
      // add the following HTML to the cities element
      `
        <option value="${data.name}">${data.name}</option>
        `;
  });
}

// Source: https://codepen.io/deannabosschert/pen/KKZooaB?editors=1011 - Deanna Bosschert
