import axios from './axios';

export const fetchUserDetails = () => {
    return axios.get('/users/');
};

export const loginUser = (user) => {
    return axios.post('/users/login', user);
};

export const registerUser = (user) => {
    return axios.post('/users/register', user);
};