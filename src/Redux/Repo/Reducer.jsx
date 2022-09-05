import { ADD_REPO } from "./Actions";

export const AddReducer = (store = {add : {}}, {type, payload}) => {
    switch (type){
        case ADD_REPO : 
            return {
                ...store, add : payload
            }
        default :
            return store;
    }
}