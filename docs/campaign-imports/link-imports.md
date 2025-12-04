---
sidebar_position: 1
---

# Link Imports to Campaign

Attach one or more import cohorts to a campaign and automatically create campaign leads.

## Link Imports

```
POST /campaign-imports/{campaign_id}/imports
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative) |
| `Content-Type` | Yes | `application/json` |

*Either `X-API-Key` or `Authorization` is required.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `campaign_id` | UUID | Campaign receiving the imports |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `import_ids` | UUID[] | Yes | List of imports to link (min 1) |

### Example Request

```bash
curl -X POST "https://api.sdragent.com/campaign-imports/ea765b3d-1378-4da9-b374-5022d224e1b8/imports" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "import_ids": [
      "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "8d0f7780-8536-51ef-c948-f18gd2g01bf8"
    ]
  }'
```

### Example Response

```json
{
  "campaign_id": "ea765b3d-1378-4da9-b374-5022d224e1b8",
  "linked_imports": 2,
  "considered_contacts": 420,
  "excluded_contacts": 12,
  "inserted_leads": 408
}
```

## What the endpoint does

1. Validates imports belong to the same org and checks provider account conflicts for the campaign.
2. Filters out conflicting/duplicate contacts before lead creation.
3. Creates `campaign_leads` for valid contacts and links imports to the campaign.
4. Triggers the enrichment batch for the new leads.

### Error cases

- `400` if `import_ids` is empty.
- `404/403` if imports do not belong to the organization.
- `500` if the preparation or lead creation RPC fails.
