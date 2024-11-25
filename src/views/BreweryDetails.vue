<template>
  <ion-page v-if="brewery">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ brewery.name ? brewery.name : "" }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button
            :text="getBackButtonText()"
            default-href="/"
          ></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="brewery">
      <div class="brewery-hero margin-bottom-ten">
        <span class="brewery-hero-indicator">
          <ion-icon
            aria-hidden="true"
            :icon="beerOutline"
            color="primary"
            class="icon-mug-jumbo"
          ></ion-icon>
        </span>
      </div>
      <ion-grid :fixed="true" class="pad-lr-zero pad-lr-fifteen">
        <ion-row
          class="ion-align-items-center margin-bottom-ten pad-lr-fifteen"
        >
          <ion-col>
            <ion-row class="ion-align-items-center">
              <ion-col>
                <h2 class="text-bold">{{ brewery.name }}</h2>
              </ion-col>

              <ion-col size="auto">
                <ion-row class="ion-align-items-center star-rating no-rating">
                  <ion-col size="auto" class="col-no-padding display-flex">
                    <star-rating
                      :rating="4.5"
                      read-only="true"
                      :increment="0.1"
                      :show-rating="false"
                      :star-size="20"
                      inactive-color="#a2a2a2"
                      @click="deadEnd()"
                    />
                  </ion-col>
                  <ion-col size="auto">
                    <ion-text color="medium">(514)</ion-text>
                  </ion-col>
                </ion-row>
              </ion-col>
            </ion-row>
            <ion-row class="ion-align-items-center">
              <ion-col size="auto">
                <!-- {{ brewery }} -->
                {{ brewery.city + ", " + brewery.state }}
              </ion-col>
              |
              <ion-col size="auto">
                <a :href="brewery.website_url">
                  {{ brewery.website_url }}
                </a>
              </ion-col>
            </ion-row>
            <ion-row
              class="ion-align-items-center margin-bottom-ten margin-top-twenty"
            >
              <ion-col>
                <ion-button
                  expand="block"
                  color="tertiary"
                  :disabled="
                    !brewery || !brewery.latitude || !brewery.longitude
                  "
                  @click="
                    routeToService(
                      {
                        lat: brewery.latitude,
                        long: brewery.longitude,
                      },
                      brewery.id
                    )
                  "
                >
                  <ion-icon slot="start" :icon="compass"></ion-icon>
                  Go</ion-button
                >
              </ion-col>
              <ion-col>
                <ion-button expand="block" color="warning" @click="deadEnd()">
                  <ion-icon slot="start" :icon="share"></ion-icon>
                  Share</ion-button
                >
              </ion-col>
              <ion-col>
                <ion-button expand="block" color="danger" @click="deadEnd()">
                  <ion-icon slot="start" :icon="starHalf"></ion-icon>
                  Rate</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
        <ion-row class="pad-lr-fifteen">
          <ion-col>
            <p>
              This brewery is pretty unique! This is a mock description, there
              wasn't a decent one that came through the API so I'm inserting
              this one just as a placeholder.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" @click="deadEnd()"
            >report problem</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonTitle,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonFooter,
} from "@ionic/vue";
import { ref, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import StarRating from "vue-star-rating";
import {
  personCircle,
  beerOutline,
  compass,
  heart,
  starHalf,
  share,
  star,
} from "ionicons/icons";
import { Device } from "@capacitor/device";
import { AppLauncher } from "@capacitor/app-launcher";
import { useBreweries } from "@/data/useBreweries";

export default defineComponent({
  name: "BreweryDetails",
  components: {
    IonBackButton,
    IonTitle,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    StarRating,
    IonText,
    IonButton,
    IonFooter,
  },
  setup() {
    const route = useRoute();
    const { brewery, fetchBreweryById } = useBreweries();

    onMounted(() => {
      fetchBreweryById(route.params.id as string);
    });

    const routeToService = async (geoCode: object) => {
      const deviceInfo = await Device.getInfo();
      // alert(JSON.stringify(geoCode));
      await AppLauncher.openUrl({
        url:
          deviceInfo.operatingSystem == "ios"
            ? `http://maps.apple.com/?daddr=${geoCode.lat},${geoCode.long}`
            : `https://www.google.com/maps/dir/?api=1&destination=${geoCode.lat},${geoCode.long}`,
      });
    };

    const deadEnd = () => {
      alert("Nothing Here Yet!");
    };

    // Determine the back button text based on the platform
    const getBackButtonText = () => {
      const win = window as any;
      const mode = win && win.Ionic && win.Ionic.mode;
      return mode === "ios" ? "Back" : "";
    };

    return {
      brewery,
      personCircle,
      beerOutline,
      getBackButtonText,
      compass,
      heart,
      starHalf,
      share,
      star,
      routeToService,
      deadEnd,
    };
  },
});
</script>

<style scoped>
.brewery-hero {
  height: 36%;
  display: grid;
  place-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #525252;
}

.brewery-hero-indicator {
  border-radius: 50%;
  width: 190px;
  height: 190px;
  display: grid;
  place-items: center;
  font-size: 35px;
  font-weight: 800;
  background-color: #111111;
  color: #3175f9;
  padding: 40px;
}

ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 42px;
  margin-right: 8px;
}

ion-item ion-note {
  font-size: 0.9375rem;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
}

p {
  line-height: 1.4;
}

.icon-mug-jumbo {
  font-size: 100px;
}

.star-rating.no-rating ion-icon {
  fill: #acacac;
}

.display-flex {
  display: flex;
}

.col-no-padding {
  padding: 0px !important;
}

/* start custom css */

.text-center {
  text-align: center;
}

.text-bold {
  font-weight: bold;
}

.text-small {
  font-size: 12px;
}

.text-medium {
  font-size: 15px;
}

.text-large {
  font-size: 20px;
}

.text-jumbo {
  font-size: 40px;
}

.text-white {
  color: #fff;
}

.text-caps {
  text-transform: capitalize;
}

.text-muted {
  color: #949494;
}
.text-link {
  color: #3880ff;
  text-decoration: underline;
}

.x-close-button {
  font-size: 40px;
  font-weight: 300;
}

.margin-zero {
  margin: 0px !important;
}

.margin-bottom-five {
  margin-bottom: 5px;
}

.margin-bottom-ten {
  margin-bottom: 10px;
}

.margin-bottom-twenty {
  margin-bottom: 20px;
}

.margin-bottom-thirty {
  margin-bottom: 30px;
}

.margin-bottom-zero {
  margin-bottom: 0px;
}

.margin-top-zero {
  margin-top: 0px;
}

.margin-top-five {
  margin-top: 5px;
}

.margin-top-ten {
  margin-top: 10px !important;
}

.margin-top-twenty {
  margin-top: 20px;
}

.margin-top-thirty {
  margin-top: 30px;
}

.margin-top-fourty {
  margin-top: 40px;
}

.margin-top-fifty {
  margin-top: 50px;
}

.margin-top-sixty {
  margin-top: 60px;
}

.margin-right-five {
  margin-right: 5px;
}

.margin-right-ten {
  margin-right: 10px;
}

.pad-zero {
  padding: 0px !important;
}
.pad-top-zero {
  padding-top: 0px !important;
}
.pad-bottom-ten {
  padding-bottom: 10px !important;
}
.pad-bottom-twenty {
  padding-bottom: 20px !important;
}

.pad-ten {
  padding: 10px;
}

.pad-twenty {
  padding: 20px;
}

.pad-thirty {
  padding: 30px;
}

.pad-fourty {
  padding: 40px;
}

.pad-fifty {
  padding: 50px;
}

.pad-sixty {
  padding: 60px;
}

.pad-lr-zero {
  padding-right: 0px !important;
  padding-left: 0px !important;
}

.pad-lr-five {
  padding-right: 5px;
  padding-left: 5px;
}

.pad-lr-ten {
  padding-right: 10px;
  padding-left: 10px;
}

.pad-lr-fifteen {
  padding-right: 15px;
  padding-left: 15px;
}

.pad-lr-twenty {
  padding-right: 20px;
  padding-left: 20px;
}

.pad-tb-ten {
  padding-top: 10px;
  padding-bottom: 10px;
}

.pad-tb-twenty {
  padding-top: 20px;
  padding-bottom: 20px;
}

.pad-left-ten {
  padding-left: 10px;
}

.pad-left-twenty {
  padding-left: 20px;
}

.margin-left-five {
  margin-left: 5px;
}

.margin-left-ten {
  margin-left: 10px;
}

.margin-left-twenty {
  margin-left: 20px;
}

.full-height {
  height: 100%;
}

.full-width {
  width: 100%;
}

.display-flex {
  display: flex;
}

.border-top-thin {
  border-top: 1px solid #dadada;
}

.border-top-thick {
  border-top: 1px solid #dadada;
}
</style>
