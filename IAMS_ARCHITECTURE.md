# Internal Agency Management System (IAMS) - Architecture & Implementation Plan

## 1. System Context & Overview

**Product:** Comprehensive Internal Agency Management System (IAMS)  
**Role:** Unified platform for agency operations, client management, projects, and financials.  
**Core Philosophy:** Single Source of Truth + Role-Based Access Control + Payment-Driven Logic.

The system will be integrated into the existing "Nashied Digital Boutique" web infrastructure but will largely operate as a Single Page Application (SPA) dashboard behind a secure authentication wall.

## 2. System Architecture

### 2.1 Technology Stack

*   **Frontend:** React (Vite) + Tailwind CSS (shadcn/ui for components).
*   **State Management:** TanStack Query (React Query) for server state, Zustand for global UI state.
*   **Backend / Database:** Supabase (PostgreSQL) is recommended for rapid development of a scalable, secure, and relational system without managing a separate backend server initially. It provides Auth, DB, and Realtime subscriptions out of the box.
    *   *Alternative:* Node.js (Express/NestJS) + PostgreSQL if self-hosting requirements are strict. *Assumption: We will proceed with Supabase for this design to ensure "Build-ready" speed and security.*
*   **Authentication:** Supabase Auth (Email/Password, Magic Link, Google OAuth).
*   **Storage:** Supabase Storage (for documents, invoices, branding assets).

### 2.2 Functional Modules

1.  **Public Site** (Existing): Marketing & Lead Gen.
2.  **Auth Layer**: Gatekeeper for IAMS.
3.  **Core App (Protected Routes)**:
    *   **Admin Dashboard**: Global view.
    *   **Taskmaster**: Kanban/List interactions.
    *   **CRM**: Client data.
    *   **Projects**: Timelines & Deliverables.
    *   **Finance**: Invoicing & Payments.
    *   **Hosting**: Service status & WHMCS-like logic.
    *   **Client Portal**: Restricted view for clients.

## 3. Database Schema (Relational)

### 3.1 Users & Roles (RBAC)
*   **`profiles`**
    *   `id` (UUID, PK, FK to auth.users)
    *   `full_name` (Text)
    *   `avatar_url` (Text)
    *   `role` (Enum: 'super_admin', 'admin', 'finance', 'pm', 'creative', 'client')
    *   `email` (Text)
    *   `created_at`

### 3.2 Clients & CRM
*   **`clients`**
    *   `id` (UUID, PK)
    *   `company_name` (Text)
    *   `primary_user_id` (UUID, FK to profiles)
    *   `status` (Enum: 'active', 'lead', 'archived')
    *   `currency` (Text, default 'USD')

*   **`client_contacts`** (Many-to-Many profiles <-> clients)
    *   `client_id` (FK)
    *   `profile_id` (FK)

### 3.3 Projects & Tasks
*   **`projects`**
    *   `id` (UUID, PK)
    *   `client_id` (FK)
    *   `name` (Text)
    *   `type` (Enum: 'web_dev', 'design', 'marketing', 'consulting')
    *   `status` (Enum: 'quoted', 'active', 'on_hold', 'completed')
    *   `start_date` (Date)
    *   `end_date` (Date)
    *   `budget` (Numeric)

*   **`tasks`**
    *   `id` (UUID, PK)
    *   `project_id` (FK, nullable - tasks can be operational)
    *   `title` (Text)
    *   `description` (Text)
    *   `assigned_to` (UUID, FK to profiles)
    *   `status` (Enum: 'pending', 'in_progress', 'review', 'done')
    *   `priority` (Enum: 'low', 'medium', 'high', 'urgent')
    *   `due_date` (Timestamp)
    *   `recurrence_rule` (Text, optional Cron or RRule)

### 3.4 Finance (The Backbone)
*   **`invoices`**
    *   `id` (UUID, PK)
    *   `client_id` (FK)
    *   `project_id` (FK, nullable)
    *   `total_amount` (Numeric)
    *   `status` (Enum: 'draft', 'sent', 'paid', 'overdue')
    *   `due_date` (Date)
    *   `issued_date` (Date)

*   **`invoice_items`**
    *   Line items for invoices.

*   **`payments`**
    *   `id` (UUID, PK)
    *   `invoice_id` (FK)
    *   `amount` (Numeric)
    *   `method` (Enum: 'stripe', 'bank_transfer', 'cash')
    *   `date_recorded` (Timestamp)

### 3.5 Hosting & Services (WHMCS-Lite)
*   **`services`**
    *   `id` (UUID, PK)
    *   `client_id` (FK)
    *   `name` (Text, e.g., "Standard Hosting")
    *   `type` (Enum: 'hosting', 'domain', 'email', 'maintenance')
    *   `renewal_price` (Numeric)
    *   `cycle` (Enum: 'monthly', 'yearly')
    *   `next_due_date` (Date)
    *   `status` (Enum: 'active', 'suspended', 'cancelled')

### 3.6 Documents
*   **`documents`**
    *   `id` (UUID, PK)
    *   `client_id` (FK)
    *   `project_id` (FK)
    *   `name` (Text)
    *   `url` (valid Supabase Storage URL or GDrive Link)
    *   `access_level` (Enum: 'internal', 'client_view', 'public')

## 4. API & Data Access Strategy (RLS)

We will use **Row Level Security (RLS)** in PostgreSQL to enforce roles. This is critical.

*   **Super Admin**: `true` for all policies.
*   **Client**:
    *   Can `SELECT` from `projects` where `client_id` matches their organization.
    *   Can `SELECT` from `invoices` where `client_id` matches.
    *   Cannot see `tasks` unless flagged `client_visible`.
    *   Cannot see `internal_notes`.
*   **Creative/Dev**:
    *   Can `SELECT`/`UPDATE` `tasks` assigned to them or in their projects.
    *   Cannot see `invoices` or `payments`.

## 5. Implementation Phases

### Phase 1: Core Operations (The Engine)
*   Detailed DB Schema setup (Supabase migration scripts).
*   Auth Implementation (Login page, Protect Routes wrapper).
*   **Taskmaster Module**:
    *   Dashboard for employees.
    *   Create/Edit/Move tasks.
    *   User Profile management.

### Phase 2: Client Intelligence & Projects
*   **CRM Module**:
    *   Add Clients.
    *   Client Detail View.
*   **Projects Module**:
    *   Link tasks to projects.
    *   Project progress tracking.

### Phase 3: Money & Clients (The Business)
*   **Accounting Module**:
    *   Invoice generation.
    *   Payment recording (manual entry initially).
*   **Client Portal**:
    *   Client-specific dashboard.
    *   View Invoices/Projects.

### Phase 4: Automation (The Scale)
*   **Hosting Module**:
    *   Automated expiry notifications.
*   **Documents**:
    *   File upload and categorized listing.

## 6. Assumptions & Decisions

1.  **Single Repo**: We will keep the management system in the same repo but efficiently split code bundles using lazy loading for the dashboard routes to avoid bloating the landing page.
2.  **No "Draft" Logic for Projects**: Projects are either Active or not. Complex quoting happens in the "Accounting" stage (Quotes) before a project is created.
3.  **Manual Payments first**: We will not integrate Stripe/PayPal API immediately in Phase 1. Payments are creating manually by Finance role after checking bank feeds. (Phase 3 can automate this).
4.  **Supabase**: Chosen for speed and built-in Auth/DB/Realtime.

---
*Ready for implementation.*
