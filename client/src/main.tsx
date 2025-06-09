import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Preload Orbitron font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap';
link.rel = 'preload';
link.as = 'style';
link.onload = () => {
  link.rel = 'stylesheet';
};
document.head.appendChild(link);

createRoot(document.getElementById("root")!).render(<App />);
