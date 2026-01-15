import { type Root, createRoot } from 'react-dom/client';
import { CopyButton } from './CopyButton';
import { isOnBrowsePage } from './utils';

// データブラウザページのテーブルセルにコピーボタンを注入
export class CopyButtonInjector {
  private bodyObserver: MutationObserver | null = null; // body監視用
  private tableObservers = new Map<Element, MutationObserver>(); // 各esr-table用のobserver
  private processedElements = new WeakSet<Element>();
  private roots = new Map<Element, Root>();

  constructor() {
    this.init();
  }

  private init() {
    // body全体を監視して.esr-tableの出現・削除を監視
    this.bodyObserver = new MutationObserver(() => {
      this.updateTableObservers();
    });

    this.bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 初回チェック：既に.esr-tableが存在する場合
    this.updateTableObservers();
  }

  private updateTableObservers() {
    // 現在DOM内に存在する全ての.esr-tableを取得
    const tables = document.querySelectorAll('.esr-table');
    const currentTables = new Set<Element>(tables);

    // 削除されたテーブルのobserverを停止
    for (const [table, observer] of this.tableObservers.entries()) {
      if (!currentTables.has(table)) {
        observer.disconnect();
        this.tableObservers.delete(table);
      }
    }

    // 新しいテーブルにobserverを追加
    for (const table of currentTables) {
      if (!this.tableObservers.has(table)) {
        this.setupTableObserver(table);
      }
    }
  }

  private setupTableObserver(table: Element) {
    // このテーブル専用のobserverを作成
    const observer = new MutationObserver(() => {
      this.checkAndInjectButtons(table);
    });

    observer.observe(table, {
      childList: true,
      subtree: true,
    });

    // observerをMapに追加
    this.tableObservers.set(table, observer);

    // 初回のボタン注入
    this.checkAndInjectButtons(table);
  }

  // データブラウザページかどうかをチェック
  private isOnBrowsePage(): boolean {
    return isOnBrowsePage();
  }

  // テーブルセルにコピーボタンを注入
  private checkAndInjectButtons(table: Element) {
    if (!this.isOnBrowsePage()) {
      return;
    }

    // 指定されたテーブル内のtbodyを取得
    const tbody = table.querySelector('.rt-tbody');
    if (!tbody) {
      return;
    }

    // childrenプロパティで直接の子要素を取得（最速）
    for (const row of tbody.children) {
      // rt-tr-groupクラスを持つ要素のみ処理
      if (!row.classList.contains('rt-tr-group')) {
        continue;
      }

      const rtTrOdd = row.children[0];
      if (!rtTrOdd) {
        continue;
      }

      // 各行内のセル（rt-td）を取得 - childrenを使用
      const cells = rtTrOdd.children;

      // 3番目以降のセルのみ処理（インデックス2以降）
      for (let i = 2; i < cells.length; i++) {
        const cell = cells[i];
        if (cell instanceof HTMLElement) {
          // リンク要素（a tag）が含まれている場合は除外
          if (cell.querySelector('a')) {
            continue;
          }
          this.injectButton(cell);
        }
      }
    }
  }

  private injectButton(cell: HTMLElement) {
    // 既に処理済みのセルはスキップ
    if (this.processedElements.has(cell)) {
      return;
    }

    const text = cell.textContent.trim();

    // 空セルやテキストがない場合はスキップ
    if (text === '') {
      return;
    }

    // 既にコピーボタンコンテナが存在する場合はスキップ
    // 直接 className で比較（最速）
    const lastChild = cell.lastElementChild;
    if (lastChild?.className === 'copy-button-container') {
      return;
    }

    // セルに position: relative を設定
    const originalPosition = cell.style.position;
    if (!originalPosition || originalPosition === 'static') {
      cell.style.position = 'relative';
    }

    // コピーボタンコンテナを作成
    const container = document.createElement('div');
    container.className = 'copy-button-container';
    container.style.cssText = `
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      pointer-events: auto;
    `;

    // Reactコンポーネントをマウント
    const root = createRoot(container);
    root.render(<CopyButton text={text} />);

    cell.appendChild(container);
    this.roots.set(container, root);
    this.processedElements.add(cell);
  }

  public destroy() {
    // bodyObserverを停止
    if (this.bodyObserver) {
      this.bodyObserver.disconnect();
      this.bodyObserver = null;
    }

    // すべてのtableObserverを停止
    for (const observer of this.tableObservers.values()) {
      observer.disconnect();
    }
    this.tableObservers.clear();

    // すべてのReactルートをクリーンアップ
    for (const root of this.roots.values()) {
      root.unmount();
    }
    this.roots.clear();
    this.processedElements = new WeakSet();
  }
}
