# Hasura Console Assistant

Chrome拡張機能で、Hasura Consoleの作業効率を向上させます。Relationshipsタブでのテーブル名リンク化や、relationship名の自動提案など、便利な機能を提供します。

## 機能

### 1. Relationships Linker
- **自動リンク変換**: Relationshipsタブ内のテーブル名を自動検出してリンク化
- **直接遷移**: クリックで対象テーブルのデータブラウザページへ即座に移動
- **新しいタブで開く**: 別タブで開くため、現在の作業を中断しない

### 2. Relationship Name Suggester
- **自動名前提案**: Create Relationshipダイアログで、テーブル名とRelationship Typeに基づいて適切なrelationship名を自動提案
- **英語の複数形ルール対応**: object型ではそのまま、array型では複数形に変換（例: `category` → `categories`）
- **ワンクリック入力**: "Suggest Name"ボタンをクリックするだけで自動入力

## 技術スタック

- TypeScript
- React
- Vite
- Chrome Extension Manifest V3

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. ビルド

```bash
pnpm run build
```

ビルド成果物は `dist/` フォルダに出力されます。

### 3. Chrome拡張機能として読み込み

1. Chromeを開き、`chrome://extensions/` にアクセス
2. 右上の「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトの `dist/` フォルダを選択

### 4. 使用方法

#### Relationships Linker
1. Hasura Consoleを開く
2. データベーステーブルのRelationshipsタブに移動
3. テーブル名が自動的にリンクになっていることを確認
4. クリックして対象テーブルのデータブラウザへ移動

**注意**: 
- リンクをクリックした際に再ログインを求められる場合は、Hasuraのパスワード保存ボタンを押してログインしてください。これにより、今後スムーズにページ遷移できるようになります。
- 外部テーブルとのrelationshipについては、リンクは生成されません。

#### Relationship Name Suggester
1. Hasura Consoleを開く
2. データベーステーブルのRelationshipsタブに移動
3. "Add relationship"ボタンをクリック
4. Create Relationshipダイアログで"To Reference"を選択
5. Relationship Typeの隣に表示される"Suggest Name"ボタンをクリック
6. Relationship Name入力欄に適切な名前が自動入力される

**提案ルール**:
- **Object型**: テーブル名をそのまま使用（例: `user` → `user`）
- **Array型**: テーブル名を複数形に変換（例: `user` → `users`, `category` → `categories`）


## 開発

### 開発モード（ウォッチモード）

```bash
pnpm run dev
```

ファイルの変更を監視して自動的に再ビルドします。拡張機能を再読み込みすることで変更が反映されます。

### コードフォーマット & リント

```bash
# フォーマット
pnpm run format

# リント
pnpm run lint

# リント（自動修正）
pnpm run lint:fix

# フォーマット & リント（自動修正）
pnpm run check:fix
```

### 型チェック

```bash
pnpm run type-check
```

## プロジェクト構造

```
hasura-console-assistant/
├── manifest.json           # Chrome拡張機能のマニフェストファイル
├── package.json
├── tsconfig.json
├── vite.config.ts          # Viteビルド設定
├── src/
│   └── content/
│       └── index.tsx       # Content Script（メイン処理）
└── dist/                   # ビルド出力先
```

## 注意事項

- Hasura ConsoleのDOM構造はバージョンによって変わる可能性があります
- アイコン画像（icon16.png, icon48.png, icon128.png）は別途追加する必要があります

## ライセンス

MIT
