import axios from 'axios';

const cookie = require('cookie')

const axios_proxy = axios.create({
  baseURL: `http://localhost:5000/api/user/`
});

export const getUser = async () => {
  try {
    return await axios_proxy.get('/', {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const createList = async (title: string) => {
  try {
    return await axios_proxy.post('/createList', {title}, {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const addTask = async (title: string, list_id: number) => {
  try {
    return await axios_proxy.post('/addTask', {title, list_id}, {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const editTask = async ({list_id, task_id, title, completed}:
                                 { list_id: number, task_id: number, title: string, completed: boolean }) => {
  try {
    return await axios_proxy.post('/editTask', {list_id, task_id, title, completed}, {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const editTitleList = async (title: string, list_id: number) => {
  try {
    return await axios_proxy.post('/editTitleList', {title, list_id}, {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}

export const deleteListById = async (list_id: number) => {
  try {
    return await axios_proxy.post('/deleteListById', {list_id}, {
      headers: {
        Authorization: `Bearer ${cookie.parse(document.cookie).access_token}`
      }
    })
  } catch (e) {
    console.log(e)
  }
}