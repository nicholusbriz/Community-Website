-- Seed roles for the Community Website

-- Insert roles with hierarchy levels
INSERT INTO roles (id, name, level, description, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'USER', 1, 'Standard user with basic permissions', NOW(), NOW()),
  (gen_random_uuid(), 'MENTOR', 2, 'Mentor with elevated permissions', NOW(), NOW()),
  (gen_random_uuid(), 'MODERATOR', 3, 'Can moderate content and users', NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN', 4, 'Full administrative access', NOW(), NOW()),
  (gen_random_uuid(), 'SUPERADMIN', 5, 'System-level controls and oversight', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET 
  level = EXCLUDED.level,
  description = EXCLUDED.description,
  "updatedAt" = NOW();

-- Verify roles were inserted
SELECT * FROM roles ORDER BY level ASC;
