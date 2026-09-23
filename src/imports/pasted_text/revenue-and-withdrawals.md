Update ONLY the existing main-menu section named:

"Орлого ба тайлан"

This section already exists in the current prototype.

IMPORTANT:
Do not create a new Revenue, Earnings, Analytics, or Reports module.
Do not rename the main-menu item.
Keep the main navigation label exactly as:

"Орлого ба тайлан"

Apply all changes inside the existing "Орлого ба тайлан" section only.

Preserve the current product structure, existing business logic, routes, fields, functionality, and overall purple visual identity.

The purpose of this update is to make the existing "Орлого ба тайлан" section clearer, more modern, more compact, and easier for artists and labels to understand.

Inside "Орлого ба тайлан", organize the page as follows:

Financial summary header
Tabs:
Орлого
Мөнгө таталт
Under "Орлого":
Орлогын график
Орлогын дэлгэрэнгүй
Under "Мөнгө таталт":
Таталтын мэдээлэл
Таталтын түүх

Do not add an Insights section here. Advanced insights will be a separate feature in the future.

FINANCIAL SUMMARY HEADER

At the top of the existing "Орлого ба тайлан" page, redesign the current purple hero area into a more compact financial summary.

The most important value must be:

Татах боломжтой баланс
₮410,000

Show this as the largest and strongest financial number.

On the right side place the primary action:

[ Мөнгө татах ]

Below the available balance show two secondary values:

Нийт орлого
₮9,225,000

Нийт шилжүүлсэн
₮8,815,000

Remove the existing:
"Хүлээгдэж буй орлого"

Do not show any pending-income KPI.

Do not put a date filter inside this header.

The balance header represents the user's current financial position and must not change when the revenue period filter changes.

TABS

Directly below the financial summary keep:

[ Орлого ] [ Мөнгө таталт ]

"Орлого" is the default active tab.

The header button "Мөнгө татах" is an action.

The tab "Мөнгө таталт" is for viewing withdrawal information and history.

Do not confuse or merge these two functions.

ОРЛОГО TAB

Keep the existing revenue graph.

Place the period selector in the Revenue content area, not in the top financial summary.

Use one shared period selector for BOTH:

Орлогын график
Орлогын дэлгэрэнгүй

Period options:

Сүүлийн сар
Сүүлийн улирал
Сүүлийн жил
Нийт хугацаа
Custom

For Custom, allow start and end date selection.

The selected period must NOT affect:

Татах боломжтой баланс
Нийт орлого in the top lifetime summary
Нийт шилжүүлсэн

It should affect only period-based revenue data below.

ОРЛОГЫН ГРАФИК

Keep the line chart so the user can quickly understand how revenue changes over time.

Make it cleaner and more compact.

Show:

Орлогын график

[ Сүүлийн жил ▼ ]

Selected-period total revenue should be visible near the chart if useful.

Keep CSV export secondary.

Do not add advanced analytics.

ОРЛОГЫН ДЭЛГЭРЭНГҮЙ

Below the chart show:

Орлогын дэлгэрэнгүй

This table must follow the same selected date period as the graph.

Add search:

[ Цомог, дуу хайх... ]

Search must support:

album/release title
song/track title

Add filters:

[ Үйлчилгээ: Бүгд ▼ ]
[ Ашиглалтын төрөл: Бүгд ▼ ]

Add a separate grouping/view control:

Харах:
[ Дуу ] [ Цомог ] [ Үйлчилгээ ]

Do not treat these three options as ordinary filters.
They change how the same revenue data is grouped.

Default view:
Дуу

ДУУ VIEW

Columns:

ДУУ
АРТИСТ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

If a song is expanded, show service breakdown as a compact nested list/table.

Do not use large cards for every platform.

ЦОМОГ VIEW

Columns:

ЦОМОГ
АРТИСТ
ДУУНЫ ТОО
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Aggregate values by album/release.

ҮЙЛЧИЛГЭЭ VIEW

Columns:

ҮЙЛЧИЛГЭЭ
СОНСОЛТ
ТАТАЛТ
ОРЛОГО

Aggregate values by digital service.

PAGINATION

Display 25 records per page.

Use pagination such as:

1–25 / 486

‹ 1 2 3 4 5 … 20 ›

Keep 25 fixed for now.

CSV

CSV export must respect the currently active:

period
search
service filter
usage-type filter
selected view/grouping
МӨНГӨ ТАТАЛТ TAB

Keep the existing withdrawal section but visually refine it.

At the top show a compact summary:

Татах боломжтой баланс
₮410,000

Хүлээн авах данс
Хаан Банк ••••4521

Хүлээн авагч
Болд Жаргал

Do not create another large hero banner here.

ТАТАЛТЫН ТҮҮХ

Keep these primary columns:

ХҮСЭЛТИЙН ОГНОО
ШИЙДВЭРЛЭСЭН
СТАТУС
ДҮН

Use concise statuses:

Шалгаж байна
Баримт хүлээгдэж байна
Шилжүүлсэн
Цуцлагдсан

Keep bank details, eBarimt notes, request IDs, or cancellation reasons as secondary information rather than adding too many table columns.

МӨНГӨ ТАТАХ MODAL

Keep the existing modal logic.

Use this hierarchy:

Мөнгө татах

Татах боломжтой дүн
₮410,000

Шилжүүлэх данс
Хаан Банк ••••4521

Хүлээн авагч
Болд Жаргал

Keep the existing eBarimt notice.

Buttons:

[ Болих ] [ Хүсэлт илгээх ]

Do not invent additional fees, processing times, minimum withdrawal rules, or other financial rules.

VISUAL DESIGN

Keep the current purple brand identity.

Improve:

spacing
hierarchy
typography
button consistency
table readability
status badges
borders
alignment
whitespace
component consistency

Use modern SaaS design principles.

Do not:

redesign the rest of the application
change the navigation
rename "Орлого ба тайлан"
create a separate Revenue page
create a separate Earnings page
add Insights
change existing business logic

The final "Орлого ба тайлан" section should immediately answer:

Би одоо хэдийг татаж болох вэ?
Би нийт хэдэн төгрөгийн орлого олсон бэ?
Надад нийт хэдийг шилжүүлсэн бэ?
Сонгосон хугацаанд орлого хэрхэн өөрчлөгдсөн бэ?
Ямар дуу, цомог, үйлчилгээнээс орлого орсон бэ?
Миний мөнгө татах хүсэлт ямар төлөвтэй байна вэ?

The final result must remain the same product and the same "Орлого ба тайлан" module, only more polished, structured, modern, and understandable.