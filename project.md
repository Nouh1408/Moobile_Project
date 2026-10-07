1. Overview
This document describes the user interface of a mobile app that helps university members report lost items, report found items, and get them back to their owners. It builds on the Problem Statement document and focuses on what users see and do on each screen.
2. Goals
• Let a user report a lost or found item in under a minute.
• Make it easy to browse, search, and filter reported items.
• Show likely matches clearly and guide the user to a safe handover.
• Keep the interface simple enough that a first-time user needs no instructions.
3. Users
User
What they want to do
Loser
Report a lost item and be told when it is found
Finder
Report a found item and return it with minimal effort
Admin / security staff
Review reports, confirm handovers, remove abuse
4. Design Principles
1. Fast first: the main actions (report lost, report found) are always one tap away.
2. Photo-led: items are recognised by their photo, so cards show the image first.
3. Clear status: every item shows one of three states: Lost, Found, or Returned.
4. Safe by default: contact details are hidden, and handover happens through chat and a suggested campus spot.
5. Navigation
The app uses a bottom tab bar with four tabs: Home, Report (centre button), Matches, and Profile. Chat is reached from a match or an item, not from the tab bar.
6. Screens and Requirements
6.1 Sign In / Sign Up
Users sign in with their university email so that only campus members can use the app. The screen has an email field, a password field, and a single primary button. A short line explains why the university email is required.
6.2 Home Feed
The feed shows recent reports as cards (photo, title, location, time, status badge). At the top are a search bar and filter chips for Lost, Found, and category. Pull-to-refresh updates the list. Tapping a card opens the item details.
6.3 Report Item
A single-page form with a Lost / Found toggle at the top. Fields are photo (camera or gallery), item title, category, description, location (list of campus places plus an optional map pin), and date and time. The Submit button stays fixed at the bottom. Required fields are marked, and errors appear inline.
6.4 Item Details
Shows a large photo, title, status badge, category, location on a small map, time, and description. The main button is I found this on lost items, or This is mine on found items. The reporter can edit the post or mark it as Returned.
6.5 Matches
Lists suggested matches between the user's reports and other reports. Each row shows the two items side by side with a match percentage. The user can confirm or dismiss a match.
6.6 Chat and Handover
A simple one-to-one chat opened from a match or item. A pinned banner suggests a safe handover spot (for example, the security office or library desk). After handover, either side can tap Mark as Returned.
6.7 Profile
Shows the user's name, their reports (Active and Returned), notification settings, and sign out.
6.8 Notifications
Push notifications for new matches, new chat messages, and status changes. Each opens the related screen directly.
7. Key User Flows
Report a lost item: Home, then Report, choose Lost, fill the form, submit, then a confirmation screen shows any immediate matches.
Return a found item: Home, then Report, choose Found, fill the form, submit, then wait for the owner to claim it through chat.
Claim an item: Open a found item, tap This is mine, answer a verification question set by the finder, then chat and hand over.
8. UI States
Every list and form needs designed states for loading (skeleton cards), empty (friendly message and a Report button), error (message and retry), and no connection.
9. Non-Functional UI Requirements
• Works on common Android and iOS screen sizes.
• Text is readable and tap targets are at least 44 px.
• Photos are compressed before upload so the feed loads quickly.
• Support for Arabic and English, including right-to-left layout, is an open decision.
10. Open Questions
1. Should the app support Arabic and English from the start?
2. Should users be able to stay anonymous in chat?
3. Should admin tools be inside the app or a separate web page?
