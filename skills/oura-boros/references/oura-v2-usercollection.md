# Oura V2 Usercollection Reference

Sources:
- Main docs: https://cloud.ouraring.com/v2/docs
- OpenAPI spec: https://cloud.ouraring.com/v2/static/json/openapi-1.28.json

## Endpoints Covered By This Skill

Date-windowed list + single document:
- `GET /v2/usercollection/daily_activity`
- `GET /v2/usercollection/daily_activity/{document_id}`
- `GET /v2/usercollection/daily_cardiovascular_age`
- `GET /v2/usercollection/daily_cardiovascular_age/{document_id}`
- `GET /v2/usercollection/daily_readiness`
- `GET /v2/usercollection/daily_readiness/{document_id}`
- `GET /v2/usercollection/daily_resilience`
- `GET /v2/usercollection/daily_resilience/{document_id}`
- `GET /v2/usercollection/daily_sleep`
- `GET /v2/usercollection/daily_sleep/{document_id}`
- `GET /v2/usercollection/daily_spo2`
- `GET /v2/usercollection/daily_spo2/{document_id}`
- `GET /v2/usercollection/daily_stress`
- `GET /v2/usercollection/daily_stress/{document_id}`
- `GET /v2/usercollection/enhanced_tag`
- `GET /v2/usercollection/enhanced_tag/{document_id}`
- `GET /v2/usercollection/rest_mode_period`
- `GET /v2/usercollection/rest_mode_period/{document_id}`
- `GET /v2/usercollection/session`
- `GET /v2/usercollection/session/{document_id}`
- `GET /v2/usercollection/sleep`
- `GET /v2/usercollection/sleep/{document_id}`
- `GET /v2/usercollection/sleep_time`
- `GET /v2/usercollection/sleep_time/{document_id}`
- `GET /v2/usercollection/tag`
- `GET /v2/usercollection/tag/{document_id}`
- `GET /v2/usercollection/vO2_max`
- `GET /v2/usercollection/vO2_max/{document_id}`
- `GET /v2/usercollection/workout`
- `GET /v2/usercollection/workout/{document_id}`

Datetime-windowed list:
- `GET /v2/usercollection/heartrate`

List + single with no date window required:
- `GET /v2/usercollection/ring_configuration`
- `GET /v2/usercollection/ring_configuration/{document_id}`

Singleton endpoint:
- `GET /v2/usercollection/personal_info`

## Query Parameters

Date-windowed list routes:
- `start_date` (`YYYY-MM-DD`)
- `end_date` (`YYYY-MM-DD`)
- optional `next_token`
- optional `limit`

Heartrate route:
- `start_datetime` (ISO8601)
- `end_datetime` (ISO8601)
- optional `next_token`
- optional `limit`

Ring configuration list:
- optional `next_token`

## Auth

- Header: `Authorization: Bearer <access_token>`
- OAuth2 auth URL: `https://cloud.ouraring.com/oauth/authorize`
- OAuth2 token URL: `https://api.ouraring.com/oauth/token`

## Scope Notes

Common scopes for routes in this skill:
- `daily`
- `heartrate`
- `personal`
- `workout`
- `session`
- `tag`
- `stress`
- `spo2`
- `ring_configuration`
- `heart_health`

If a route returns `403`, re-run OAuth with expanded scopes in `OURA_SCOPES`.
