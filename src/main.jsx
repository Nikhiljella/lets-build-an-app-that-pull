import React from "react";
import { createRoot } from "react-dom/client";
import { StocksAtDiscountFeature } from "./features/stocks-at-discount/StocksAtDiscountFeature.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StocksAtDiscountFeature />
  </React.StrictMode>
);
