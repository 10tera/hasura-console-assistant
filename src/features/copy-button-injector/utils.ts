// データブラウザページかどうかを判定
// URLからクエリパラメータを除いた状態で、後方が/browseであるかを判定
export const isOnBrowsePage = (): boolean => {
  return window.location.pathname.endsWith('/browse');
};

/**
 * クリップボードにコピー
 * @param text - コピーするテキスト
 * @returns 成功したかどうか
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
