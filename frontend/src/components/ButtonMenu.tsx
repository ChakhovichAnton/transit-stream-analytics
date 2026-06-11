import Tooltip from "./Tooltip";

interface ButtonMenuProps {
  options: {
    onClick: () => void;
    selected: boolean;
    label: string;
    toolTip?: string;
  }[];
  disabled?: boolean;
}

const ButtonMenu = ({ options, disabled }: ButtonMenuProps) => {
  return (
    <div className="bg-card rounded-lg p-0.5 flex text-xs">
      {options.map((opt, index) => {
        const Button = (
          <button
            key={index}
            onClick={opt.onClick}
            className={`flex-1 py-1 rounded-md transition w-full ${
              opt.selected ? "bg-button-blue text-white" : "text-slate-400"
            }`}
            disabled={disabled}
          >
            {opt.label}
          </button>
        );

        return opt.toolTip !== undefined ? (
          <Tooltip key={index} text={opt.toolTip}>
            {Button}
          </Tooltip>
        ) : (
          Button
        );
      })}
    </div>
  );
};

export default ButtonMenu;
