# Supabase Backend Setup, SQL Schema & Run Guide

This document provides the complete backend implementation plan, **100% verified PostgreSQL schema**, **Row-Level Security (RLS) policies**, **Database Triggers**, **Supabase Dashboard settings**, and **all methods to run the mobile application**.

---

## 1. Backend Handover & Setup Plan

If you are setting up a brand-new backend or handing this project to another developer, follow this 5-step execution plan:

1. **Step 1 — Provision Supabase Project**: Create a new project on [Supabase Dashboard](https://supabase.com/dashboard).
2. **Step 2 — Execute SQL Schema & Triggers**: Run the complete SQL script in **Section 2** inside the Supabase **SQL Editor** to create `profiles`, `reports`, `messages`, the auto-profile trigger, indexes, and RLS policies.
3. **Step 3 — Configure Auth & Realtime Settings**: Apply the dashboard toggles in **Section 3** (disable email confirmation for instant campus sign-up and verify Realtime is enabled on `messages`).
4. **Step 4 — Connect Environment Variables**: Copy `.env.example` to `.env` and populate `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
5. **Step 5 — Launch the Client**: Start the app using one of the 4 run modes in **Section 4**.

---

## 2. Complete SQL Migration Script (Copy & Paste)

Open **Supabase Dashboard → SQL Editor → New Query**, paste the entire block below, and click **Run**:

```sql
-- ============================================================================
-- 1. PROFILES TABLE (Synced automatically with auth.users via Trigger)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger function to automatically create a profile row when a user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.phone
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 2. REPORTS TABLE (Lost & Found Campus Listings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CONSTRAINT reports_type_check CHECK (type IN ('lost', 'found')),
    category TEXT NOT NULL CONSTRAINT reports_category_check CHECK (category IN ('device', 'money', 'id', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'open' CONSTRAINT reports_status_check CHECK (status IN ('open', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast feed filtering & user profile lookups
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_type_status ON public.reports(type, status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports RLS Policies
CREATE POLICY "Anyone can view campus reports"
    ON public.reports FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update report status"
    ON public.reports FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Owners can delete their own reports"
    ON public.reports FOR DELETE
    USING (auth.uid() = user_id);


-- ============================================================================
-- 3. MESSAGES TABLE (Real-Time 1-on-1 Report Chat)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast chat room history retrieval
CREATE INDEX IF NOT EXISTS idx_messages_report_id_created ON public.messages(report_id, created_at ASC);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages RLS Policies
CREATE POLICY "Authenticated users can read messages"
    ON public.messages FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);


-- ============================================================================
-- 4. ENABLE SUPABASE REALTIME FOR LIVE CHAT
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
```

---

## 3. Required Supabase Dashboard Configurations

After running the SQL script, verify these settings in your **Supabase Web Dashboard**:

### A. Disable "Confirm Email" (Instant Session Provisioning)
1. Go to **Authentication → Providers → Email**.
2. Toggle **"Confirm email"** to **OFF**.
3. Click **Save**.
   - *Why:* This allows students registering with `@nmu.edu.eg` to receive an active session token immediately upon registration without hitting Supabase's free-tier SMTP rate limit (3 emails/hour) or university email firewall blocks.

### B. Phone Authentication (Optional)
1. If you want users to register/login via the **Egyptian Phone (`+20`)** tab:
   - Go to **Authentication → Providers → Phone** and toggle **Enable Phone Provider** to **ON**.
   - Disable SMS confirmation if testing without a paid Twilio/Vonage gateway.

### C. Realtime Replication Check
1. Go to **Database → Publications** (or **Database → Replication**).
2. Under `supabase_realtime`, ensure the **`messages`** table is toggled **ON**.
   - *Why:* [`lib/chat.ts`](file:///c:/Stuff/projects/Moobile_Project/lib/chat.ts) subscribes to `postgres_changes` (`INSERT` events on `public.messages`) to deliver instant chat bubbles without polling.

### D. API Keys Setup
1. Go to **Project Settings → API**.
2. Copy **Project URL** and **Project API Keys (`anon` `public`)**.
3. Create a `.env` file in the root of the mobile project:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

---

## 4. Different Ways to Run the Application

Before running any command, ensure you are using **Node.js >= 22.13.0** (e.g. `nvm use 25.0.0`) and have installed packages with:
```bash
npm install --legacy-peer-deps
```

### Method 1: Run on Physical Phone via Expo Go (Standard LAN)
Best when your laptop and phone are connected to the **same Wi-Fi network** (e.g. home Wi-Fi or mobile hotspot):
```bash
npx expo start -c
```
- Install **Expo Go (SDK 58)** on your Android or iOS phone.
- Scan the QR code shown in the terminal.

### Method 2: Run via Tunnel Mode (Best for University / Campus Wi-Fi)
University networks, enterprise Wi-Fi, or firewalls often block peer-to-peer LAN connections between your laptop and phone. Use `--tunnel` to route through Expo's ngrok tunnel:
```bash
npx expo start --tunnel -c
```
- Wait for `Tunnel ready.` and scan the QR code. Works even if your phone is on mobile data (4G/5G)!

### Method 3: Run on Android Emulator (Android Studio)
If you don't have a physical phone with SDK 58 or want to demo on your PC screen:
1. Open **Android Studio → Virtual Device Manager** and launch an Android Emulator (API 33+).
2. Run:
   ```bash
   npx expo start --android -c
   ```
   *(Or press **`a`** inside the running `npx expo start` terminal).*

### Method 4: Run in Web Browser (Quick UI Preview)
You can preview the app's screens directly in Chrome/Edge:
```bash
npx expo start --web -c
```
*(Or press **`w`** inside the running `npx expo start` terminal).*

---

## 5. Full Project Scan & Architecture Audit

A complete scan of the codebase confirms the following architecture status:

| Layer / File | Purpose | Status |
| :--- | :--- | :---: |
| [`lib/supabase.ts`](file:///c:/Stuff/projects/Moobile_Project/lib/supabase.ts) | Initializes Supabase client with `AsyncStorage` session persistence | ✅ Verified |
| [`_providers/AuthProvider.tsx`](file:///c:/Stuff/projects/Moobile_Project/_providers/AuthProvider.tsx) | Manages auth state, login, registration, password reset, and sign-out | ✅ Verified |
| [`lib/reports.ts`](file:///c:/Stuff/projects/Moobile_Project/lib/reports.ts) | CRUD operations for `public.reports` + `sanitizeCategory()` constraint guard | ✅ Verified |
| [`lib/chat.ts`](file:///c:/Stuff/projects/Moobile_Project/lib/chat.ts) | History fetch, message insertion, realtime channel subscription, handover update | ✅ Verified |
| [`app/(auth)/Login.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(auth)/Login.tsx) | Email & Egyptian phone (`+20`) sign-in + password recovery modal | ✅ Verified |
| [`app/(auth)/Register.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(auth)/Register.tsx) | Account creation with validation | ✅ Verified |
| [`app/(tabs)/_layout.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/_layout.tsx) | Bottom navigation bar (`Home`, `Browse`, `+ Report`, `Matches`, `Profile`) | ✅ Verified |
| [`app/(tabs)/index.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/index.tsx) | Home dashboard, quick CTAs, live recent reports with status badges, HIW guide | ✅ Verified |
| [`app/(tabs)/Browse.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/Browse.tsx) | Live search, All/Lost/Found segmented control, category filter chips | ✅ Verified |
| [`app/(tabs)/ReportAction.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/ReportAction.tsx) | Unified single-page Lost/Found reporting form with base64 camera/gallery upload | ✅ Verified |
| [`app/(tabs)/Matches.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/Matches.tsx) | Heuristic matching engine comparing Lost ↔ Found reports with confidence % | ✅ Verified |
| [`app/(tabs)/Profile.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/(tabs)/Profile.tsx) | User profile card, Active vs. Returned report management, status toggles | ✅ Verified |
| [`app/ReportDetail.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/ReportDetail.tsx) | Full item view, owner-gated deletion, Ownership Verification Challenge modal | ✅ Verified |
| [`app/Chat.tsx`](file:///c:/Stuff/projects/Moobile_Project/app/Chat.tsx) | Live chat, pinned item snapshot, safe handover banner, finder verification prompts | ✅ Verified |

### Notes for the Backend Developer:
- **Image Storage**: Currently, images picked via `expo-image-picker` are compressed (`quality: 0.6`) and stored directly as `data:image/jpeg;base64,...` strings in `reports.image_url`. This means **no Supabase Storage Bucket configuration is required** for photos to work across devices immediately. If scaling to thousands of high-res photos in the future, `image_url` can seamlessly hold public URLs from a Supabase Storage bucket.
- **Unused Legacy Components**: `components/CategoryType.tsx`, `components/ReportFTitle.tsx`, `components/SearchBar.tsx`, and `hooks/UseLocation.tsx` are leftover helper files from early prototyping and are not required by the active screens.
