import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { UserInterfaceProvider } from "./contexts/UserInterfaceContext";
import { AuthProvider } from "./contexts/AuthContext";
import { store } from "./app/store";

import "./index.css";
import { MemesProvider } from "./contexts/MemesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <UserInterfaceProvider>
    <AuthProvider>
      <MemesProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </MemesProvider>
    </AuthProvider>
  </UserInterfaceProvider>
  // </React.StrictMode>
);
