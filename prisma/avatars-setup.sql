-- ============================================================
-- 🖼️ FIX AVATARS BUCKET POLICIES
-- ============================================================
-- This fixes the policies so that:
-- - SELECT (view): Anyone (public) can view avatars
-- - INSERT/UPDATE/DELETE: Server-side uploads use service role key (bypasses RLS)
--   These policies are for client-side Supabase Auth users only
-- ============================================================
-- NOTE: This project uses NextAuth for authentication, not Supabase Auth.
-- Server-side uploads use the SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- The folder structure (userId/filename) is enforced in the upload route,
-- not by these policies.
-- ============================================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- ============================================================
-- POLICY 1: Public can view avatars (SELECT)
-- ============================================================
-- This is correct - anyone can view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND storage."extension"(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
);

-- ============================================================
-- POLICY 2: Users can upload their own avatars (INSERT)
-- ============================================================
-- ✅ FIXED: Only authenticated users can upload
-- The WITH CHECK ensures the folder name matches their user ID
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated  -- ✅ This restricts to logged-in users
WITH CHECK (
  bucket_id = 'avatars'
  AND storage."extension"(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- POLICY 3: Users can update their own avatars (UPDATE)
-- ============================================================
-- ✅ FIXED: Only authenticated users can update
-- The USING clause checks the folder name matches their user ID
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated  -- ✅ This restricts to logged-in users
USING (
  bucket_id = 'avatars'
  AND storage."extension"(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- POLICY 4: Users can delete their own avatars (DELETE)
-- ============================================================
-- ✅ FIXED: Only authenticated users can delete
-- The USING clause checks the folder name matches their user ID
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated  -- ✅ This restricts to logged-in users
USING (
  bucket_id = 'avatars'
  AND storage."extension"(name) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- ✅ VERIFICATION: Check which roles each policy applies to
-- ============================================================
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;