import axios from './axios';

export const fetchAssets =  ()=>{

    return axios.get('api/assets')
  
}

export const fetchAssetDetails = (id)=>{
    const results  =  axios.get(`api/assets?id=${id}`)
    return  results;
}