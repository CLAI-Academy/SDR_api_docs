---
sidebar_position: 2
---

# Retrieve Integration Credentials

Retrieve stored credentials for external CRM integrations by provider name or ID.

## Get Credentials by Provider

Retrieve credentials for a specific CRM provider.

### HTTP Request

```
GET /integration-credentials/provider/{provider}
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |

*Either `X-API-Key` or `Authorization` is required.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `provider` | string | CRM provider name (e.g., "salesforce", "hubspot") |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/integration-credentials/provider/salesforce" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "id": "8e1f9722-9637-62fg-d059-g29he3h12cg9",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "provider": "salesforce",
  "dsn": "https://mycompany.salesforce.com",
  "access_token": "00D5g000001234567!AQYAQ...",
  "metadata": {
    "instance_url": "https://mycompany.salesforce.com",
    "api_version": "v58.0",
    "refresh_token": "5Aep861...",
    "token_type": "Bearer"
  },
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T12:00:00Z"
}
```

### Error Responses

#### 404 Not Found
Credentials for the specified provider do not exist.

```json
{
  "detail": "Integration credentials for provider 'salesforce' not found"
}
```

---

## Get Credentials by ID

Retrieve credentials by their unique identifier.

### HTTP Request

```
GET /integration-credentials/{credentials_id}
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentials_id` | UUID | Unique identifier of the credentials |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/integration-credentials/8e1f9722-9637-62fg-d059-g29he3h12cg9" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

Same response format as "Get by Provider" endpoint.

---

## List All Credentials

Retrieve all stored integration credentials for your organization.

### HTTP Request

```
GET /integration-credentials/
```

### Example Request

```bash
curl -X GET "https://api.sdragent.com/integration-credentials/" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
[
  {
    "id": "8e1f9722-9637-62fg-d059-g29he3h12cg9",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "provider": "salesforce",
    "dsn": "https://mycompany.salesforce.com",
    "access_token": "00D5g000001234567!AQYAQ...",
    "metadata": {
      "instance_url": "https://mycompany.salesforce.com",
      "api_version": "v58.0"
    },
    "created_at": "2024-10-06T12:00:00Z",
    "updated_at": "2024-10-06T12:00:00Z"
  },
  {
    "id": "9f2g0833-0748-73gh-e16a-h30if4i23dh0",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "provider": "hubspot",
    "dsn": "https://api.hubapi.com",
    "access_token": "pat-na1-1234567890abcdef",
    "metadata": {
      "portal_id": "12345678",
      "scopes": ["contacts", "companies"]
    },
    "created_at": "2024-10-05T10:00:00Z",
    "updated_at": "2024-10-05T10:00:00Z"
  }
]
```

---

## Delete Credentials

Permanently delete integration credentials.

### HTTP Request

```
DELETE /integration-credentials/{credentials_id}
```

### Example Request

```bash
curl -X DELETE "https://api.sdragent.com/integration-credentials/8e1f9722-9637-62fg-d059-g29he3h12cg9" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "message": "Integration credentials 8e1f9722-9637-62fg-d059-g29he3h12cg9 deleted successfully"
}
```

---

## Common Error Responses

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

### 403 Forbidden
Credentials belong to a different organization.

```json
{
  "detail": "You do not have permission to access this resource"
}
```

---

## Use Cases

### CRM Sync Workflow

1. **Retrieve credentials** for your CRM provider
2. **Use access token** to authenticate with external CRM API
3. **Fetch contacts** from CRM
4. **Transform data** to SDR Agent format
5. **Bulk upload** contacts via `/contacts/bulk`

### Example Integration Script

```python
import requests

# 1. Get Salesforce credentials
api_key = "sk_live_1234567890abcdef"
response = requests.get(
    "https://api.sdragent.com/integration-credentials/provider/salesforce",
    headers={"X-API-Key": api_key}
)
creds = response.json()

# 2. Use credentials to fetch Salesforce leads
salesforce_token = creds["access_token"]
instance_url = creds["metadata"]["instance_url"]

sf_response = requests.get(
    f"{instance_url}/services/data/v58.0/query",
    params={"q": "SELECT Name, Email, Company FROM Lead WHERE IsConverted = false"},
    headers={"Authorization": f"Bearer {salesforce_token}"}
)
leads = sf_response.json()["records"]

# 3. Transform to SDR Agent format
contacts = [
    {
        "full_name": lead["Name"],
        "email": lead["Email"],
        "company": lead["Company"],
        "linkedin_profile": f"https://linkedin.com/in/{lead['Email'].split('@')[0]}"
    }
    for lead in leads
]

# 4. Bulk upload to SDR Agent
requests.post(
    "https://api.sdragent.com/contacts/bulk",
    headers={"X-API-Key": api_key, "Content-Type": "application/json"},
    json=contacts
)
```

---

## Security Notes

- **Access tokens** are returned in API responses - handle securely
- **Do not log tokens** or expose them in client-side code
- **Refresh tokens** regularly to maintain integration security
- **Monitor usage** to detect unauthorized access

---

## Next Steps

- [Store new credentials](/docs/integration-credentials/store-credentials)
- [Create an import](/docs/imports/create-import)
- [Bulk upload contacts](/docs/contacts/bulk-upload)
