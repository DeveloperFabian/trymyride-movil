import axios from 'axios';

const baseConfig = {
    baseURL: 'http://localhost:8000/api',
    timeout: 5000,
};

const instanceGET = axios.create({
    ...baseConfig,
    headers: {
        'Content-Type': 'application/json',
    },
});

const instancePOST = axios.create({
    ...baseConfig,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
    },
});

const instancePUT = axios.create({
    ...baseConfig,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
    },
});

export { instanceGET, instancePOST, instancePUT };
