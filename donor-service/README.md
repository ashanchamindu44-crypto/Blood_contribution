# Donor Service

This is the Donor Service microservice for the Blood Donation System. It manages donor records, donation history, and performs eligibility checks.

## Tech Stack
- Java 17
- Spring Boot 3.2.4
- PostgreSQL
- Springdoc OpenAPI (Swagger)

## Architecture Overview

This microservice is a part of the larger Blood Donation System and handles all donor-related operations. It exposes a REST API and uses PostgreSQL as its database.

## Setup Instructions

### Prerequisites
- JDK 17
- Maven 3.8+
- Docker and Docker Compose (optional, for running with DB via Docker)

### Running Locally with Docker Compose

The easiest way to start the service along with its PostgreSQL database is using Docker Compose:

```bash
docker-compose up --build -d
```

This will start:
1. `donor_db`: A PostgreSQL instance on port `5432`.
2. `donor_service`: The Spring Boot app on port `8082`.

### Running Locally with Maven

If you have a PostgreSQL database already running, you can start the app via Maven:

1. Copy `.env` to configure your environment variables (or just use the defaults).
2. Run the application:
```bash
mvn spring-boot:run
```

## Security

All API endpoints (except for Swagger docs) require an API Key for authentication.
- **Header Name:** `X-API-KEY`
- **Default Value:** `my-secret-api-key-12345` (configured in `application.yml` or `.env`)

### Test Credentials
To test the API, include the following header in your requests:
`X-API-KEY: my-secret-api-key-12345`

## Swagger API Documentation

Swagger UI is available at:
`http://localhost:8082/swagger-ui.html`

You can authenticate in the Swagger UI by clicking the "Authorize" button and entering your API Key.
