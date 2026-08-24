# TECHNICAL PROJECT REPORT
## Coursework: Microservices-Based System Architecture
**Module:** Service-Oriented Computing  
**Assessment Type:** Group Project (5 Students)  
**Project Name:** BloodLink - Distributed Microservices Blood Donation System  
**Date:** August 2026  

---

## 👥 Group Member Work Breakdown Matrix

| Student ID | Student Name | Role / Microservice | Assigned Branch | Port | Dedicated Database | Key Responsibilities |
|---|---|---|---|---|---|---|
| **ITBIN-2313-0099** | **Shakya Sangeeth** | **Gateway Lead (User & Auth Service)** | `gateway` | `8080` | `gateway_db` | User registration, OAuth 2.0 JWT token generation, API Gateway reverse proxy routing, Rate Limiting (60 req/min), CORS policy, System audit logging. |
| **ITBNM-2313-0072** | **Adeesha Akalanka** | **Donor Service** | `donor-service` | `8081` | `donor_db` | Donor profile registry, eligibility status calculations, donation history logs, API Key verification (`X-API-KEY`). |
| **ITBNM-2313-0057** | **Vikum Probodya** | **Blood Inventory Service** | `inventory-service` | `8082` | `inventory_db` | Real-time blood stock tracking across 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-), stock level updates post-donation, critical threshold alerts. |
| **ITBNM-2313-0009** | **Ashan Chamidu** | **Request & Matching Service** | `request-service` | `8083` | `request_db` | Hospital blood requests, automated donor-recipient matching engine based on blood compatibility matrix and geographic city proximity. |
| **ITBNM-2313-0077** | **Adeesha Omal** | **Notification Service** | `notification-service` | `8084` | `notification_db` | Automated Email notification dispatch, SMS emergency alert simulator, broadcast alert logs for urgent blood shortages. |
| **-** | **All Team Members** | **React Client Application ("BloodLink")** | `client-app` | `5173` | - | Single unified dark-themed React frontend integrating all 5 microservices via API Gateway. |

---

## 1. System Architecture & Design

### 1.1 High-Level Architecture Overview
The **BloodLink System** is built on a decentralized, distributed **Service-Oriented Architecture (SOA) / Microservices Pattern**. The application decoupled monolithic functionality into 5 independent, domain-specific Spring Boot microservices backed by dedicated MongoDB databases (Database-per-Service pattern).

```
                      +----------------------------------+
                      |  React Client App ("BloodLink")  |
                      |          (Port 5173)             |
                      +----------------+-----------------+
                                       |
                                       | HTTP / REST (JWT Auth)
                                       v
                      +----------------+-----------------+
                      |     Central API Gateway          |
                      |   (User & Auth Service)          |
                      |          (Port 8080)             |
                      +-------+---+----+---+-------------+
                              |   |    |   |
          +-------------------+   |    |   +--------------------+
          |                       |    |                        |
          v                       v    v                        v
+---------+--------+  +-----------+----+--+  +------------------+----+  +--------------------+----+
|  Donor Service   |  | Inventory Service |  | Request-Matching Service|  | Notification Service    |
|   (Port 8081)    |  |    (Port 8082)    |  |    (Port 8083)         |  |    (Port 8084)           |
+--------+---------+  +---------+---------+  +---------+----------------+  +---------+---------------+
         |                      |                      |                           |
         v                      v                      v                           v
+--------+---------+  +---------+---------+  +---------+----------------+  +---------+---------------+
| MongoDB: donor_db|  |MongoDB:inventory_db| | MongoDB: request_db    |  |MongoDB: notification_db |
+------------------+  +-------------------+  +--------------------------+  +-------------------------+
```

### 1.2 Inter-Service Communication Flow
1. **Client to Gateway:** The React Frontend communicates exclusively with the **API Gateway** on port `8080`.
2. **Authentication Flow:** Requests to protected domain endpoints require an `Authorization: Bearer <JWT_TOKEN>` header.
3. **Gateway Routing:** The Gateway authenticates the JWT, checks Rate Limiting rules, and proxies the request to the appropriate downstream microservice (`/donors`, `/inventory`, `/requests`, `/notify`).
4. **Service Security:** Communication from Gateway to microservices includes an internal `X-API-KEY: blood_donation_secret_key_2026` header to prevent direct unauthorized access to downstream ports (8081–8084).

---

## 2. Microservice Breakdown & API Design

### 2.1 Branch 1: API Gateway & User Auth Service (`api-gateway` - Port 8080)
- **Lead Developer:** Chanaka Sandaruwan (ITBNM-2313-0073)
- **Database:** `gateway_db` (Collections: `users`, `login_logs`)
- **Key Responsibilities:** OAuth 2.0 User Registration & JWT Authentication, Rate Limiting Filter (60 req/min per IP), CORS configuration, Central API Reverse Proxy.

#### Endpoints Table:
| Method | Endpoint Path | Description | Access / Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register new Donor or Hospital user account | Public / API Key |
| `POST` | `/auth/login` | Authenticate credentials & return OAuth 2.0 JWT Token | Public / API Key |
| `GET` | `/auth/profile` | Fetch authenticated user details | Bearer JWT |
| `GET` | `/auth/validate` | Validate token status | Bearer JWT |
| `GET` | `/auth/logs` | Fetch system audit logs | API Key |

---

### 2.2 Branch 2: Donor Service (`donor-service` - Port 8081)
- **Lead Developer:** Chamod Vimukthi (ITBNM-2313-0082)
- **Database:** `donor_db` (Collections: `donors`, `donation_history`)
- **Key Responsibilities:** Donor registry, eligibility criteria checking (56-day gap rule), donation record creation.

#### Endpoints Table:
| Method | Endpoint Path | Description | Access / Auth |
|---|---|---|---|
| `GET` | `/donors` | Get all registered donors | API Key |
| `POST` | `/donors` | Register a new donor profile | API Key |
| `GET` | `/donors/{id}` | Get donor profile by ID | API Key |
| `GET` | `/donors/{id}/eligibility` | Evaluate donor eligibility for donation | API Key |
| `POST` | `/donors/{id}/donate` | Record a new blood donation | API Key |
| `GET` | `/donors/{id}/history` | Get donation history logs for donor | API Key |

---

### 2.3 Branch 3: Blood Inventory Service (`inventory-service` - Port 8082)
- **Lead Developer:** A.A.M Dilshara Dias (ITBNM-2313-0015)
- **Database:** `inventory_db` (Collection: `blood_inventory`)
- **Key Responsibilities:** Stock tracking across 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-), threshold monitoring, stock increment post-donation.

#### Endpoints Table:
| Method | Endpoint Path | Description | Access / Auth |
|---|---|---|---|
| `GET` | `/inventory` | Get stock capacity for all 8 blood groups | API Key |
| `GET` | `/inventory/{bloodType}` | Get stock for specific blood type (e.g. O+) | API Key |
| `POST` | `/inventory/update` | Update blood stock quantity | API Key |

---

### 2.4 Branch 4: Request & Matching Service (`request-service` - Port 8083)
- **Lead Developer:** Kaumini Sathsarani (ITBNM-2313-0088)
- **Database:** `request_db` (Collection: `blood_requests`)
- **Key Responsibilities:** Manage hospital recipient requests (`CRITICAL`, `HIGH`, `NORMAL`), donor-recipient matching engine based on blood type compatibility and city proximity.

#### Endpoints Table:
| Method | Endpoint Path | Description | Access / Auth |
|---|---|---|---|
| `GET` | `/requests` | Get all active blood requests | API Key |
| `POST` | `/requests` | Submit a new blood request | API Key |
| `GET` | `/requests/{id}` | Get request details by ID | API Key |
| `POST` | `/requests/match` | Execute donor-recipient matching algorithm | API Key |

---

### 2.5 Branch 5: Notification Service (`notification-service` - Port 8084)
- **Lead Developer:** R.G Malsha Prabodinee (ITBNM-2313-0058)
- **Database:** `notification_db` (Collection: `notifications`)
- **Key Responsibilities:** Email notification dispatching, SMS emergency alert dispatching, broadcast alert logs.

#### Endpoints Table:
| Method | Endpoint Path | Description | Access / Auth |
|---|---|---|---|
| `GET` | `/notify` | Get notification audit logs | API Key |
| `POST` | `/notify/email` | Send automated email notification | API Key |
| `POST` | `/notify/sms` | Send automated SMS alert | API Key |
| `POST` | `/notify/alerts` | Broadcast emergency alert | API Key |

---

## 3. Security & Infrastructure

### 3.1 OAuth 2.0 & JWT Implementation
User authentication uses JSON Web Tokens (JJWT library `0.11.5`). Upon successful login at `POST /auth/login`, the API Gateway signs a JWT containing the user's `email`, `role`, `issuedAt`, and `expiration` timestamp (24-hour validity).

### 3.2 Service-to-Service API Key Verification
Every individual microservice implements a custom `ApiKeyAuthFilter.java` extending Spring's `OncePerRequestFilter`. Requests lacking the header `X-API-KEY: blood_donation_secret_key_2026` are rejected with HTTP Status `401 Unauthorized`.

### 3.3 Rate Limiting & CORS
- **Rate Limiting:** `RateLimitingFilter.java` tracks request counts per IP address using a `ConcurrentHashMap` with atomic counters. Requests exceeding **60 requests per minute** receive an HTTP `429 Too Many Requests` response.
- **CORS:** Configured in `SecurityConfig.java` to explicitly permit origin `http://localhost:5173` with standard REST methods (`GET`, `POST`, `PUT`, `DELETE`).

---

## 4. Containerization & Deployment (Docker)

The system is fully containerized using Multi-Stage Dockerfiles and orchestrated via a root `docker-compose.yml` file.

### 4.1 Root Docker Compose Architecture
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: blood_donation_mongodb
    ports:
      - "27017:27017"

  api-gateway:
    build: ./api-gateway
    container_name: api_gateway_service
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/gateway_db

  donor-service:
    build: ./donor-service
    container_name: donor_service
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/donor_db

  inventory-service:
    build: ./inventory-service
    container_name: inventory_service
    ports:
      - "8082:8082"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/inventory_db

  request-service:
    build: ./request-service
    container_name: request_service
    ports:
      - "8083:8083"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/request_db

  notification-service:
    build: ./notification-service
    container_name: notification_service
    ports:
      - "8084:8084"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/notification_db

  frontend:
    build: ./frontend
    container_name: frontend_app
    ports:
      - "5173:5173"
```

---

## 5. Client Application & API Documentation

### 5.1 Interactive Swagger UI Specs
Every microservice embeds `springdoc-openapi-starter-webmvc-ui` (OpenAPI 3.0):
- **Gateway Hub (Port 8080):** `http://localhost:8080/swagger-ui.html`
- **Donor Service (Port 8081):** `http://localhost:8081/swagger-ui.html`
- **Inventory Service (Port 8082):** `http://localhost:8082/swagger-ui.html`
- **Request Service (Port 8083):** `http://localhost:8083/swagger-ui.html`
- **Notification Service (Port 8084):** `http://localhost:8084/swagger-ui.html`

### 5.2 Postman API Collection
The repository includes `Blood_Donation_Postman_Collection.json` organized into 5 Microservice Branch folders with auto-saving test scripts for JWT tokens and resource IDs.

---

## 6. Conclusion

The **BloodLink Microservices System** successfully fulfills all technical guidelines, architectural standards, security protocols, containerization criteria, and unified client application integration required by the **Service-Oriented Computing** module specification.
