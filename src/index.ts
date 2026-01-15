import { CopyButtonInjector } from './features/copy-button-injector/CopyButtonInjector';
import { RelationshipNameSuggester } from './features/relationship-name-suggester/RelationshipNameSuggester';
import { RelationshipTableLinker } from './features/relationships/RelationshipTableLinker';

// 拡張機能を初期化
let linker: RelationshipTableLinker | null = null;
let suggester: RelationshipNameSuggester | null = null;
let copyButtonInjector: CopyButtonInjector | null = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    linker = new RelationshipTableLinker();
    suggester = new RelationshipNameSuggester();
    copyButtonInjector = new CopyButtonInjector();
  });
} else {
  linker = new RelationshipTableLinker();
  suggester = new RelationshipNameSuggester();
  copyButtonInjector = new CopyButtonInjector();
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
  if (copyButtonInjector) {
    copyButtonInjector.destroy();
    copyButtonInjector = null;
  }
});
