---
id: anidaze-development-log
title: "AniDaze — 從設計師視角打造的極致追番體驗：開發紀錄與設計思維"
date: 2026-03-13
category: Development
categoryName: 開發筆記
series: Side Project Chronicles
seriesVolume: 01
excerpt: "當視覺設計師遇上前端開發，如何解決「追番資訊碎片化」的痛點？從 UI/UX 的強迫症出發，整合多平台資料與響應式設計，打造一個既漂亮又實用的動畫時日表。這不只是一個工具，更是一場關於資訊設計與使用者體驗的實踐。"
tags: 
  - 前端開發
  - UI/UX 設計
  - Next.js
  - SideProject
  - 動漫文化
  - 資訊架構
image: https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-hero.webp
thumbnail: https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-hero.webp
author: Homer Shie
readingTime: 5
draft: false
keywords: AniDaze,動畫時日,追番工具,UI設計,前端開發,Next.js,Supabase,響應式設計,RWD,資訊整合
canonical: https://homershie.com/blog/AniDaze/anidaze-development-log
ogType: article
twitterCard: summary_large_image
lastModified: 2026-03-13
lang: zh-TW
---

<center class="mb-4"><i>Side Project Chronicles vol.01</i></center>

::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-hero.webp" alt="AniDaze 動畫時日首圖" title="AniDaze - 設計師的追番儀表板" loading="lazy" class="w-100" >
::

## 一、碎片化時代的追番苦惱

身為一名視覺設計師，同時也是重度動漫迷，我發現「追番」這件事在資訊獲取上意外地低效。每當新番季到來，我往往需要經歷一段機械式的循環：在 A 網站查播放時間、在 B 分頁看評分、最後再跳轉到 C 平台做紀錄。

這種**資訊碎片化**（Information Fragmentation）不僅干擾了純粹的觀影樂趣，更讓身為設計師的我感到不安——資訊本該是優雅且直覺的。於是，我決定動手開發 [AniDaze 動畫時日](http://www.anidaze.com)，目標很單純：**打造一個美感與功能並存的追番整合工具。**

## 二、設計哲學：一目了然的直覺美學

在 UI/UX 的設計上，AniDaze 核心理念是「減法」。我們不需要過多的雜訊，只需要在對的時間點呈現對的資訊。

針對不同使用者的習慣，我設計了四種檢視模式（週檢視、月檢視各搭配兩種視圖）。這不僅是排版上的變換，更是對於 **「時間流」**的不同詮釋——你可以像看行事曆一樣優雅地規劃週末的觀影清單，也可以快速掃描當季的熱門走向。

::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-views.gif" alt="AniDaze 檢視模式展示" title="四種模式的靈活切換" loading="lazy" class="w-100" >
::

## 三、整合的力量：告別分頁俠

這是我在開發過程中投入最多心血的部分。AniDaze 整合了 AniList、Bangumi、Wikipedia 等多家平台的資料庫。透過技術手段，我將原本散落在各處的評分、播放時間、以及多語言的作品資訊進行了統一。

這對使用者來說意味著：**不再需要當「分頁俠」**。同一個頁面中，你可以同時參考多方平台的評價，決定這部作品是否值得投入時間，並在當下完成個人的觀看紀錄。

::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-integration.webp" alt="AniDaze 多平台整合特寫" title="資訊整合的視覺呈現" loading="lazy" class="w-100" >
::

## 四、響應式體驗：設計師的自尊心

雖然目前 AniDaze 尚未推出原生 App，但我對網頁版的 **RWD（響應式網頁設計）** 有著極高的要求。

我特別優化了行動裝置的操作元件，例如引入了符合直覺的 **Bottom Sheet（底部抽屜選單）**，確保使用者即便在單手握持手機的情況下，也能流暢地進行篩選、搜尋與紀錄。對我來說，網頁版不應該是手機上的妥協，而應該是另一種適配後的完美呈現。

::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/AniDaze/anidaze-mobile-mockup.webp" alt="AniDaze 行動版 Mockup" title="跨裝置的無縫體驗" loading="lazy" class="w-100" >
::

## 五、結語：持續進化的 Side Project

AniDaze 對我而言，不只是一個前端技術（Next.js / Supabase）的練習場，更是一個關於「解決問題」的實踐紀錄。目前網頁版功能已全面升級完畢，支援用戶 Follow 作品、紀錄觀看狀態與心得評分。

如果你也在尋找一個乾淨、高效且充滿設計感的追番工具，歡迎來 AniDaze 逛逛。這裡沒有過度的廣告干擾，只有為了動漫迷而生的純粹空間。

---

**🚪 傳送門：** [www.anidaze.com](http://www.anidaze.com)

歡迎在下方留言或透過 [Instagram](https://www.instagram.com/homer_create/) 與我交流。無論是關於介面設計的想法，還是技術實作的討論，我都很期待與大家碰撞出不同的火花。