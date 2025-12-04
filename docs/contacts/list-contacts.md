---
sidebar_position: 3
---

# List Contacts

Retrieve all contacts belonging to your organization.

## HTTP Request

```
GET /contacts/
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes* | API key for authentication |
| `Authorization` | Yes* | Bearer JWT token (alternative to API key) |

*Either `X-API-Key` or `Authorization` is required.

## Response

Returns an array of contact objects.

**Status Code:** `200 OK`

## Example Request

```bash
curl -X GET "https://api.sdragent.com/contacts/" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

## Example Response

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "linkedin_profile": "https://www.linkedin.com/in/johndoe",
    "company": "Tech Corp",
    "locale": "en-US",
    "timezone": "America/New_York",
    "enrichment": {
      "source": "website",
      "campaign": "Q1-2024"
    },
    "created_at": "2024-10-06T12:00:00Z",
    "updated_at": "2024-10-06T12:00:00Z"
  },
  {
    "id": "660f9511-f3ac-52e5-b827-557766551111",
    "org_id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "Jane Smith",
    "email": "jane.smith@techcorp.com",
    "linkedin_profile": "https://www.linkedin.com/in/janesmith",
    "company": "Tech Corp",
    "locale": "en-US",
    "timezone": "America/New_York",
    "enrichment": null,
    "created_at": "2024-10-05T10:30:00Z",
    "updated_at": "2024-10-05T10:30:00Z"
  }
]
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique contact identifier |
| `org_id` | UUID | Organization identifier |
| `full_name` | string | Contact's full name |
| `email` | string | Email address |
| `linkedin_profile` | string | LinkedIn profile URL |
| `company` | string | Company name |
| `locale` | string | Language/locale preference |
| `timezone` | string | Timezone |
| `enrichment` | object | Additional metadata and enrichment data |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last update timestamp |

## Organization Isolation

Results are automatically filtered to include only contacts belonging to your organization. You cannot see contacts from other organizations.

## Error Responses

### 401 Unauthorized
Missing or invalid authentication.

```json
{
  "detail": "Invalid or missing authentication credentials"
}
```

## Notes

- **Automatic filtering**: Only contacts from your organization are returned
- **No pagination**: All contacts are returned in a single response
- **Sorted by creation**: Results typically ordered by `created_at` descending

## Next Steps

- [Get specific contact](/docs/contacts/manage-contacts#get-contact-by-id)
- [Update a contact](/docs/contacts/manage-contacts#update-contact)
- [Delete a contact](/docs/contacts/manage-contacts#delete-contact)
