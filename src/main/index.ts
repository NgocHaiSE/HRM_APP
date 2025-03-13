import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ZmqSub } from './ZmqSub'
import Database from './database'

const subscribers: Map<number, ZmqSub> = new Map()
const db = Database.getInstance();

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true, // Bật contextIsolation để an toàn
      nodeIntegration: false,
    },
    // fullscreen: true
  })


  // ----------------------------ZMQ IPC----------------------------------
  ipcMain.handle('is-zmq-active', (event, id) => {
    return subscribers.has(id); // Trả về true nếu subscriber tồn tại
  });
  
  ipcMain.on('start-zmq', (event, { id, host }) => {
    if (!subscribers.has(id)) {
      const sub = new ZmqSub(id, host);
      subscribers.set(id, sub);
      sub.start().catch((err) => console.error(err));
    }
  });
  
  ipcMain.on('stop-zmq', (event, id) => {
    const zmqSub = subscribers.get(id);
    if (zmqSub) {
      zmqSub.stop();
      subscribers.delete(id);
    }
  });
  
  ipcMain.on('image-frame', (event, data) => {
    mainWindow.webContents.send('image-frame', data);
  });

  // ----------------------------Database IPC----------------------- 
  ipcMain.handle('get-camera-list', async () => {
    try {
      const cameras = await db.procedure('GetAllCameras'); 
      return cameras[0]; 
    } catch (error) {
      console.error('Error fetching camera list:', error);
      throw error;
    }
  });

  ipcMain.handle('get-person-list', async () => {
    try {
      const persons = await db.procedure('GetAllPersons');
      return persons[0]; 
    } catch (error) {
      console.error('Error fetching camera list:', error);
      throw error;
    }
  });

  ipcMain.handle('get-images', async (event, personId) => {
    try {
      const images = await db.procedure('GetPersonImages', [personId]);
      return images[0]; 
    } catch (error) {
      console.error('Error fetching images: ', error);
      throw error;
    }
  });

  ipcMain.handle('adjust-person', async (event, params) => {
    try {
      const [id, fullname, birth, gender, phone, address, email] = params;
      console.log('Received params for adjust-person:', { id, fullname, birth, gender, phone, address, email });
  
      // Kiểm tra tham số
      if (!id || id <= 0) {
        throw new Error('ID nhân viên không hợp lệ');
      }
      if (birth && !/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
        throw new Error('Định dạng ngày sinh không hợp lệ, phải là yyyy-MM-dd');
      }
      if (phone && !/^\d{10}$/.test(phone)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }
  
      const response = await db.procedure('AdjustPerson', [
        id,
        fullname,
        birth,
        gender,
        phone,
        address,
        email,
      ]);
      return response;
    } catch (error) {
      console.error('Error adjusting person info: ', error);
      throw error;
    }
  });


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  await db.connect();
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })



  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  subscribers.forEach((sub) => sub.stop());
  subscribers.clear();
  await db.disconnect();
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

