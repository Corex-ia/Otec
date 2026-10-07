/*
  # Add instructor role to user_role enum

  Adds the 'instructor' value to the existing user_role enum type,
  which was previously missing. This aligns the Supabase enum with
  the Firebase role system used in the application.
*/

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'instructor';
