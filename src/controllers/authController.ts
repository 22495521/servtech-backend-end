import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt.js";
import User from "../models/User.js";

// 使用者註冊
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 驗證輸入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "輸入驗證失敗",
        errors: errors.array(),
      });
      return;
    }

    const { username, password, role = "user" } = req.body;

    // 檢查使用者是否已存在
    if (User.isUsernameExists(username)) {
      res.status(400).json({
        success: false,
        message: "使用者名稱已存在",
      });
      return;
    }

    // 加密密碼
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 建立新使用者
    const newUser = User.create({
      username,
      password: hashedPassword,
      role,
    });

    // 生成 JWT 令牌
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    // 回傳成功回應（不包含密碼）
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "使用者註冊成功",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("註冊錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器內部錯誤",
    });
  }
};

// 使用者登入
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // 驗證輸入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "輸入驗證失敗",
        errors: errors.array(),
      });
      return;
    }

    const { username, password } = req.body;

    // 查找使用者
    const user = User.findByUsername(username);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "使用者名稱或密碼錯誤",
      });
      return;
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "使用者名稱或密碼錯誤",
      });
      return;
    }

    // 生成 JWT 令牌
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // 回傳成功回應（不包含密碼）
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "登入成功",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("登入錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器內部錯誤",
    });
  }
};

// 取得使用者資料
export const getProfile = (req: Request, res: Response): void => {
  try {
    const user = User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "找不到使用者",
      });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("取得使用者資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器內部錯誤",
    });
  }
};

//取得所有使用者資料
export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const users = User.getAllUsers();
    res.json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("取得所有使用者資料錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器內部錯誤",
    });
  }
};
