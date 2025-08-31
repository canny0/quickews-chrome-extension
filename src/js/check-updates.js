export default function checkUpdates() {
  chrome.storage.local.get(
    ["lastCheckForUpdates", "lastCheckForUpdatesVersion"],
    async ({ lastCheckForUpdates, lastCheckForUpdatesVersion }) => {
      const now = new Date().toISOString().slice(0, 7);

      if (lastCheckForUpdates !== now) {
        chrome.storage.local.set({ lastCheckForUpdates: now });

        const response = await fetch(
          "https://api.github.com/repos/canny0/quickews-chrome-extension/releases/latest"
        );
        const { tag_name } = await response.json();

        if (lastCheckForUpdatesVersion !== tag_name) {
          chrome.storage.local.set({
            lastCheckForUpdatesVersion: tag_name,
          });

          chrome.notifications.create("", {
            type: "basic",
            iconUrl: chrome.runtime.getURL("logo.png"),
            title: "QuickEWS Just Got Better!",
            message:
              "Check out the latest features and enhancements in quickews v" +
              tag_name,
            priority: 0,
          });
        }
      }
    }
  );
}
