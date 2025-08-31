import renderApp from "../components/index";
import HeaderFooter from "../components/HeaderFooter";
import HistoryTable from "./HistoryTable";
import { Container } from "@mantine/core";
import "./App.css" 

export default function App() {
  return (
    <HeaderFooter>
      <Container>
        <HistoryTable />
      </Container>
    </HeaderFooter>
  );
}

renderApp(App);
