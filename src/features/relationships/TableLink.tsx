import type React from 'react';
import { extractUrlInfo } from './utils';

interface TableLinkProps {
  tableName: string;
  originalText: string;
}

export const TableLink: React.FC<TableLinkProps> = ({ tableName, originalText }) => {
  const urlInfo = extractUrlInfo();
  if (!urlInfo) {
    // URLが取得できない場合はテキストのまま返す
    return <span>{originalText}</span>;
  }

  // データブラウザページへのURLを構築
  const baseUrl = window.location.origin;
  const href = `${baseUrl}/console/data/${urlInfo.dataSource}/schema/${urlInfo.schema}/tables/${tableName}/browse`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#4A90E2',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        fontFamily: 'inherit',
      }}
      title={`Go to ${tableName} table browser`}
    >
      {originalText}
    </a>
  );
};
