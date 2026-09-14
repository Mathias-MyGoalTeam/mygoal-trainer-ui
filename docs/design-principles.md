# Design principles

This document explains where this app's visual design system comes from, and
the one deliberate way it diverges from its sibling project. Read this before
adding new components or layouts.

## Where the design tokens and base components came from

`mygoal-trainer-ui` shares its visual identity with
[`mygoal-webapp-ui`](https://github.com/MyGoal-Team/mygoal-webapp-ui), the
customer-facing web app. Rather than inventing a new look, we extracted the
existing design language from that repository:

- **Design tokens** — [src/assets/scss/variables.scss](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/src/assets/scss/variables.scss)
  was copied (values unchanged, names normalized to a `$category-scale`
  convention) from `mygoal-webapp-ui`'s `src/assets/scss/variables.scss`.
  It covers the color palette (neutral/orange/blue/red/yellow scales),
  typography scale and weights, spacing scale, border-radius scale, and
  shadow tokens.
- **Mixins** — [src/assets/scss/mixins.scss](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/src/assets/scss/mixins.scss)
  carries over only the `typo()` and `padding()` helpers that the base atoms
  actually use, trimmed from the source file's larger mixin set.
- **Base atoms** — [src/components/BaseButton.vue](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/src/components/BaseButton.vue),
  [src/components/BaseInput.vue](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/src/components/BaseInput.vue), and
  [src/components/BaseCard.vue](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/src/components/BaseCard.vue)
  are adapted from `mygoal-webapp-ui`'s `AppButton.vue`, `CustomInput.vue`,
  and `AchievementCardWrapper.vue` respectively. They were simplified to be
  presentation-only (no deprecated prop aliases, no validation logic, no
  autosize/other third-party behavior) and re-styled purely with the tokens
  above.

**Not ported:** font binary files (OpenSans/Caveat woff2/ttf assets), the
activity-variant color theming, and any molecule/organism/template-level
component. The z-index scale started the same way (not ported directly),
but has since been extended locally as overlay components were added
(`$z-drawer-backdrop`/`$z-drawer`, then `$z-modal-backdrop`/`$z-modal`/
`$z-toast` — see `variables.scss`); molecules/organisms (`BaseModal`,
`BaseToast`, `BasePageHeader`, ...) are documented in the "Component
library" section of the [README](/Users/mathiaspriebe/Documents/mygoal-trainer-ui/README.md).
Those were either out of scope for the original tokens-and-atoms task or
needed to be designed fresh for this app (see below).

When extending the token set or adding new atoms, prefer pulling further
from `mygoal-webapp-ui` over inventing new values, so the two products stay
visually consistent. If a value doesn't exist there yet, add it here first
and consider upstreaming it.

## Critical deviation: this app is desktop-first, not mobile-first

`mygoal-webapp-ui` is the athlete-facing app and is built mobile-first,
because athletes primarily use it on their phones. **This trainer app
intentionally does not follow that assumption.**

Trainers use this product in two distinct contexts that serve different
purposes, not one layout at two sizes:

- **Desktop/laptop** — training planning, session review, reporting, and
  other "office work" tasks. This is the primary, full-featured surface of
  the app and where trainers spend most of their working time.
- **Mobile** — quick communication with athletes (chat, status checks)
  while away from a desk. This is a deliberately reduced, purpose-built
  experience focused on communication, not a cramped version of the
  desktop dashboard.

Because of this, **the mobile view must not be designed as a responsive
breakdown of the desktop layout.** It is a separate view with its own scope,
to be designed later once the relevant chat/communication features exist.

Practical consequences for anyone (human or AI) working in this repo:

1. **Build for desktop first.** Default component and layout styles should
   assume a desktop/laptop viewport. Do not add mobile breakpoints
   "defensively" before there is an actual mobile-specific design.
2. **No mobile-first breakpoint mixins yet.** `src/assets/scss/mixins.scss`
   intentionally does not include a `breakpoint()`/media-query helper. Adding
   one implicitly invites shrinking the desktop layout down for small
   screens, which is exactly the pattern we're avoiding. Add breakpoint
   tooling only when there's a real mobile view being designed with its own
   requirements.
3. **Don't reflow desktop organisms/templates into mobile automatically.**
   When the mobile experience is eventually built, expect it to be its own
   set of views/components (e.g. a chat-focused layout), not `@media`
   overrides bolted onto the dashboard/planning screens.
4. **Base atoms stay viewport-agnostic.** `BaseButton`, `BaseInput`, and
   `BaseCard` are simple enough to be reused by both the desktop experience
   and the future mobile experience as-is — the deviation is about layout
   and information architecture, not about the tokens or atoms themselves.

If you're building a new page and unsure whether to consider mobile: assume
desktop unless the task explicitly says you're building the mobile
communication experience.
