/*
# Create profiles table for user roles

1. Purpose
   This app connects grassroots youth sportspersons in India with coaches and scouts.
   Each user selects a role during registration: Athlete, Coach, or Scout/Academy.
   We need a profiles table linked to Supabase Auth to store the selected role
   and basic information about the user.

2. New Tables
   - `profiles`
     - `id` (uuid, primary key, references auth.users) — one row per auth user
     - `full_name` (text) — the person's full name
     - `role` (text) — one of: 'athlete', 'coach', 'scout'
     - `phone` (text, nullable) — optional phone number
     - `location` (text, nullable) — city/village/district
     - `created_at` (timestamptz) — when the profile was created
     - `updated_at` (timestamptz) — last modification time

3. Security
   - Enable RLS on `profiles`.
   - Each authenticated user can read and update only their own profile row.
   - Inserts are allowed for the row owner (the user creating their own profile).
   - Users cannot see or modify other users' profiles.

4. Notes
   - `id` defaults to `auth.uid()` so the insert from the client (which omits id)
     still satisfies the INSERT policy's WITH CHECK.
   - An index on `role` allows filtering users by role efficiently.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('athlete', 'coach', 'scout')),
  phone text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
