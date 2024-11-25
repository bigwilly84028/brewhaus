import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BreweryDetails from "../../src/views/BreweryDetails.vue";
import { useRoute } from "vue-router";
import { Device } from "@capacitor/device";
import { AppLauncher } from "@capacitor/app-launcher";

// Mock Vue Router's useRoute
vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

// Mock Capacitor Plugins
vi.mock("@capacitor/device", () => ({
  Device: {
    getInfo: vi.fn(),
  },
}));
vi.mock("@capacitor/app-launcher", () => ({
  AppLauncher: {
    openUrl: vi.fn(),
  },
}));

// Mock useBreweries composable
vi.mock("@/data/useBreweries", () => ({
  useBreweries: () => ({
    brewery: {
      id: "123",
      name: "Mock Brewery",
      city: "Mock City",
      state: "Mock State",
      latitude: 40.123,
      longitude: -111.456,
      website_url: "https://mockbrewery.com",
    },
    fetchBreweryById: vi.fn(),
  }),
}));

describe("BreweryDetails.vue", () => {
  it("renders correctly with brewery data", () => {
    const wrapper = mount(BreweryDetails);

    // Assert the main elements are rendered
    expect(wrapper.text()).toContain("Mock Brewery");
    expect(wrapper.text()).toContain("Mock City, Mock State");
    expect(wrapper.html()).toContain(
      '<a href="https://mockbrewery.com">https://mockbrewery.com</a>'
    );
  });

  it("calls fetchBreweryById on mount", () => {
    const { useBreweries } = require("@/data/useBreweries");
    const fetchBreweryById = useBreweries().fetchBreweryById;

    mount(BreweryDetails);

    expect(fetchBreweryById).toHaveBeenCalled();
  });

  it("calls routeToService with correct arguments", async () => {
    const wrapper = mount(BreweryDetails);
    const { Device, AppLauncher } = require("@capacitor/device");

    // Mock device info
    Device.getInfo.mockResolvedValue({ operatingSystem: "ios" });

    const goButton = wrapper.find("ion-button[color='tertiary']");
    await goButton.trigger("click");

    expect(AppLauncher.openUrl).toHaveBeenCalledWith({
      url: "http://maps.apple.com/?daddr=40.123,-111.456",
    });
  });

  it("triggers deadEnd method on unsupported actions", async () => {
    const wrapper = mount(BreweryDetails);

    // Mock window alert
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    const shareButton = wrapper.find("ion-button[color='warning']");
    await shareButton.trigger("click");

    expect(alertSpy).toHaveBeenCalledWith("Nothing Here Yet!");
  });

  it("renders the back button with proper text for iOS", async () => {
    const wrapper = mount(BreweryDetails);

    // Simulate iOS environment
    const win = global.window as any;
    win.Ionic = { mode: "ios" };

    expect(wrapper.find("ion-back-button").attributes("text")).toBe("Back");
  });

  it("renders the back button with no text for other platforms", async () => {
    const wrapper = mount(BreweryDetails);

    // Simulate non-iOS environment
    const win = global.window as any;
    win.Ionic = { mode: "android" };

    expect(wrapper.find("ion-back-button").attributes("text")).toBe("");
  });
});
