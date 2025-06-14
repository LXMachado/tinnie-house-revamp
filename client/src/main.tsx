import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Orbitron font is now loaded in HTML head

createRoot(document.getElementById("root")!).render(<App />);
