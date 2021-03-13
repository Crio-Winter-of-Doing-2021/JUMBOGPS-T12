

let initialState  = {
    /**
     * Set initial state
    */
   assetDetails:[]
}

const reducer =  (state=initialState, action)=>{

    switch (action.type) {
        case 'ADD_ASSET_DETAILS':
        return{...state, assetDetails:action.payload}   
        default:
            break;
    }
    return state;
}

export default reducer;