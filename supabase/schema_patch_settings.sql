
-- ORGANIZATION PROFILE (Global Settings)
create table if not exists public.organization_profile (
  id uuid default uuid_generate_v4() primary key,
  name text not null default 'Nashied Digital Boutique',
  legal_name text,
  tax_number text,
  reg_number text,
  email text,
  phone text,
  website text,
  address_street text,
  address_city text,
  address_country text default 'Zimbabwe',
  base_currency text default 'USD',
  fiscal_year_start text default 'January',
  logo_url text,
  invoice_prefix text default 'INV-',
  quote_prefix text default 'QT-',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.organization_profile enable row level security;
create policy "Auth access organization_profile" on public.organization_profile for all using (auth.role() = 'authenticated');

-- Insert default record if not exists
insert into public.organization_profile (id, name)
values ('00000000-0000-0000-0000-000000000000', 'Nashied Digital Boutique')
on conflict (id) do nothing;
