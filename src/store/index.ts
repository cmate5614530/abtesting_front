import {
    configureStore,
    getDefaultMiddleware,
  } from "@reduxjs/toolkit";
  import { combineReducers } from "redux";
  import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from "redux-persist";
  import { createLogger } from "redux-logger";
  import storage from "redux-persist/lib/storage";
  import { authReducer, domainReducer, pricingReducer,experimentReducer } from "./reducer";

  const logger = createLogger({ collapsed: true });
  const reducers = combineReducers({
    auth: authReducer,
    domain: domainReducer,
    pricing: pricingReducer,
    experiment: experimentReducer
  });
  
  const persistConfig = {
    key: "root",
    // version: 1,
    storage,
    whitelist: ["auth"],
  };
  
  const persistedReducer = persistReducer(persistConfig, reducers);
  
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  });
  
  const persistor = persistStore(store);
  
  export { store, persistor };
  // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch