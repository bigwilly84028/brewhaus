<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Breweries List</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openModal">
            <ion-icon slot="icon-only" :icon="search"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-progress-bar
        v-if="!breweries.length"
        type="indeterminate"
      ></ion-progress-bar>
      <ion-list v-else>
        <ion-item
          v-for="brewery in breweries"
          :key="brewery.id"
          :routerLink="'/brewery/' + brewery.id"
        >
          <!-- {{ brewery }} -->
          <ion-label>
            <h2>{{ brewery.name }}</h2>
            <p>{{ brewery.city + ", " + brewery.state }}</p>
          </ion-label>
          <ion-label slot="end">
            <ion-icon :icon="starHalfOutline"></ion-icon>
          </ion-label>
          <ion-label slot="end">
            <ion-icon :icon="beerOutline"></ion-icon>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- Infinite Scroll -->
      <ion-infinite-scroll
        threshold="100px"
        @ionInfinite="loadMoreBreweries"
        ref="infiniteScroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Brewing more results..."
        ></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  modalController,
  IonProgressBar,
} from "@ionic/vue";

import { beerOutline, search, starHalfOutline } from "ionicons/icons";

import SearchBreweries from "./SearchBreweries.vue";

export default {
  name: "BreweriesList",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonProgressBar,
  },
  setup() {
    const breweries = ref([]); // List of loaded breweries
    const page = ref(1); // Current page
    const perPage = 50; // Items per page
    const hasMoreData = ref(true); // Track if there are more breweries to load

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
    const loadMoreBreweries = async (event) => {
      if (hasMoreData.value) {
        page.value += 1; // Increment page number
        await fetchBreweries();
      }

      // Notify Infinite Scroll to complete
      event.target.complete();
    };

    async function openModal() {
      const modal = await modalController.create({
        component: SearchBreweries,
      });

      modal.present();
    }

    // Fetch initial data on component mount
    onMounted(fetchBreweries);

    return {
      breweries,
      loadMoreBreweries,
      hasMoreData,
      search,
      starHalfOutline,
      beerOutline,
      openModal,
      modalController,
    };
  },
};
</script>

<style scoped>
ion-infinite-scroll-content {
  margin-top: 1rem;
}
</style>
