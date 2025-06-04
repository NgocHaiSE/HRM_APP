import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

ipcRenderer.on('clear-auth-data', () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
});

const api = {
  startZMQ: (id: number, host: string) => ipcRenderer.send('start-zmq', { id, host }),
  stopZMQ: (id: number) => ipcRenderer.send('stop-zmq', id),
  onImageFrame: (callback: (data: { id: number; data: string }) => void) => {
    const listener = (event: any, data: any) => callback(data);
    ipcRenderer.on('image-frame', listener);
    return () => {
      ipcRenderer.removeListener('image-frame', listener); // Gỡ listener
    };
  },
  isZmqActive: (id: number, callback: (active: boolean) => void) =>
    ipcRenderer.invoke('is-zmq-active', id).then(callback),
};

const dbAPI = {
  getCameraList: () => ipcRenderer.invoke('get-camera-list'),
  getPersonList: () => ipcRenderer.invoke('get-person-list'),
  getImages: (id: number) => ipcRenderer.invoke('get-images', id),
  adjustPerson: (
    id: number,
    fullname: string | null,
    gender: number | null,
    birth: string | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    departmentId: number | null,
  ) => ipcRenderer.invoke('adjust-person', [id, fullname, gender, birth, phone, address, email, position, departmentId,]),
  addPerson: (
    code: string | null,
    fullname: string | null,
    gender: number | null,
    birth: Date | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    departmentId: number | null,
  ) => ipcRenderer.invoke('add-person', [code, fullname, gender, birth, phone, address, email, position, departmentId]),
  authenticateUser: (username: string, password: string) => ipcRenderer.invoke('authenticate', [username, password]),
  getAllRecogHistory: () => ipcRenderer.invoke('get-all-recog-history'),
  getAllTimekeepingHistory: () => ipcRenderer.invoke('get-all-timekeeping-history'),
  getAllTimekeepingHistoryByPersonCode: (personCode: string) => ipcRenderer.invoke('get-all-timekeeping-history-by-person-code', personCode),
};

const appAPI = {
  openNewWindow: () => ipcRenderer.send('open-new-window'),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('app', appAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('db', dbAPI);
  } catch (error) {
    console.error('Failed to expose APIs:', error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // window.db = dbAPI;
}
