-- ==============================================================================
-- TGPCOP 2.0 — FACULTY LOGIN ACCESS & ROLE PROVISIONING SQL
-- Generated for Tulsiramji Gaikwad Patil College of Pharmacy, Nagpur
--
-- This script provides complete SQL to grant login access and teacher/admin
-- privileges for all 22 faculty members.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PRE-AUTHORIZE VIA STAFF INVITATIONS (Recommended for Supabase)
-- When faculty members register / sign up using these emails, their accounts
-- are automatically assigned 'teacher' (or 'admin') roles and activated.
-- ------------------------------------------------------------------------------

INSERT INTO public.staff_invitations (full_name, email, role, department, designation, status)
VALUES
  -- Leadership & HoD
  ('Dr. Awdhut D. Pimple', 'adityapimpale@gmail.com', 'admin', 'Pharmaceutical Chemistry', 'Principal & Associate Professor', 'pending'),
  ('Mr. Lalit G. Pund', 'lalitsworld2007@gmail.com', 'admin', 'Pharmaceutical Analysis', 'Associate Professor & TPO', 'pending'),
  ('Prof. Priyanka S. Waghmare', 'waghmare456priyanka@gmail.com', 'admin', 'Pharmaceutics', 'Assistant Professor & HoD', 'pending'),

  -- Teaching Faculty
  ('Prof. Krutika J. Warthi', 'krutikawarthi14@gmail.com', 'teacher', 'Pharmaceutical Chemistry', 'Assistant Professor', 'pending'),
  ('Mrs. Neha Rumale', 'madankarneha@gmail.com', 'teacher', 'Pharmacology', 'Assistant Professor', 'pending'),
  ('Prof. Pooja Pralhad Patle', 'poojapatle000@gmail.com', 'teacher', 'Pharmaceutical Chemistry', 'Lecturer', 'pending'),
  ('Prof. Samiksha Narendra Ajankar', 'sajankar2@gmail.com', 'teacher', 'Quality Assurance', 'Lecturer', 'pending'),
  ('Prof. Vaishnavi G. Vaidya', 'vaishnavivaidya196@gmail.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Tarun V. Pavale', 'tarun.pharmacy@gpgit.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Akhil Gajananrao Mondhe', 'akhilmonde111@gmail.com', 'teacher', 'Quality Assurance', 'Lecturer', 'pending'),
  ('Prof. Lankesh D. Sakhare', 'lankesh.pharmacy@gpgit.com', 'teacher', 'Pharmaceutical Chemistry', 'Assistant Professor', 'pending'),
  ('Prof. Ambika R. Watekar', 'ambika.pharmacy@gpgit.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Atul Nagdevte', 'atul.pharmacy@gpgit.com', 'teacher', 'Pharmacology', 'Assistant Professor', 'pending'),
  ('Prof. Tejaswini Ambadas Mankar', 'tejumankar1999@gmail.com', 'teacher', 'Pharmacology', 'Assistant Professor', 'pending'),
  ('Prof. Ashwini Sudhakar Shambharkar', 'ashwinishambharkar123@gmail.com', 'teacher', 'Pharmacology', 'Lecturer', 'pending'),
  ('Prof. Shivani R. Sawarkar', 'shivanisawarkar786@gmail.com', 'teacher', 'Quality Assurance', 'Lecturer', 'pending'),
  ('Prof. Pallavi Shankarrao Zode', 'pallavizode31@gmail.com', 'teacher', 'Quality Assurance', 'Assistant Professor', 'pending'),
  ('Prof. Bratati Bhattacharjee', 'bratatibhattacharjee@gmail.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Sejal S. Dhage', 'sejal.dhage2002@gmail.com', 'teacher', 'Pharmaceutical Chemistry', 'Assistant Professor', 'pending'),
  ('Prof. Heena Mahurkar', 'heenamahurkar881@gmail.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Shejal Deodas Baghele', 'shejal.pharmacy@gpgit.com', 'teacher', 'Pharmaceutics', 'Assistant Professor', 'pending'),
  ('Prof. Mehawish Ajim Sheikh', 'mehawish.pharmacy@gpgit.com', 'teacher', 'Pharmaceutics', 'Lecturer', 'pending')
ON CONFLICT (email) DO UPDATE SET
  role = excluded.role,
  department = excluded.department,
  designation = excluded.designation,
  full_name = excluded.full_name,
  status = 'pending';


-- ------------------------------------------------------------------------------
-- 2. UPDATE ANY ALREADY-EXISTING PROFILES TO TEACHER/ADMIN ROLE
-- If any of these faculty members already signed up previously, upgrade them
-- to their respective staff roles immediately.
-- ------------------------------------------------------------------------------

UPDATE public.profiles p
SET
  role = CASE
    WHEN lower(p.email) IN ('adityapimpale@gmail.com', 'lalitsworld2007@gmail.com', 'waghmare456priyanka@gmail.com') THEN 'admin'
    ELSE 'teacher'
  END,
  status = 'active',
  department = si.department,
  designation = si.designation,
  full_name = coalesce(p.full_name, si.full_name)
FROM public.staff_invitations si
WHERE lower(p.email) = lower(si.email);


-- ------------------------------------------------------------------------------
-- 3. DIRECT AUTH PROVISIONING (OPTIONAL — FOR DIRECT INSTANT LOGIN)
-- To create confirmed auth accounts with an initial default password ('Tgpcop@2026')
-- so faculty can log in immediately without waiting for self-signup:
-- ------------------------------------------------------------------------------

DO $$
DECLARE
  f RECORD;
  new_user_id UUID;
  default_pass_hash TEXT;
BEGIN
  -- Default password hash for 'Tgpcop@2026'
  default_pass_hash := crypt('Tgpcop@2026', gen_salt('bf'));

  FOR f IN (SELECT * FROM public.staff_invitations) LOOP
    -- Check if user already exists in auth.users
    SELECT id INTO new_user_id FROM auth.users WHERE lower(email) = lower(f.email);

    IF new_user_id IS NULL THEN
      new_user_id := gen_random_uuid();

      -- Insert into auth.users
      INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
      ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        lower(f.email),
        default_pass_hash,
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        json_build_object('full_name', f.full_name)::jsonb,
        now(),
        now()
      );
    END IF;

    -- Upsert profile with staff role
    INSERT INTO public.profiles (user_id, full_name, email, role, department, designation, status)
    VALUES (
      new_user_id,
      f.full_name,
      lower(f.email),
      f.role,
      f.department,
      f.designation,
      'active'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      role = excluded.role,
      department = excluded.department,
      designation = excluded.designation,
      status = 'active';

    -- Mark invitation activated
    UPDATE public.staff_invitations
    SET status = 'activated', updated_at = now()
    WHERE lower(email) = lower(f.email);

  END LOOP;
END;
$$;
