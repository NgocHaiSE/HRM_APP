import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  startZMQ: (id: number, host: string) => void;
  stopZMQ: (id: number) => void;
  onImageFrame: (callback: (data: { id: number; data: string }) => void) => () => void;
  isZmqActive: (id: number, callback: (active: boolean) => void) => void;
}

interface db {
  getCameraList: () => Promise<any>;
  getPersonList: () => Promise<any>;
  getImages: (id) => Promise<any>;
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
  ) => Promise<any>;
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
  ) => Promise<any>;
  authenticateUser: (username, password) => Promise<any>;
  getAllRecogHistory: () => Promise<any>;
  getAllTimekeepingHistory: () => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
    db: typeof db
  }

  interface Camera {
    id: number;             
    name: string;   
    link: string;    
    type: string;  
    ip: string;             
    username?: string; 
    password?: string;    
    status: number;   
    location: string;       
  }

  interface Person {
    id: number;
    code: string;
    fullname: string;
    createTime: string;
    gender: string;
    birth: Date;
    address: string;
    phone: string;
    avatarPath: string;
    email: string;
    provine: string;
    position: string;
    rank: string;
    department: string;
  }

  interface RecogHistory {
    id: number;
    code: string;
    fullname: string;
    position: string;
    rank: string;
    department: string;
    location: string;
    time: string;
    video_url: string;
  }

  interface TimekeepingHistory {
    id: number;
    personcode: string;
    location: string;
    time: string;
    image_url: string;
    score: number;
    fullname: string;
    rank: string;
    avatar_path: string;
  }
}

export {};
