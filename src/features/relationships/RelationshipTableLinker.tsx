import { type Root, createRoot } from 'react-dom/client';
import { TableLink } from './TableLink';

// Relationshipsタブでテーブル名を検出してリンクに変換
export class RelationshipTableLinker {
  private observer: MutationObserver | null = null;
  private processedElements = new WeakSet<Element>();
  private roots = new Map<Element, Root>();

  constructor() {
    this.init();
  }

  private init() {
    // 初回チェック
    this.checkAndEnhance();

    // DOM変更を監視
    this.observer = new MutationObserver(() => {
      this.checkAndEnhance();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Relationshipsタブかどうかをチェック
  private isOnRelationshipsTab(): boolean {
    return window.location.pathname.endsWith('/relationships');
  }

  // Relationshipsタブのテーブル名を取得（テーブル名のみを取得）
  private checkAndEnhance() {
    if (!this.isOnRelationshipsTab()) {
      return;
    }

    // Relationshipsタブのテーブル内の各行を取得
    const rows = document.querySelectorAll('table tbody tr');

    for (const row of rows) {
      // RELATIONSHIPカラム
      const fourthTd = row.querySelector('td:nth-child(4)');
      // アクションカラム（Edit, Delete, Rename etc.）
      const fifthTd = row.querySelector('td:nth-child(5)');

      if (!fourthTd) continue;
      // 5番目のtdに"Edit"が含まれていたらスキップ（外部テーブルとのrelationshipはリンクを見つけることができないため、スキップ）
      if (fifthTd?.textContent?.toLowerCase().includes('edit')) {
        continue;
      }

      // td > div を取得
      const parentDiv = fourthTd.querySelector('div');
      if (!parentDiv) continue;

      // 親divの中の1番目（from）と2番目のdiv（to）を取得
      const childDivs = parentDiv.querySelectorAll(':scope > div');
      if (childDivs.length < 2) continue;

      // 1番目と2番目のdivの中の子要素の2番目を処理
      for (let i = 0; i < 2; i++) {
        const targetDiv = childDivs[i];
        const children = targetDiv.querySelectorAll(':scope > *');

        // 子要素の2番目（インデックス1）を処理
        if (children.length >= 2) {
          this.enhanceElement(children[1]);
        }
      }
    }
  }

  private enhanceElement(element: Element) {
    // 既に処理済みの要素はスキップ
    if (this.processedElements.has(element)) {
      return;
    }

    const text = element.textContent?.trim();
    if (!text) {
      return;
    }

    // schema.tableName の形式をチェック（例: public.users）
    const schemaTablePattern = /^([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)$/;
    const match = text.match(schemaTablePattern);

    if (!match) {
      return;
    }

    const schema = match[1];
    const tableName = match[2];

    // 既にリンク化されていない要素のみ処理
    const hasLink = element.querySelector('a') !== null;
    const isLink = element.tagName === 'A';

    if (!hasLink && !isLink) {
      this.convertToLink(element, tableName, schema);
      this.processedElements.add(element);
    }
  }

  private convertToLink(element: Element, tableName: string, schema: string) {
    // 元のテキストを保存（schema.tableName の形式）
    const originalText = element.textContent || `${schema}.${tableName}`;

    // 既存のルートがあればクリーンアップ
    const existingRoot = this.roots.get(element);
    if (existingRoot) {
      existingRoot.unmount();
    }

    // Reactコンポーネントをマウント
    const root = createRoot(element);
    root.render(<TableLink tableName={tableName} originalText={originalText} />);

    this.roots.set(element, root);
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // すべてのReactルートをクリーンアップ
    for (const root of this.roots.values()) {
      root.unmount();
    }
    this.roots.clear();
    this.processedElements = new WeakSet();
  }
}
