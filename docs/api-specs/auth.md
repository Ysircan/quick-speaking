# 用户系统接口规范（auth.md）

所有接口路径前缀：`/api/auth`  
用于处理用户注册、登录、信息获取、登出等功能。

---

## ✅ POST `/api/auth/register`

注册新用户。

### 请求参数（JSON）
```json
{
  "name": "测试用户",
  "email": "test@example.com",
  "password": "password123",
  "role": "CREATOR"  // 可选，默认值为 "PARTICIPANT"
}

POST /api/auth/register

注册新用户。

请求 JSON：
{
  "name": "测试用户",
  "email": "test@example.com",
  "password": "password123",
  "role": "CREATOR"  // 可选，默认值为 "PARTICIPANT"
}

成功返回：
{
  "success": true,
  "token": "jwt-token-string",
  "user": {
    "id": "clx123abc456",
    "name": "测试用户",
    "email": "test@example.com",
    "role": "CREATOR",
    "avatarUrl": "https://cdn.quick.com/default-avatar.png"
  }
}

失败返回：
{
  "success": false,
  "error": "邮箱已被注册"
}

---

POST /api/auth/login

用户登录。

请求 JSON：
{
  "email": "test@example.com",
  "password": "password123"
}

成功返回：
{
  "success": true,
  "token": "jwt-token-string",
  "user": {
    "id": "clx123abc456",
    "name": "测试用户",
    "email": "test@example.com",
    "role": "PARTICIPANT",
    "avatarUrl": "https://cdn.quick.com/default-avatar.png"
  }
}

失败返回：
{
  "success": false,
  "error": "邮箱或密码错误"
}

---

GET /api/auth/me

获取当前登录用户信息。

请求 Header：
Authorization: Bearer <token>

返回：
{
  "success": true,
  "user": {
    "id": "clx123abc456",
    "name": "测试用户",
    "email": "test@example.com",
    "role": "PARTICIPANT",
    "points": 0,
    "currentStreakDays": 0,
    "avatarUrl": "https://cdn.quick.com/default-avatar.png",
    "createdAt": "2025-06-12T05:50:00.000Z"
  }
}

未登录或 token 错误返回：
{
  "success": false,
  "error": "未授权访问"
}

---

POST /api/auth/logout

用户登出（前端删除 token 即可，此接口可选）。

返回：
{
  "success": true,
  "message": "已登出"
}

---

错误格式统一为：
{
  "success": false,
  "error": "错误信息"
}

---

