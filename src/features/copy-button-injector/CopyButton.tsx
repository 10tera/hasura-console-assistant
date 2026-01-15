import { useState } from 'react';
import { copyToClipboard } from './utils';

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        padding: '0',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        opacity: copied ? 1 : 0.5,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.opacity = '0.5';
        }
      }}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        // チェックマークアイコン
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Copied</title>
          <path
            d="M13.5 4.5L6 12L2.5 8.5"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // コピーアイコン
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Copy</title>
          <rect x="5.5" y="5.5" width="8" height="9" rx="1" stroke="#6b7280" strokeWidth="1.5" />
          <path
            d="M3.5 10.5H2.5C2.22386 10.5 2 10.2761 2 10V2C2 1.72386 2.22386 1.5 2.5 1.5H8.5C8.77614 1.5 9 1.72386 9 2V3"
            stroke="#6b7280"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </button>
  );
};
