import {SERVER_URL}  from './Api';

export const endpoints = {
  auth: {
    login: `${SERVER_URL}/auth/login`,
    register: `${SERVER_URL}/auth/register`,
  },
  user: {
    getAll: `${SERVER_URL}/user/get`,
    getById: (id: string) => `${SERVER_URL}/users/${id}`,
  },
  employee: {
    getAll: `${SERVER_URL}/employee/get`,
    getById: (id: string) => `${SERVER_URL}/employee/${id}`,
    create: `${SERVER_URL}/employee/create`,
    update: (id: string) => `${SERVER_URL}/employee/update/${id}`,
    delete: (id: string) => `${SERVER_URL}/employee/delete/${id}`,
  },
  timekeeping: {
    getAll: `${SERVER_URL}/timekeeping/get`,
    getPersonalTimekeeping: (id: string) => `${SERVER_URL}/timekeeping/personal/${id}`,
    getById: (id: string) => `${SERVER_URL}/timekeeping/${id}`,
    create: `${SERVER_URL}/timekeeping/create`,
    update: (id: string) => `${SERVER_URL}/timekeeping/update/${id}`,
    delete: (id: string) => `${SERVER_URL}/timekeeping/delete/${id}`,
  },
}