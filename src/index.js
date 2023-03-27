import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { configureStore } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));

const index = () => {
  document.onreadystatechange = function () {
    if (document.readyState === "complete") {
      root.render(
        <Provider store={configureStore({})}>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </Provider>
      );
    }
    else {
      return (
        < div className="loader-container" >
          <span className="loader-initial-page"></span>
        </div >
      )
    }
  };
}

index()

reportWebVitals();