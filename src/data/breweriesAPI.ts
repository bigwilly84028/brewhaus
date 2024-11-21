//NEXT STEPS: Pipe all API calls in the app
//through this file for reusability
//whereas currently they are local to each vue file.

import axios from "axios";

export interface Brewery {
  id: number;
  name: string;
  state: string;
}

// Initialize breweries as an empty array
let breweries: Brewery[] = [];
let breweriesFetched = false;

// Function to fetch breweries and populate the `breweries` array
const fetchBreweries = async (): Promise<void> => {
  if (breweriesFetched) return; // Avoid duplicate fetches
  try {
    const response = await axios.get(
      "https://api.openbrewerydb.org/v1/breweries"
    );
    // Map API response to Brewery interface structure
    breweries = response.data.map((brewery: any) => ({
      id: brewery.id || 0, // Default ID to 0 if not provided
      name: brewery.name || "Unknown Brewery",
      state: brewery.state || "No state provided",
    }));
    breweriesFetched = true;
    // console.log("Breweries fetched and stored:", breweries);
  } catch (error) {
    // console.error("Error fetching breweries:", error);
  }
};

// Function to get all breweries, ensuring data is fetched first
export const getBreweries = async (): Promise<Brewery[]> => {
  await fetchBreweries(); // Ensure data is fetched
  return breweries;
};

// Function to get a specific brewery by ID, ensuring data is fetched first
export const getBrewery = async (id: number): Promise<Brewery | undefined> => {
  await fetchBreweries(); // Ensure data is fetched
  return breweries.find((m) => m.id === id);
};
