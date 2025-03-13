import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',        // Địa chỉ host của MySQL (thay đổi nếu cần)
  user: 'root',            // Tên người dùng MySQL
  password: '08032003',            // Mật khẩu MySQL (để trống nếu không có)
  database: 'face_application',  // Tên database của bạn
  port: 3306,              // Cổng mặc định của MySQL
};

class Database {
  private static instance: Database;
  private connection: mysql.Connection | null = null;

  private constructor() {
    // Private constructor để áp dụng Singleton pattern
  }

  // Singleton: Chỉ tạo một instance duy nhất
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Khởi tạo kết nối
  public async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL database');
    } catch (error) {
      console.error('Error connecting to MySQL:', error);
      throw error;
    }
  }

  // Lấy connection để thực hiện query
  public getConnection(): mysql.Connection {
    if (!this.connection) {
      throw new Error('Database connection not initialized. Call connect() first.');
    }
    return this.connection;
  }

  // Ngắt kết nối
  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log('Disconnected from MySQL database');
      this.connection = null;
    }
  }

  // Thực hiện query (ví dụ)
  public async query(sql: string, params: any[] = []): Promise<any> {
    const conn = this.getConnection();
    const [results] = await conn.execute(sql, params);
    return results;
  }

  public async procedure(procedureName: string, params: any[] = []): Promise<any> {
    const conn = this.getConnection();
    const placeholders = params.map(() => '?').join(','); // Tạo chuỗi dấu ? cho tham số
    const sql = `CALL ${procedureName}(${placeholders})`;
    const [results] = await conn.execute(sql, params);
    return results;
  }
}

export default Database;