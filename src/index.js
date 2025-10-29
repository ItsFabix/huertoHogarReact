// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// OJO: no importamos ensureSeed ni nada extra.
// El seed se hace automáticamente dentro de data/catalog.js.

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
