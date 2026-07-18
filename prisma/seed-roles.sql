-- Quick update - delete and recreate roles
TRUNCATE TABLE roles CASCADE;
INSERT INTO roles (id, name, description, "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'USER', 'Standard user with basic access', NOW(), NOW()),
  (gen_random_uuid(), 'STUDENT', 'Student role for learning and collaboration', NOW(), NOW()),
  (gen_random_uuid(), 'MENTOR', 'Mentor with elevated privileges to guide students', NOW(), NOW()),
  (gen_random_uuid(), 'PROJECT_LEAD', 'Project team lead with management capabilities', NOW(), NOW()),
  (gen_random_uuid(), 'ADMIN', 'Administrator with full platform management access', NOW(), NOW()),
  (gen_random_uuid(), 'SUPERADMIN', 'System-level controls and full platform access', NOW(), NOW());
SELECT * FROM roles ORDER BY name ASC;