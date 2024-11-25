import { ref } from "vue";
import axios from "axios";

export function useBreweries() {
  const breweries = ref([]); // List of loaded breweries
  const page = ref(1); // Current page
  const perPage = 50; // Items per page
  const hasMoreData = ref(true); // Track if there are more breweries to load
  const brewery = ref(null); // Single brewery details

  // Fetch breweries data
  const fetchBreweries = async () => {
    try {
      const response = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries?page=${page.value}&per_page=${perPage}`
      );

      const fetchedBreweries = response.data;

      // If no more data is returned, stop infinite scrolling
      if (fetchedBreweries.length === 0) {
        hasMoreData.value = false;
      } else {
        breweries.value = [...breweries.value, ...fetchedBreweries]; // Append new breweries
      }
    } catch (error) {
      console.error("Error fetching breweries:", error);
      hasMoreData.value = false; // Stop fetching on error
    }
  };

  // Load more breweries when Infinite Scroll is triggered
  const loadMoreBreweries = async (event: any) => {
    if (hasMoreData.value) {
      page.value += 1; // Increment page number
      await fetchBreweries();
    }

    // Notify Infinite Scroll to complete
    event.target.complete();
  };

  // Fetch a single brewery by ID
  const fetchBreweryById = async (id: string) => {
    try {
      const response = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries/${id}`
      );
      brewery.value = response.data;
    } catch (error) {
      console.error("Error fetching brewery:", error);
      brewery.value = null;
    }
  };

  return {
    breweries,
    brewery,
    fetchBreweryById,
    fetchBreweries,
    loadMoreBreweries,
    hasMoreData,
  };
}
