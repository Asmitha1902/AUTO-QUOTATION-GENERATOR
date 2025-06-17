import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// Standard Imports
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

// Your Custom Styles (use correct relative paths)
import "./assets/css/bootstrap.datetimepicker.css";
import "./assets/css/skin-green.css";
import "./assets/css/skin-purple.css";
import "./assets/css/styles.css";  // This should include layout fixes
import "./index.css";
import "./App.jsx";


// ✅ Optional JS Libraries
import "jquery";
import "moment";
import "./assets/js/bootstrap.min.js";
import "./assets/js/scripts.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// ✅ Render React App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
