# Forms Rule

## Hard Rules

1. **Use a form library** (e.g. React Hook Form) or a dedicated hook; do not hand-manage a `useState` per field in non-trivial forms.
2. **Validate with a single `zod` schema** shared by the form and the submit mapper; derive the form type with `z.infer`.
3. **Every input has a visible `<label>` bound by `htmlFor`/`id`** (or wraps the input). Placeholders are not labels.
4. **Use the right input `type`, `inputMode`, and `autoComplete`** (`email`, `tel`, `one-time-code`, `current-password`).
5. **Show field errors next to the field** and link them with `aria-describedby`; mark invalid fields with `aria-invalid`. Move focus to the first invalid field on failed submit.
6. **Submit via `<form onSubmit>` with a `type="submit"` button** so Enter works. Call `preventDefault` in the handler.
7. **Disable submit while submitting and ignore re-entry;** a double click must never submit twice.
8. **Prefer uncontrolled inputs** and let the form library read values on submit; use controlled inputs only when the UI must react to each keystroke.
9. **Map server validation errors back to fields;** unmapped errors show as a form-level message.
10. **Warn before leaving a dirty form** only when data loss is real; never block navigation silently.

```tsx
// ✅ Correct
<form onSubmit={handleSubmit(onValid)} noValidate>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined} {...register('email')} />
  {errors.email && <p id="email-error" role="alert">{errors.email.message}</p>}
  <button type="submit" disabled={isSubmitting}>Save</button>
</form>
```

## Why

Schema-driven, accessible forms remove duplicated validation, prevent double submits, and work with keyboards, password managers, and screen readers out of the box.
