interface ButtonMenuProps {
  options: { onClick: () => void; selected: boolean; label: string }[];
  disabled?: boolean;
}

const ButtonMenu = ({ options, disabled }: ButtonMenuProps) => {
  return (
    <div className="bg-card rounded-lg p-0.5 flex text-xs">
      {options.map((opt, index) => (
        <button
          key={index}
          onClick={opt.onClick}
          className={`flex-1 py-1 rounded-md transition ${
            opt.selected ? "bg-button-blue text-white" : "text-slate-400"
          }`}
          disabled={disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonMenu;
