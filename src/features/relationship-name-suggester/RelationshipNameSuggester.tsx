import { type Root, createRoot } from 'react-dom/client';
import { SuggestNameButton } from './SuggestNameButton';
import { pluralize } from './utils';

// Create Relationshipダイアログでrelationship nameを自動提案
export class RelationshipNameSuggester {
  private observer: MutationObserver | null = null;
  private processedDialogs = new WeakSet<Element>();
  private buttonRoots = new Map<Element, Root>();

  constructor() {
    this.init();
  }

  private init() {
    // 初回チェック
    this.checkAndInjectButton();

    // DOM変更を監視
    this.observer = new MutationObserver(() => {
      this.checkAndInjectButton();
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

  // Create Relationshipダイアログを取得
  private findDialog(): Element | null {
    return document.querySelector('div[role="dialog"]');
  }

  // Create Relationshipダイアログを検出してボタンを挿入
  private checkAndInjectButton() {
    if (!this.isOnRelationshipsTab()) {
      return;
    }

    const dialog = this.findDialog();
    if (!dialog) {
      return;
    }

    // for="details.relationshipType"のlabelを探す
    const label = dialog.querySelector('label[for="details.relationshipType"]');
    if (!label) {
      return;
    }

    // 既に処理済みの要素はスキップ
    const container = label.parentElement;
    if (!container || this.processedDialogs.has(container)) {
      return;
    }

    // ボタンを挿入
    this.injectButton();
    this.processedDialogs.add(container);
  }

  private injectButton() {
    const dialog = this.findDialog();
    if (!dialog) {
      return;
    }

    // for="details.relationshipType"のlabelを探す
    const label = dialog.querySelector('label[for="details.relationshipType"]');
    if (!label) {
      return;
    }

    // labelの親の親要素を取得
    const labelGrandParent = label.parentElement?.parentElement;
    if (!labelGrandParent) {
      return;
    }

    // 親の親要素に横並びのスタイルを適用
    if (labelGrandParent instanceof HTMLElement) {
      labelGrandParent.style.display = 'flex';
      labelGrandParent.style.alignItems = 'center';
      labelGrandParent.style.gap = '8px';
    }

    // ボタンを挿入するためのdivを作成
    const buttonContainer = document.createElement('div');

    // labelの親要素と同じ階層に挿入
    labelGrandParent.appendChild(buttonContainer);

    // Reactボタンをマウント
    const root = createRoot(buttonContainer);
    root.render(<SuggestNameButton onClick={() => this.handleSuggestName()} />);

    this.buttonRoots.set(buttonContainer, root);
  }

  private handleSuggestName() {
    // To Referenceの値を取得
    const toReferenceValue = this.getToReferenceValue();
    if (!toReferenceValue) {
      console.warn('[Relationship Name Suggester] To Reference value not found');
      return;
    }

    // Relationship Typeの選択を取得
    const relationshipType = this.getRelationshipType();
    if (!relationshipType) {
      console.warn('[Relationship Name Suggester] Relationship Type not found');
      return;
    }

    // 提案名を生成
    let suggestedName: string;
    if (relationshipType === 'Array') {
      suggestedName = pluralize(toReferenceValue);
    } else {
      // object の場合はそのまま
      suggestedName = toReferenceValue;
    }

    // Relationship Name Inputに値を設定
    this.setRelationshipName(suggestedName);
  }

  private getToReferenceValue(): string | null {
    const dialog = this.findDialog();
    if (!dialog) {
      return null;
    }

    // for="toSource"のlabelを探す
    const label = dialog.querySelector('label[for="toSource"]');
    if (!label) {
      return null;
    }

    // labelと同じ階層（兄弟要素）にあるdivを探す
    const parent = label.parentElement;
    if (!parent) {
      return null;
    }

    // 親要素のネストしたどこかに存在するTo Referenceの文字列を探す
    const text = parent.querySelector('span.text-gray-800');
    if (text instanceof HTMLSpanElement && text.textContent) {
      // /区切りの最後の部分を抜き出す（例: "public/users" -> "users"）
      const parts = text.textContent.split('/');
      const tableName = parts[parts.length - 1].trim();
      return tableName;
    }

    return null;
  }

  private getRelationshipType(): 'Object' | 'Array' | null {
    const dialog = this.findDialog();
    if (!dialog) {
      return null;
    }

    const select = dialog.querySelector('select[id="details.relationshipType"]');
    if (select instanceof HTMLSelectElement) {
      const value = select.value;
      if (value === 'Object' || value === 'Array') {
        return value;
      }
    }
    return null;
  }

  private setRelationshipName(name: string) {
    // role="dialog"のdiv内のinput[id="name"]を探す
    const dialog = this.findDialog();
    if (!dialog) {
      console.warn('[Relationship Name Suggester] Dialog not found');
      return;
    }

    const input = dialog.querySelector('input[id="name"]');
    if (input instanceof HTMLInputElement) {
      // 値を設定
      input.value = name;

      // Reactの場合、inputイベントをトリガーする必要がある
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);

      // changeイベントもトリガー
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(changeEvent);
    } else {
      console.warn('[Relationship Name Suggester] Relationship Name input not found');
    }
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // すべてのReactルートをクリーンアップ
    for (const root of this.buttonRoots.values()) {
      root.unmount();
    }
    this.buttonRoots.clear();
    this.processedDialogs = new WeakSet();
  }
}
