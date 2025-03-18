import { createRoot } from "react-dom/client";
import App from "./App";
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/500.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel-decorative/400.css'
import '@fontsource/cinzel-decorative/700.css'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);