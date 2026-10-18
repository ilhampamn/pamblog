# Brief

Status: draft — reconstructed from the live site and code, 2026-10-18. No written brief exists yet.

## Who
**Travel Pam** [decisions 2026-10-18]: the travel site of Ilham Pamungkas, a product designer from Indonesia who works in tech and spends part of each year living and working abroad ("a part-time digital nomad, I guess") [about page]. The site is his personal travel blog at travelpam.com [live site].

## Goal of the site
**Now:** a home for Ilham's own travel writing and sharing: stories, itineraries, tips and tricks, and links out to his TikTok and other content [decisions 2026-10-18].
**Later:** a travel platform where visitors log in, save things, share things and plan their trips on the site [decisions 2026-10-18]. Nothing designed now should block accounts, saved items or a trip planner from being added later.

What the site does today:
- Publishes personal writing: "stories" (trip journals in seasons and chapters) and "essays" [live site /blog, schema].
- Shows travel photography in a gallery that links photos to stories [live site /gallery, README].
- Helps people plan trips: Explore → Destinations (region → country → city), Itineraries ("Trip plans you can follow") [ui strings, live site /explore].
- Builds an audience through a newsletter (Kit) [live site /newsletter].
- Earns affiliate income on the Uses page, which has a disclosure [live site /uses].

## Positioning
Travel-first: Ilham's own trips and know-how now, growing into a place where others plan theirs [decisions 2026-10-18]. [TBC: one-line positioning statement, to be drafted in the direction phase.] Earlier taglines that this replaces:
- "Welcome to my Travel Blog!" — homepage hero [live site]
- "Writing about things I find interesting." — `home.tagline` [ui strings]
- "I write about photography, building things, and the space between." — `canvas.intro` [ui strings]
- "an Indonesian, abroad" — masthead descriptor [exp3]
- Newsletter promises "essays, notes, reviews, tutorials" [live site /newsletter]

These taglines need rewriting to match: see `voice.md` and the copy phase.

## Audiences
All four are in scope, with no ranking yet [decisions 2026-10-18]. [TBC: what each needs to feel and do next. Draft these in the direction phase and have Ilham confirm.]

| Audience | Evidence | They need to feel | They come to | Their next step |
| --- | --- | --- | --- | --- |
| Indonesian readers | `id` locale; exp3 drafts on Indonesian-passport visas [i18n.ts, exp3] | [TBC] | [TBC] | [TBC] |
| Chinese-reading visitors | `zh` locale [i18n.ts] | [TBC] | [TBC] | [TBC] |
| Trip planners | Itineraries, destinations [ui strings] | [TBC] | Plan a trip | [TBC] |
| Readers who follow Ilham | Newsletter, stories in seasons [live site] | [TBC] | Read the next chapter | Subscribe |

## Pillars / stories
[TBC — Ilham]. Content on the site today:
- Itineraries and tips and tricks, which are planned content [decisions 2026-10-18]
- Links out to Ilham's TikTok and other social content [decisions 2026-10-18]. [TBC: which platforms, and should videos be embedded or linked?]
- Long journeys told as seasons and chapters, e.g. "A horse ride to Son-kul Lake" (stories) and "Somewhere in Central Asia — Season 1" [live site /blog, exp2]
- Personal essays, e.g. "Maybe, you don't really know about yourself" [live site /blog]
- Photography: underwater (freediving with whale sharks and mantas), places, ceremonies [live site /gallery]
- The kid who read about the Seven Wonders and now travels for real [about page]

## Mood words
[TBC — Ilham]. Words the existing work uses about itself: "rough raw realism", "hand-drawn annotation" [exp1]; "travel-journal… graph paper, torn-edge cards, taped polaroids" [exp2]; "newspaper… warm paper ground" [exp3]; paper texture, sticky notes and stickers on the live site [git log 2026-07-06].

## Do's
- Use real photographs, never placeholders [exp1 page.tsx, exp2 page.tsx].
- Respect reduced motion: an earlier bug blanked the homepage for those users [git log 7b0b3a0].
- Show cover images whole (fit, don't crop) [git log 924a16b].
- Disclose affiliate links where they appear [live site /uses].
- [TBC: more — Ilham]

## Don'ts
- [TBC — Ilham]. exp3 refers to "the brief says no borders in the bar" [exp3 css], so an earlier brief existed and isn't in the repo.

## Constraints
- Three languages, en / id / zh, with fallback locale → en → id [i18n.ts]. Layouts must hold Chinese and Indonesian text lengths.
- Content is edited in Sanity; photos come from Cloudinary [CLAUDE.md].
- Solo maintainer, Next.js 14 on Vercel [git log, live site headers].
- Font licences: the exp3 display faces come from FontStruct/dafont; Upakarti has a EULA in `assets-experiment-3/` [exp3, build-experiment3-fonts.py]. [TBC: confirm web-use rights before shipping].

## References
- The three experiment pages (see `art-direction.md` → References).
- Quote used in the site footer: Dorothea Lange on the camera teaching people how to see [live site footer].
- [TBC: outside references Ilham likes]

## Open questions
- Each audience's next step: subscribe, follow on TikTok, read the next chapter, or save or plan a trip?
- Which social platforms to link or embed (TikTok, Instagram, YouTube)? The home canvas already embeds a YouTube video [live site].
- Do you have the earlier brief that exp3 refers to? Its Don'ts belong here.
- Are tutorials and reviews still part of the plan (the newsletter promises them, but none exist yet)?
