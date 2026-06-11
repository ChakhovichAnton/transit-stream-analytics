import type { PropsWithChildren } from "react";

interface TooltipProps extends PropsWithChildren {
  text: string;
}

const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="relative w-full flex flex-col items-center group h-full">
      {children}
      <div className="absolute bottom-full hidden items-center group-hover:flex mb-1">
        <span className="relative z-10 max-w-xs p-1 text-xs leading-relaxed whitespace-normal wrap-break-word rounded-lg bg-gray-900 text-gray-100 shadow-xl ring-1 ring-white/10">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Tooltip;
