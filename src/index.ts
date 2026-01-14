import { RelationshipTableLinker } from './features/relationships/RelationshipTableLinker';

// 拡張機能を初期化
let linker: RelationshipTableLinker | null = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    linker = new RelationshipTableLinker();
  });
} else {
  linker = new RelationshipTableLinker();
}

// クリーンアップ（ページ遷移時など）
window.addEventListener('beforeunload', () => {
  if (linker) {
    linker.destroy();
    linker = null;
  }
});
