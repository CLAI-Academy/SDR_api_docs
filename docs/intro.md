---
sidebar_position: 1
---

# SDR Agent API Documentation

Welcome to the **SDR Agent API** documentation. This API enables seamless integration between the SDR Agent platform and external CRM systems.

## Overview

The SDR Agent API Middleware is a FastAPI-based service that provides:

- **Multi-tenant architecture** with organization-level data isolation
- **Contact management** with bulk upload capabilities
- **Import cohorts** for grouping contact data
- **Campaign orchestration** with lead magnets and provider accounts
- **Lead management** inside campaigns

## Base URL

```
https://your-api-domain.com
```

## Key Features

### Contact Management
Create, read, update, and delete contacts with automatic company creation and LinkedIn profile normalization.

### Bulk Operations
Import hundreds or thousands of contacts via CSV or JSON with a single API call.

## Organization Isolation

All data is automatically scoped to your organization (`org_id`). You can only access and modify data belonging to your organization.

## Getting Started

1. Create a contact or bulk upload contacts
2. Create an import to group contacts
3. Create and link campaigns to imports

## API Endpoints

### Contacts
- `POST /contacts/` - Create single contact
- `POST /contacts/bulk` - Bulk upload contacts
- `GET /contacts/` - List all contacts
- `GET /contacts/{id}` - Get specific contact
- `PUT /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact

### Imports
- `POST /imports/` - Create import cohort
- `GET /imports/` - List imports
- `GET /imports/{id}` - Get import by ID
- `PUT /imports/{id}` - Update import metadata/status
- `DELETE /imports/{id}` - Delete import

### Campaigns
- `POST /campaigns/` - Create campaign (availability, lead magnet, provider accounts)
- `GET /campaigns/` - List campaigns
- `GET /campaigns/{id}` - Get campaign by ID
- `PUT /campaigns/{id}` - Update campaign
- `DELETE /campaigns/{id}` - Delete campaign

### Campaign Imports
- `POST /campaign-imports/{campaign_id}/imports` - Link imports to a campaign and create leads

### Campaign Leads
- `GET /campaign-leads/` - List leads with filters
- `GET /campaign-leads/{id}` - Get lead by ID

## Need Help?

- Check the detailed [API Reference](/docs/contacts/create-contact) for each endpoint
- Contact support for integration assistance
