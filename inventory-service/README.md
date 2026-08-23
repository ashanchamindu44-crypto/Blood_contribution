# Blood Inventory Service

This is the Blood Inventory Service microservice for the Blood Donation System. It tracks available blood units by type, manages stock levels, and updates stock after donations or transfusions.

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- MongoDB
- Springdoc OpenAPI (Swagger)

## Architecture Overview

This microservice is part of the larger Blood Donation System and handles all blood-stock-related operations. It exposes a REST API and uses MongoDB as its database, consistent with the `donor-service`.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory` | Get stock levels for all blood types |
| GET | `/inventory/{bloodType}` | Get stock level for one blood type, e.g. `/inventory/O-` |
| POST | `/inventory/update` | Adjust stock. Body: `{ "bloodType": "O-", "amount": 5, "timestamp": "..." }`. Positive `amount` adds stock, negative deducts. |

`status` (`Healthy` / `Warning` / `Critical`) is derived automatically from `units`:
- `< 10` units → `Critical`
- `< 20` units → `Warning`
- `>= 20` units → `Healthy`

### Sample response — `GET /inventory`
```json
[
  {
    "bloodType": "O-",
    "units": 4,
    "status": "Critical",
    "location": "General Hospital Hub",
    "lastUpdated": "2026-08-16 09:10"
  }
]
```

### Sample request/response — `POST /inventory/update`
Request:
```json
{ "bloodType": "O-", "amount": 5, "timestamp": "2026-08-16T09:15:00Z" }
```
Response:
```json
{
  "bloodType": "O-",
  "units": 9,
  "status": "Critical",
  "location": "General Hospital Hub",
  "lastUpdated": "2026-08-16 09:15"
}
```

On startup, if the database is empty, the service seeds the 8 standard blood types with starting stock so the dashboard has data immediately.

## Setup Instructions

### Prerequisites
- JDK 17
- Maven 3.8+
- Docker and Docker Compose (optional, for running with DB via Docker)

### Running Locally with Docker Compose

```bash
docker-compose up --build -d
```

This starts:
1. `inventory_db`: A MongoDB instance (host port `27018` → container `27017`).
2. `inventory_service`: The Spring Boot app on port `8083`.

### Running Locally with Maven

If you have MongoDB already running locally:

1. Copy `.env` to configure your environment variables (or just use the defaults).
2. Run the application:
```bash
mvn spring-boot:run
```

## Security

All `/inventory/*` endpoints (except Swagger docs) require an API Key.
- **Header Name:** `X-API-KEY`
- **Default Value:** `blood_donation_secret_key_2026` (matches the gateway's configured key and the client-app's default, so everything works together with no extra setup)

### Test Credentials
Include the following header in your requests:
`X-API-KEY: blood_donation_secret_key_2026`

## Swagger API Documentation

Swagger UI is available at:
`http://localhost:8083/swagger-ui.html`

Authenticate in Swagger UI by clicking "Authorize" and entering your API Key.
