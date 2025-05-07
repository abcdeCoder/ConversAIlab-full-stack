-- Create notes table with ownership and timestamps
create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);
