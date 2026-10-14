# Buteel Portal UI standards

Preserve the existing violet palette, Manrope font and Tailwind token contract in `src/styles/theme.css`. Reuse shared components instead of introducing a new visual style for each page.

## Typography

- Use the application sans-serif font throughout. Do not use monospace for identifiers.
- Page headings: 20px on mobile, 24px on larger screens; semibold or bold.
- Section headings: 18px; dialog headings: 16px; field labels and field text: 14px.
- Body text and primary actions: 14px. Supporting text, metadata and helper text: 12px, with relaxed line height.
- Use 10–11px only for compact, nonessential metadata. Do not use it for form labels or primary actions.
- Use sentence case. Avoid uppercase transforms and default tight tracking.

## Fields and actions

- Standard fields are 44px high, with a 12px corner radius and 14px horizontal padding.
- Place labels 6–8px above their fields, helper/error text 4–6px below and separate field groups by 16px.
- Shared input labels must be associated with their fields. Errors use `aria-invalid` and `aria-describedby`.
- Password fields reserve space for their visibility button.
- Primary registration actions and standard fields have a 44px target height. Compact secondary controls may be smaller when appropriate.
- Use a visible keyboard focus indicator. Do not communicate selection through color alone.
- Individual register numbers use two compact letter selects and a numeric eight-digit input. Organization register numbers remain numeric.
- The compact letter dropdown matches its trigger width. Other dropdowns retain sufficient width for readable choices.

## Layout and spacing

- Use a 4px spacing scale. Small icon/text gaps: 6–8px; form fields: 16px; card content: 20px mobile and 24–32px desktop.
- Account, help and profile pages use `max-w-3xl`; reports and revenue use `max-w-[1100px]`.
- Onboarding steps 1, 2 and 4 and completion use `max-w-xl`. Agreement reading uses `max-w-3xl`.
- Registration and onboarding use a centered `min-h-dvh` layout with 40px mobile and 48px desktop vertical padding. Long content must remain scrollable.
- Keep onboarding headers simple: logo and “Buteel Portal”. Put step-specific content inside its card.
- Align icons centrally with their associated content. Activity timestamps appear to the right, date above time.

## Responsive behavior

- Support 320px-wide viewports without page-level horizontal overflow. Set `min-w-0` on flexible text regions.
- Stack long forms and action groups when needed; do not shrink critical text to make them fit.
- Tables may scroll within a clearly contained region; do not make the entire page scroll horizontally.
- Dropdowns and date pickers render in portals with viewport collision handling.
- Dialogs have a viewport-relative maximum height and a scrollable body. Include title, description, keyboard dismissal and focus management.
- Respect reduced-motion settings. Preserve touch scrolling and browser zoom.

## Validation and prototype boundaries

- Validate registration names, email, phone, password, confirmation and terms before advancing.
- Display actionable errors beside their fields and focus the first invalid field on submission.
- Never persist passwords or verification codes in browser storage.
- UI validation is not server authentication. Real email/SMS delivery, OTP verification, KYC, countersigning and password changes require backend integration.
- Do not report an agreement as signed without a stored signature. Capture the signer and party identity at signing time.
