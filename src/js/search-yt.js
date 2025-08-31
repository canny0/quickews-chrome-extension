export default function searchYoutube(searchQuery) {
  chrome.storage.local.get(["tabTarget"], ({ tabTarget }) => {
    const url = "https://www.youtube.com/results?search_query=" + searchQuery;

    if (tabTarget === "newRegularWindow") {
      chrome.windows.create({ url });
    } else if (tabTarget === "newIncognitoWindow") {
      chrome.windows.create({ url, incognito: true });
    } else if (tabTarget === "newTab" || true) {
      chrome.tabs.create({ url });
    }
  });
}
