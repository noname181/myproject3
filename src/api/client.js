import { create } from 'apisauce';

const apiClient = create({
    baseURL: "https://restfull-api-nodejs-mongodb.herokuapp.com"
})

export default apiClient;