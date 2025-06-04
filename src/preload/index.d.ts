import { ElectronAPI } from '@electron-toolkit/preload'

interface api {
  startZMQ: (id: number, host: string) => Promise<void>;
  stopZMQ: (id: number) => void;
  onImageFrame: (callback: (data: { id: number; data: string }) => void) => () => void;
  isZmqActive: (id: number, callback: (active: boolean) => void) => void;
}

interface app {
  openNewWindow: () => void;
}

interface db {
  getCameraList: () => Promise<any>;
  getPersonList: () => Promise<any>;
  getImages: (id) => Promise<any>;
  adjustPerson: (
    id: number,
    fullname: string | null,
    gender: number | null,
    birth: string | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    rank: string | null,
    departmentId: string | null,
  ) => Promise<any>;
  addPerson: (
    code: string | null,
    fullname: string | null,
    gender: number | null,
    birth: Date | null,
    phone: string | null,
    address: string | null,
    email: string | null,
    position: string | null,
    departmentId: string | null,
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
    app: typeof appAPI
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

  interface TimekeepingRecord {
    id: number;
    personcode: string;
    location: string;
    date: string;
    checkin_time: string;
    checkin_image: string;
    checkout_time: string;
    checkout_image: string;
    fullname: string;
    rank: string;
    avatar_path: string;
  }

  interface AttRecord{
    id: number;
    personId; number;
    avatarPath: string;
    personName: string;
    personCode: string;
    department: string;
    date: string;
    checkIn: string;
    checkOut: string;
    totalWorkMin: number;
    status: string;
    photo: string;
  }
}

export {};
