import axios from './axios';

export const fetchAssets =  ()=>{


    let token = localStorage.getItem('token') || "";
    return axios.get('api/assets', {headers:{
        token:token
    }})
  
}

export const fetchAssetDetails = (id)=>{
    let token = localStorage.getItem('token') || "";

    const results  =  axios.get(`api/assets?id=${id}`, {headers:{
            token: token
        }})  
  
    return  results;
}

export const fetchUserDetails = () => {
    debugger;
    return axios.get('/users/');
};

export const loginUser = (user) => {
    return axios.post('api/users/login', user);
};

export const registerUser = (user) => {
    return axios.post('api/users/register', user);
};