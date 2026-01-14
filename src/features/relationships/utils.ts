// URLからスキーマ名とデータソース名を抽出
export const extractUrlInfo = (): { dataSource: string; schema: string } | null => {
  const urlMatch = window.location.pathname.match(/\/console\/data\/([^\/]+)\/schema\/([^\/]+)/);

  if (urlMatch) {
    return {
      dataSource: urlMatch[1],
      schema: urlMatch[2],
    };
  }

  return null;
};
