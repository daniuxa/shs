import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//theme
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primeflex/primeflex.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
