import favouriteLastSearch from "./favourite-last-search";
import PaperInfo from "./paper-info";
import saveHistory from "./save-history";
import searchYoutube from "./search-yt";
import { version } from "../../public/manifest.json";
import checkUpdates from "./check-updates";
import monthlyActiveUser from "./monthly-active-users";

async function activateExtension(tabUrl, envokationMethod) {
  const info = new PaperInfo(tabUrl);

  searchYoutube(info.searchQuery);

  chrome.storage.local.get(
    ["lastActiveMonth", "checkForUpdates", "historyEnabled"],
    async ({ lastActiveMonth, checkForUpdates, historyEnabled }) => {
      const month = new Date().toISOString().slice(0, 7);

      if (lastActiveMonth !== month) {
        chrome.storage.local.set({ lastActiveMonth: month });
        monthlyActiveUser();
      }

      if (historyEnabled && info.code) {
        saveHistory(info, envokationMethod);
      }

      if (checkForUpdates) {
        checkUpdates();
      }
    }
  );
}

chrome.action.onClicked.addListener((tab) =>
  activateExtension(tab.url, "click")
);

chrome.commands.onCommand.addListener(async (command, tab) => {
  switch (command) {
    case "_execute_action":
      activateExtension(tab.url, "command");
      break;
    case "favourite-last-search":
      favouriteLastSearch();
      break;
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({
    tabTarget: "newTab",
    historyEnabled: JSON.stringify(true),
    checkForUpdates: JSON.stringify(false),
    lastCheckForUpdatesVersion: version,
    lastCheckForUpdates: new Date().toISOString().slice(0, 7),
  });

  const url = new URL(__API_URL__);
  url.pathname = "/v1/installs";

  const response = await fetch(url, { method: "POST" });
  console.log(response.status);

  chrome.tabs.create({ url: chrome.runtime.getURL("guide/index.html") });
});
