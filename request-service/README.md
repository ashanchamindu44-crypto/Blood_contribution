# Request & Matching Service

Handles blood requests from recipients/hospitals and matches them against
eligible donors (fetched live from `donor-service`) by blood-type
compatibility and city proximity.

## Run locally

1. Start MongoDB (or use the bundled `docker-compose.yml`).
2. Make sure `donor-service` is running on port 8082 (needed for `/requests/match`).
3. `mvn spring-boot:run`
4. Swagger UI: http://localhost:8084/swagger-ui.html

## Endpoints (all require header `X-API-KEY: blood_donation_secret_key_2026`)

| Method | Path | Description |
|---|---|---|
| POST | /requests | Submit a blood request |
| GET | /requests | List requests |
| GET | /requests/{id} | Get one request |
| POST or GET | /requests/match?requestId={id} | Run the matching engine |

## Config (env vars, see `.env`)

- `MONGO_URI` — defaults to `mongodb://localhost:27017/request_db`
- `API_KEY` — must match the key used by the gateway / other services
- `DONOR_SERVICE_URL` — defaults to `http://localhost:8082`

## Note on port

The task sheet listed port 8083, but `inventory-service` already uses 8083
in this repo. This service runs on **8084** instead to avoid a clash —
confirm with the team/gateway config before merging.
