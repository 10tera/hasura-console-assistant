# リリース手順

このドキュメントでは、Hasura Console AssistantのChrome拡張機能をリリースする手順を説明します。

## 前提条件

- [ ] pnpmがインストールされている
- [ ] Node.js v22.13.1がインストールされている
- [ ] GitHubアカウントがある
- [ ] リポジトリへのpush権限がある
- [ ] 作業ディレクトリがクリーンな状態（未コミットの変更がない）

## リリース手順

### 1. 準備

#### 1.1 作業ディレクトリの確認

```bash
git status
```

未コミットの変更がある場合は、先にコミットまたはstashしてください。

#### 1.2 最新の状態に更新

```bash
git switch main
git pull
```

### 2. バージョンの決定

セマンティックバージョニング（`MAJOR.MINOR.PATCH`）に従ってバージョンを決定します。

- **MAJOR**: 後方互換性のない変更（例: 1.0.0 → 2.0.0）
- **MINOR**: 後方互換性のある機能追加（例: 1.0.0 → 1.1.0）
- **PATCH**: 後方互換性のあるバグ修正（例: 1.0.0 → 1.0.1）

現在のバージョンは`package.json`で確認できます：

```bash
cat package.json | grep version
```

### 3. バージョン番号の更新

#### 3.1 package.jsonの更新

```bash
# 例: 1.0.1 にバージョンアップする場合
npm version 1.0.1 --no-git-tag-version
```

または手動で`package.json`の`version`フィールドを編集します。

#### 3.2 manifest.jsonの更新

`manifest.json`の`version`フィールドを手動で更新します：

```json
{
  "manifest_version": 3,
  "name": "Hasura Console Assistant",
  "version": "1.0.1",
  ...
}
```

### 4. 品質チェック

#### 4.1 Lint & Format

```bash
pnpm run check:fix
```

#### 4.2 Type Check

```bash
pnpm run type-check
```

エラーがある場合は修正してください。

### 5. ビルド

```bash
pnpm run build
```

`dist/`フォルダにビルド成果物が生成されます。

### 6. 動作確認（推奨）

1. Chrome で `chrome://extensions/` を開く
2. 既存の拡張機能を削除（テスト中の場合）
3. 「パッケージ化されていない拡張機能を読み込む」から `dist/` フォルダを選択
4. Hasura Consoleで以下を確認：
   - Relationshipsタブでテーブル名がリンク化されているか
   - Create Relationshipダイアログで"Suggest Name"ボタンが表示されるか
   - ボタンをクリックして正しく動作するか

### 7. リリースアーカイブの作成

```bash
# バージョン番号を変数に設定（例: v1.0.1）
VERSION=v1.0.1

# distフォルダをzip化
cd dist
zip -r ../hasura-console-assistant-${VERSION}.zip .
cd ..
```

`hasura-console-assistant-v1.0.1.zip`が作成されます。

### 8. Git操作

#### 8.1 変更をコミット

```bash
git add package.json manifest.json
git commit -m "chore: release v1.0.1"
```

#### 8.2 タグを作成

```bash
git tag v1.0.1
```

#### 8.3 プッシュ

```bash
# メインブランチをプッシュ
git push origin main

# タグをプッシュ
git push origin v1.0.1
```

### 9. GitHub Releaseの作成

1. GitHubのリポジトリページを開く
2. 「Releases」セクションに移動
3. 「Draft a new release」をクリック
4. 以下を入力：
   - **Tag**: `v1.0.1`（プッシュしたタグを選択）
   - **Release title**: `v1.0.1`
   - **Description**: リリースノートを記載

#### リリースノート例：

```markdown
## 🎉 新機能

- Relationship Name Suggester機能を追加
  - Create Relationshipダイアログでrelationship名を自動提案
  - 英語の複数形ルールに対応

## 🐛 バグ修正

- リンククリック時のナビゲーション問題を修正

## 🔧 改善

- ボタンデザインをHasura UIに統一
```

5. 「Attach binaries」で `hasura-console-assistant-v1.0.1.zip` をアップロード
6. 「Publish release」をクリック

### 10. リリース完了

✅ リリースが完了しました！

ユーザーは以下からダウンロードできます：
- GitHub Releases: `https://github.com/YOUR_USERNAME/hasura-console-assistant/releases`

## Chrome Web Storeへの公開（オプション）

より多くのユーザーに使ってもらうには、Chrome Web Storeに公開することをおすすめします。

### 必要なもの

- Chrome Web Store Developer アカウント（登録料: $5）
- アイコン画像（16x16, 48x48, 128x128）
- スクリーンショット（最低1枚、推奨5枚）
- プライバシーポリシー
- 詳細な説明文

### 公開手順

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)にアクセス
2. 「新しいアイテム」をクリック
3. `hasura-console-assistant-v1.0.1.zip` をアップロード
4. 必要な情報を入力：
   - 詳細な説明
   - アイコン
   - スクリーンショット
   - カテゴリ（Developer Tools）
   - 言語（日本語、英語）
5. プライバシーの設定
6. 「審査のために送信」をクリック

審査には数日～数週間かかる場合があります。

## トラブルシューティング

### ビルドエラーが発生する

```bash
# 依存関係を再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

### Gitタグを間違えた

```bash
# ローカルのタグを削除
git tag -d v1.0.1

# リモートのタグを削除（プッシュ済みの場合）
git push origin :refs/tags/v1.0.1

# 正しいタグを作成し直す
git tag v1.0.1
git push origin v1.0.1
```

### GitHub Releaseを削除したい

GitHub上で該当のReleaseページから「Delete」ボタンをクリックしてください。

## チェックリスト

リリース前の最終確認：

- [ ] すべての変更がコミットされている
- [ ] package.jsonとmanifest.jsonのバージョンが一致している
- [ ] Lintとtype-checkが通っている
- [ ] ビルドが成功している
- [ ] 実際にChrome拡張機能として動作確認した
- [ ] zipファイルが作成されている
- [ ] Gitタグが作成されている
- [ ] GitHubにプッシュされている
- [ ] GitHub Releaseが作成されている
- [ ] リリースノートが記載されている

## 参考リンク

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Semantic Versioning](https://semver.org/)

