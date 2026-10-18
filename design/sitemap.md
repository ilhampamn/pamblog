# Sitemap

Status: draft — from the route list in `src/app/[locale]/` and the live nav, 2026-10-18. Jobs and audiences are proposals until the brief is settled.

Every route is prefixed with a locale: `/en`, `/id`, `/zh` [i18n.ts].

| Page | Route | Job (the question it answers) | Main audience | Next step |
| --- | --- | --- | --- | --- |
| Home | `/` | Who is this, and what's new? | [TBC] | Read the latest story / subscribe |
| Writing | `/blog`, `/blog/tag/[tag]` | What has he written? | Readers | Open a story or essay |
| Article | `/blog/[slug]` | The story itself | Readers | Next chapter / related post / subscribe |
| Explore | `/explore` | Where has he been, and can I go too? | Trip planners | Pick destinations, itineraries or stories |
| Destinations | `/explore/destinations/[country]/[city]/[destination]` | What's at this place? | Trip planners | Related itinerary or story |
| Itineraries | `/explore/itineraries`, `/[slug]` | How do I do this trip? | Trip planners | [TBC] |
| Explore stories | `/explore/stories`, `/[slug]` | Journals from longer journeys | Readers | [TBC: how this differs from Writing → stories] |
| Gallery | `/gallery` | What did it look like? | Everyone | Read the related story |
| About | `/about` | Who is Ilham? | New visitors | "See the tools I use →" / email |
| Uses | `/uses` | What gear does he use? | Photographers, nomads | Affiliate link (disclosed) |
| Newsletter | `/newsletter` | How do I follow along? | Returning readers | Subscribe |
| Experiments | `/experiment`, `/experiment-2`, `/experiment-3` | Design sandboxes, noindex | Ilham only | — |
| Components | `/components` | Internal component showcase | Ilham only | — |
| Studio | `/studio` | Sanity CMS | Ilham only | — |

## Later: platform (not built)
Planned once the site grows into a platform [decisions 2026-10-18]: sign-in and account, saved items, sharing, and a trip planner. [TBC: routes and scope, to be planned in their own phase.] Leave space for an account entry in the nav without designing it yet.

## Journeys
[TBC — after the audiences are confirmed]. Paths the current links already support:
1. Home → story → related photo or next chapter → subscribe.
2. Gallery photo → "Read the related story" → article [README, live site /gallery].
3. Explore → destination → itinerary or story that mentions it [ui strings].

## Navigation

**Decided 2026-10-18 (new direction):** a **sticky top bar** (menu + logo, Subscribe), like Medium, whose menu opens **two vertical columns** like Intercom. Rail 1 holds Home · Stories · Explore · Gallery · About. **Rail 2** opens beside it with the selected section's directory; only Stories has one (seasons → chapters, essays, with counts). A "You · later" section reserves Saved / Trips / Sign in. Subscribe sits at the rail's foot. The rail is collapsible for reading, and a drawer on phones. All stories live under Stories; Explore = destinations + itineraries only [decisions 2026-10-18]. Prototype: `/experiment-4`.

Before the redesign (live today):
- **Primary (live):** Home · Writing · About me · Gallery. This is the hand-drawn icon pill from exp2 [live site, git log 735797a].
- **Footer (live):** Writing · About · Uses · Newsletter · RSS [live site].
- **Not in the primary nav:** Explore, Uses, Newsletter. Explore is only reachable by URL or from other pages [live site]. [TBC: should Explore be in the nav?]
- **exp3 proposes:** Stories · Explore · Gallery · About · ● Subscribe [exp3].
