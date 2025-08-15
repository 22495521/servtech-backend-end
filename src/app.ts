import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中介軟體
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);

// 根路由
app.get('/', (req: Request, res: Response): void => {
  res.json({ 
    message: '歡迎使用 ServTech 後端 API',
    version: '1.0.0',
    status: '運行中'
  });
});

// 404 錯誤處理
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: '找不到請求的路由'
  });
});

// 全域錯誤處理
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '伺服器內部錯誤'
  });
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});

export default app;