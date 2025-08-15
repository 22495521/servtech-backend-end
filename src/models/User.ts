export interface UserData {
  id: number;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface CreateUserData {
  username: string;
  password: string;
  role?: "user" | "admin";
}

export interface UserWithoutPassword {
  id: number;
  username: string;
  role: "user" | "admin";
  createdAt: Date;
}

class User {
  private users: UserData[];
  private nextId: number;

  constructor() {
    this.users = [
      {
        id: 1,
        username: "admin",
        password:
          "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "admin",
        createdAt: new Date(),
      },
      {
        id: 2,
        username: "user",
        password:
          "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
        role: "user",
        createdAt: new Date(),
      },
    ];
    this.nextId = 3;
  }

  // 根據使用者名稱查找使用者
  findByUsername(username: string): UserData | undefined {
    return this.users.find((user) => user.username === username);
  }

  // 根據 ID 查找使用者
  findById(id: number | string): UserData | undefined {
    const userId = typeof id === "string" ? parseInt(id, 10) : id;
    return this.users.find((user) => user.id === userId);
  }

  // 建立新使用者
  create(userData: CreateUserData): UserData {
    const newUser: UserData = {
      id: this.nextId++,
      role: "user",
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // 取得所有使用者（不包含密碼）
  getAllUsers(): UserWithoutPassword[] {
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // 檢查使用者名稱是否已存在
  isUsernameExists(username: string): boolean {
    return this.users.some((user) => user.username === username);
  }
}

export default new User();
