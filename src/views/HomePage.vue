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
      <!-- Progress Bar -->
      <ion-progress-bar
        v-if="!breweries.length"
        type="indeterminate"
      ></ion-progress-bar>

      <!-- Breweries List -->
      <ion-list v-else>
        <ion-item
          v-for="brewery in breweries"
          :key="brewery.id"
          :routerLink="'/brewery/' + brewery.id"
        >
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
import { onMounted } from "vue";
import {
  IonPage,
  IonTitle,
  IonButton,
  IonIcon,
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
import { useBreweries } from "@/data/useBreweries";

export default {
  name: "BreweriesList",
  components: {
    IonPage,
    IonTitle,
    IonButton,
    IonIcon,
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
    const { breweries, fetchBreweries, loadMoreBreweries, hasMoreData } =
      useBreweries();

    // Fetch initial data on component mount
    onMounted(fetchBreweries);

    // open search breweries modal window
    async function openModal() {
      const modal = await modalController.create({
        component: SearchBreweries,
      });

      modal.present();
    }

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
