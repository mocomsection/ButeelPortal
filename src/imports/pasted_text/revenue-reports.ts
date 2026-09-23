Modify ONLY the content, UX, and UI inside the EXISTING main-menu section named:

"Орлого ба тайлан"

This section already exists in the current product.

IMPORTANT:
- This task is specifically to update the existing "Орлого ба тайлан" menu section.
- Do NOT create a new menu item.
- Do NOT create a new Revenue, Earnings, Reports, Analytics, Insights, or Finance module.
- Keep the existing main-menu location and route.
- Keep the existing navigation structure outside this section.
- Keep existing permissions, backend integrations, account logic, financial logic, and data structure.
- Apply all requested changes ONLY inside the existing "Орлого ба тайлан" section.
- Do not redesign or modify any other section of the product.

The existing main-menu label must remain:

"Орлого ба тайлан"

Inside this section, change the PAGE TITLE to:

"Тайлан ба орлого"

Subtitle:

"Орлогын тайлан, таталтын мэдээлэл"

IMPORTANT:
"Тайлан ба орлого" is only the page title inside the existing "Орлого ба тайлан" menu section.
It is NOT a new menu item.

Use two internal tabs:

[Тайлан] [Орлого татах]

==================================================
EXISTING DESIGN SYSTEM
==================================================

Follow the current product design system exactly.

Reuse the existing product's:

- typography
- text hierarchy
- font family
- font sizes
- brand colors
- semantic colors
- spacing
- buttons
- inputs
- dropdowns
- popovers
- tabs
- cards
- tables
- modals
- status badges
- icons
- borders
- shadows
- radii
- responsive behavior

Do NOT introduce a new visual language.
Do NOT define new design tokens.
Do NOT create a separate visual style just for this section.

Focus on improving:

- information architecture
- layout
- hierarchy
- usability
- interaction behavior
- workflow clarity
- financial information grouping
- status logic
- reporting UX

The result should feel like a polished part of the existing product.

==================================================
TAB 1 — ТАЙЛАН
==================================================

--------------------------------------------------
1. FINANCIAL SUMMARY HEADER
--------------------------------------------------

At the top of the "Тайлан" tab, use ONE full-width branded gradient financial summary header.

Use the existing product's gradient/brand treatment.

Do NOT split this into multiple unrelated cards.

The header should have enough vertical breathing room and should not feel cramped.

Inside the header:

LEFT SIDE

Label:

"Нийт орлого"

Show the existing verified lifetime revenue value.

This value represents TOTAL LIFETIME REVENUE.

IMPORTANT:
This value must remain fixed.
It must NOT change when the filters in "Орлогын дэлгэрэнгүй" change.

Supporting text:

"Баталгаажсан нийт хугацааны орлого"

CENTER / SECOND FINANCIAL VALUE

Show:

"Боломжтой үлдэгдэл"

Use the existing verified withdrawable balance.

Supporting text:

"Хамгийн бага татах дүн ₮100,000.00"

Use a subtle semantic indicator for the available balance if appropriate using the existing product design system.

RIGHT SIDE

Use one compact CTA:

[Орлого татах]

Do not make this button excessively wide.

Clicking:

"Орлого татах"

must switch the user to the internal:

"Орлого татах"

tab.

Do NOT place any date filter inside this header.

Do NOT make the header react to the detailed reporting filters.

The header has only three responsibilities:

1. Lifetime total revenue
2. Current withdrawable balance
3. Go to withdrawal action

==================================================
2. НИЙТ ХУГАЦААНЫ ОРЛОГЫН ГРАФИК
==================================================

Below the financial summary header, keep the lifetime revenue graph as a separate section.

Title:

"Нийт хугацааны орлогын график"

Subtitle:

"Сар бүрийн баталгаажсан орлого"

Top-right action:

[Сар бүрээр харах]

The graph must show TOTAL LIFETIME REVENUE TREND.

The graph is independent from the filters in:

"Орлогын дэлгэрэнгүй"

Changing the detailed reporting period must NOT change this graph.

--------------------------------------------------
GRAPH DATA LOGIC
--------------------------------------------------

Always aggregate this graph by MONTH.

Never switch this graph to:

- daily
- weekly

Include every month in the lifetime reporting interval.

If a month has no revenue:

- keep that month in the graph
- show it at the zero baseline
- do not skip it
- do not interpolate across it as if revenue existed

The vertical revenue scale should adapt to the real dataset.

Use Mongolian monetary wording.

Examples:

0
500 мянга
1 сая
5 сая
10 сая

Do NOT use:

k
K
M

Use a reasonable rounded upper scale based on the actual highest monthly revenue.

--------------------------------------------------
X AXIS
--------------------------------------------------

Use compact Mongolian month/year formatting.

Example:

1 сар, 26
2 сар, 26
3 сар, 26

Do not use English month names.

--------------------------------------------------
POINT INTERACTION
--------------------------------------------------

Each month is represented by an interactive point.

When the user hovers over a point, show:

FULL MONTH
REVENUE

Example:

2026 он 1-р сар

₮635,000.00

The current month point should be visually distinguishable using the existing product's accent/semantic treatment.

Do not change the overall chart style away from the current design system.

--------------------------------------------------
GRAPH FOOTER
--------------------------------------------------

Leave comfortable spacing between the chart and its helper text.

Bottom-left:

"Одоогийн сар"

with the current-month indicator.

Bottom-right:

"Цэг дээр хулганаа аваачиж сарын орлогыг харна."

Keep these two items on opposite sides.

Do not place both helper texts together.

==================================================
3. САР БҮРЭЭР ХАРАХ
==================================================

Clicking:

[Сар бүрээр харах]

opens a modal containing the monthly revenue breakdown.

Use a table.

Columns:

ОН САР
ОРЛОГО
ТӨЛӨВ

Inside this modal, use FULL Mongolian date formatting.

Examples:

2026 он 1-р сар
2026 он 2-р сар
2026 он 3-р сар
2026 он 4-р сар

Do NOT use the compact graph format such as:

1 сар, 26

inside this modal.

The current reporting month may show a status/badge:

"Одоогийн сар"

Use the existing table and modal components.

==================================================
4. ОРЛОГЫН ДЭЛГЭРЭНГҮЙ
==================================================

Below the graph, keep a separate reporting section:

"Орлогын дэлгэрэнгүй"

This section is an independent detailed reporting tool.

IMPORTANT:

Filters in this section affect ONLY the detailed table.

They must NOT change:

- Нийт орлого in the header
- Боломжтой үлдэгдэл
- lifetime graph
- withdrawal balance

Default reporting period:

"Сүүлийн 1 сар"

Default grouping:

"Дуу"

Default results should represent the latest available reporting month.

==================================================
5. PERIOD FILTER
==================================================

Do NOT show multiple date-range buttons across the page.

Use ONE existing dropdown/popover control.

The trigger should include a calendar icon.

Example concept:

[calendar icon] Сүүлийн 1 сар [chevron]

Dropdown options:

Сүүлийн 1 сар
Сүүлийн 3 сар
Сүүлийн 1 жил
Date сонгох

Use the existing product dropdown/popover design.

--------------------------------------------------
DATE СОНГОХ
--------------------------------------------------

When the user selects:

"Date сонгох"

reveal the existing appropriate date/month range selector.

Do not permanently display custom date inputs.

Custom dates should only become visible after:

"Date сонгох"

is selected.

The selected date range applies ONLY to:

"Орлогын дэлгэрэнгүй"

==================================================
6. SEARCH + GROUPING CONTROL
==================================================

Below the date control, keep the search field.

The search placeholder changes depending on the active grouping.

If:

Дуу

placeholder:

"Дуу хайх..."

If:

Цомог

placeholder:

"Цомог хайх..."

If:

Үйлчилгээ

placeholder:

"Үйлчилгээ хайх..."

If:

Лейбл

placeholder:

"Лейбл хайх..."

If:

Артист

placeholder:

"Артист хайх..."

--------------------------------------------------
GROUPING
--------------------------------------------------

Do NOT use a dropdown for:

Дуу
Цомог
Үйлчилгээ
Лейбл
Артист

Instead, use the existing selectable / segmented control style.

Show directly clickable options:

[Дуу] [Цомог] [Үйлчилгээ] [Лейбл] [Артист]

Only one can be active at a time.

This is a VIEW / GROUPING control.

Do not make these look like five unrelated filters.

Changing the active grouping updates:

- table structure
- search placeholder
- displayed results

==================================================
7. DETAIL TABLE — ДУУ
==================================================

When grouping is:

"Дуу"

use columns:

ДУУ
АРТИСТ
ЛЕЙБЛ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Clicking the song name opens the song revenue detail modal.

==================================================
8. DETAIL TABLE — ЦОМОГ
==================================================

When grouping is:

"Цомог"

use columns:

ЦОМОГ
АРТИСТ
ДУУНЫ ТОО
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Clicking the album name opens the album revenue detail modal.

==================================================
9. DETAIL TABLE — ҮЙЛЧИЛГЭЭ
==================================================

When grouping is:

"Үйлчилгээ"

use columns:

ҮЙЛЧИЛГЭЭ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Example services may include:

Spotify
Apple Music
YouTube Music
Deezer
Amazon Music

==================================================
10. DETAIL TABLE — ЛЕЙБЛ
==================================================

When grouping is:

"Лейбл"

use columns:

ЛЕЙБЛ
РЕЛИЗ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

==================================================
11. DETAIL TABLE — АРТИСТ
==================================================

When grouping is:

"Артист"

use columns:

АРТИСТ
РЕЛИЗ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

==================================================
12. MONEY FORMAT
==================================================

Keep monetary formatting consistent everywhere.

Always include two decimal places.

Example:

₮1,100,000.00

Do not remove:

.00

==================================================
13. TABLE PAGINATION
==================================================

Use:

25 rows per page

Keep pagination.

For the prototype:

create 3 pages.

Page 1 must contain 25 realistic-looking example rows.

Pages 2 and 3 can contain additional sample data.

The first page must look realistic enough to evaluate the table UX.

==================================================
14. SONG / ALBUM DETAIL MODAL
==================================================

Do NOT expand service/DSP details as an accordion inside the main table.

This becomes too vertically long when many services exist.

Instead:

clicking a SONG NAME or ALBUM NAME opens a modal.

--------------------------------------------------
SONG MODAL
--------------------------------------------------

Title:

"Дууны орлогын дэлгэрэнгүй"

Show compact context such as:

Артист
Лейбл
Сонгосон хугацаа

Then show a service breakdown TABLE.

Columns:

ҮЙЛЧИЛГЭЭ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Example services:

Spotify
Apple Music
YouTube Music
Deezer
Amazon Music

Do not create large individual DSP cards.

--------------------------------------------------
ALBUM MODAL
--------------------------------------------------

Title:

"Цомгийн орлогын дэлгэрэнгүй"

Show:

Артист
Дууны тоо
Сонгосон хугацаа

Then show the appropriate service revenue breakdown in table format.

==================================================
TAB 2 — ОРЛОГО ТАТАХ
==================================================

==================================================
15. WITHDRAWAL SUMMARY
==================================================

At the top of the:

"Орлого татах"

tab, use one spacious summary section/card.

Give this section enough vertical breathing room.

Do not make it cramped.

It should contain:

LEFT:

"Боломжтой үлдэгдэл"

Show the verified current withdrawable balance.

Below:

"Хамгийн бага ₮100,000.00"

CENTER:

"Хүлээн авах данс"

Show the verified payout account.

Example only:

Хаан Банк ••••4521

Also show:

"Хүлээн авагч"

Use the verified recipient name.

RIGHT:

[Тохиргоо]

[Татах хүсэлт]

Use the existing product button styles.

Do not make these actions overly wide.

--------------------------------------------------
ТОХИРГОО
--------------------------------------------------

Clicking:

[Тохиргоо]

must navigate to the existing Account/payment settings area.

Do not create a new payment-settings module.

--------------------------------------------------
WITHDRAWAL THRESHOLD
--------------------------------------------------

Minimum withdrawal threshold:

₮100,000.00

The:

[Татах хүсэлт]

button is enabled ONLY when:

available balance >= ₮100,000.00

If available balance is below the threshold:

- disable the action
- use the existing disabled state
- make the minimum requirement understandable

==================================================
16. ТАТАЛТЫН ТҮҮХ
==================================================

Below the summary, show:

"Таталтын түүх"

Supporting text:

"Одоогийн төлөв, сүүлийн өөрчлөлт"

Columns:

ХҮСЭЛТ
СТАТУС
ТАТАХ ДҮН
ХҮЛЭЭН АВАХ
MODIFIED
ACTION

Action label:

[Дэлгэрэнгүй]

IMPORTANT:

"Modified"

means:

the timestamp when the request's status was most recently changed.

It is NOT:

- final resolved date
- payout date only

It updates whenever the request state changes.

==================================================
17. WITHDRAWAL STATUS MODEL
==================================================

Normal successful workflow:

1. Хүсэлт үүссэн
2. Баримт хүлээгдэж байна
3. Санхүү шалгаж байна
4. Төлбөр шилжүүлсэн

IMPORTANT:

"Төлбөр шилжүүлсэн"

is the FINAL successful status.

Do NOT add:

"Дууссан"

Do NOT add another final success stage after:

"Төлбөр шилжүүлсэн"

==================================================
18. TIMELINE LOGIC
==================================================

The withdrawal detail modal contains a vertical timeline.

The timeline must follow the request's actual current status.

--------------------------------------------------
STATUS:
Хүсэлт үүссэн
--------------------------------------------------

Хүсэлт үүссэн = CURRENT

Future stages remain incomplete.

--------------------------------------------------
STATUS:
Баримт хүлээгдэж байна
--------------------------------------------------

Хүсэлт үүссэн = COMPLETED

Баримт хүлээгдэж байна = CURRENT

Future stages remain incomplete.

--------------------------------------------------
STATUS:
Санхүү шалгаж байна
--------------------------------------------------

Хүсэлт үүссэн = COMPLETED

Баримт хүлээгдэж байна = COMPLETED

Санхүү шалгаж байна = CURRENT

Төлбөр шилжүүлсэн = INCOMPLETE

--------------------------------------------------
STATUS:
Төлбөр шилжүүлсэн
--------------------------------------------------

Хүсэлт үүссэн = COMPLETED

Баримт хүлээгдэж байна = COMPLETED

Санхүү шалгаж байна = COMPLETED

Төлбөр шилжүүлсэн = COMPLETED

IMPORTANT:

When the request is:

"Төлбөр шилжүүлсэн"

there must be NO remaining CURRENT step.

All normal workflow steps must show as completed.

Do not leave:

"Санхүү шалгаж байна"

visually active after payment has been transferred.

==================================================
19. TIMELINE VISUAL CONTENT
==================================================

Each timeline stage shows:

- status title
- timestamp
- short supporting explanation

Example:

Санхүү шалгаж байна

2026-08-20 13:40

Баримт болон хүсэлтийг шалгаж байна.

Completed steps use the existing completed-state treatment.

Make sure check/tick icons are correctly centered and aligned inside their timeline markers.

The timeline should be easy to scan and should not feel visually tiny or compressed.

Use the existing timeline/status visual language if one already exists in the product.

==================================================
20. EXCEPTION STATE — БУЦААСАН
==================================================

A withdrawal request may be returned by Finance if the submitted eBarimt information is incorrect.

Use status:

"Буцаасан"

This is an exception state.

Use the existing error/negative semantic treatment.

Clearly show the reason.

Example:

"Регистрийн дугаар буруу шивэгдсэн.
Баримтаа засварлаад дахин илгээнэ үү."

Provide action:

[eBarimt дахин нээх]

IMPORTANT:

Do not incorrectly mark future workflow stages as completed when the request has been returned.

The returned state branches from the normal workflow.

After the user corrects and resubmits the receipt, Finance may continue processing the same request.

==================================================
21. ТАТАХ ХҮСЭЛТ MODAL
==================================================

Clicking:

[Татах хүсэлт]

opens the existing withdrawal request flow in a modal.

The modal must be easy to scan.

Do not make the entire modal one grey surface.

Use the existing branded treatment to clearly distinguish the financial summary from the calculation/content area.

Top section:

"Боломжтой үлдэгдэл"

Show the verified current available balance.

Also identify the applicant type:

"Хувь хүн"

or

"Байгууллага"

==================================================
22. TAX / VAT DISPLAY
==================================================

Show the existing configured calculation.

Possible fields:

Хүсэлтийн дүн

Conditional VAT information when applicable.

If applicant is an individual:

"ХХОАТ (Эрхийн шимтгэл)"

+ info control

If applicant is a company:

"ААНОАТ"

+ info control

Then show:

"Хүлээн авах дүн"

Also show:

Шилжүүлэх данс
Хүлээн авагч

The info controls should display only short contextual explanations.

Do not show long tax explanations by default.

IMPORTANT:

Do not invent:
- tax percentages
- VAT percentages
- tax base logic
- deduction rules

Use the existing configured/backend financial rules.

==================================================
23. AFTER WITHDRAWAL REQUEST CREATION
==================================================

After successful request creation, show a clear success state.

Title:

"Хүсэлт үүслээ"

Supporting text:

"Одоо eBarimt баримтаа илгээнэ үү"

The next required user action must be very obvious.

==================================================
24. eBARIMT ACTION AREA
==================================================

Create one focused eBarimt action section.

Title:

"eBarimt дээр баримт үүсгэх"

Short instruction:

"Доорх регистр, төлбөрийн утга, дүнг ашиглаад баримтаа манай байгууллага руу илгээнэ."

Primary action:

[eBarimt нээх ↗]

Use the existing configured eBarimt destination/deep link if available.

Do NOT invent a URL.

Secondary action:

[Мэдээлэл хуулах]

==================================================
25. COPYABLE eBARIMT INFORMATION
==================================================

Show:

РЕГИСТР

use the existing company registration number

[Copy]

Show:

ТӨЛБӨРИЙН УТГА

use the existing/generated payment reference

[Copy]

Show:

БАРИМТЫН ДҮН

use the required backend/calculated receipt amount

[Copy]

Keep these easy to read and copy.

==================================================
26. DO NOT ASK USER TO MANUALLY CONFIRM RECEIPT
==================================================

Do NOT add a button such as:

"Баримт илгээсэн"

The user should NOT manually tell the system that the eBarimt was sent.

That does not reliably confirm receipt.

Instead show:

"Баримт санхүүд ирсний дараа хүсэлтийн статус автоматаар шинэчлэгдэнэ. Та дахин ямар нэг товч дарах шаардлагагүй."

The actual state transition must be triggered by the backend / Finance process.

Example:

Баримт хүлээгдэж байна
→ Санхүү шалгаж байна

when Finance receives and starts reviewing the receipt.

==================================================
27. RETURNED eBARIMT
==================================================

If Finance rejects/returns the receipt:

show:

"Баримт буцаагдсан"

Then show the reason.

Example:

"Регистрийн дугаар буруу шивэгдсэн.
Баримтаа засварлаад дахин илгээнэ үү."

Action:

[eBarimt дахин нээх]

The user can correct the receipt and send it again.

Do not create a new withdrawal request just because the receipt was returned.

The existing request continues its workflow after correction unless the existing backend business logic says otherwise.

==================================================
28. DATA AND BUSINESS LOGIC CONSTRAINTS
==================================================

Do not invent financial totals.

Do not calculate one displayed financial total by subtracting another value unless that calculation already exists in the backend.

Use existing verified/backend values for:

- lifetime revenue
- available balance
- withdrawal request amount
- payout amount
- tax
- VAT
- recipient
- bank account
- request statuses
- modified timestamps
- eBarimt information

Do not assume:

Total Revenue − Paid = Available Balance

unless that is explicitly the existing backend rule.

==================================================
29. PRODUCTION UI CONSTRAINTS
==================================================

Do not expose any:

- Demo controls
- Test controls
- test tax settings
- manually editable balance controls
- manually editable workflow-status controls

Those were only for prototype testing.

They must not appear in the production UI.

==================================================
30. FINAL QA
==================================================

Before completing the update, perform a final consistency pass inside the existing:

"Орлого ба тайлан"

section.

Check:

- information hierarchy
- spacing
- alignment
- duplicated information
- button consistency
- table readability
- filter clarity
- modal hierarchy
- financial-value consistency
- graph interactions
- monthly popup formatting
- withdrawal threshold behavior
- status badge accuracy
- Modified timestamp behavior
- timeline state logic
- completed-state check alignment
- returned-state behavior
- eBarimt action clarity
- responsive behavior

Preserve the current product design system throughout.

Do not redesign other modules.

Do not add advanced Insights or analytics to this section.

Again:

MAIN MENU remains:
"Орлого ба тайлан"

PAGE TITLE inside that section:
"Тайлан ба орлого"

INTERNAL TABS:
"Тайлан"
"Орлого татах"