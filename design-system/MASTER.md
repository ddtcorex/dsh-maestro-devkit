# MASTER — dsh-maestro-devkit Design System
Pattern: Floating Toolbar → Foldable Bar → Drawer Panel
Style: Minimalism (DSH-native) + Bento compact floating
  Keywords: pill, compact, glass-border, token-only, draggable, foldable
  Best For: dev overlay that coexists with DSH shell
  Performance: cost:low (CSS only, no extra font) | Accessibility: risk:low (4.5:1 via DSH aliases, 7:1 primary)
Colors (100% DSH --dsw-* tokens, zero custom hex):
  Background: var(--dsw-alias-bg-base) / var(--dsw-alias-bg-layer-3)
  Border: var(--dsw-alias-border-l2)
  Text primary: var(--dsw-alias-label-primary)
  Text secondary: var(--dsw-alias-label-secondary)
  Hover: var(--dsw-alias-interactive-bg-hover) / active var(--dsw-alias-interactive-bg-active)
  Accent: var(--dsw-alias-state-business-primary)
  Shadow: var(--dsw-shadow-lv2) → var(--dsw-shadow-lv3) on drag
  Notes: inherits light/dark at body[data-ds-dark-theme]; contrast verified via static bluish palette
Typography: var(--dsw-font-family) / var(--ds-font-family-code), sizes var(--dsw-font-xxs-12) / var(--dsw-font-s-14), no external Google Fonts
Spacing: 4pt grid — gap 6 bar, gap 8 mobile, pad 4/6 (desktop), 6/8 (mobile), radius 999px pill / 12px drawer
Key Effects: translate/box-shadow 120ms var(--ds-ease-in-out), hover 100ms, focus-visible 2px state-business-primary, prefers-reduced-motion → none
Avoid: custom hex palette, Tailwind bundle, emoji-as-icon, no focus ring, fixed top-only detach, <44px touch target, outside-DSH shadows, backdrop-blur full-page
Pre-delivery: [x] no emoji, [x] cursor-pointer+focus ring, [x] prefers-reduced-motion, [x] 4.5:1, [x] reflow 375px/200% zoom, [x] 375/768/1024/1440, [x] 44pt touch, [x] alt/labels
