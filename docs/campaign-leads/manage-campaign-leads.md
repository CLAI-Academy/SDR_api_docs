---
sidebar_position: 1
---

# Campaign Leads

Consult and update leads generated inside campaigns.

## Get Lead by ID

```
GET /campaign-leads/{lead_id}
```

| Path Parameter | Type | Description |
|----------------|------|-------------|
| `lead_id` | UUID | Lead identifier |

### Example

```bash
curl -X GET "https://api.sdragent.com/campaign-leads/5f8b38b2-5f0c-4e9f-bb6a-0e6a2e8de28f" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

### Example Response

```json
{
  "id": "5f8b38b2-5f0c-4e9f-bb6a-0e6a2e8de28f",
  "campaign_id": "ea765b3d-1378-4da9-b374-5022d224e1b8",
  "contact_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "lead_status": "pending",
  "lead_score": null,
  "lead_phase": null,
  "is_contact": null,
  "current_lead_step_id": null,
  "created_at": "2024-10-06T12:05:00Z",
  "updated_at": "2024-10-06T12:05:00Z"
}
```

---

## List Leads

```
GET /campaign-leads/
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `campaign_id` | UUID | Filter by campaign |
| `status` | string | Filter by `pending`, `in_progress`, `ended`, `paused` |
| `contact_id` | UUID | Filter by contact |

### Example Request

```bash
curl -X GET "https://api.sdragent.com/campaign-leads/?campaign_id=ea765b3d-1378-4da9-b374-5022d224e1b8&status=pending" \
  -H "X-API-Key: sk_live_1234567890abcdef"
```

---

## Notes

- `org_id` is enforced by Supabase RLS; results are scoped to your organization.
- Use `campaign_id` filter to restrict results to a specific campaign for reporting dashboards.
