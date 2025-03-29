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
    const listener = (data: any) => callback(data);
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
    birth: string | null,
    gender: number | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    rank: string | null,
    department: string | null,
    provine: string | null,
  ) => ipcRenderer.invoke('adjust-person', [id, fullname, birth, gender, phone, address, email, position, rank, department, provine]),
  addPerson: (
    code: string | null,
    fullname: string | null,
    birth: Date | null,
    gender: number | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    rank: string | null,
    department: string | null,
    provine: string | null,
  ) => ipcRenderer.invoke('add-person', [code, fullname, birth, gender, phone, address, email, position, rank, department, provine]),
  authenticateUser: (username: string, password: string) => ipcRenderer.invoke('authenticate', [username, password]),
  getAllRecogHistory: () => ipcRenderer.invoke('get-all-recog-history'),
  getAllTimekeepingHistory: () => ipcRenderer.invoke('get-all-timekeeping-history'),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
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
