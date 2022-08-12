import axios from 'axios';

const axios_proxy = axios.create({
  baseURL: `http://localhost:5000/api/auth/`
});

export const login = async (username: string, password: string) => {
  try {
    return await axios_proxy.post('/login', {username, password})
  } catch (_) {
    console.log(_)
  }
}

export const registration = async (username: string, password: string) => {
  try {
    return await axios_proxy.post('/registration', {username, password})
  } catch (e) {
    console.log(e)
  }
}