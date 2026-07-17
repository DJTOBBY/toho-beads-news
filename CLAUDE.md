# TOHO Beads World News — 編集ポリシー

このサイトは、世界中のTOHOビーズ(トーホー株式会社の製品)関連ニュースを集めて日本語で要約する、ファンメイドのニュースまとめサイト。`data/news.json` に記事データを追加する際は、以下のルールを必ず守ること。

## 記事を追加する前に

**「TOHOビーズっぽい話」ではなく、情報源に「TOHO」「TOHOBEADS」「TOHO BEADS」またはTOHOの具体的な製品名(例:「TOHO ROUND 11/0」「TOHO Treasure」「TOHOチャレンジ」等)が**文字通り**書かれていることを確認する。**

- ブランド名・企業名が似ている、テーマが似ている、といった状況証拠だけで「TOHOとの関連あり」と判断しない。
  (実例:過去に「オランダの毛糸ブランドScheepjesとTOHOがコラボ」という記事が誤って掲載されていた。実際にはArtbeads.com独自の商品ライン名「Metropolis」がScheepjesの毛糸ライン名とたまたま同じだっただけで、両社の提携は存在しなかった。)
- 情報源のページを実際に読み(WebFetchまたはWebSearchのスニペットで)、TOHOへの言及箇所を確認できなければ、記事化しない。

## 記事スキーマ:`verificationQuote` を必須項目とする

`category: "コラム"` (TOHOとの直接関係を明記しない文化紹介記事)を除く、すべての新規記事には `verificationQuote` フィールドを含めること。

- 情報源からTOHOへの言及箇所を**原文のまま**引用する(日本語訳ではなく原文)。
- 例:
  ```json
  "verificationQuote": "TOHO Beads, manufacturer of premium glass beads, was founded in Hiroshima after WWII..."
  ```
- 引用箇所が見つからない場合は記事を追加しない。もしくは `category: "コラム"` として、TOHOとの関連が未確認である旨を本文に明記して掲載する。

## コミット前に検証スクリプトを実行する

```
python3 scripts/validate_news.py
```

チェック内容:
- JSONとして正しくパースできるか
- `id` の重複がないか
- `date` が `YYYY-MM-DD` 形式か
- `コラム` 以外の記事に `verificationQuote` があるか、およびTOHOへの言及を含んでいるか(警告)

このスクリプトはPush時にGitHub Actions (`.github/workflows/validate-news.yml`) でも自動実行される。
