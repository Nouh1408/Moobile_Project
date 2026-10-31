# NMU Campus Lost & Found Mobile App 🎓🔍

A centralized, mobile-first campus item recovery platform developed for university students, faculty, and security staff. Built with **React Native (Expo SDK 58)**, **NativeWind (Tailwind CSS)**, and backed by **Supabase (PostgreSQL & Realtime)**.

---

## 🌟 Key Features

### 1. 🔐 Campus-Only Authentication & Security
- **Domain-Restricted Access**: Strictly enforces official university emails (`@nmu.edu.eg`) or Egyptian phone numbers (`+20`).
- **Instant Session Provisioning**: Direct password-based authentication with automated session persistence via `@react-native-async-storage/async-storage`.
- **Ownership Gating**: Item deletion and resolution are locked strictly to the original reporter's verified `user_id`.

### 2. 📱 Unified Single-Page Reporting (`/ReportAction`)
- **Instant Type Switch**: Single tap toggle between **[ I Lost Something ]** (Red) and **[ I Found Something ]** (Blue).
- **Photo Upload**: Supports both Camera capture and Photo Library gallery picking via `expo-image-picker`.
- **Campus Spot Presets**: Quick-select presets for major university buildings (*Main Library, Engineering Hall A, Student Center, Cafeteria, Sports Complex, Security Gate 2*).
- **Database Normalization**: Client-side sanitization ensuring compliance with PostgreSQL constraints (`device`, `money`, `id`, `other`).

### 3. 🔎 Search, Filter & Directory (`/Browse`)
- **Live Search**: Instant text filtering across item title, description, category, and campus location.
- **Segmented Control**: Filter by **All**, **Lost**, or **Found** items.
- **Category Chips**: Fast single-tap category chips for Devices, Wallets, IDs/Cards, and Miscellaneous.
- **Color-Coded Status Cards**: High-contrast, 2D flat cards with relative timestamping.

### 4. ⚡ Algorithmic Suggested Matches (`/Matches`)
- **Automated Cross-Type Matching**: Automatically correlates active Lost posts against newly submitted Found posts.
- **Confidence Scoring Algorithm (%)**:
  - Category match (50 points)
  - Keyword title & description overlap (up to 30 points)
  - Campus spot proximity (20 points)
- **Side-by-Side Comparison**: Side-by-side card UI comparing user reports with potential matches, with **Dismiss** and **View & Claim** actions.

### 5. 💬 Real-Time Chat & Handover (`/Chat`)
- **Postgres Change Stream**: Live peer-to-peer messaging using Supabase Realtime WebSocket subscriptions.
- **Pinned Item Snapshot**: Pinned top banner showing the exact item under discussion with direct navigation back to post details.
- **Safe Handover Spot Advice**: Pinned guidance directing students to official campus pickup points (*Library Reception Desk / Gate 2 Security*).
- **Ownership Verification Challenges**: Allows finders to demand proof of ownership (e.g. lock screen wallpaper, serial numbers, case markings) before agreeing to hand over.
- **Handover Confirmation**: Either party can tap **"Resolved / Handover"** to update database status to `returned` in real time.

### 6. 👤 Profile & Reports Management (`/Profile`)
- **Active vs. Returned Tabs**: Distinct tracking for active open reports versus resolved/returned items.
- **Status Toggle**: Re-open or mark items as returned with a single tap.
- **User Identity & Metrics**: Displays university email/phone, student UID, and active metrics.

---

## 🛠️ Technology Stack

- **Framework**: [Expo SDK 58](https://expo.dev) / React Native 0.88
- **Routing**: [Expo Router v58](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS 3.4) with Flat 2D aesthetic tokens
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL 15, Row-Level Security, Realtime Channels)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Language**: TypeScript 5.8+ (Strict type-checking)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 22.13.0` (or Node 25 with `nvm`)
- **Mobile Device**: [Expo Go](https://expo.dev/go) (SDK 58 compatible)

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/Moobile_Project.git
   cd Moobile_Project
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start & Run the Application (Choose a Mode)**:
   - **Standard LAN (Phone & PC on same Wi-Fi)**:
     ```bash
     npx expo start -c
     ```
   - **Tunnel Mode (For Campus / Restricted Wi-Fi or Mobile Data)**:
     ```bash
     npx expo start --tunnel -c
     ```
   - **Android Emulator (Android Studio)**:
     ```bash
     npx expo start --android -c
     ```
   - **Web Browser Preview**:
     ```bash
     npx expo start --web -c
     ```

---

## 🗄️ Database Schema & Supabase Setup

For the **complete SQL migration script** (including Row-Level Security policies, auth-to-profile triggers, indexes, and Supabase Dashboard settings), see **[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)**.

```sql
-- 1. Profiles table (Auto-populated via auth.users trigger)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Reports table
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    category TEXT NOT NULL CHECK (category IN ('device', 'money', 'id', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Realtime Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 👥 Contributors & Academic Context
Developed as an official university mobile application project for **New Mansoura University (NMU)** to streamline campus asset recovery.
