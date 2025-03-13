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
    email: string | null
  ) => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: api
    db: typeof db
  }

  interface Camera {
    ID: number;             
    'Tên Camera': string;   
    'Đường dẫn': string;    
    'Loại Camera': string;  
    IP: string;             
    'Tên tài khoản'?: string; 
    'Mật khẩu'?: string;    
    'Trạng thái': number;   
    'Vị trí': string;       
    'Nhận diện': string;
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
  }
}

export {};
