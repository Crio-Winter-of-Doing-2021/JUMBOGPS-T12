import axios from './axios';

export const fetchAssets =  ()=>{

    return axios.get('/assets')
  
}