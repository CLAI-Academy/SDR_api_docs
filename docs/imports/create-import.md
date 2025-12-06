---
sidebar_position: 1
---

# Create Import

Create an import cohort to group contacts from external sources. Imports are used to organize contacts for campaign management.

## HTTP Request

```
POST /imports/
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | Must be `application/json` |

*Either `X-API-Key` or `Authorization` is required.

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | Yes | Source of the import (e.g., "salesforce", "hubspot", "csv_upload") |
| `file_name` | string | No | Original filename if uploaded from file |
| `campaign_id` | UUID | No | Link import to a specific campaign |
| `status` | string | No | Import status: "pending", "processing", "completed", "failed" (default: "pending") |
| `total_rows` | integer | No | Expected number of contacts (default: 0) |

## Response

Returns the created import object with generated `id`.

**Status Code:** `201 Created`

## Example Request

```bash
curl -X POST "https://api.sdragent.com/imports/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "salesforce",
    "file_name": "salesforce_leads_q4_2024.csv",
    "status": "pending",
    "total_rows": 500
  }'
```

## Example Response

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "campaign_id": null,
  "source": "salesforce",
  "file_name": "salesforce_leads_q4_2024.csv",
  "status": "pending",
  "total_rows": 500,
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T12:00:00Z"
}
```

## Example with Campaign

```bash
curl -X POST "https://api.sdragent.com/imports/" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "hubspot",
    "campaign_id": "8d0f7780-8536-51ef-c948-f18gd2g01bf8",
    "status": "pending"
  }'
```

## Status Values

| Status | Description |
|--------|-------------|
| `pending` | Import created, waiting for contacts to be uploaded |
| `processing` | Contacts are being imported/enriched |
| `completed` | All contacts successfully imported and processed |
| `failed` | Import failed due to errors |

## Source Examples

Common source identifiers:
- `salesforce` - Salesforce CRM
- `hubspot` - HubSpot CRM
- `pipedrive` - Pipedrive CRM
- `csv_upload` - Manual CSV upload
- `api_integration` - Custom API integration
- `webhook` - Incoming webhook data

## Error Responses

### 400 Bad Request
Invalid request body or missing required fields.

```json
{
  "detail": "Validation error: source field is required"
}
```

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

## Notes

- **Auto org_id**: Organization ID is automatically added by the authentication layer
- **Campaign linking**: Imports can be linked to campaigns for lead generation workflows
- **Status tracking**: Update status as import progresses through workflow stages

## Next Steps

- [Bulk upload contacts with import ID](/docs/contacts/bulk-upload)
- [List imports](#list-imports)

---

## List Imports

Retrieve all imports belonging to your organization, with optional filtering.

### HTTP Request

```
GET /imports/
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: "pending", "processing", "completed", "failed" |
| `campaign_id` | UUID | Filter by campaign ID |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/imports/?status=completed" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
[
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "campaign_id": null,
    "source": "salesforce",
    "file_name": "salesforce_leads_q4_2024.csv",
    "status": "completed",
    "total_rows": 500,
    "created_at": "2024-10-06T12:00:00Z",
    "updated_at": "2024-10-06T15:30:00Z"
  }
]
```

---

## Get Import by ID

Retrieve a specific import and its metadata.

### HTTP Request

```
GET /imports/{import_id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `import_id` | UUID | Import identifier |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/imports/7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "campaign_id": null,
  "source": "salesforce",
  "file_name": "salesforce_leads_q4_2024.csv",
  "status": "completed",
  "total_rows": 500,
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T15:30:00Z"
}
```

---

## Update Import

Update import metadata or status (hard updates on the import row).

### HTTP Request

```
PUT /imports/{import_id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `import_id` | UUID | Import identifier |

### Request Body

Only provided fields are updated.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `campaign_id` | UUID | No | Link/unlink import to a campaign |
| `source` | string | No | Source label (normalized) |
| `file_name` | string | No | Original filename |
| `status` | string | No | `pending`, `processing`, `completed`, `failed` |
| `total_rows` | integer | No | Expected total rows |

### Example Request

```bash
curl -X PUT "https://api.sdragent.com/imports/7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
    "total_rows": 1250
  }'
```

### Example Response

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "campaign_id": null,
  "source": "salesforce",
  "file_name": "salesforce_leads_q4_2024.csv",
  "status": "processing",
  "total_rows": 1250,
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T13:15:00Z"
}
```

---

## Delete Import

Permanently delete an import record.

### HTTP Request

```
DELETE /imports/{import_id}
```

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `import_id` | UUID | Import identifier |

### Example Request

```bash
curl -X DELETE "https://api.sdragent.com/imports/7c9e6679-7425-40de-944b-e07fc1f90ae7" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

```json
{
  "message": "Import 7c9e6679-7425-40de-944b-e07fc1f90ae7 eliminado"
}
```
