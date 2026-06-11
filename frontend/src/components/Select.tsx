import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Dots from "./Dots";

interface SelectProps<T extends string | number | boolean> {
  loading?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
  error?: boolean;
}

const Select = <T extends string | number | boolean>({
  loading,
  value,
  onChange,
  options,
  label,
  error,
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        e.target instanceof Node &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const disabled = error || loading || options.length === 0;

  return (
    <div ref={ref} className="relative my-3 bg-base">
      <div className="absolute -top-2 left-2 px-1 text-xs bg-base text-text-base font-medium">
        {label}
      </div>

      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="truncate w-full flex justify-between items-center px-3 py-2 bg-base border border-border-base rounded"
      >
        {loading ? (
          <span>
            Loading
            <Dots />
          </span>
        ) : options.length > 0 ? (
          <span>{options.find((o) => o.value === value)?.label}</span>
        ) : (
          <span>No options to select</span>
        )}

        <ChevronDown
          className={`${disabled ? "text-border-base" : ""}`}
          size={16}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-1 w-full bg-card rounded shadow-lg overflow-hidden p-1 space-y-0.5 z-50"
          >
            {options.map((opt) => (
              <div
                key={opt.value + "-option"}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="px-2 py-1 flex justify-between items-center rounded text-text-base hover:text-black hover:bg-white cursor-pointer"
              >
                {opt.label}
                {opt.value === value && <Check size={18} />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
