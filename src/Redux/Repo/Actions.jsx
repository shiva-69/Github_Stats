export const ADD_REPO = "ADD_REPO";

export const addRepo = (payload) => {
    return {
        type : ADD_REPO,
        payload
    }
}