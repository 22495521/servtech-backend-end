import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getProfile,
  getAllUsers,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// 輸入驗證規則
const registerValidation = [
  body("username")
    .isLength({ min: 5, max: 20 })
    .withMessage("使用者名稱必須介於 5-20 個字元之間")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("使用者名稱只能包含字母、數字和底線"),

  body("password").isLength({ min: 6 }).withMessage("密碼至少需要 6 個字元"),
];

const loginValidation = [
  body("username").notEmpty().withMessage("請提供使用者名稱"),

  body("password").notEmpty().withMessage("請提供密碼"),
];

// 路由定義
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", authenticateToken, getProfile);
router.get("/getAllUsers", authenticateToken, getAllUsers);

// 測試受保護的路由
router.get(
  "/protected",
  authenticateToken,
  (req: Request, res: Response): void => {
    res.json({
      success: true,
      message: "成功存取受保護的路由",
      data: {
        user: req.user,
        timestamp: new Date().toISOString(),
      },
    });
  }
);

// 登出路由（客戶端需要刪除令牌）
router.post(
  "/logout",
  authenticateToken,
  (req: Request, res: Response): void => {
    res.json({
      success: true,
      message: "登出成功，請在客戶端刪除令牌",
    });
  }
);

export default router;
