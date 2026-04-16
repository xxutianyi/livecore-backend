import axios from 'axios';

const axiosInstance = axios.create();
axiosInstance.defaults.withXSRFToken = true;
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common['Accept'] = 'application/json';
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axiosInstance;
