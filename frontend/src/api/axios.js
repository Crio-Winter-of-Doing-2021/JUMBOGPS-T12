import axios from 'axios';
import { config } from '../components/navigation/sidebar/config';

const instance = axios.create({
    baseURL:'http://localhost:8081'
})

export default instance;