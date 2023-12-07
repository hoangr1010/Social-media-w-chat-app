import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import App from './App';
import reducers from "./state";

const { authReducer, profileReducer, chatReducer } = reducers;

// CONFIGURE REDUX STORAGE AND PERSISTOR
const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineReducers({ authReducer, profileReducer, chatReducer })

const persistedReducer = persistReducer(persistConfig,reducer);
let store = configureStore({
  reducer: persistedReducer,
})
let persistor = persistStore(store);

// RENDER
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


