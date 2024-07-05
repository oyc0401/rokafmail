export function Checkbox({ isSelected, onValueChange }) {

  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        className="hidden"
        checked={isSelected}
        onChange={(e) => {
          onValueChange(e.target.checked)
        }}
      />
      <span
        className={`relative inline-flex items-center justify-center flex-shrink-0 overflow-hidden  absolute inset-0  text-primary-foreground w-5 h-5 rounded-[calc(theme(borderRadius.medium)*0.5)]
        ${isSelected ? 'bg-primary' : ' border-2 box-border border-default'}`}
      >
        {isSelected && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </span>
    </label>
  );
};