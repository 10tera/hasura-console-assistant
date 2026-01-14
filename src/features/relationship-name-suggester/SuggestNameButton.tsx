interface SuggestNameButtonProps {
  onClick: () => void;
}

export const SuggestNameButton = ({ onClick }: SuggestNameButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="items-center max-w-full justify-center inline-flex text-sm font-sans font-semibold bg-gradient-to-t border rounded shadow-sm focus-visible:outline-none focus-visible:bg-gradient-to-t focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 disabled:opacity-60 text-gray-600 bg-gray-50 from-transparent to-white border-gray-300 hover:border-gray-400 disabled:border-gray-300 focus-visible:from-bg-gray-50 focus-visible:to-bg-gray-50 focus-visible:ring-gray-400 h-btn px-sm"
      title="Suggest relationship name based on table name and type"
    >
      Suggest Name
    </button>
  );
};
