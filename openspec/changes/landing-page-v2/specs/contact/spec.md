# Spec: Contact Form
**Change**: landing-page-v2
**Domain**: contact
**Status**: draft

---

## SPEC-CONTACT-001 — Contact Form Component

### Requirements

- A contact form MUST be added to the existing `Contact.astro` component, replacing or augmenting the current contact methods section.
- The form MUST include: Name field (required), Email field (required, validated as email format), Message textarea (required, min 10 characters), and a Submit button.
- The form MUST use a third-party form backend — either Formspree or Web3Forms — to handle submission without a server.
- The form backend endpoint/key MUST be stored in an Astro environment variable (`PUBLIC_FORM_ENDPOINT`), not hardcoded.
- The form MUST include a honeypot anti-spam field (hidden input with an innocuous name like `_honey`) that MUST be empty on submission.
- The current contact methods (email, LinkedIn, GitHub, WhatsApp) MUST remain visible alongside the form.
- The form MUST submit via `fetch` (AJAX), not a full page navigation.

### Form Layout

- On large screens: two-column grid — left column: existing contact info + methods, right column: form.
- On mobile: single column, form below contact info.
- This extends the current `lg:grid-cols-2` layout already in `Contact.astro`.

### Scenarios

**Scenario 1: Successful submission**
- Given all required fields are filled correctly
- And the honeypot field is empty
- When the user clicks "Enviar mensaje"
- Then the form MUST submit via `fetch` to the configured endpoint
- And a success message MUST appear: "¡Mensaje enviado! Te responderé pronto."
- And the form fields MUST be cleared

**Scenario 2: Validation error on empty name**
- Given the Name field is empty
- When the user attempts to submit
- Then browser native validation or inline error MUST prevent submission
- And focus MUST move to the Name field

**Scenario 3: Honeypot filled by bot**
- Given the honeypot field is filled with any value
- When the form is submitted
- Then the submission MUST be silently ignored (no error shown to user, no data sent)

**Scenario 4: Network error on submission**
- Given the form backend is unreachable
- When the user submits the form
- Then an error message MUST appear: "Ocurrió un error. Por favor, intentá de nuevo."
- And the form data MUST be preserved (not cleared)

**Scenario 5: Duplicate fast submissions**
- Given the form is submitting
- When the user clicks Submit again before the response arrives
- Then the Submit button MUST be disabled during submission
- And no duplicate request MUST be sent

### Acceptance Criteria

- [ ] Form has name, email, message fields, all marked `required`
- [ ] Honeypot hidden input is present (`_honey` or similar)
- [ ] Submission uses `fetch`, not `<form action>`
- [ ] `PUBLIC_FORM_ENDPOINT` environment variable is used
- [ ] Success message renders after successful submission
- [ ] Error message renders on network failure
- [ ] Submit button is disabled during pending request
- [ ] Form fields are cleared after successful submission
- [ ] Existing contact methods remain visible

---

## SPEC-CONTACT-002 — Form Validation

### Requirements

- Name field: MUST be required, minimum 2 characters.
- Email field: MUST be required, MUST validate as valid email format using HTML `type="email"` + optional JS pattern check.
- Message field: MUST be required, minimum 10 characters, maximum 2000 characters.
- All validation MUST happen client-side before submission.
- Validation error messages MUST be in Spanish and associated with their field via `aria-describedby`.
- Fields in error state MUST have `border-red-500` and a visible error message below.
- Fields with valid input SHOULD show a subtle success indicator (border-green or checkmark).

### Scenarios

**Scenario 1: Invalid email format**
- Given the email field contains "notanemail"
- When the user tabs away or tries to submit
- Then an error message "Ingresá un email válido" MUST appear below the field
- And the field border MUST become `border-red-500`

**Scenario 2: Message too short**
- Given the message field has fewer than 10 characters
- When the user tries to submit
- Then an error "El mensaje debe tener al menos 10 caracteres" MUST appear

**Scenario 3: All fields valid**
- Given all fields pass validation
- When the user focuses the submit button
- Then no error messages MUST be visible
- And the submit button MUST be enabled

### Acceptance Criteria

- [ ] Name validated: required, min 2 chars
- [ ] Email validated: required, valid email format
- [ ] Message validated: required, 10-2000 chars
- [ ] Error messages in Spanish
- [ ] Error messages linked via `aria-describedby`
- [ ] Error styles apply `border-red-500` on invalid fields
- [ ] No submission occurs while any field is invalid
