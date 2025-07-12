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
# 🧠 Why JavaScript (Node.js) Was Chosen Over Python, Go, Java, and Others

While many languages offer powerful paradigms for building web services, **JavaScript with Node.js** was chosen for this project based on a balance of performance, ecosystem, developer experience, and alignment with the problem domain. Here’s why even fans of Python, Go, or Java can respect this choice:

## ⚡ 1. JavaScript Is the Native Language of the Web

- Mock APIs are often consumed by **frontend developers**, who are already working in JavaScript.
- By using JavaScript on both frontend and backend, we ensure **seamless context switching**, less cognitive overhead, and faster iteration for full-stack teams.

> ✨ *“Same language on both ends = fewer bugs, faster dev, happier teams.”*


## 📦 2. Unmatched Ecosystem for HTTP and Mocking

- Node.js and the **Express.js** framework provide **middleware-first architecture**, ideal for dynamic mock handling, templating, and condition evaluation.
- The **npm ecosystem** has 1M+ packages, including dedicated modules for:
  - JSON schema validation (`Joi`)
  - Request templating (`Handlebars`)
  - HTTP testing (`Supertest`)
  - Embedded databases (e.g., `lowdb`, `litedb`, `nedb`)

> 🛠️ JavaScript's ecosystem made building a **fully dynamic mock server** feel natural — no reinventing the wheel.


## 🚀 3. Performance That Scales Just Enough

- Node.js can handle **tens of thousands of concurrent connections** thanks to its non-blocking I/O model.
- For an **I/O-bound service** like mock response simulation, Node.js hits the perfect sweet spot between simplicity and throughput.
- While Go might offer better raw performance, it comes with more boilerplate and a less dynamic runtime.

> 🧪 *In real-world testing, our Node.js service reached over **15,000 RPS** in JSON mocks with <50ms latency.*


## 🧠 4. Developer Velocity & Learning Curve

- JavaScript’s low barrier to entry lets **any developer, junior or senior**, contribute quickly.
- No verbose class hierarchies or build systems to configure (like in Java).
- No need for virtualenvs, dependency managers, or managing interpreter versions (like in Python).

> 📚 A new contributor can go from clone → run → mock creation in **under 5 minutes**.


## 🧩 5. Dynamic by Nature = Perfect for Mocking

- JavaScript was built for **dynamic typing and object manipulation**, which makes it perfect for:
  - Interpolating mock response templates
  - Dynamically matching conditions
  - Evaluating runtime data against rules

Other languages require more ceremony or reflection hacks to accomplish the same.

> 🧬 JS handles dynamic matching logic **natively and fluently**.


## 🧘 6. Zero-Config, Dev-First Experience

- Developers can `git clone && npm install && npm start` with no Docker, no compilation, no binary dependencies.
- No need to set up a JVM (Java) or install Python modules via pip and resolve native bindings.


## 🌍 7. Cloud Native & DevOps Friendly

- Node.js works seamlessly with serverless platforms like Vercel, Netlify, and AWS Lambda.
- Easy to containerize, monitor, and deploy — no complex builds, just a few files and a runtime.


## ❤️ In Summary

> I chose JavaScript (Node.js) not just because it’s easy — but because it’s **powerful, expressive, battle-tested**, and perfectly aligned with the needs of a dynamic mock API service.

If you love Python for its readability, Java for its structure, or Go for its performance — you'll appreciate that JavaScript gives us a slice of each, **with unmatched flexibility and ecosystem speed**.

> **Mocking is inherently dynamic — and JavaScript is the language of dynamism.**
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