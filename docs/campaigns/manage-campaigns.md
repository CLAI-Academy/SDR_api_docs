---
sidebar_position: 1
---

# Campaigns

Create and manage campaigns that orchestrate outreach and lead generation.

## Create Campaign

```
POST /campaigns/
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | `application/json` |

*Either `X-API-Key` or `Authorization` is required.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Campaign name |
| `availability_data.start_working` | string (HH:MM) | Yes | Start time (24h) |
| `availability_data.end_working` | string (HH:MM) | Yes | End time (24h, after start) |
| `availability_data.weekend_work` | boolean | No | Allow weekend work (default: `false`) |
| `availability_data.calendar_id` | string | Yes | Google Calendar ID |
| `service_id` | UUID | Yes | Service identifier |
| `icp_profile_id` | UUID | Yes | ICP profile ID |
| `description` | string | No | Campaign description |
| `status` | string | Yes | `draft`, `active`, `paused`, `archived` |
| `target_meeting_type` | string | Yes | Meeting type label |
| `review_required_default` | string | Yes | `human_review` (default) or `auto` |
| `seller_name` | string | Yes | Seller name |
| `provider_account_id` | UUID[] | Yes | Provider accounts to link (pass the IDs for both LinkedIn and Email accounts) |
| `lead_magnet` | object | No | Inline lead magnet creation (see below) |
| `publish_posts` | boolean | No | Whether to publish LinkedIn comments (default: `true`) |

**Lead magnet payload**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Lead magnet name |
| `description` | string | No | Lead magnet description |
| `url` | string | Yes | Public URL (validated) |
| `content_type` | string | No | `pdf`, `doc`, `docx`, `video`, `image`, `webpage`, `ebook` |

### Example Request

```bash
curl -X POST "https://api.sdragent.com/campaigns/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Outbound Q4 LatAm",
    "description": "Meetings for Fintech ICP",
    "status": "draft",
    "service_id": "1c9f6c10-b4b6-4c79-b18a-2dc2b603d9c5",
    "target_meeting_type": "Intro call",
    "review_required_default": "human_review",
    "seller_name": "Jane SDR",
    "icp_profile_id": "63b95f0e-7f67-45e9-9c5c-2d6edb7f1cfa",
    "provider_account_id": [
      "a13e4e4f-3a8a-4fc5-9c2a-5f7fdaa4d9c2",  // LinkedIn account ID
      "b24f3b9d-5b1c-4d0f-a6e3-1b7b2d4e6f8a"   // Email account ID
    ],
    "availability_data": {
      "start_working": "09:00",
      "end_working": "17:00",
      "weekend_work": false,
      "calendar_id": "primary"
    },
    "lead_magnet": {
      "name": "2024 Benchmark",
      "url": "https://cdn.example.com/benchmarks.pdf",
      "content_type": "pdf"
    }
  }'
```

### Example Response

```json
{
  "id": "ea765b3d-1378-4da9-b374-5022d224e1b8",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Outbound Q4 LatAm",
  "description": "Meetings for Fintech ICP",
  "status": "draft",
  "icp_profile_id": "63b95f0e-7f67-45e9-9c5c-2d6edb7f1cfa",
  "lead_magnet_id": "a2c8754e-1be3-473c-93c6-33584d0b35fa",
  "availability_data": {
    "start_working": "09:00",
    "end_working": "17:00",
    "weekend_work": false,
    "calendar_id": "primary"
  },
  "publish_posts": true,
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T12:00:00Z"
}
```

---

## List Campaigns

```
GET /campaigns/
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by `draft`, `active`, `paused`, `archived` |
| `icp_profile_id` | UUID | Filter by ICP profile |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/campaigns/?status=active" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

```json
[
  {
    "id": "ea765b3d-1378-4da9-b374-5022d224e1b8",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Outbound Q4 LatAm",
    "status": "active",
    "availability_data": {
      "start_working": "09:00",
      "end_working": "17:00",
      "weekend_work": false,
      "calendar_id": "primary"
    },
    "publish_posts": true,
    "created_at": "2024-10-06T12:00:00Z",
    "updated_at": "2024-10-10T09:45:00Z"
  }
]
```

---

## Get Campaign by ID

```
GET /campaigns/{campaign_id}
```

| Path Parameter | Type | Description |
|----------------|------|-------------|
| `campaign_id` | UUID | Campaign identifier |

### Example

```bash
curl -X GET "https://api.sdragent.com/campaigns/ea765b3d-1378-4da9-b374-5022d224e1b8" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

---

## Update Campaign

```
PUT /campaigns/{campaign_id}
```

| Path Parameter | Type | Description |
|----------------|------|-------------|
| `campaign_id` | UUID | Campaign identifier |

### Request Body

Send only fields to update.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Campaign name |
| `description` | string | Campaign description |
| `status` | string | `draft`, `active`, `paused`, `archived` |
| `target_meeting_type` | string | Meeting type label |
| `review_required_default` | string | `human_review` or `auto` |
| `seller_name` | string | Seller name |
| `service_id` | UUID | Service identifier |
| `icp_profile_id` | UUID | ICP profile |
| `availability_data` | object | Availability block (same shape as create) |
| `publish_posts` | boolean | Whether to publish LinkedIn comments |

### Example Request

```bash
curl -X PUT "https://api.sdragent.com/campaigns/ea765b3d-1378-4da9-b374-5022d224e1b8" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "target_meeting_type": "Intro call",
    "publish_posts": false
  }'
```

---

## Delete Campaign

```
DELETE /campaigns/{campaign_id}
```

| Path Parameter | Type | Description |
|----------------|------|-------------|
| `campaign_id` | UUID | Campaign identifier |

### Example Request

```bash
curl -X DELETE "https://api.sdragent.com/campaigns/ea765b3d-1378-4da9-b374-5022d224e1b8" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

```json
{
  "message": "Campaign ea765b3d-1378-4da9-b374-5022d224e1b8 eliminada"
}
```

---

## Notes

- `org_id` is injected by Supabase RLS; you only manage your organization's data.
- If you send `provider_account_id`, the API validates that the provider accounts belong to your org and match the expected channel.
- If `lead_magnet` is provided, it is created first; campaign creation fails atomically if subsequent steps fail.
