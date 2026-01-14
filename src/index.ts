import { RelationshipNameSuggester } from './features/relationship-name-suggester/RelationshipNameSuggester';
import { RelationshipTableLinker } from './features/relationships/RelationshipTableLinker';

// 拡張機能を初期化
let linker: RelationshipTableLinker | null = null;
let suggester: RelationshipNameSuggester | null = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    linker = new RelationshipTableLinker();
    suggester = new RelationshipNameSuggester();
  });
} else {
  linker = new RelationshipTableLinker();
  suggester = new RelationshipNameSuggester();
}

// クリーンアップ（ページ遷移時など）
window.addEventListener('beforeunload', () => {
  if (linker) {
    linker.destroy();
    linker = null;
  }
  if (suggester) {
    suggester.destroy();
    suggester = null;
  }
});
