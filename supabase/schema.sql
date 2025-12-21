-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Linked to Auth)
do $$ begin
  create type user_role as enum ('super_admin', 'admin', 'finance', 'pm', 'creative', 'client');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role user_role default 'client'::user_role,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- CLIENTS
create table if not exists public.clients (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  customer_type text check (customer_type in ('Business', 'Individual')) default 'Business',
  salutation text,
  first_name text,
  last_name text,
  email text,
  phone_work text,
  phone_mobile text,
  currency text default 'USD',
  tax_rate text,
  company_id text,
  display_name text,
  customer_language text default 'English',
  payment_terms text default 'Due on Receipt',
  address_billing jsonb,
  address_shipping jsonb,
  billing_phone text,
  billing_fax text,
  website text,
  notes text,
  opening_balance numeric default 0,
  credit_limit numeric default 0,
  portal_enabled boolean default false,
  bank_account_details jsonb,
  primary_user_id uuid references public.profiles(id),
  status text check (status in ('active', 'lead', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- PROJECTS
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) not null,
  name text not null,
  description text,
  type text not null,
  status text check (status in ('Draft', 'Active', 'In Review', 'Completed', 'On Hold', 'Cancelled')) default 'Draft',
  start_date date,
  end_date date,
  invoice_amount numeric default 0,
  deposit_amount numeric default 0,
  assigned_to uuid references public.profiles(id),
  folder_link text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TASKS
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id),
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id),
  status text default 'pending',
  priority text default 'medium',
  due_date timestamp with time zone,
  task_category text check (task_category in ('one-off', 'monthly', 'potential')) default 'one-off',
  timer_state text check (timer_state in ('stopped', 'running', 'paused')) default 'stopped',
  revision_count integer default 0,
  total_active_seconds bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- INVOICES
create table if not exists public.invoices (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) not null,
  project_id uuid references public.projects(id),
  invoice_number text unique,
  status text check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')) default 'draft',
  currency text default 'USD',
  subtotal numeric default 0,
  tax_total numeric default 0,
  discount_total numeric default 0,
  total_amount numeric default 0,
  amount_paid numeric default 0,
  due_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- QUOTES
create table if not exists public.quotes (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.clients(id) not null,
  project_id uuid references public.projects(id),
  quote_number text unique,
  status text check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')) default 'draft',
  currency text default 'USD',
  total_amount numeric default 0,
  expiry_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- VENDORS
create table if not exists public.vendors (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  contact_name text,
  email text,
  phone text,
  category text, -- e.g. Hosting, Software, Office
  status text check (status in ('active', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- BILLS (Purchases)
create table if not exists public.bills (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references public.vendors(id) not null,
  bill_number text,
  status text check (status in ('draft', 'pending', 'paid', 'overdue', 'cancelled')) default 'pending',
  currency text default 'USD',
  total_amount numeric default 0,
  amount_paid numeric default 0,
  due_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- EXPENSES (Direct spend)
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  category text,
  amount numeric default 0,
  currency text default 'USD',
  date date default current_date,
  description text,
  paid_via text,
  receipt_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- SERVICES (Hosting, Maintenance etc)
create table if not exists public.services (
    id uuid default uuid_generate_v4() primary key,
    client_id uuid references public.clients(id),
    name text not null,
    type text default 'hosting',
    renewal_price numeric default 0,
    cycle text default 'monthly',
    next_due_date date,
    status text default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- DOCUMENTS (Repository)
create table if not exists public.documents (
    id uuid default uuid_generate_v4() primary key,
    client_id uuid references public.clients(id),
    project_id uuid references public.projects(id),
    name text not null,
    url text not null,
    access_level text default 'internal',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on all
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.invoices enable row level security;
-- EMPLOYEES (Payroll Master)
create table if not exists public.employees (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) unique,
  employee_number text unique,
  job_title text,
  department text,
  basic_salary numeric default 0,
  allowances numeric default 0,
  tax_id text,
  nssa_number text,
  bank_name text,
  bank_account text,
  status text check (status in ('active', 'on_leave', 'terminated')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- PAYROLL RUNS (Monthly Batches)
create table if not exists public.payroll_runs (
  id uuid default uuid_generate_v4() primary key,
  month text not null, -- e.g. "January"
  year integer not null,
  status text check (status in ('draft', 'processed', 'paid')) default 'draft',
  total_gross numeric default 0,
  total_net numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- PAYSLIPS (Individual Employee Records)
create table if not exists public.payslips (
  id uuid default uuid_generate_v4() primary key,
  run_id uuid references public.payroll_runs(id) on delete cascade,
  employee_id uuid references public.employees(id),
  gross_pay numeric default 0,
  paye_tax numeric default 0,
  nssa_deduction numeric default 0,
  other_deductions numeric default 0,
  net_pay numeric default 0,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.employees enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payslips enable row level security;

-- Enable RLS on previous new tables too
alter table public.vendors enable row level security;
alter table public.bills enable row level security;
alter table public.expenses enable row level security;
alter table public.quotes enable row level security;

-- INVOICE ITEMS (Line items for the new template)
create table if not exists public.invoice_items (
  id uuid default uuid_generate_v4() primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric default 1,
  rate numeric default 0,
  amount numeric generated always as (quantity * rate) stored,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- REVIEWS (Production check)
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id),
  reviewer_id uuid references public.profiles(id),
  status text check (status in ('pending', 'approved', 'rejected')),
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.invoice_items enable row level security;
alter table public.reviews enable row level security;

-- Simple "All Authenticated" Policies for Phase 1 (Temporary)
create policy "Auth access clients" on public.clients for all using (auth.role() = 'authenticated');
create policy "Auth access projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Auth access tasks" on public.tasks for all using (auth.role() = 'authenticated');
create policy "Auth access invoices" on public.invoices for all using (auth.role() = 'authenticated');
create policy "Auth access services" on public.services for all using (auth.role() = 'authenticated');
create policy "Auth access documents" on public.documents for all using (auth.role() = 'authenticated');

-- Handle Profile Creation on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
