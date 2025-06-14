# Track 接口规范文档



## 字段说明

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `title` | String | 训练营标题，由用户输入或生成器生成 |
| `description` | String | 简要介绍训练营目标、结构、面向人群等 |
| `durationDays` | Int | 总任务天数（例如 7 天） |
| `unlockMode` | Enum | 解锁节奏模式（DAILY、LINEAR、FREE 等） |
| `isAIgenerated` | Boolean | 是否为 AI 生成（如关键词创建） |
| `tags` | String[] | 可选标签，如“词汇”“写作” |
| `recommendedFor` | String[] | 推荐对象，如“初中生”“高一” |

---

## 1. 创建 Track

**POST** `/api/track`

### 请求体示例：
```json
{
  "title": "训练营标题（如：七年级词汇强化训练营）",
  "description": "训练营简介（如：7天搞定核心词汇，每日测试+卡片掉落）",
  "coverImage": "https://cdn.quick.com/image.jpg",
  "durationDays": 7,
  "unlockMode": "DAILY",
  "lang": "zh",
  "tags": ["词汇", "七年级"],
  "recommendedFor": ["初中生"],
  "isAIgenerated": true,
  "customRules": {},
  "isFree": true,
  "isPublished": false
}
```

### 响应：
```json
{
  "success": true,
  "track": {
    "id": "clx123abc456",
    "title": "七年级词汇强化训练营",
    "isPublished": false,
    "durationDays": 7,
    "createdAt": "2025-06-13T12:00:00.000Z"
  }
}
```

---

## 2. 获取 Track 列表（我的训练营）

**GET** `/api/track/my`

> 获取当前用户创建的所有 Track

### 响应：
```json
{
  "tracks": [
    {
      "id": "clx123abc456",
      "title": "七年级词汇强化训练营",
      "isPublished": false,
      "durationDays": 7,
      "createdAt": "2025-06-13T12:00:00.000Z"
    }
  ]
}
```

---

## 3. 获取单个 Track 详情

**GET** `/api/track/:id`

### 响应：
```json
{
  "track": {
    "id": "clx123abc456",
    "title": "七年级词汇强化训练营",
    "description": "...",
    "durationDays": 7,
    "unlockMode": "DAILY",
    "tags": [...],
    "isFree": true,
    "isPublished": false,
    "tasks": [
      { "id": "task1", "dayIndex": 1, "type": "QUIZ" },
      { "id": "task2", "dayIndex": 2, "type": "CHECKIN" }
    ]
  }
}
```

---

## 4. 更新 Track

**PUT** `/api/track/:id`

### 请求体示例：
```json
{
  "title": "更新后的标题",
  "description": "新的简介内容",
  "tags": ["更新", "英语"]
}
```

### 响应：
```json
{
  "success": true,
  "track": { "id": "clx123abc456", "title": "更新后的标题" }
}
```

---

## 5. 发布 Track

**POST** `/api/track/:id/publish`

### 响应：
```json
{
  "success": true,
  "message": "训练营已发布"
}