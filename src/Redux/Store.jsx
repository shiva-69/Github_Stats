import { createStore } from "redux"
import { AddReducer } from "./Repo/Reducer";


const store = createStore(AddReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export {store};
