# 🚀 Mock API Service

> A dynamic REST API simulation tool developed as part of the **Tigo Start Summit Challenge 2025**.

**Mock API Service** enables developers to simulate RESTful endpoints with fully customizable responses, conditions, templates, and validation logic—ideal for testing, training, and prototyping APIs without backend dependencies.

---

## 🧭 Project Overview

Mock API Service is a lightweight and extensible platform to dynamically create and manage REST API mocks. It supports advanced request matching, templated responses, schema validation, and logging—making it a powerful tool for API consumers and backend simulation.

### ✅ Key Features
- Dynamic mock configuration via REST interface.
- Query/body/header condition matching.
- Lightweight storage via embedded LiteDB (JSON file).
- Creation of a backup copy of the logs in order to leave evidence of user movements.

---

## 🏗️ System Architecture

```bash
mock-api-service/
├── src/
│   ├── config/           # Env, logger, and DB connection
│   ├── controllers/      # Admin, mock, utility logic
│   ├── models/           # LiteDB schemas for mocks and logs
│   ├── routes/           # Route definitions (admin + catch-all)
│   ├── services/         # Business logic (matcher, templating, validation)
│   ├── utils/            # Helpers (faker, operators, errors)
├── scripts/              # DB seed and migration tools
├── .env.example          # Env config template
├── app.js                # Main entry point
└── package.json
```

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js ≥ 18.x
- Git
- npm or yarn

### Linux/macOS
```bash
git clone https://github.com/cabeltrantello/TigoChallenge.git
cd TigoChallenge
cp .env.example .env
npm install
```

### Windows
```cmd
git clone https://github.com/cabeltrantello/TigoChallenge.git
cd TigoChallenge
copy .env.example .env
npm install
```

---

## 🚀 Execution Guide

### Start in development mode:
```bash
npm run dev
```

### Environment variables (`.env`)
```env
PORT=3000
MOCK_DB_PATH=./data/mocks.db.json
LOG_DB_PATH=./data/logs.db.json
SCALE_MODE=low
```

---

## 🧩 Configuration Examples

### Simple Mock (JSON)
```json
{
  "method": "GET",
  "path": "/api/user",
  "conditions": {
    "query": {
      "role": "admin"
    }
  },
  "response": {
    "status": 200,
    "body": {
      "user": "{{request.query.name}}",
      "role": "admin"
    }
  }
}
```
---

## 🔍 Usage Examples

### 1. Create a dynamic mock
```http
POST /admin/mocks
Content-Type: application/json

{
  "method": "POST",
  "path": "/api/products",
  "response": {
    "status": 201,
    "body": { "message": "Product created" }
  }
}
```

### 2. Call the simulated endpoint
```bash
curl -X POST http://localhost:3000/api/products
```

---

## 💻 Code Snippets

### Matcher Service
```js
function matchRequest(req, mock) {
  return mock.conditions.query.role === req.query.role;
}
```

---

## 📡 API Reference

### `GET /admin/mocks`
List all configured mocks.

### `POST /admin/mocks`
Register a new mock.

```json
{
  "method": "GET",
  "path": "/api/hello",
  "response": {
    "status": 200,
    "body": { "msg": "Hello!" }
  }
}
```

### `DELETE /admin/mocks/:id`
Delete a specific mock by ID.

> All endpoints accept and return JSON. Authentication is not required by default.

---

## 🧰 Troubleshooting

| Issue                            | Fix                                                   |
|----------------------------------|--------------------------------------------------------|
| `Cannot find module`            | Check ES module imports and relative paths            |
| Mocks not triggered              | Ensure `conditions` match the request correctly        |
| Logs not saved                   | Validate `log.model.js` and file permissions           |
| `EACCES` on Linux                | Use `sudo` or change port to above 1024               |

---

## 🤝 Contribution Guidelines

We welcome contributions!

### Steps
1. Fork and clone the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Write clear code with comments and tests.
4. Submit a detailed pull request.

## 🏁 Challenge Context

This project was built for the **Tigo Start Summit Challenge 2025**, showcasing the use of dynamic backend mocking for scalable, test-driven development environments.

---

## 📜 License

MIT © 2025 Carlos Andrés Beltran Tello
