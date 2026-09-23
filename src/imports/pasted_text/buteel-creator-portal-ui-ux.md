Create a complete responsive web portal UI/UX prototype for “Buteel Creator Portal”.

Project context:
Buteel is a music creator/distribution web portal for artists, labels, small business creators, and organizations. Users can create an account, complete verification, manage their music catalog, submit new releases, view revenue/statements, manage payment/tax information, and access help links.

Use the attached user flow map and screen map as the main structure. Build the web based on this flow:

1. Login / Register
- Login screen
- Forgot password
- Create account
- Choose account type: Individual, Small business owner, Organization
- Fill basic profile information
- Accept Terms of Service

2. Account verification
- Account general status screen
- Show missing steps with clear status cards
- Account & Tax information
- Distribution agreement
- Payment information
- Bank, tax, eBarimt, payout status
- Edit / request update action

3. Main dashboard
After login, user lands on a clean dashboard.
Dashboard must show:
- Account verification status
- Missing actions / next steps
- Quick actions: “Submit new release”, “View catalog”, “View revenue”
- Recent releases
- Revenue summary card
- Help / support card

4. My Catalog
- Catalog list screen
- Search, filter, and status tabs
- Release cards/table with title, artist, release type, date, distribution status
- Release detail screen
- Track list
- Distribution status
- Codes / metadata
- Support form link

5. Submit New Release
Create a step-by-step wizard:
Step 1: Release setup
- Release type: Single / EP / Album
- Release title
- Artist
- Release date
- Label

Step 2: Track information
- Track title
- ISRC
- Audio file upload
- Explicit content status
- Contributors

Step 3: Review & submit
- Show all entered information
- Highlight missing or incorrect fields
- Buttons: Back, Save draft, Submit

After submit:
- Show “Submitted / Under review”
- If revision is required, guide user back to the correct step
- If approved, release appears in Catalog

6. Revenue & Statements
- Revenue summary screen
- Total revenue
- Revenue by service
- Revenue by sales type
- Statement list/detail
- Statement detail by release, track, service, sales type
- Payment status: waiting for eBarimt / finance approval / paid

7. Help & Links
- FAQ
- Help page
- ClickUp form link
- Contact support
- Note: ticket history is not visible inside the portal

Reference websites / design inspiration:
Use these as visual and UX references, but do not copy exactly:
- Spotify for Artists: clean artist dashboard, simple analytics cards, music catalog clarity
- DistroKid: simple release upload flow, step-by-step music distribution process
- TuneCore: artist/label distribution portal structure
- Stripe Dashboard: clean revenue, payout, statement, and status UI
- Notion / Linear style: clean layout, strong hierarchy, simple cards, modern SaaS feel

Design direction:
- Modern SaaS dashboard
- Clean, professional, trustworthy, creator-friendly
- Light theme
- Spacious layout with clear hierarchy
- Use sidebar navigation on desktop
- Use bottom navigation or compact menu on mobile
- Use status badges, progress cards, stepper components, tables, filters, empty states, form validation, upload components
- Avoid overly decorative visuals
- Keep it very usable and easy to understand

Visual style:
- Primary color: deep teal or blue-green
- Secondary accent: soft indigo or blue
- Background: #F8FAFC or very light gray
- Text: #111827 / #374151
- Cards: white with subtle border
- Status colors:
  - Success: green
  - Warning: amber
  - Error: red
  - Info: blue

Typography:
Use a clean modern sans-serif font.
Design should work well with Mongolian Cyrillic text.
Use clear font hierarchy:
- Page title
- Section title
- Card title
- Body text
- Helper text
- Error text

Required screens:
Create desktop web screens at 1440px width:
1. Login
2. Create Account / Account Type
3. Terms of Service
4. Dashboard
5. Account General Status
6. Account & Tax
7. Distribution Agreement
8. Payment Information
9. Catalog List
10. Release Detail
11. Submit New Release - Release Setup
12. Submit New Release - Track Information
13. Submit New Release - Review & Submit
14. Revenue Summary
15. Statement Detail
16. Help & Links

Also create mobile responsive versions for these key screens:
1. Dashboard
2. Catalog List
3. Submit New Release wizard
4. Revenue Summary
5. Account Status

Navigation:
Desktop sidebar items:
- Dashboard
- My Catalog
- Submit New Release
- Revenue & Statements
- Account
- Help

Top bar:
- Search
- Notifications
- Profile menu
- Language selector if needed

UX requirements:
- Make the flow very clear for first-time users
- Show onboarding / next step guidance on dashboard
- Use progress indicator for account verification
- Use wizard stepper for new release submission
- Use badges for statuses:
  - Draft
  - Submitted
  - Under review
  - Revision required
  - Approved
  - Distributed
  - Failed
  - Paid
  - Waiting for eBarimt
- Use empty states for no catalog, no statement, no revenue
- Use confirmation modal after submit
- Use error states for missing required fields
- Use helper text under complex fields
- Keep copy in Mongolian language

Sample Mongolian UI copy:
- Нэвтрэх
- Аккаунт үүсгэх
- Аккаунтын төрөл сонгох
- Үйлчилгээний нөхцөл зөвшөөрөх
- Ерөнхий төлөв
- Дутуу алхмууд
- Миний каталог
- Шинэ бүтээл илгээх
- Орлого ба тайлан
- Төлбөрийн мэдээлэл
- Түгээлтийн гэрээ
- Хянаж илгээх
- Илгээх
- Буцах
- Ноорог хадгалах
- Тусламж авах
- Шалгаж байна
- Засвар шаардсан
- Батлагдсан
- Төлөгдсөн

Deliverable:
Generate a polished, editable Figma web UI prototype with:
- Design system
- Reusable components
- Desktop screens
- Mobile responsive screens
- Connected prototype flow
- Clean naming of frames and components