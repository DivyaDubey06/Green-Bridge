# GreenBridge Dehradun Synthetic Dataset

**2,683 fictional records across 10 collections.** All names, contacts, registrations, events, donations, products and transactions are simulated. No record represents a real person, NGO, payment or verified registration.

## Collections
- `ngos`: 80 records
- `users`: 400 records
- `opportunities`: 240 records
- `applications`: 500 records
- `events`: 150 records
- `event_registrations`: 250 records
- `donations`: 400 records
- `eco_products`: 120 records
- `orders`: 180 records
- `order_items`: 363 records

Each collection has both JSON (array of documents) and CSV versions.

## MongoDB import
Suggested development database: `greenbridge_db`.

In MongoDB Compass, create/select the database, create each collection, then choose **Add Data → Import File** and import the matching JSON file (JSON array) or CSV file.

Example with MongoDB Database Tools:
`mongoimport --uri "<YOUR_MONGODB_URI>" --db greenbridge_db --collection ngos --file ngos.json --jsonArray`

Never paste a database URI or password into a public repo or presentation.

## Relationships
- opportunities.ngo_id → ngos.ngo_id
- applications.opportunity_id → opportunities.opportunity_id
- applications.user_id → users.user_id
- applications.ngo_id → ngos.ngo_id
- events.ngo_id → ngos.ngo_id
- event_registrations.event_id → events.event_id
- event_registrations.user_id → users.user_id
- donations.donor_user_id → users.user_id
- donations.ngo_id → ngos.ngo_id
- orders.user_id → users.user_id
- order_items.order_id → orders.order_id
- order_items.product_id → eco_products.product_id

## Integration warning
This is a tailored demo seed, not guaranteed to match the existing GreenBridge Prisma schema. Before importing into the application database, compare field names, model names, collection mappings and required fields with `backend/prisma/schema.prisma`. Test in a separate development database and do not overwrite existing data. MongoDB will generate `_id` values on import; the string IDs above are stable demo relationship keys.

## Suggested indexes
Create indexes on IDs and common filter fields: `ngo_id`, `verification_status`, `focus_area`, `category`, `status`, `city`, `start_date`, `event_date`, `user_id`, `opportunity_id`, `payment_status`, `product_id`, `order_id`.

## Teacher explanation
"We generated a clearly labelled synthetic Dehradun dataset because available public datasets did not contain the connected records required by our modules. It includes NGOs, volunteers, opportunities, applications, events, donations, EcoCart products and orders. We use it to test database operations, filtering, dashboards and recommendation logic. These are simulated records, not actual verified NGOs or real financial transactions."

Dates, amounts, statuses, capacities and relationships are simulated for software testing and demonstration, not statistical or real-world claims.
