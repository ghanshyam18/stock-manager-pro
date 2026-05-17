# Build Quick Invoices Module

We want to introduce a new module called **Quick Invoices** inside our existing business system.

This module must be designed for:

- Extremely fast daily billing
- High business usability
- Clean and intuitive UX
- Premium invoice generation
- Minimal clicks
- High-volume business usage

This invoice system should be **general-purpose**, not tied to any one industry. It should work for:

- Garments
- Wholesale
- Retail
- Manufacturing
- Distribution
- Product-based businesses

This should **NOT** feel like a basic CRUD billing form.

This should feel like a **premium, production-grade invoicing workflow**.

---

# Core Product Goals

The system should allow users to create invoices in **under 15–20 seconds**.

Target workflow:

```text
Select Party → Add Products → Auto Calculate → Save → Share / Print
```

The user should never feel blocked during billing.

Billing speed is the highest priority.

---

# Invoice Header Fields

## Party Details

Support both:

### Existing Party

Allow:

- Search
- Autocomplete
- Fast selection

### New Party

Allow inline creation if not found.

Required fields:

- Party Name
- Address

Optional fields:

- Contact Number
- Tax ID / GST

---

## Invoice Date

Requirements:

- Default to today's date
- User can edit if needed

---

## Dispatched Through

Requirements:

Allow free text entry.

Also support previous values/history.

Examples:

- Transport
- Courier
- Self Pickup
- Delivery Staff

---

## Discount Percentage

Requirements:

Default:

```text
3%
```

Editable.

---

## Tax Percentage

Requirements:

Default:

```text
0%
```

Editable.

---

# Product Entry Section

This section supports **multiple invoice rows**.

---

# Product / Design Search Behavior

We already have an existing **Design/Product master table**.

The invoice module must integrate with that.

---

## Case 1 — Design exists in system

If the entered Design No exists:

Auto fetch and populate:

- Design Number
- Product details (if available)
- Thumbnail image (if available)
- Previous/default price (if available)

Autocomplete should feel instant.

---

## Case 2 — Design does NOT exist

If no design is found:

**Do not block billing.**

**Do not show validation errors.**

**Do not force master creation.**

**Do not show popup interruptions.**

Instead:

Allow the user to continue with the exact Design No they typed.

Example:

If user searches:

```text
4102A
```

and it does not exist—

Allow:

- Design No = 4102A
- Quantity = user input
- Price = user input

And continue billing normally.

This Design No must appear exactly as entered in:

- Invoice
- PDF
- Invoice history
- Reports

Billing must never stop because master data is missing.

---

# Invoice Item Fields

Each row must support:

- Product Thumbnail (if available)
- Design / Product Number
- Quantity
- Unit Price
- Row Total

Formula:

```text
Row Total = Quantity × Unit Price
```

Must calculate instantly.

---

# Invoice Calculations

Must auto calculate:

## Subtotal

Sum of all item totals.

---

## Discount Amount

Based on discount percentage.

---

## Tax Amount

Based on tax percentage.

---

## Grand Total

Formula:

```text
(Subtotal - Discount) + Tax
```

All calculations must update instantly.

---

# UX Requirements

This module must be optimized for speed.

---

## Desktop UX

Must support:

- Tab navigation
- Enter to move next field
- Arrow navigation
- Keyboard-first workflow

Fast users should create invoices without touching the mouse.

---

## Mobile UX

Must support:

- Large tap targets
- Sticky totals section
- Fast product search
- Easy quantity entry

---

# Save Flow

When user clicks **Save**:

Invoice should save instantly.

No blocking.

No heavy loading experience.

After save, immediately show:

- Share PDF
- Print Invoice
- Download PDF
- Create Next Invoice

User should never wait after clicking Save.

---

# PDF Requirements (Critical)

Invoice PDF must be generated using a **high-standard, world-class PDF rendering approach**.

Do NOT use low-quality browser print hacks.

PDF output must be:

- Pixel-perfect
- Consistent across all devices
- Professional A4 layout
- Stable typography
- Proper page breaks
- Sharp logo rendering
- Business-grade formatting

This PDF should be suitable for:

- Wholesalers
- Retailers
- Manufacturers
- Distributors
- Corporate clients

---

# PDF Layout

## Header

Must contain:

- Company Logo
- Business Name
- Address
- Contact Details
- Tax Details (if available)
- Invoice Title

---

## Party Section

Must contain:

- Party Name
- Address
- Contact
- Tax Details

---

## Product Table

Columns:

| Image | Product / Design | Qty | Rate | Total |

Rules:

- If thumbnail exists → show it
- If thumbnail does not exist → still render cleanly

---

## Footer

Must contain:

- Total Quantity
- Subtotal
- Discount
- Tax
- Grand Total
- Terms & Conditions
- Signature Area

---

# Additional Smart Features

Also support:

## Recent Parties

Quick access to recently billed parties.

---

## Recent Products

Quick access to recently billed designs/products.

---

## Duplicate Invoice

Allow quick repeat billing.

---

## Live Invoice Preview

Allow preview before sharing.

---

# Design Standards

This module should feel:

- Premium
- Minimal
- Fast
- Trustworthy
- Business-first
- Easy for non-technical staff

---

# Final Goal

Build this as a **real business workflow product**.

Do NOT build this like a basic billing CRUD screen.

The final experience should be **better than traditional ERP invoicing systems** and optimized for **high-volume daily billing workflows**.
