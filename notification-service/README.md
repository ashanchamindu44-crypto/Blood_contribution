# Notification Service

Part of the **Blood Donation System** microservices project. Owned by: **Student 5**.

Sends email/SMS notifications and broadcast alerts (e.g. "urgent need for O- blood")
to donors, recipients, and hospitals. Secured with API Key authentication, matching
the pattern used by every other microservice in this system.

## Tech Stack
- Spring Boot 3.2.4 (Java 17)
- Spring Data MongoDB
- Spring Boot Starter Mail (for real email delivery; runs in mock/log mode by default)
- springdoc-openapi (Swagger UI)
- Docker

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/notify/email` | Send an email to a single recipient |
| POST | `/notify/sms` | Send an SMS to a single recipient |
| POST | `/notify/alerts` | Broadcast one alert message to a list of recipients (email or SMS) |
| GET | `/notify` | List the full notification log |
| GET | `/notify/{id}` | Get a single notification record |
| GET | `/notify/recipient/{recipientId}` | Get all notifications sent to a given donor/recipient ID |

All endpoints require the `X-API-KEY` header. Requests without it (or with the
wrong key) receive `401 Unauthorized`. Swagger UI and `/api-docs` are exempted
so the docs remain browsable without a key.

### Example: send an email
```bash
curl -X POST http://localhost:8085/notify/email \
  -H "X-API-KEY: my-secret-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "donor123",
    "recipientEmail": "donor@example.com",
    "subject": "Thank you for donating!",
    "message": "Your donation has been recorded."
  }'
```

### Example: broadcast an alert
```bash
curl -X POST http://localhost:8085/notify/alerts \
  -H "X-API-KEY: my-secret-api-key-12345" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "EMAIL",
    "subject": "Urgent: O- Blood Needed",
    "message": "A hospital in your area urgently needs O- blood.",
    "bloodType": "O-",
    "location": "Colombo",
    "recipientContacts": ["donor1@example.com", "donor2@example.com"]
  }'
```

## Mock mode (no real SMTP/SMS account needed)

By default `NOTIFICATION_MOCK_MODE=true`, so every send just logs to the console
and is recorded as `SENT` in MongoDB — this is intentional so the service, the
gateway, and the client app can all be demonstrated/marked without anyone
needing a real Gmail app password or a Twilio account.

To send real emails: set `NOTIFICATION_MOCK_MODE=false` and provide
`MAIL_USERNAME` / `MAIL_PASSWORD` (an app password, not your normal Gmail
password) in `.env`. SMS is a mock provider by design — swap
`SmsSenderService.send()` for a real Twilio/Vonage call if you want actual
texts; the interface is already isolated so nothing else needs to change.

## Running locally

```bash
cd notification-service
mvn spring-boot:run
```
Requires a local MongoDB on `localhost:27017` (or set `MONGO_URI`).

## Running with Docker

```bash
cd notification-service
docker compose up --build
```
This starts a dedicated MongoDB container (`notification-db`, host port `27020`)
and the service itself on `http://localhost:8085`.

> When merging into the **root** `docker-compose.yml` for the whole system,
> copy the `notification-db` and `notification-service` blocks from this
> file's `docker-compose.yml` into the root file, and remove this file so
> there's only one compose definition for the project.

## Swagger / OpenAPI
- Swagger UI: `http://localhost:8085/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8085/api-docs`

## API Key
Header: `X-API-KEY`
Default test key (override via `API_KEY` env var): `my-secret-api-key-12345`

## Folder Structure
```
notification-service/
├── Dockerfile
├── docker-compose.yml
├── pom.xml
├── .env
├── Notification_Service_Postman_Collection.json
├── README.md
└── src/main/
    ├── java/com/blooddonation/notificationservice/
    │   ├── NotificationServiceApplication.java
    │   ├── config/OpenApiConfig.java
    │   ├── controller/NotificationController.java
    │   ├── dto/
    │   │   ├── EmailNotificationRequestDTO.java
    │   │   ├── SmsNotificationRequestDTO.java
    │   │   ├── AlertRequestDTO.java
    │   │   └── NotificationResponseDTO.java
    │   ├── model/
    │   │   ├── Notification.java
    │   │   ├── NotificationType.java
    │   │   └── NotificationStatus.java
    │   ├── repository/NotificationRepository.java
    │   ├── security/
    │   │   ├── ApiKeyAuthFilter.java
    │   │   └── SecurityConfig.java
    │   └── service/
    │       ├── NotificationService.java
    │       ├── EmailSenderService.java
    │       └── SmsSenderService.java
    └── resources/application.yml
```
