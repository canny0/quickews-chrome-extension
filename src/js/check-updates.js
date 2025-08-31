export default function checkUpdates() {
  chrome.storage.local.get(
    ["lastCheckForUpdates", "lastCheckForUpdatesVersion"],
    async ({ lastCheckForUpdates, lastCheckForUpdatesVersion }) => {
      const now = new Date().toISOString().slice(0, 7);

      if (lastCheckForUpdates !== now) {
        chrome.storage.local.set({ lastCheckForUpdates: now });

        const response = await fetch(
          "https://api.github.com/repos/canny0/quickews/releases/latest"
        );
        const { tag_name: latestVersion } = await response.json();

        if (lastCheckForUpdatesVersion !== latestVersion) {
          chrome.storage.local.set({
            lastCheckForUpdatesVersion: latestVersion,
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
