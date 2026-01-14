# セットアップガイド

## 前提条件

- Node.js v22.13.1（`.node-version`で指定）
- pnpm（パッケージマネージャー）
- Google Chrome

## インストール手順

### 1. Node.jsバージョンの確認

プロジェクトはNode.js v22.13.1を使用します。nvmやnodenvなどのバージョン管理ツールを使用している場合、`.node-version`ファイルが自動的に読み込まれます。

```bash
node --version  # v22.13.1であることを確認
```

### 2. 依存関係のインストール

pnpmがインストールされていない場合は、まずpnpmをインストールします：

```bash
npm install -g pnpm
```

プロジェクトルートで依存関係をインストール：

```bash
pnpm install
```

### 3. ビルド

```bash
pnpm run build
```

これにより、`dist/` フォルダに以下のファイルが生成されます：
- `content.js` - Content Script
- `manifest.json` - Chrome拡張機能のマニフェスト

### 3. Chrome拡張機能として読み込む

1. Google Chromeを開く
2. アドレスバーに `chrome://extensions/` と入力してEnter
3. 右上の「デベロッパーモード」トグルを**オン**にする
4. 「パッケージ化されていない拡張機能を読み込む」ボタンをクリック
5. ファイル選択ダイアログで、プロジェクトの `dist/` フォルダを選択

### 4. コード品質のチェック（オプション）

ビルド前にコードフォーマットとリントを実行することをお勧めします：

```bash
# フォーマット & リント（自動修正）
pnpm run check:fix
```

### 5. 動作確認

1. Hasura Consoleにアクセス（例: `https://your-hasura-instance.com/console/`）
2. データベーステーブルを選択
3. 「Relationships」タブをクリック
4. テーブル名が青色のリンクになっていることを確認
5. リンクをクリックして、対象テーブルのデータブラウザページに移動できることを確認

## 開発モード

ファイルの変更を監視して自動的に再ビルドするには：

```bash
pnpm run dev
```

変更後、Chrome拡張機能ページで拡張機能の再読み込みボタン（🔄）をクリックしてください。

## コード品質管理

このプロジェクトはBiomeを使用してコードフォーマットとリントを行います。

### 利用可能なコマンド

```bash
# フォーマットのみ
pnpm run format

# リントのみ
pnpm run lint

# リント（自動修正）
pnpm run lint:fix

# フォーマット & リント（チェックのみ）
pnpm run check

# フォーマット & リント（自動修正）
pnpm run check:fix
```

## トラブルシューティング

### 拡張機能が動作しない

1. Chrome拡張機能ページ（`chrome://extensions/`）で拡張機能が有効になっているか確認
2. Hasura ConsoleのURLが `https://*/console/*` または `http://*/console/*` のパターンに一致しているか確認
3. ブラウザのデベロッパーツール（F12）のコンソールでエラーが出ていないか確認

### リンクが表示されない

1. Relationshipsタブが開かれているか確認
2. ページを再読み込みしてみる
3. Hasura ConsoleのDOM構造が変更されている可能性があります。その場合は `src/content/index.tsx` のセレクタを調整する必要があります

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

## アンインストール

1. `chrome://extensions/` にアクセス
2. 「Hasura Console Assistant」の「削除」ボタンをクリック

