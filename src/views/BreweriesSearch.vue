<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search all Breweries</ion-title>
        <ion-buttons slot="end">
          <ion-button class="x-close-button" @click="cancel" :strong="true"
            >&times;</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          :debounce="1000"
          @ionInput="handleSearchInput($event)"
          placeholder="Search breweries by name"
          :value="searchInputValue"
          ref="searchInputRef"
        ></ion-searchbar>
        <ion-progress-bar
          v-if="loading"
          type="indeterminate"
        ></ion-progress-bar>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list class="search-results-list" lines="full">
        <ion-item
          v-for="(brewery, index) in searchResults"
          :key="index"
          @click="() => closeModal()"
          :routerLink="'/brewery/' + brewery.id"
        >
          <ion-label>
            <h2>{{ brewery.name }}</h2>
            <p>{{ brewery.city + ", " + brewery.state }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonList,
  IonItem,
  modalController,
  IonSearchbar,
} from "@ionic/vue";
import axios from "axios";

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonList,
    IonItem,
    IonSearchbar,
  },
  props: {
    searchString: {
      type: String,
      required: false,
    },
  },

  setup() {
    const searchInputValue = ref(undefined);
    const loading = ref(false);
    const searchResults = ref([]);

    const searchInputRef = ref();

    const cancel = () => modalController.dismiss(null, "cancel");

    async function handleSearchInput(event: any) {
      if (event.target.value.length > 3) {
        loading.value = true;
        await searchByString(event.target.value);
      } else {
        searchResults.value = [];
      }
      loading.value = false;
    }

    async function searchByString(value: string) {
      const response = await axios.get(
        `https://api.openbrewerydb.org/v1/breweries?by_name=${value}&per_page=10`
      );

      searchResults.value = response.data;
    }

    const closeModal = () => modalController.dismiss(null, "cancel");

    return {
      loading,
      cancel,
      searchResults,
      handleSearchInput,
      searchByString,
      searchInputValue,
      searchInputRef,
      closeModal,
    };
  },
};
</script>
<style scoped>
ion-content {
  --padding-top: 0px;
  --padding-start: 0px;
  --padding-end: 0px;
}
ion-spinner {
  width: 100px;
  height: 100px;
}
ion-item-divider {
  --padding-top: 10px;
  --padding-bottom: 10px;
}
ion-card-content {
  padding: 0px;
}
ion-card-header {
  padding-bottom: 0px;
}
ion-card-title {
  margin-top: 5px;
}

.quick-search-list ion-card {
  padding-top: 30px;
  padding-bottom: 30px;
  margin: 5px;
}

.x-close-button {
  font-size: 40px;
  font-weight: 300;
}
</style>
