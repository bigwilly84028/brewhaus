import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "../../src/views/HomePage.vue";
import { useBreweries } from "../../src/data/useBreweries";
import { modalController } from "@ionic/vue";
import { IonInfiniteScroll } from "@ionic/vue";

// Mock useBreweries composable
vi.mock("@/data/useBreweries", () => ({
  useBreweries: vi.fn(),
}));

describe("HomePage.vue", () => {
  let mockBreweries;

  beforeEach(() => {
    mockBreweries = [
      { id: "1", name: "Brewery One", city: "CityOne", state: "StateOne" },
      { id: "2", name: "Brewery Two", city: "CityTwo", state: "StateTwo" },
    ];

    useBreweries.mockReturnValue({
      breweries: mockBreweries,
      fetchBreweries: vi.fn(),
      loadMoreBreweries: vi.fn(),
      hasMoreData: true,
    });
  });

  it("renders the header and title", () => {
    const wrapper = mount(HomePage);
    expect(wrapper.find("ion-title").text()).toBe("Breweries List");
  });

  it("shows a progress bar when breweries list is empty", () => {
    useBreweries.mockReturnValueOnce({
      breweries: [],
      fetchBreweries: vi.fn(),
      loadMoreBreweries: vi.fn(),
      hasMoreData: true,
    });

    const wrapper = mount(HomePage);
    expect(wrapper.find("ion-progress-bar").exists()).toBe(true);
  });

  it("renders a list of breweries when data is available", () => {
    const wrapper = mount(HomePage);

    const breweryItems = wrapper.findAll("ion-item");
    expect(breweryItems.length).toBe(mockBreweries.length);
    expect(breweryItems[0].text()).toContain("Brewery One");
    expect(breweryItems[1].text()).toContain("Brewery Two");
  });

  it("navigates to the correct route when a brewery item is clicked", async () => {
    const wrapper = mount(HomePage, {
      global: {
        mocks: {
          $router: {
            push: vi.fn(),
          },
        },
      },
    });

    const breweryItem = wrapper.findAll("ion-item")[0];
    await breweryItem.trigger("click");

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/brewery/1");
  });

  it("should call loadMoreBreweries when ionInfinite is triggered", async () => {
    // Mock loadMoreBreweries
    const loadMoreBreweries = vi.fn();

    const wrapper = mount(HomePage, {
      global: {
        stubs: {
          "ion-infinite-scroll": IonInfiniteScroll,
          "ion-infinite-scroll-content": true,
        },
        provide: {
          // Mock the `useBreweries` composable
          useBreweries: () => ({
            breweries: [],
            fetchBreweries: vi.fn(),
            loadMoreBreweries,
            hasMoreData: true,
          }),
        },
      },
    });

    // Find the infinite scroll component
    const infiniteScroll = wrapper.findComponent(IonInfiniteScroll);

    // Trigger the `ionInfinite` event
    await infiniteScroll.trigger("ionInfinite");

    // Assert the mocked method was called
    expect(loadMoreBreweries).toHaveBeenCalled();
  });

  it("opens the search modal when the search button is clicked", async () => {
    const wrapper = mount(HomePage);
    const searchButton = wrapper.find("ion-button");
    await searchButton.trigger("click");

    expect(modalController.create).toHaveBeenCalledWith({
      component: expect.anything(),
    });
  });

  it("fetches initial breweries data on mount", () => {
    const fetchBreweriesMock = vi.fn();
    useBreweries.mockReturnValueOnce({
      breweries: [],
      fetchBreweries: fetchBreweriesMock,
      loadMoreBreweries: vi.fn(),
      hasMoreData: true,
    });

    mount(HomePage);

    expect(fetchBreweriesMock).toHaveBeenCalled();
  });
});
