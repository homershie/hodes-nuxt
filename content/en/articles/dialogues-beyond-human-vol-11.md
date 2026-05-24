---
id: dialogues-beyond-human-vol-11
title: "I Am Not Only Me — Contemplating the Dependent Origination of My Work"
date: 2026-05-24
category: Philosophy
categoryName: Philosophy
series: Dialogues Beyond Human
seriesVolume: 11
excerpt: "During the MemeDam 2.0 upgrade, there was a stretch where I shut the entire backend down. The site was basically broken — no logins, hearts didn't register, the activity wall was empty. I thought no one would notice. Then someone emailed me. That email made me start rethinking: when a project starts running on other people's expectations, when most of the technical details are written by AI, what exactly is 'the work I made'? From the origins of hando and MemeDam 2.0, to bypassing the yardstick of 'can this make money,' to unpacking the Buddhist concepts of dependent origination and the Middle Way — this late-night dialogue tries to dissolve the myth of a work's 'pure self-nature.'"
tags:
  - Dependent Origination
  - The Middle Way
  - Creation
  - Open Source
  - Philosophy
image: https://r2bucket.homershie.com/assets/imgs/blog/dialogues-beyond-human-vol-11.webp
thumbnail: https://r2bucket.homershie.com/assets/imgs/blog/dialogues-beyond-human-vol-11.webp
author: Homer Shie
readingTime: 9
draft: false
keywords: dependent origination,the Middle Way,creation,open source,side project,hando,MemeDam,freelance,AI collaboration,philosophy
canonical: https://homershie.com/en/blog/non-human-midnight-dialogues-vol-11
ogType: article
twitterCard: summary_large_image
lastModified: 2026-05-24
lang: en
---


<center class="mb-4"><i>Dialogues Beyond Human vol.11</i></center>

::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/dialogues-beyond-human-vol-11.webp" alt="I Am Not Only Me" title="Contemplating the Dependent Origination of My Work" loading="lazy" class="w-100" >
::

During the MemeDam 2.0 upgrade, there was a stretch where I shut the entire backend down — refactoring from a Vue 3 SPA into Nuxt 4 SSR and rewiring Supabase. For those few days the site was basically broken — no logins, hearts didn't register, the activity wall was empty. I figured no one would notice.

Then someone emailed me.

The message was short — essentially asking "is the site down? did something happen?" I sat with it for a while, surprised and a little glad. But more precisely, it felt like getting hit. This site was no longer only mine.

## 1. The Email That Broke the Isolation

The initial direction for MemeDam came out of a conversation with ChatGPT. I'd often see memes referenced in online videos and have no idea what the joke was — and that recurring "I don't know what everyone's laughing at" feeling accumulated into a vague sense of isolation. So I built a meme wall with annotations, hoping the site could serve as cultural preservation and a community for meme lovers. But after the first version went public, traffic was poor, so I figured I'd just casually work on 2.0 — making changes as ideas came up — assuming there probably weren't any real users yet.

It wasn't until I got that email last month that I realized — it had become something other people periodically open. I can still decide its direction, but it's now running with someone else's expectations attached.

The feeling was more complex than I expected. Half was happiness: someone really is using it. The other half was pressure: whether this thing can continue to exist is no longer only my own concern.

## 2. Bypassing the Yardstick Called "Monetization"

Not long ago, someone asked me why I spend time making things that look like hobby projects, instead of writing programs that actually make money — like logistics integration tools that have real market scale.

At the time I answered with "an individual can't build something that practically useful" — a solo developer can't write integration systems; that requires a company, capital, a team, a customer base. It sounded reasonable enough.

But honestly, as he pointed out, the side projects I'm working on still can't make money. MemeDam applied for AdSense and got rejected — actual revenue is zero. hando, because of insufficient update frequency and not enough resolved issues, can't even get into the official GitHub Sponsors program. The question he raised hasn't actually been refuted, even today.

And yet I keep updating.

Why do I keep updating something that won't make money? I asked Claude. He pointed out that the question "why don't you write programs that make money" presupposes that "programs should be measured by the yardstick of 'will this make money.'" When I answered "an individual can't build practical tools," it sounded like I was refuting it — but I was actually conceding to that yardstick. I was just saying "I don't meet the bar." Both responses operate inside *das Man*; they just stand on opposite sides of the same yardstick.

What actually drove hando and MemeDam 2.0 to completion wasn't this logic. It was that I later bypassed that yardstick entirely and just made them — and the real reason wasn't on the "programs that make money" yardstick at all.

## 3. Disassembling the Parts: Two Machines Woven from Shared Conditions

hando and MemeDam 2.0 were being pushed forward during almost the same period — after 3/30, for about a month, I spent entire weekends at home writing code. The two projects went in different directions: hando is a desktop image compression tool, MemeDam 2.0 is a web-based meme encyclopedia (rebuilt from the original Vue 3 SPA into Nuxt 4 SSR + Supabase). But disassembled, you can see they share very similar sources of conditions.

The pain points weren't mine alone. hando came from Photoshop's slow file conversion, the useless loop of constantly switching between image compression tools. MemeDam came from a gap in cultural information. Both are problems activated by daily life — not needs I generated out of thin air.

The era was sitting on the table. The Tauri + Rust ecosystem had just gained momentum, Nuxt 4 SSR + Supabase had just matured enough, and the rise of AI had lowered the technical barrier. These conditions weren't ones I created.

Old ideas were activated by conditions. I'd had the idea of "I want to write a lightweight desktop app" for a long time, and had always felt memes were scattered across platforms — but they were just ideas. It was only when era + time + pain-point conditions wove together that they got activated into actual code.

The source of time was the same. Those weekends I poured in entirely were backed by the surplus time that suddenly opened up after the breakup.

Most of the technical details were written by AI. I'm the design and architecture decision-maker; AI is the executor.

But these conditions don't automatically grow into hando or MemeDam. It was me who chose Tauri over Electron. It was my obsessiveness that pushed it to a fully Rust-native encoder. It was me who chose the dual-wall architecture (Home Meme Wall + Activity Wall) rather than a pure encyclopedia, and me who chose SSR for SEO and performance. No single condition can paint the whole picture of hando or MemeDam — but combined, they exist.

## 4. Dependent Origination and the Middle Way: When the Work No Longer Belongs to "Me"

I asked Claude: if every component comes from external conditions, what role does "I" actually play? Claude brought up a term from a completely different field — *dependent origination*. The meaning is simple: everything arises from a combination of conditions; there is no independent, eternal, unchanging "self-nature." My making hando is dependent origination, your opening this article is dependent origination, even this very conversation itself is.

I then asked: if I accept that concept, doesn't the work just become an illusion?

Claude offered another term — *the Middle Way*. "Being assembled from conditions" does not equal "doesn't exist." What dependent origination dismantles isn't the work itself, only its "pure self-nature" — the arrogance of "this is entirely made by me, the other conditions don't matter." **The Middle Way is staying at the position where "both extremes are wrong" — neither slipping into nihilism nor retreating into self-inflation.**

In freelance work, my sense of ownership over the work is often the source of conflict. The client wants to change a color palette I don't like, the PM wants to cut a composition I think works, the boss says the animation I spent three days on has to go — every single time, the reaction "this is mine, I know better, why are you touching it" rises up.

But if this project's dependent origination already includes the client's needs, the PM's judgment, the boss's tradeoffs, then from the very beginning this project isn't "what I made" — it's "what we assembled together." The "pure self-nature" that the ownership instinct is trying to protect doesn't actually exist. The Middle Way's landing point here is: accept that the final result is a version negotiated from various conditions, but don't deny that my own decisions genuinely played a real role within it.

hando is a real tool — people download it, install it, use it to compress images. MemeDam 2.0 is a real website — someone wrote in asking why it was down. That email doesn't vanish just because I admit MemeDam's dependent origination is empty. hando doesn't suddenly become AI's work just because "most of the technical details were written by AI." Behind those technical choices, there are more subjective judgments that can't be quantified — why this tool is called hando and not something else, why the activity wall's visual tone ended up the way it did. Those choices still come from me — even though "me" itself is also assembled from conditions.

Disassembling dependent origination didn't turn the work into illusion. It just removed its "pure self-nature." What's left is a cleaner set of facts: there are servers running, some people are using it, and an email sits in my inbox.

## Closing: The Machine Keeps Running, and I Don't Know Why

Back to that email.

The small flash of happiness when I first opened it was quickly covered by another, more familiar reaction — "the activity wall's content filtering could probably be optimized," "should the reply system be more complete," "should the next version add a voting page." How critical I am of my own work has never been less than how I am of others'.

I joke about becoming a control freak over my own creations, but this controlling instinct is itself assembled — years of freelance work cultivating problem-solving reflexes, the INTJ's Ni-driven obsession with detail, the unwillingness to let go of needing to prove something, the need to numb myself with work. Even the "wanting to make things" impulse didn't appear out of nowhere from inside me.

But this machine keeps running. The work keeps moving forward. If someone asks me again why I make these things, my answer now resembles what Eren — the protagonist of *Attack on Titan* — gave Armin at the end when asked why he set off the Rumbling: I don't know.

Eren doesn't know the conditions behind triggering the Rumbling. Some say it was the obsession with "pursuing freedom," some say it was the cognitive confusion brought by the Founding Titan's power, some say it was the helplessness of being unable to change the future. But people in the moment can't always find all the conditions, and don't need to know them completely. **There are too many parts in this machine that I didn't design — but it really is running.**

In the next piece, I'll get into an even harder part to take apart — even "the way I make things" isn't purely mine either. An even more blurred, more shifting boundary.
