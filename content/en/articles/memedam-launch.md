---
id: memedam-launch
title: "For Everyone Who Only Dared Reply 'Haha' in the Group Chat: I Built a Meme Encyclopedia That Makes 'Not Getting It' Disappear."
date: 2026-05-09
category: Development
categoryName: Dev Notes
series: Building memedam
seriesVolume: 01
excerpt: "I used to be completely lost when it came to meme culture — a friend would send a meme in the group chat, everyone would lose it, and I'd stare at it before typing 'haha.' I realized most people never look up the memes they don't get — they just scroll past, and all that absurd joy slips away. So I built MemeDam — not a dictionary, but two walls: one that teaches you memes as you scroll, and one where meme lovers find their people."
tags:
  - memedam
  - meme
  - side project
  - internet culture
  - goal-oriented thinking
  - encyclopedia
  - Nuxt
  - Supabase
image: https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-launch.webp
thumbnail: https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-launch.webp
author: Homer Shie
readingTime: 8
draft: false
keywords: MemeDam,meme encyclopedia,internet memes,meme culture,goal-oriented thinking,Nuxt,Supabase,side project,community,activity wall
canonical: https://homershie.com/blog/memedam-launch
ogType: article
twitterCard: summary_large_image
lastModified: 2026-05-09
lang: en
---


<center class="mb-4"><i>Building memedam vol.01</i></center>

<!-- 📸 Image position 1 (Hero): Dual phone mockup — left: Home Meme Wall / right: Activity Wall, with tagline "Discover pure humor. Find your meme people." -->
::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-launch.webp" alt="MemeDam dual phone mockup" title="Discover pure humor. Find your meme people." loading="lazy" class="w-100" >
::

Honestly, I used to be completely lost when it came to meme culture.

A friend would drop a meme in the group chat, everyone would crack up, and I'd stare at it for ages before finally just typing "haha." That moment of "I have no idea what everyone's laughing at" — I'm pretty sure most people have been there.

The awkward part is, we usually don't ask. We're afraid of being laughed at, afraid of looking out of the loop, or we just figure "not knowing won't kill us." So those moments pile up into a quiet sense of distance — you scrolled past, but you never really joined.

MemeDam exists to make those moments rarer.

This post is my full train of thought behind building this product: why a goal-oriented person fell into the meme rabbit hole, why people don't actually look up the memes they don't get, and why I ended up building two walls instead of a dictionary.

## 1. I Was the Person Who Didn't Get What Was Funny

I'm the kind of person who defaults to goal-oriented thinking — what's the point of this? what does this conclusion lead to? does this logic hold?

So when I encountered the internet's "punchlines with no setup," its homophone jokes, its universally beloved brain-rot sounds, I was constantly lost. They don't solve problems, don't convey information, don't fit any "reasonable joke structure." If I had to classify them, I'd call them noise. But a lot of my friends loved them.

A friend sends a meme, he's dying laughing, I stare at it and just type "haha."
I scroll past a meme on social media with tens of thousands of likes, people flooding the comments with even funnier riffs — I keep lurking.

This went on for a long time. I didn't dislike memes — I just couldn't understand the logic of how they worked. And my world was one where you had to understand something before you could participate.

## 2. Then I Realized: Pointless Humor Is Its Own Kind of Meaning

One day I actually sat down and researched a meme I'd never understood.

Not the "Google it once and give up" kind of research — actually following the thread: where it came from, how it mutated, why it blew up, why everyone kept riffing on it, at which generation it evolved into something else entirely.

Something clicked in that moment.

A lot of interesting, beautiful things in life don't need to justify themselves. Or more precisely — "having no meaning" is the whole point.

A meme becomes a meme not because it's clever or useful. It's because **at that exact moment in time, a bunch of people collectively decided it was funny**. No reason. Just the shared consensus of that instant.

That kind of communal, inexplicable, no-explanation-needed joy — it's actually something precious. It can't be deduced, optimized, or manufactured. It can only be encountered, joined, collected.

For someone who's spent their life looking for meaning in everything, this was a genuinely disorienting cultural shift.

## 3. But Here's the Thing — Most People Never Actually Look It Up

That's the core problem MemeDam was built to solve.

When we encounter a meme we don't get, the typical response is: **scroll past, react with a laughing emoji, keep scrolling**.

We don't open Google, we don't ask our friends (too embarrassing), we don't dig deeper. Because "not knowing won't kill us."

But this means a lot of genuinely interesting things get missed. A meme you would have loved, a conversation you would have joined, a moment where you would have found your people — all of it scrolled away because "I don't really get what's happening here."

This is also why I didn't build a dictionary.

A dictionary is a passive tool — it assumes the user will actively look things up. But when it comes to memes, that assumption completely falls apart. **Nobody is going to stop mid-scroll, open a new tab, type in a search query, and read an explanation.** The friction is way too high for the "killing time on social media" context.

So MemeDam isn't a dictionary. It's two walls.

<!-- 📸 Image position 2: Home Meme Wall screenshot (mobile, dark mode) -->
::image-md
<img src="https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-home-meme-wall.webp" alt="MemeDam Home Meme Wall" title="Home Meme Wall — learn memes as you scroll" loading="lazy" class="w-100" >
::

**Home Meme Wall**: you scroll in, and every meme comes with a short explanation right there. You just get it as you go. The whole experience feels like scrolling Instagram, except you actually understand everything. No "I need to go look that up" — just "oh, I just learned that."

## 4. Why Two Walls? Because Meme People Have No Home

But solving "not getting it" is only half the problem.

People share memes across Instagram and Threads these days, scattered across every corner of every social platform. But the people who are genuinely deep into meme culture — the ones who remember the origin of an obscure meme, who care about how a phrase evolved, who'll explain the history behind an image to their friends — they've never had a place to call home.

Reddit is one option, but it's massive and impersonal. Discord is fragmented across thousands of servers. Threads is growing but scattered.
You want to recommend an obscure meme you love to someone who'll actually appreciate it? There's no right stage for that.

So MemeDam has a second wall — the **Activity Wall**.

<!-- 📸 Image position 3: Activity Wall screenshot (mobile), showing the community feel of recommendations and comments -->
::image-md
<img src="https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-activity-wall.webp" alt="MemeDam Activity Wall" title="Activity Wall — home for meme people" loading="lazy" class="w-100" >
::

The Activity Wall is where meme people connect. You can drop a meme you've been loving lately, see what others are recommending, comment on origins, share a niche meme with people who'll actually get it.

Two walls for two needs:

- **Home Meme Wall** solves the problem for people who "don't get it" — anyone who scrolls in can quickly understand a meme. **No one gets left behind.**
- **Activity Wall** solves the problem for dedicated meme people — there are others here who understand and love memes the way you do. You can share what you've been into and actually be seen.

One is an entry point. One is a gathering place. Newcomers can get in. Regulars don't get bored.

## 5. Three Ways to Use It

MemeDam actually has three levels of engagement — go as deep as you want:

| Level | Action | Who It's For |
|-------|--------|-------------|
| **Level 1: Scroll** | Pure browsing, memes with explanations | Just got off work, brain empty, need to laugh |
| **Level 2: Connect** | Like/dislike, hang out on the Activity Wall | Been on the fringes too long, looking for your meme people |
| **Level 3: Dig** | Collaborative editing, researching meme origins | Have a research obsession, want to become a meme scholar |

<!-- 📸 Image position 4: Interaction UI, with the "dislike" button highlighted — showing off the intentional design choice -->
::image-md
<img src="https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-reactions.gif" alt="MemeDam reaction buttons" title="Like, Dislike, Comment, Save, Share" loading="lazy" class="w-100" >
::

Not everyone will make it to Level 3. But that door is always open.

## 6. A Note on the Rewrite

The old version of MemeDam was built with Vue 3 SPA. It worked — but the experience had some painful gaps: slow initial load, invisible to search engines, and sharing a link was like sending out a broken kite — just a bare URL with no preview at all.

For a product that wants to feel like "scroll in and just get it," these are fatal flaws.

The new version is rebuilt on **Nuxt 4 SSR + Supabase** — I won't get into the technical details, but there are three differences users actually feel:

- **Loads faster**: the Meme Wall is visible on first render, no waiting for JS to finish
- **Shows up in search**: Google a meme name and MemeDam entries come up
- **Links come with cover images**: the old experience was sharing a bare URL; now every meme link shared to Discord, LINE, or wherever automatically pulls in the meme's cover image — this is what SSR-powered social sharing looks like

Supabase handles real-time sync for likes, comments, and collaborative edits. The explanation you just added? The next person to scroll through sees it immediately — that's what makes "growing the encyclopedia together" actually happen.

We also rebuilt the UI, dark mode, and mobile experience from scratch. **Mobile-first, dark mode, easy to use one-handed** — because the most common moment to open MemeDam is on the commute, before bed, or during that ten-minute stretch at 2am when sleep isn't happening.

<!-- 📸 Image position 5 (optional): Share preview comparison — bare URL on the left vs. rich preview card on the right -->
::image-md
<img src="https://r2bucket.homershie.com/assets/imgs/blog/MemeDam/memedam-share-preview.webp" alt="MemeDam share preview" title="Links with cover images" loading="lazy" class="w-100" >
::

I won't go deeper into the technical side — what users feel is: fast to open, easy to understand, smooth to share.

## 7. Why Spend Time on This at All?

I've asked myself this many times.

MemeDam won't make serious money. It's not a SaaS, there's no subscription model, no fundraising plans. The time spent maintaining it could easily go toward freelance work or side income that would be far more "efficient."

But coming back to that goal-oriented question I started with — "what's the meaning of this?"

I used to answer with "can this make money?" Then I realized **that's das Man answering for me** — the voice of "that's what everyone does," not my own voice.

What MemeDam means to me: **it archives the joys that can't be explained — which is exactly what someone like me, who's spent a lifetime searching for meaning, most needs to learn to catch.** It's a gift to myself, and a gift to everyone who has ever typed "haha" in a group chat while secretly having no idea what was happening.

If it happens to become a home for meme people along the way — even better.

## Closing

Back to that moment in the group chat, typing "haha" and hoping no one noticed.

That kind of moment won't disappear entirely — there will always be new memes, new subcultures, new circles, always something you haven't caught up to yet. But **you can choose whether to leave a place where those moments can be understood later**.

MemeDam is here.

If you're the kind of person who watches everyone else laugh and wonders what you missed — come scroll through MemeDam.
If you're already deep in meme culture — come find your people, and maybe fill in the explanation for that one niche meme nobody's documented yet.

Three ways to get started:

1. Open the Home Meme Wall and scroll — see if any memes that used to confuse you suddenly make sense
2. When something makes you smile (or makes you want to hit dislike), leave a reaction — make your mark
3. Check the Activity Wall to see what other meme people are recommending, then share one of your favorites so your people can find you

👉 **[memedam.com](https://memedam.com)**

If you think a meme should be in there but isn't, let me know — or just go edit it in yourself.

Discover pure humor on MemeDam. Find your meme people.

---

<!-- Image list summary (for editors/designers) -->

<!--
📸 Image list for this post:

1. Hero (required)
   File: memedam-launch.webp
   Content: Dual phone mockup — left: Home Meme Wall, right: Activity Wall
   Tagline: Discover pure humor. Find your meme people.
   Suggested size: 1600×900 (16:9) or 1200×675

2. Home Meme Wall screenshot (required)
   File: memedam-home-meme-wall.webp
   Content: Mobile, dark mode — home screen filled with meme cards + explanations
   Suggested size: tall mobile screenshot portrait, or 800×1600

3. Activity Wall screenshot (required)
   File: memedam-activity-wall.webp
   Content: Mobile — community feel of user recommendations and comments
   Suggested size: tall mobile screenshot portrait, or 800×1600

4. Interaction UI (required)
   File: memedam-reactions.webp
   Content: Meme card with the "dislike" button highlighted
   Suggested size: 800×800 or 800×600

5. Share preview comparison (optional)
   File: memedam-share-preview.webp
   Content: Bare URL on the left vs. rich preview card on the right
   Suggested size: 1200×600 (side-by-side comparison)

Backup images (decide based on article length):
- Meme detail page (origin/evolution section) — can go in Section 5, Level 3
- Editor interface screenshot (collaborative editing) — can go in Section 5, Level 3
- Before/after comparison (old vs. new home page) — can go in Section 6
-->
