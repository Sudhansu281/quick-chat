import {configureStore} from "@reduxjs/toolkit"
import loaderReducer from './loaderSlice';
import userReducer from './userSlice';
// import themeSliceReducer from "./ThemeSlice";
export const store = configureStore({
    reducer:{
        userReducer,
        // themeKey:themeSliceReducer,
        loaderReducer
    },
})

