# BloodLink System (Microservices Architecture)

A complete, production-ready microservices-based Blood Donation Management System featuring an API Gateway, 5 individual Spring Boot microservices connected to MongoDB, a single-command Docker environment, a Postman collection, and a React Client Application ("BloodLink").

---

## 👥 Member Role & Branch Assignment Matrix

| Student ID | Student Name | Role / Microservice | Branch | Port | Database | Responsibilities |
|---|---|---|---|---|---|---|
| **ITBIN-2313-0099** | **Shakya Sangeeth** | **Gateway Lead (User & Auth Service)** | `gateway` | `8080` | `gateway_db` | User registration, OAuth 2.0 JWT authentication, rate limiting, Swagger UI. |
| **ITBNM-2313-0072** | **Adeesha Akalanka** | **Donor Service** | `donor-service` | `8081` | `donor_db` | Donor records, history, eligibility checks, API Key authentication. |
| **ITBNM-2313-0057** | **Vikum Probodya** | **Blood Inventory Service** | `inventory-service` | `8082` | `inventory_db` | Blood stock levels by blood type, stock updates after donation. |
| **ITBNM-2313-0009** | **Ashan Chamindu** | **Request & Matching Service** | `request-service` | `8083` | `request_db` | Recipient requests, donor-recipient matching based on blood type and city. |
| **ITBNM-2313-0077** | **Adeesha Omal** | **Notification Service** | `notification-service` | `8084` | `notification_db` | Email & SMS alerts for blood requests and donor matches. |
| **-** | **All Members** | **React Client Frontend (BloodLink)** | `client-app` | `5173` | - | Unified Light-themed Hospital & University Grade UI connected to Gateway. |

---

## 📁 Repository Folder Structure

```text
BLOOD-DONATION /
├── 📁 .github/                    # CI/CD Workflows
├── 📁 .vscode/                    # VS Code Settings & Debug Configurations
├── 📁 api-gateway/                # User & Auth Service / Gateway (Port 8080)
├── 📁 donor-service/              # Donor Service (Port 8081)
├── 📁 inventory-service/          # Blood Inventory Service (Port 8082)
├── 📁 request-service/            # Request & Matching Service (Port 8083)
├── 📁 notification-service/       # Notification Service (Port 8084)
├── 📁 frontend/                   # React + Vite Frontend - BloodLink UI (Port 5173)
├── 📄 docker-compose.yml          # Single-command Multi-Container Orchestration
├── 📄 Blood_Donation_Postman_Collection.json # Importable 5-Branch Postman Collection
├── 📄 start_system.ps1            # One-click startup script
└── 📄 README.md                   # Complete Project Documentation
```

---

## 🚀 How to Run the Project

### Option 1: Using Docker Compose (Recommended)
Run the entire ecosystem (MongoDB + 5 Microservices + React App) with one command:

```bash
docker compose up --build
```

### Option 2: Running Locally (Without Docker)
1. **Database:** Start local MongoDB instance on `mongodb://localhost:27017`.
2. **Frontend:** Navigate to `frontend` and run:
   ```bash
   npm install
   npm run dev
   ```
3. **Backend Services:** Open any microservice folder (e.g. `api-gateway`) and run:
   ```bash
   mvn spring-boot:run
   ```

---

## 📖 Interactive Swagger UI & OpenAPI Documentation

Every microservice in this ecosystem exposes an interactive **OpenAPI 3 / Swagger UI** console. You can test endpoints, view JSON schemas, and simulate requests directly from your browser.

| Microservice | Port | Interactive Swagger UI URL | OpenAPI 3 JSON Spec |
|---|---|---|---|
| 🛡️ **API Gateway (Main Entry & Reverse Proxy)** | `8080` | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |
| 🩸 **Donor Service** | `8081` | [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html) | [http://localhost:8081/v3/api-docs](http://localhost:8081/v3/api-docs) |
| 📦 **Blood Inventory Service** | `8082` | [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html) | [http://localhost:8082/v3/api-docs](http://localhost:8082/v3/api-docs) |
| 📋 **Request & Matching Service** | `8083` | [http://localhost:8083/swagger-ui.html](http://localhost:8083/swagger-ui.html) | [http://localhost:8083/v3/api-docs](http://localhost:8083/v3/api-docs) |
| 🔔 **Notification Service** | `8084` | [http://localhost:8084/swagger-ui.html](http://localhost:8084/swagger-ui.html) | [http://localhost:8084/v3/api-docs](http://localhost:8084/v3/api-docs) |

### 🔑 How to Authorize in Swagger UI:
1. Open any Swagger UI link above (e.g. `http://localhost:8080/swagger-ui.html`).
2. Click the green **`Authorize` 🔓** button in the top-right corner.
3. For **`ApiKey` / `X-API-KEY`**, enter:
   ```text
   blood_donation_secret_key_2026
   ```
4. Click **`Authorize`** and then **`Close`**.
5. Choose any endpoint, click **`Try it out`**, fill any required request body, and click **`Execute`**!

---

## 📮 Postman API Collection

Import the included `Blood_Donation_Postman_Collection.json` into Postman to test all endpoints organized across the 5 Branches.

| Service Branch | Sample Endpoint | Auth Header Required |
|---|---|---|
| Branch 1: Gateway | `POST /auth/register` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 1: Gateway | `POST /auth/login` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 1: Gateway | `GET /auth/profile` | `Authorization: Bearer <JWT_TOKEN>` |
| Branch 1: Gateway | `GET /auth/logs` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 2: Donor Service | `GET /donors` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 3: Inventory Service | `GET /inventory` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 4: Request Service | `GET /requests` | `X-API-KEY: blood_donation_secret_key_2026` |
| Branch 5: Notification Service | `POST /notify/email` | `X-API-KEY: blood_donation_secret_key_2026` |

---

## 🔑 Default Credentials & Database Connection

- **Donor Account:** `donor@blood.lk` | Password: `password123`
- **Hospital Account:** `hospital@colombo.lk` | Password: `hospital123`
- **Internal Security API Key:** `blood_donation_secret_key_2026`
- **MongoDB Compass Connection:** `mongodb://localhost:27017`

---

## 🔒 Security & Architecture Setup

- **Database-per-Service:** Each microservice operates on its own dedicated MongoDB database (`gateway_db`, `donor_db`, `inventory_db`, `request_db`, `notification_db`).
- **OAuth 2.0 & JWT:** Enforced at the API Gateway level with audit logging.
- **Service-to-Service Security:** `X-API-KEY` internal secret enforced on all microservices.
- **CORS:** Configured for cross-origin client app communication on port `5173`.
- **Rate Limiting:** Prevents API abuse at Gateway level (60 req/min).
