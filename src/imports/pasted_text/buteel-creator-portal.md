Create a high-fidelity interactive web prototype for the **Buteel Creator Portal — Music Distribution Submission Flow**.

The product is a creator-facing portal for Mongolian artists and rights holders to submit music for distribution. The experience must feel simple and modern. Do not expose internal CMS terminology such as Asset, Product, Release object, delivery package, etc.

Use **Nunito Sans** as the primary font.

Visual direction:

* Modern SaaS / creator platform
* White and very light gray surfaces
* Purple primary accent
* Thin neutral borders
* Medium rounded corners, not excessively rounded
* Compact but spacious
* Strong information hierarchy
* Avoid nested cards inside cards
* Use section dividers instead of too many bordered boxes
* Desktop-first, responsive on mobile
* Full-width content layout
* No left sidebar navigation
* Do not overuse explanatory text
* Use small info icons with short popovers for field explanations
* Use Lucide-style icons

---

# MAIN FLOW

The form has 5 stages:

1. **Үндсэн мэдээлэл**
2. **Дууны мэдээлэл**
3. **Ковер зураг**
4. **Нийтлэх & Түгээх**
5. **Шалгах & Илгээх**

Show these stages as a horizontal or top progress navigation.

Allow users to click through stages in the prototype.

Autosave form changes automatically and show a subtle autosave state.

---

# CREATE TYPE

When starting, show a clean modal:

**Юу үүсгэх вэ?**

Options:

### Дуу үүсгэх

One song.

### Цомог үүсгэх

Multiple songs.

Do not ask users to select Single / EP / Album directly.

The backend/CMS will determine the industry release type based on track count, duration and business rules.

Portal may display the returned type as:

* Single
* EP
* Album

Do not make users understand these classification rules.

---

# STAGE 1 — ҮНДСЭН МЭДЭЭЛЭЛ

## Title

Show only **one clean title input**.

Structure:

[ Title input                                    ] [ Монгол ▾ ]

Default language: **Монгол**

The language selector is visually attached to the title input.

Required title languages:

* Монгол
* English / Latin

The English / Latin title must be completed before submission.

Additional languages are optional.

Below the field show a compact language status:

✓ Монгол
✓ English / Latin

* Нэмэлт хэл

When switching languages, keep the same single input and swap its value.

Do not show multiple title inputs simultaneously.

For album mode use label:
**Цомгийн нэр**

For song mode:
**Дууны нэр**

---

# ARTIST SELECTION

Create an **Артистууд** section.

Roles:

### Үндсэн артист

Required.

Allow multiple primary artists.

### Хамтарсан артист

Optional.

Do not use an inline autocomplete field as the main UI.

Use:

**Артист сонгох** / **+ Нэмэх**

Clicking opens an artist search modal.

Search modal:

* Search by artist name
* Search by Artist ID
* Search results show:

  * profile/avatar
  * artist name
  * Artist ID

Allow selecting multiple artists.

Also provide:

**Шинэ артист үүсгэх**

New artist modal can create an artist and immediately select them.

Once selected, the main form should NOT show Artist ID.

Selected artist display:

* medium profile/avatar
* artist name clearly visible
* role
* remove icon
* compact horizontal profile card

Avoid oversized bordered cards.

Primary and featured artist roles should be part of one clean artist section separated by a subtle divider.

---

# GENRES

Fields:

**Үндсэн жанр**
Required searchable select.

**Secondary genre**
Optional searchable select.

Do not allow the same genre in both fields.

---

# LABEL

Label is configured at account level.

Show:

**Label**

[ lock icon ] MOCO Records
Account тохиргооноос

This field is completely read-only.

Do NOT:

* show dropdown
* allow choosing multiple labels
* show “Удирдах”
* allow editing from this form

---

# PREVIOUSLY RELEASED PRODUCT / UPC

Ask naturally:

**Энэ дуу / цомог өмнө нь гарч байсан уу?**

Options:

Үгүй / Тийм

If **Үгүй**:

Show:

**UPC автоматаар үүснэ**

No additional UPC decision.

If **Тийм**, reveal:

**Анх гарсан огноо**

**Өмнөх UPC код**

The user must enter the UPC previously used for this exact product/release.

UPC belongs to the song/album product, not to individual album tracks.

---

# STAGE 2 — ДУУНЫ МЭДЭЭЛЭЛ

## SINGLE MODE

A song submission contains exactly **one track**.

Do NOT repeat these fields at track level:

* title
* primary artist
* featured artist
* primary genre
* secondary genre

Those values already come from Үндсэн мэдээлэл.

Single can use:

**Дууны файл оруулах**

Primary action: upload audio.

Also provide a smaller secondary action:

**Өмнө гаргасан дуу ашиглах**

This opens a search modal showing ONLY songs that have previously been successfully released by this account.

Do not show drafts or random uploaded files.

This prevents Buteel from becoming generic cloud storage.

---

# ALBUM MODE

Allow adding multiple tracks.

Button:

**+ Дуу нэмэх**

Open one unified modal containing:

1. audio upload/drop zone
2. separator “эсвэл”
3. **Өмнө гарсан дуунууд**

The existing-song list only contains previously released songs from this account.

Search by:

* title
* artist
* ISRC

Allow multiple song selections.

Already-added songs are disabled.

---

# TRACK ORDER

Album tracks must be reorderable by drag-and-drop.

Each collapsed track row has a drag handle.

Dragging a track changes its album sequence.

Track numbers automatically update:

1
2
3
4...

Keep the expanded track open after reorder where possible.

Show subtle text:

**Дуунуудыг чирж дарааллыг өөрчилж болно.**

Single mode has no drag handle.

---

# TRACK ACCORDION

Each track is an accordion.

Collapsed row layout:

drag handle (album only)

track number

track title
primary artist(s) · duration

right-side compact statuses:

* ISRC code if available
* Үгтэй / Үггүй
* previous album usage indicator if relevant

chevron

Do not vertically stack these values awkwardly.

Use a clean horizontal row.

---

# ISRC IN COLLAPSED TRACK ROW

If an ISRC already exists, show the actual ISRC instead of:

“ISRC байгаа”

Display the ISRC WITHOUT hyphens.

Example stored value:

MN-ABC-26-00001

Display as:

**MNABC2600001**

Only remove hyphens for display.

---

# EXPANDED TRACK DESIGN

Expanded track should be ONE clean surface.

Do NOT create:

card inside card inside card.

Use section dividers.

Order:

1. Аудио файл
2. reuse warning if applicable
3. Дууны үндсэн мэдээлэл — album only
4. ISRC
5. Дууны үг & контент
6. Оролцогчид

---

# AUDIO FILE SECTION

Show a clean audio source component containing:

* play button
* source filename
* waveform
* duration
* file format
* sample rate
* bit depth
* Дахин хуулах
* Устгах

Do NOT display bitrate.

Example:

Nene - Boroo.wav
03:42
WAV · 44.1 kHz · 24-bit

**Дахин хуулах**

Clicking opens file browse.

When a replacement file is selected show:

filename
uploading progress bar
percentage, e.g. 67%

When complete replace the source audio information.

Audio source information should only appear after opening the accordion.

---

# ALBUM TRACK METADATA

Album tracks have their own:

* title
* primary artists
* featured artists
* primary genre
* secondary genre

Use the same title localization interaction as Stage 1:

one title input + language selector.

Монгол required.

English / Latin required.

Additional languages optional.

---

# ALBUM TRACK ARTIST UX

Use the SAME artist interaction pattern as Үндсэн мэдээлэл.

Primary artist:

* multiple artists allowed

Featured artist:

* optional

Selected artists:

* profile/avatar
* name
* role
* remove icon

Use:

**Артист сонгох**
or
**+ Нэмэх**

Open search modal.

Search results show Artist ID.

Selected artists do NOT show Artist ID.

Do not use a basic text dropdown.

---

# REUSED SONG LOGIC

If an existing previously released song is selected for a new album:

Load its existing metadata.

It remains editable.

Edits update the underlying song and therefore affect other albums where the same song is used.

Show an obvious but compact warning:

**Энэ дуу өмнө нь 2 цомогт орсон**

“Энд зассан мэдээлэл энэ дуу ашиглагдсан бусад цомогт мөн шинэчлэгдэнэ.”

List previous albums with:

* album name
* UPC
* release date

Example:

Шөнийн хот
UPC 865123456789
2026-05-18

Nene — Collection
UPC 865987654321
2025-11-02

---

# REUSED SONG ISRC

If a previously released song is reused in a new album:

Do NOT ask:

“Энэ бичлэг өмнө нь гарч байсан уу?”

The system already knows.

Show:

**Өмнө оноогдсон ISRC**

MNABC2600001

Badge:

**Өмнөх код**

Explain briefly:

“Энэ дуу өмнө гарсан recording тул өмнө ашигласан ISRC код автоматаар дуудагдсан.”

Do not generate a new ISRC for the same reused recording.

---

# NEW TRACK ISRC

For a newly uploaded track ask:

**Энэ бичлэг өмнө нь гарч байсан уу?**

Үгүй / Тийм

If Үгүй:

**ISRC автоматаар үүснэ**

If Тийм:

show required:

**Өмнөх ISRC код**

---

# LYRICS / EXPLICIT

Every track asks:

**Энэ дуу үгтэй юу?**

Үгтэй / Үггүй

If **Үггүй**:

hide:

* Explicit status
* vocal language
* lyrics textarea

If **Үгтэй**, show:

**Explicit контент**

Not explicit / Explicit

Then:

**Дуулагдаж буй үндсэн хэл**

search/select language.

Then:

**Дууны үг**

textarea with character count.

---

# CONTRIBUTORS

Track contributors use an account-level contributor library.

Previously created contributor names can be reused.

Also allow creating a new contributor.

Split contributors into two subsections.

## Үндсэн оролцогчид

### Ая зохиогч

Composer

Use legal full name.

Can optionally store:

**Эрхийн байгууллага**

### Үг зохиогч

Lyricist

Use legal full name.

Can optionally store:

**Эрхийн байгууллага**

IMPORTANT:

If the track is **Үггүй**, the user MUST NOT be able to add a lyricist.

Show disabled information:

**Үг зохиогч**

“Үггүй дуу дээр үг зохиогч нэмэх боломжгүй.”

If the track previously had lyricists and the user changes the track to Үггүй, clear lyricist credits.

---

# БУСАД CONTRIBUTOR

Separate subsection:

**Бусад contributor**

Button:

**+ Contributor нэмэх**

Role options:

* Producer
* Mixing Engineer
* Mastering Engineer
* Recording Engineer

Users can choose someone previously created on the account or create a new contributor.

Producer does NOT need to use a legal name.

Producer may use a professional/stage credit name.

For engineering roles, display the credited name.

---

# STAGE 3 — КОВЕР ЗУРАГ

Use a modern large square upload component.

The preview must ALWAYS be shown in a **1:1 square frame**.

Use object-fit cover.

Drag & drop + browse.

Before upload, show requirements clearly beside the upload area.

## Зураг дээр агуулагдаж болохгүй

* артистын нэр болон дуу/цомгийн нэрээс бусад текст
* URL / website / QR code
* social media logo, username, handle
* references to brands
* pornographic content
* unlicensed images / plagiarism
* same artwork used for another release

## Файлын техникийн шаардлага

* 1:1 perfect square
* minimum 1500 × 1500 px
* maximum 6000 × 6000 px
* JPG or PNG
* maximum 20MB
* no blurry images
* no pixelated images
* no mismatched or poorly aligned image
* no rotated image

Actually validate:

* JPG/PNG
* <=20MB
* width === height
* min 1500 px
* max 6000 px

If invalid, reject and show a clear Mongolian error.

After upload show:

* 1:1 cover preview
* filename
* dimensions
* file size
* Дахин сонгох
* Устгах

---

# STAGE 4 — НИЙТЛЭХ & ТҮГЭЭХ

Use a modern clean layout.

Avoid large selectable cards around every service.

---

# НИЙТЛЭХ ХУГАЦАА

Two choices:

### Аль болох хурдан

“Шалгалт дуусмагц нийтэлнэ. Ойролцоогоор 2–3 ажлын өдөр.”

### Огноо төлөвлөх

User can select a specific date.

Minimum selectable date:

today + 7 days

Show:

**Нийтлэх огноо**

and a short note showing the earliest allowed date.

---

# DISTRIBUTION SERVICES

All groups are selected by default.

Use group-level selection.

The main group check appears on the RIGHT side with label:

**Сонгосон**

Inside each group, show the services as normal-size logo/name items.

Do not put an individual checkbox on every service except where explicitly specified below.

Use normal readable sizing:

service icon about 40px
service name about 12–13px

---

# ДОТООДЫН ХӨГЖМИЙН ҮЙЛЧИЛГЭЭ

One group-level:

✓ Сонгосон

Contained services:

* Sonsy Music
* M Music

Do not show individual selection checkboxes for these services.

---

# PRBT

One group-level:

✓ Сонгосон

Contained services:

* Hitone
* Unimusic
* SkyMelody
* GTone

No individual checkboxes.

---

# ОЛОН УЛСЫН ХӨГЖМИЙН ҮЙЛЧИЛГЭЭНҮҮД

One group-level:

✓ Сонгосон

Contained services:

* Egshig
* Apple Music
* Spotify
* YouTube Music
* Deezer

No individual checkboxes.

---

# СУРТАЛЧИЛГААНЫ РАДИО ЦАЦАЛТ

Separate final section.

One group-level:

✓ Сонгосон

Service:

**Sonsy FM 78.9 & 100.1**

Show a short informational notice:

“Энэ радио цацалт нь сурталчилгааны зорилготой. Buteel энэ цацалтын royalty орлогыг тооцож, хуваарилахгүй. Хамаарах royalty-г эрх эзэмшигч өөрийн харьяалах Хамтын удирдлагын байгууллагаар бүртгүүлж, цуглуулах боломжтой.”

Style this as a subtle information note, not a warning.

---

# STAGE 5 — ШАЛГАХ & ИЛГЭЭХ

Design this like a clean review dashboard.

Top:

**Шалгах & Илгээх**

“Илгээхийн өмнө бүх мэдээллээ нэг удаа шалгана уу.”

Sections:

## Үндсэн мэдээлэл

Display:

* type
* Монгол нэр
* English / Latin title
* primary artists
* genre
* label
* UPC
* original release date if applicable

Provide small:

**Засах**

button.

---

## Дууны мэдээлэл

Show each track as a clean row:

track number
track title
artist
duration
ISRC

If ISRC exists display it WITHOUT hyphens.

Example:

MNABC2600001

Provide:

**Засах**

---

## Нийтлэх & Түгээх

Show:

* publish timing
* selected distribution groups/services

Use compact chips.

---

## Ковер зураг

Show the actual cover artwork.

Preview must be clearly visible and remain **1:1 square**.

Below show:

* filename
* dimensions

Provide:

**Засах**

---

# REVIEW CONFIRMATION

At the very bottom of the review content show a SMALL simple checkbox:

[ ] **Мэдээллээ шалгасан**

“Оруулсан мэдээлэл зөв болохыг баталгаажуулна.”

Do not make this a large card.

Do not add a separate “Шалгалтад илгээх” button inside the review content.

---

# FINAL ACTION

Use the existing bottom navigation.

Left:

**← Өмнөх**

Right:

**Илгээх**

The Илгээх button is disabled until:

**Мэдээллээ шалгасан**

is checked.

After submission show a simple success state:

**Илгээгдлээ**

“Контент шалгалтын дараагийн шат руу шилжлээ.”

Status:

**Review хүлээж байна**

---

# IMPORTANT UX PRINCIPLES

1. Never expose internal CMS terms such as Asset or Product to creators.
2. Use natural questions instead of technical decisions.
3. Avoid duplicate fields.
4. Single has exactly one track.
5. Album can reuse previously released tracks.
6. Uploaded drafts are not reusable as a song library.
7. Only previously released account-owned recordings can be reused.
8. Reused recording keeps its ISRC.
9. Album track order is drag-and-drop.
10. Album tracks may have different titles, artists, genres and metadata.
11. Single inherits title, artists and genres from Үндсэн мэдээлэл.
12. Do not use deeply nested bordered cards.
13. Use one surface with section dividers whenever possible.
14. Make primary actions visually obvious.
15. Keep secondary technical explanations inside info icons or small helper text.
16. Preserve all entered state while navigating between stages.
17. Make the prototype interactive, not just static screens.
18. Use realistic sample data where needed.
19. Keep the UI entirely creator-facing and mostly in Mongolian.
20. All distribution services should be selected by default.
