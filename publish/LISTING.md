# Figma Community listing — Component Spotter

Copy each field into the publish dialog (Plugins → Development → Component Spotter → **Publish**).

## Assets

| Field | File | Size |
|---|---|---|
| Icon | `icon.png` | 128 × 128 |
| Thumbnail / cover | `cover.png` | 1920 × 1080 |
| Carousel 1 | `carousel-1-list.png` | 1920 × 1080 |
| Carousel 2 | `carousel-2-variants.png` | 1920 × 1080 |
| Carousel 3 | `carousel-3-library.png` | 1920 × 1080 |
| Carousel 4 | `carousel-4-select.png` | 1920 × 1080 |

Sources live in `src/`. Edit them and run `./render.sh` to regenerate (needs Google Chrome).

## Name

Component Spotter

## Tagline

See every component used on a page, counted and grouped by variant.

## Description

Ever wondered which components a page actually uses? Component Spotter gives you the answer in one click.

Pick any page, press Scan, and get a list of every component on it — grouped by component set, sorted by how often it's used.

**Features**
- **Counted list** — one row per component or component set, with the number of instances on the page.
- **Variant breakdown** — expand a component set to see which variants are used and how often.
- **Library, local or missing** — badges show where each component comes from, so components whose main component was deleted stand out.
- **Library only switch** — hide local components to check how much of a page uses your design system.
- **Nested instances** — optionally count components used inside other components, like icons inside buttons.
- **Select on canvas** — click a component or variant to select every matching instance and zoom to it.
- **Filter and copy** — search the list, or copy it as plain text for audits, docs or tickets.

**Good for**
- Design system adoption audits
- Cleaning up before handoff
- Finding components whose main component was deleted
- Checking which variants are actually in use

Works with light and dark mode. No data leaves your file — the plugin makes no network requests.

## Tags

Up to 12. Suggested:

`components`, `design system`, `audit`, `inventory`, `variants`, `library`, `instances`, `usage`, `handoff`, `cleanup`, `design ops`, `analytics`

## Category

Design tools → File organization

## Support contact

glennvlekke@gmail.com

## Data security disclosure

Answers for Figma's data security questionnaire:

- **Does the plugin make network requests?** No. `networkAccess.allowedDomains` is `["none"]`.
- **Does it collect, store or transmit user data?** No. It reads the selected page in memory only.
- **Does it use third-party services, analytics or tracking?** No.
- **Does it require sign-in or an account?** No.
- **Does it store data (clientStorage, pluginData)?** No.

## Release notes (v1)

First release: scan any page for components, variant breakdown, library-only switch, nested instances, select on canvas, filter and copy.

## Before you publish

1. **Plugin ID.** `manifest.json` has the placeholder id `component-spotter-dev`. Figma needs a real one. If the publish dialog doesn't give you one, create a new plugin (Plugins → Development → New plugin…), copy the `id` from its generated manifest into this `manifest.json`, and import again.
2. **Test.** Try it on a large page, a page with library components, and a page with a deleted main component.
3. **Two-factor auth.** Figma requires 2FA on your account before you can publish.
4. **Review.** Figma reviews new plugins before they go public. This usually takes a few days to a couple of weeks.
