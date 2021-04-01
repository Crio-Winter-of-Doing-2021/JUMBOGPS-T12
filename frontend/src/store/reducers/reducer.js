

let initialState  = {
    /**
     * Set initial state
    */
   assetDetails:[],
   username:null,
   allAssetStore:null
}

const reducer =  (state=initialState, action)=>{

    switch (action.type) {
        case 'ADD_ASSET_DETAILS':
        return{...state, assetDetails:action.payload}   

        case 'Store_USER_NAME':{
            return{...state, username:action.payload}   
        }
        case 'ALL_ASSET_BACKUP':{
            return{...state, allAssetStore:action.payload}   
        }
        default:
            break;
    }
    return state;
}

export default reducer;