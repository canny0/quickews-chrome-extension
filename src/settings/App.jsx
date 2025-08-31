import renderApp from "../components/index";
import HeaderFooter from "../components/HeaderFooter";
import { Container, NativeSelect, Stack, Switch } from "@mantine/core";
import { useEffect, useState } from "react";

export default function App() {
  const [targetTab, setTargetTab] = useState("");
  const [checkForUpdates, setCheckForUpdates] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(
      ["tabTarget", "checkForUpdates", "historyEnabled"],
      (items) => {
        setTargetTab(items.tabTarget);
        setCheckForUpdates(items.checkForUpdates === "true");
        setHistoryEnabled(items.historyEnabled === "true");
      }
    );
  }, []);

  function handleTabTargetChange(event) {
    const value = event.currentTarget.value;
    setTargetTab(value);
    chrome.storage.local.set({ tabTarget: value });
  }

  function handleCheckForUpdatesChange(event) {
    const checked = event.currentTarget.checked;
    setCheckForUpdates(checked);
    chrome.storage.local.set({ checkForUpdates: JSON.stringify(checked) });
  }

  function handleHistoryEnabledChange(event) {
    const checked = event.currentTarget.checked;
    setHistoryEnabled(checked);
    chrome.storage.local.set({ historyEnabled: JSON.stringify(checked) });
  }

  return (
    <HeaderFooter>
      <Container size="xs">
        <Stack gap="lg" mt="lg">

        <NativeSelect
          label="open youtube search tab in..."
          value={targetTab}
          data={["newRegularWindow", "newIncognitoWindow", "newTab"]}
          onChange={handleTabTargetChange}
          />

        <Switch
          label="Get notified about new updates (limited to once a month)"
          onLabel="ON"
          offLabel="OFF"
          checked={checkForUpdates}
          onChange={handleCheckForUpdatesChange}
          />

        <Switch
          label="Search history"
          onLabel="ON"
          offLabel="OFF"
          checked={historyEnabled}
          onChange={handleHistoryEnabledChange}
          />
          </Stack>
      </Container>
    </HeaderFooter>
  );
}

renderApp(App);
