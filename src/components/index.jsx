import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@fontsource-variable/outfit';
import "./index.css";

import mantineTheme from "./mantineTheme.jsx";

export default function renderApp(AppComponent) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <MantineProvider theme={mantineTheme}>
        <AppComponent />
      </MantineProvider>
    </StrictMode>
  );
}
