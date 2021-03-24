import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        token: localStorage.getItem('token')
    }
});

export default instance;