-- ============================================
-- Script to delete and reseed roles table
-- ============================================

-- Step 1: Disable foreign key constraints (if any)
-- This prevents errors if other tables reference roles
BEGIN;

-- Step 2: Delete all existing roles
TRUNCATE TABLE roles CASCADE;

-- Step 3: Reset the sequence if using serial IDs (optional)
-- ALTER SEQUENCE roles_id_seq RESTART WITH 1; -- Uncomment if using integer IDs

-- Step 4: Seed roles for the Community Website
-- Simple roles without hierarchy - exact role matching only

-- Insert roles
INSERT INTO roles (id, name, description, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'USER', 'Standard user with basic permissions', NOW(), NOW()),
  (gen_random_uuid(), 'MENTOR', 'Mentor with elevated permissions', NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN', 'Full administrative access', NOW(), NOW()),
  (gen_random_uuid(), 'SUPERADMIN', 'System-level controls and user management', NOW(), NOW()),
  (gen_random_uuid(), 'STUDENT', 'Student role for learning', NOW(), NOW());

-- Step 5: Verify roles were inserted
SELECT * FROM roles ORDER BY name ASC;

-- Step 6: Commit the transaction
COMMIT;

-- Optional: Re-enable constraints if you disabled them
-- (CASCADE handles this automatically)