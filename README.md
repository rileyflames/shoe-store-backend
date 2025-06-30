# shoe-store-backend

# ✅ Final Checklist of Tools You’ll Be Using

| Category                | Tools                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Server                  | express, dotenv                                                     |
| Database                | mongoose                                                            |
| Security                | helmet, cors, bcryptjs, jsonwebtoken, rate limiting, mongo-sanitize |
| Authentication          | passport, passport-jwt, passport-local                              |
| Input Validation        | zod, xss, hpp                                                       |
| Logging & Monitoring    | winston, morgan, express-status-monitor                             |
| Caching                 | redis, apicache, node-cache                                         |
| API Docs                | swagger-jsdoc, swagger-ui-express                                   |
| Testing                 | jest, supertest                                                     |
| Development Convenience | nodemon, cross-env                                                  |

# Folder structure 

shoe-store-api/
├── src/
│   ├── config/              # DB, redis, env, passport config
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth, validation, error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── services/            # Business logic (e.g., productService)
│   ├── utils/               # Helper functions
│   └── validation/          # Zod schemas
├── tests/                   # Jest/Supertest tests
├── .env
├── app.js                   # Express app config
├── server.js                # Server and DB startup
├── package.json
└── README.md

# Folder Structure 
shoe-store-backend/
|src/
|   |-config
|   |-controllers
|   |- middleware
|   |- models
|   |- routes
|   |- services
|   |- utils
|   |- validation
|   |- app.js
|   |- server.js
|
|tests/
|
|- .env
|- .eslintignore
|- .gitignore
|- .prettierignore
|- .prettierrc
|- eslint.config.js
|- LICENSE
|- package-lock.json
|- package.json
|- README.md

# what each folder does
src/ — your main source code

config/ — config files (e.g., database connection, environment variables)

controllers/ — functions that handle API requests and responses

middleware/ — Express middleware (e.g., auth, error handling)

models/ — Mongoose schemas for MongoDB collections (e.g., Shoe, User)

routes/ — API route definitions (e.g., /shoes, /users)

services/ — business logic and service layer (e.g., sending emails, external APIs)

utils/ — utility/helper functions

validation/ — input validation schemas/rules (maybe using zod or Joi)

app.js — sets up your Express app, middleware, routes

server.js — starts the server (listens on a port)

tests/ — your tests (unit, integration)

.env — environment variables (database URI, JWT secret, etc)

eslint.config.js and .prettierrc — your linting and formatting configs