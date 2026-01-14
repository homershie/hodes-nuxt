# Blog Article SEO Frontmatter Reference

This document describes all available SEO fields for blog articles in the `content/articles/` directory.

## Frontmatter Fields

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique article identifier (must match filename) | `dialogues-beyond-human-vol-01` |
| `title` | string | Article title | `"自由的幻象與框架的重量"` |
| `date` | string | Publication date (YYYY-MM-DD) | `2026-01-14` |
| `category` | string | Category ID (must exist in categories.json) | `Philosophy` |
| `categoryName` | string | Display name for category | `哲學思辨` |
| `excerpt` | string | Article summary (150-200 chars recommended) | `"年輕時討厭框架..."` |
| `image` | string | Main image URL (used for OG and Twitter) | `https://...webp` |
| `thumbnail` | string | Thumbnail image URL | `https://...webp` |
| `author` | string | Author name | `Homer Shie` |

### Optional SEO Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `keywords` | string | `''` | Comma-separated keywords for `<meta name="keywords">` |
| `canonical` | string | Auto-generated | Custom canonical URL |
| `ogType` | string | `'article'` | Open Graph type |
| `twitterCard` | string | `'summary_large_image'` | Twitter Card type |
| `lastModified` | string | `''` | Last modification date (YYYY-MM-DD) |
| `lang` | string | `'zh-TW'` | Language code for `<html lang>` and `og:locale` |
| `tags` | array | `[]` | Array of tags for `article:tag` meta |
| `readingTime` | number | `0` | Estimated reading time in minutes |
| `draft` | boolean | `false` | Draft status (not used in rendering yet) |

### Additional Fields

| Field | Type | Description |
|-------|------|-------------|
| `series` | string | Series name for article grouping |
| `seriesVolume` | string | Volume number in series |

## Example Frontmatter

```yaml
---
id: dialogues-beyond-human-vol-01
title: "自由的幻象與框架的重量"
date: 2026-01-14
category: Philosophy
categoryName: 哲學思辨
series: 非人類深夜對話錄
seriesVolume: 01
excerpt: "年輕時討厭框架與體制..."
tags:
  - 自由與框架
  - 資本主義
  - 職涯思考
image: https://r2bucket.homershie.com/assets/imgs/blog/example.webp
thumbnail: https://r2bucket.homershie.com/assets/imgs/blog/example.webp
author: Homer Shie
readingTime: 8
draft: false
keywords: 自由,框架,資本主義,職涯
canonical: https://homershie.com/blog/example
ogType: article
twitterCard: summary_large_image
lastModified: 2026-01-14
lang: zh-TW
---
```

## Generated Meta Tags

The article page (`app/pages/article/[id].vue`) generates the following meta tags:

### HTML Attributes
```html
<html lang="zh-TW">
```

### Basic Meta
```html
<meta name="description" content="[excerpt]">
<meta name="keywords" content="[keywords]">
<meta name="robots" content="index, follow">
```

### Open Graph
```html
<meta property="og:title" content="[title]">
<meta property="og:description" content="[excerpt]">
<meta property="og:image" content="[image]">
<meta property="og:url" content="[canonical]">
<meta property="og:type" content="[ogType]">
<meta property="og:locale" content="zh_TW">
```

### Article Meta
```html
<meta property="article:published_time" content="[date]">
<meta property="article:modified_time" content="[lastModified]">
<meta property="article:author" content="[author]">
<meta property="article:tag" content="[tag1]">
<meta property="article:tag" content="[tag2]">
...
```

### Twitter Card
```html
<meta name="twitter:card" content="[twitterCard]">
<meta name="twitter:title" content="[title]">
<meta name="twitter:description" content="[excerpt]">
<meta name="twitter:image" content="[image]">
```

### Canonical Link
```html
<link rel="canonical" href="[canonical]">
```

### JSON-LD Schema (BlogPosting)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[title]",
  "description": "[excerpt]",
  "image": "[image]",
  "datePublished": "[date]",
  "dateModified": "[lastModified]",
  "inLanguage": "[lang]",
  "keywords": "[tags joined by comma]",
  "author": { "@type": "Person", "name": "[author]" },
  "publisher": { "@type": "Organization", "name": "HODES" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "[canonical]" }
}
```

## Notes

1. **File naming**: The `id` field must match the markdown filename (without `.md` extension)
2. **Categories**: Must be defined in `content/config/categories.json`
3. **Images**: Twitter Card uses the same `image` field as Open Graph
4. **Fallbacks**: Old articles without SEO fields will use default values

---

**Last Updated**: 2026-01-14
**Maintainer**: Homer Shie
