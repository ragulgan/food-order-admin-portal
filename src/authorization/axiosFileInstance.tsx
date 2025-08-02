import axios from 'axios';
import { Role_Types } from "../modules/utils/constant";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 180000,
    headers: {
        "Cache-control": "no-cache",
        "Content-type": "multipart/form-data",
        "escriptMasterDataType": "merchants",
    }
});


instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('AUTH_TOKEN') || '';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, function (error) {
    return Promise.reject(error);
})

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const roles_data = JSON.parse(localStorage.getItem("ROLES")!)
    if (error.response.status === 440 || error.response.status === 401) {
        if (roles_data?.role === Role_Types.Admin) {
            window.location.replace('/login/admin?code=sessionexpired')
            localStorage.clear();
          } else if (roles_data?.role === Role_Types.Merchant) {
            window.location.replace('/login/merchant?code=sessionexpired')
            localStorage.clear();
          } else if (roles_data?.role === Role_Types.Branch) {
            window.location.replace('/login/branch?code=sessionexpired')
            localStorage.clear();
          }
    }
    return Promise.reject(error);
});

export default instance;