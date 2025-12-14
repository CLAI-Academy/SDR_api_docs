---
sidebar_position: 4
---

# Manage Contacts

Get, update, and delete individual contacts by ID.

## Get Contact by ID

Retrieve a specific contact by its unique identifier, including its activity timeline. Activities are automatically filtered by campaign and paginated.

### HTTP Request

```
GET /contacts/{contact_id}
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
| `contact_id` | UUID | Unique identifier of the contact |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `campaign_id` | UUID or "all" | - | Filter activities by campaign. Use UUID for specific campaign, "all" or omit for active campaigns |
| `page` | integer | 0 | Page number for pagination (0-based) |
| `limit` | integer | 50 | Number of activities per page (1-200) |

### Activity Filtering Behavior

The API applies intelligent campaign filtering:
- **Specific campaign** (`campaign_id=<uuid>`): Returns only activities from that campaign
- **All campaigns** (`campaign_id=all` or omitted): Filters by active campaigns (`status = 'active'`)
- **No active campaigns**: If no active campaigns exist, returns all contact activities without campaign filter

Activities are returned in **ascending order** by `event_time`.

### Example Request

```bash
curl -X GET "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000?campaign_id=all&page=0&limit=50" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "id": "b8d3d3a2-4c0d-4c1e-bc4b-5f6c12345678",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "linkedin_profile": "https://www.linkedin.com/in/janedoe",
  "company": "Tech Corp",
  "locale": null,
  "timezone": null,
  "account_id": null,
  "enrichment": null,
  "should_enrich_data": null,
  "created_at": "2024-04-09T10:22:33Z",
  "updated_at": "2024-04-09T10:22:33Z",
  "activities": [
    {
      "id": "act_123",
      "event_time": "2024-04-18T10:15:00Z",
      "channel": "linkedin",
      "event_type": "message_sent",
      "direction": "outbound",
      "sdr_agent_id": "usr_abc",
      "event_text": [{ "message": "Hola Jane, ¿comentamos?" }],
      "metadata": {
        "delivered": true,
        "opened": true,
        "clicked": false,
        "replied": false
      },
      "actor": "SDR"
    },
    {
      "id": "act_124",
      "event_time": "2024-04-18T11:02:00Z",
      "channel": "email",
      "event_type": "replied",
      "direction": "inbound",
      "event_text": { "message": "Hablemos mañana" },
      "metadata": {
        "delivered": true,
        "opened": true,
        "clicked": true,
        "replied": true
      },
      "actor": "Humano"
    }
  ]
}
```

### Activity Object Fields

Each activity in the timeline includes:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique activity identifier |
| `event_time` | ISO 8601 | Timestamp of the event |
| `channel` | string | Communication channel (email, linkedin, or "sistema" as fallback) |
| `event_type` | string | Type of event (message_sent, replied, etc.) |
| `direction` | string | "outbound" or "inbound" (fallback: "outbound") |
| `sdr_agent_id` | string | ID of the SDR agent (if applicable) |
| `event_text` | object/array | Event content/message |
| `metadata` | object | Includes delivery flags and original metadata |
| `actor` | string | "SDR" for outbound, "Humano" for inbound |

### Actor Calculation

The `actor` field is automatically calculated:
- **"SDR"**: When `direction` is "outbound"
- **"Humano"**: When `direction` is "inbound"

### Using in Postman

1. Create a new `GET` request
2. URL: `{{baseUrl}}/contacts/{{contact_id}}?campaign_id=all&page=0&limit=50`
3. Headers:
   - `X-API-Key: {{apiKey}}` OR
   - `Authorization: Bearer {{jwt}}`
4. Send the request

**Note**: If using a specific `campaign_id` UUID, ensure it belongs to your organization, otherwise the activities list will be empty.

### Error Responses

#### 404 Not Found
Contact does not exist or does not belong to your organization.

```json
{
  "detail": "Contact not found"
}
```

---

## Update Contact

Update specific fields of an existing contact. Only provided fields will be updated.

### HTTP Request

```
PUT /contacts/{contact_id}
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |
| `Content-Type` | Yes | Must be `application/json` |

*Either `X-API-Key` or `Authorization` is required.

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `contact_id` | UUID | Unique identifier of the contact |

### Request Body

Partial contact object with fields to update. All fields are optional.

```json
{
  "locale": "es-ES",
  "timezone": "Europe/Madrid",
  "metadata": {
    "updated_source": "crm_sync"
  }
}
```

### Example Request

```bash
curl -X PUT "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: sk_live_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "locale": "es-ES",
    "timezone": "Europe/Madrid"
  }'
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "org_id": "123e4567-e89b-12d3-a456-426614174000",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "linkedin_profile": "https://www.linkedin.com/in/johndoe",
  "company": "Tech Corp",
  "locale": "es-ES",
  "timezone": "Europe/Madrid",
  "enrichment": {
    "source": "website",
    "campaign": "Q1-2024",
    "updated_source": "crm_sync"
  },
  "created_at": "2024-10-06T12:00:00Z",
  "updated_at": "2024-10-06T14:30:00Z"
}
```

### Updatable Fields

- `full_name` - Contact's full name
- `email` - Email address (must remain unique)
- `company` - Company name
- `locale` - Language preference
- `timezone` - Timezone
- `linkedin_profile` - LinkedIn URL
- `metadata` - Enrichment data (merged with existing data)

### Notes

- **Partial updates**: Only include fields you want to change
- **Automatic normalization**: Email, LinkedIn URLs are automatically sanitized
- **Metadata merging**: New metadata is merged with existing enrichment data

---

## Delete Contact

Permanently delete a contact from your organization.

### HTTP Request

```
DELETE /contacts/{contact_id}
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
| `contact_id` | UUID | Unique identifier of the contact |

### Example Request

```bash
curl -X DELETE "https://api.sdragent.com/contacts/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

**Status Code:** `200 OK`

```json
{
  "message": "Contacto 550e8400-e29b-41d4-a716-446655440000 eliminado"
}
```

### Error Responses

#### 404 Not Found
Contact does not exist or does not belong to your organization.

```json
{
  "detail": "Contact not found"
}
```

### Notes

- **Hard delete**: Contact is permanently removed from the database
- **Cascade behavior**: Related records may be affected (check campaign_leads)
- **Irreversible**: Cannot undo deletion

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
Contact belongs to a different organization.

```json
{
  "detail": "You do not have permission to access this resource"
}
```

## Next Steps

- [Create a contact](/docs/contacts/create-contact)
- [Bulk upload contacts](/docs/contacts/bulk-upload)
- [List all contacts](/docs/contacts/list-contacts)
