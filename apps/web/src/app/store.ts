import { configureStore } from "@reduxjs/toolkit";
import { formsApi } from "./api/formsApi";

export const store = configureStore({
  reducer: {
    [formsApi.reducerPath]: formsApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(formsApi.middleware),
});
