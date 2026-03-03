# Monetization SOP (Embed Later)

This SOP keeps monetization implementation separate from core product features.

## Goal
Add monetization blocks later using embed code, without breaking notes/auth/resource workflows.

## Scope (when you are ready)
- Placement: Resource page only.
- Format: one or more embed widgets (HTML/JS snippet from partner or ad network).
- Visibility: optional and clearly labeled as sponsored/promoted.

## Integration Steps
1. **Create a dedicated component**
   - File: `Front_End/components/MonetizationEmbed.jsx`
   - Accept props:
     - `title`
     - `provider`
     - `embedHtml` (string)
2. **Render safely and intentionally**
   - Use a wrapper card and explicit label like `Sponsored`.
   - Keep this component isolated from note CRUD/auth logic.
3. **Add environment config**
   - In `Front_End/.env` add keys like:
     - `VITE_MONETIZATION_ENABLED=false`
     - `VITE_MONETIZATION_PROVIDER=`
   - Gate rendering with `VITE_MONETIZATION_ENABLED === "true"`.
4. **Insert component into Resource page**
   - Add section below existing categories.
   - Do not mix sponsored content with organic resources.
5. **Backend (optional)**
   - If dynamic embed management is needed later, add a separate model/route for monetization slots.
   - Keep it independent from `ResourceLink` and note APIs.

## Security Checklist
- Only use embed code from trusted providers.
- Prefer iframe-based embeds where possible.
- Avoid executing arbitrary script snippets from unknown sources.
- Keep CSP policy in mind if you later add strict headers.

## UX Checklist
- Always label sponsored content clearly.
- Keep sponsored blocks visually separated.
- Ensure mobile responsiveness.
- Avoid intrusive placements that block note usage.

## Rollback Plan
If monetization causes UI/performance issues:
1. Set `VITE_MONETIZATION_ENABLED=false`.
2. Hide/remove the monetization component from Resource page.
3. Redeploy frontend.

## Minimal starter snippet (future)
```jsx
{import.meta.env.VITE_MONETIZATION_ENABLED === "true" && (
  <MonetizationEmbed
    title="Sponsored"
    provider={import.meta.env.VITE_MONETIZATION_PROVIDER}
    embedHtml={"<!-- provider embed code here -->"}
  />
)}
```
