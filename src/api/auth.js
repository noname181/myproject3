import client from './client';

const login = (email, password) => client.post('/auth', { email, password }, {
    timeout: 120000
});

export default {
    login
}