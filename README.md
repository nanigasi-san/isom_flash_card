# ISOM Quiz

ISOM番号から日本語名を当てる、React + Vite ベースのクイズアプリです。

## ローカル開発

1. Node.js 18 以降を用意します。
2. 依存関係を入れます。

```bash
npm install
```

3. 開発サーバーを起動します。

```bash
npm run dev
```

4. 表示されたURLをブラウザで開きます。

## 手元での動作確認手順

1. 開発サーバーを起動します。

```bash
npm run dev
```

2. ブラウザで表示されたローカルURLを開きます。

3. 初期画面で問題数を選び、`クイズを始める` を押します。

4. 次の観点を確認します。

- 問題数を変えると、その値でセッションが始まる
- 問題画面で ISOM 番号が表示され、日本語名の選択肢が 6 個出る
- 選択肢を押すと選択状態が見た目で分かる
- `答え合わせ` のあとに、番号・正解名・記号画像が表示される
- 最終問題後に結果画面へ遷移する
- スマホ幅にしても大きくレイアウトが崩れず、全体が1画面内で収まる

5. 本番ビルドも確認する場合は次を実行します。

```bash
npm run build
```

6. ビルド結果をローカルで確認する場合は次を実行します。

```bash
npm run preview
```

## 本番ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

## Vercel デプロイ手順

### GitHub 連携でデプロイする場合

1. このリポジトリを GitHub に push します。
2. Vercel にログインして `Add New Project` を選びます。
3. 対象の GitHub リポジトリを Import します。
4. Framework Preset は `Vite` を選ぶか、自動検出された内容をそのまま使います。
5. Build Command が `npm run build`、Output Directory が `dist` になっていることを確認します。
6. `Deploy` を押します。

### Vercel CLI を使う場合

1. Vercel CLI を入れます。

```bash
npm i -g vercel
```

2. プロジェクト直下でログインします。

```bash
vercel login
```

3. 初回デプロイを実行します。

```bash
vercel
```

4. 本番反映は次で行います。

```bash
vercel --prod
```

## 構成

- `src/App.jsx`: 画面全体とクイズ進行
- `src/data/isomDataset.js`: SVG と日本語名JSONを結合したデータセット
- `src/styles.css`: レスポンシブUI
- `ISOM/`: 記号SVGアセット
