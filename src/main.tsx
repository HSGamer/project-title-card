import { render } from "preact";
import App from "./App.tsx";
import "./styles.css";

const rootElem = document.getElementById("root");
if (rootElem) {
  render(<App />, rootElem);
}
