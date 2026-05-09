---
id: hando-development-log
title: "Hando — 一個週末，徹底清除 UI 設計師的圖片交付痛點：開源工具開發紀錄"
date: 2026-04-27
category: Development
categoryName: 開發筆記
series: Side Project Chronicles
seriesVolume: 02
excerpt: "身為 UI 設計師，每次圖片交付都要在 TinyPNG、Squoosh 之間反覆切換,壓縮一輪、轉 WebP、再轉 AVIF。受不了這個無效循環,我用一個週末寫了 Hando——一次拖放,同時輸出壓縮後的原格式、WebP 與 AVIF 伴隨檔。這不只是工具,更是對設計師工作流程的反思與實踐。"
tags: 
  - 前端開發
  - UI/UX 設計
  - Rust
  - Tauri
  - SideProject
  - 開源工具
  - 圖片優化
image: https://r2bucket.homershie.com/assets/imgs/blog/Hando/hando-hero.webp
thumbnail: https://r2bucket.homershie.com/assets/imgs/blog/Hando/hando-hero.webp
author: Homer Shie
readingTime: 5
draft: false
keywords: Hando,圖片壓縮,WebP,AVIF,Tauri,Rust,開源工具,UI設計,前端工具,圖片優化,mozjpeg,oxipng
canonical: https://homershie.com/blog/Hando/hando-development-log
ogType: article
twitterCard: summary_large_image
lastModified: 2026-04-27
lang: zh-TW
---

<center class="mb-4"><i>Side Project Chronicles vol.02</i></center>

<!-- 🖼️ 圖片 ①:Hero 圖(Mockup + Logo + Slogan) -->
::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/Hando/hando-hero.webp" alt="Hando 開源圖片優化工具首圖" title="Hando - 設計師的圖片交付神器" loading="lazy" class="w-100" >
::

## 一、設計師的慢性疼痛:圖片交付的無效循環

身為 UI 設計師,圖片交付一直是個慢性疼痛點。每次稿件 final 之後,我都會重複同一個無聊的循環:

1. 用 TinyPNG 壓一輪 PNG / JPG
2. 開 Squoosh 一張一張轉 WebP
3. 工程師回:「有 AVIF 嗎?」再開一次 Squoosh

市面上的工具不是只做壓縮,就是只做格式轉換。**沒有一個能在同一個拖放動作裡把這三件事一次做完。**

受不了這個無效率的流程,我趁著週末直接寫了一個工具:**Hando**。

## 二、核心理念:一次拖放,三種輸出

Hando 最關鍵的設計是「同時輸出 WebP / AVIF 伴隨檔」。拖一張 PNG 進去,你會同時得到:

- 壓縮過的原格式 PNG
- 同名 WebP
- 同名 AVIF(現代格式中壓縮率最高的)

對工程師來說,他們可以直接無腦寫出這樣的完美 fallback:

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.png" alt="">
</picture>
```

對設計師來說,交付流程從「3 個工具、5 個步驟」變成了簡單的一步:**「拖進去」**。

## 三、榨乾每種格式的最佳編碼器

我沒有在壓縮品質上妥協。每種格式都選用了業界公認最強的編碼器:

- **JPEG** — mozjpeg(高壓縮率,畫質保留極佳)
- **PNG** — imagequant + oxipng(雙重最佳化)
- **WebP** — libwebp 官方編碼器
- **AVIF** — ravif

每種格式都有獨立的品質滑桿,讓你能針對不同素材精細調整。如果壓出來反而比原檔大(例如已壓縮過的 JPEG),Hando 會聰明地自動跳過。不小心壓壞?支援一鍵 Undo,原檔都在垃圾桶裡,隨時可以撿回來。

<!-- 🖼️ 圖片 ②:設定頁面截圖 -->
::image-lg
<img src="https://r2bucket.homershie.com/assets/imgs/blog/Hando/hando-settings.webp" alt="Hando 設定頁面 - 獨立品質滑桿" title="每種格式的獨立品質控制" loading="lazy" class="w-100" >
::

## 四、技術棧與開發巧思

- **前端:** TypeScript + Vite(WebView)
- **後端:** Rust + Tauri 2(所有編碼在 process 內完成,沒有 sidecar、沒有捆綁 Node 執行檔)
- **i18n 型別推導:** 既然要做,就一次到位。Hando 內建 7 國語言(英/繁中/簡中/日/韓/西/葡)。實作上有個小巧思:`MessageKey` 型別是從 locale 物件遞迴推導出的 leaf key union,**編譯時就能抓到拼錯的翻譯 key**,杜絕 runtime 跳空白的窘境。

## 五、結語:開源、免費、為設計師而生

Hando 採用 **AGPL-3.0 開源協議**,雙擊開啟,Windows 與 macOS Universal 都有提供。沒有訂閱、沒有上傳到雲端的隱私疑慮、沒有檔案大小限制——一切都在你的本機完成。

如果你也受夠了在多個工具之間切換的圖片交付流程,歡迎下載試用。這是我為自己、也為所有同樣有強迫症的設計師寫的小工具。

---

**📥 下載連結:** 從 [GitHub Releases](https://github.com/homershie/Hando/releases/tag/v0.1.1) 下載(.exe 或 .app.zip 二選一),解壓即用。

如果 Hando 幫你省下了準時下班的時間,歡迎在 Ko-fi 抖內任何金額——這會用來支付 Apple Developer Program 年費,讓未來的 macOS 使用者不用再手動跑 `xattr -cr` 解決安全性阻擋。

歡迎在下方留言或透過 [Instagram](https://www.instagram.com/homer_create/) 與我交流。無論是關於工具設計的想法,還是 Tauri 開發的討論,我都很期待與大家碰撞出不同的火花。
