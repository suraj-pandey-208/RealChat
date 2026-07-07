import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
} from "redux-persist";

import userSlice from "./userSlice";
import messageSlice from "./messageSlice";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) =>
    Promise.resolve(localStorage.removeItem(key)),
};

const socketTransform = createTransform(
  (inboundState) => {
    return {
      ...inboundState,
      socket: null,
    };
  },
  (outboundState) => {
    return {
      ...outboundState,
      socket: null,
    };
  },
  { whitelist: ["user"] }
);

const rootReducer = combineReducers({
  user: userSlice,
  message: messageSlice,
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [socketTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        ignoredPaths: ["user.socket"],
      },
    }),
});

export const persistor = persistStore(store);
