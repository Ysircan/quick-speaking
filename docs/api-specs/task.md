# Task 接口规范文档

任务节点（Task）用于描述训练营（Track）中的每日任务内容。每个 Task 属于某个 Track，并根据类型执行不同的交互逻辑。

---

---

## 字段说明（核心）

| 字段名 | 类型 | 描述 |
|--------|------|------|
| `dayIndex` | Int | 第几天的任务，从 1 开始 |
| `type` | Enum | 任务类型：`QUIZ`（出题）或 `CHECKIN`（打卡）|
| `content` | String | 任务正文内容，由老师输入（如题干或打卡说明）|
| `optionsJson` | Json? | 选项数组，仅用于 QUIZ 类型 |
| `correctAnswer` | String? | 正确答案，仅用于 QUIZ 类型 |
| `explanation` | String? | 答案解析，可选 |

---

## 1. 批量创建 Task（AI 生成 or 手动创建）

**POST** `/api/task/batch`

### 请求体示例：
```json
{
  "trackId": "clx123abc456",
  "tasks": [
    {
      "dayIndex": 1,
      "type": "QUIZ",
      "content": "【必填】请输入题目内容，例如：Which word means 'happy'?",
      "optionsJson": ["选项 A", "选项 B", "选项 C", "选项 D"],
      "correctAnswer": "选项 A",
      "explanation": "【可选】请输入解析，例如：'happy' 是 'joyful' 的近义词",
      "tags": ["词汇", "近义词"]
    },
    {
      "dayIndex": 2,
      "type": "CHECKIN",
      "content": "【必填】请输入打卡说明，例如：完成今天的阅读任务并点击下方按钮"
    }
  ]
}
```

### 响应：
```json
{
  "success": true,
  "created": 2
}
```

---

## 2. 获取某个 Track 下所有任务

**GET** `/api/task/list?trackId=clx123abc456`

### 响应：
```json
{
  "tasks": [
    {
      "id": "task1",
      "dayIndex": 1,
      "type": "QUIZ",
      "content": "【必填】请输入题目内容..."
    },
    {
      "id": "task2",
      "dayIndex": 2,
      "type": "CHECKIN",
      "content": "【必填】请输入打卡说明..."
    }
  ]
}
```

---

## 3. 获取单个 Task 详情

**GET** `/api/task/:id`

### 响应：
```json
{
  "task": {
    "id": "task1",
    "trackId": "clx123abc456",
    "dayIndex": 1,
    "type": "QUIZ",
    "content": "【必填】请输入题目内容...",
    "optionsJson": ["选项 A", "选项 B", "选项 C", "选项 D"],
    "correctAnswer": "选项 A",
    "explanation": "【可选】请输入解析内容",
    "tags": ["词汇"]
  }
}
```

---

## 4. 更新单个 Task

**PUT** `/api/task/:id`

### 请求体示例：
```json
{
  "content": "【更新】请输入修改后的任务说明，例如：今天请复习 Unit 2 中的动词短语",
  "correctAnswer": null,
  "optionsJson": null
}
```

### 响应：
```json
{
  "success": true,
  "task": { "id": "task1", "content": "【更新】请输入修改后的任务说明..." }
}
```

---

## 5. 删除 Task

**DELETE** `/api/task/:id`

### 响应：
```json
{
  "success": true,
  "message": "任务已删除"
}
```
