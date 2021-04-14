import axios from './axios';

export const fetchAssets =  ()=>{


    let token = localStorage.getItem('token') || "";
    return axios.get('api/assets', {headers:{
        token:token
    }})
  
}

export const fetchAssetDetails = (id)=>{
    let token = localStorage.getItem('token') || "";

    const apiresult  =  axios.get(`api/assets?id=${id}`, {headers:{
            token: token
        }})  
  
    return  apiresult;
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

export const addgeofence = (id,data)=>{
    let token = localStorage.getItem('token') || "";
    return axios.put(`/api/assets/geofence?id=${id}`, data, {headers:{
        token: token
    }});
}

export const addAsset = (data)=>{
    let token = localStorage.getItem('token') || "";
    return axios.post(`/api/assets/`, data, {headers:{
        token: token
    }});

}