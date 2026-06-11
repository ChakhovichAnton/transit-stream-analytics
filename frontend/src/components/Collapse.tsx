import { useState, type PropsWithChildren } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CollapseProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

const Collapse = ({ title, children, defaultOpen = true }: CollapseProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <LayoutGroup>
      <div className="w-full relative px-1 py-1">
        <motion.div
          layout
          className="flex w-full text-sm justify-between cursor-pointer font-medium"
          onClick={() => setOpen((v) => !v)}
        >
          {title}
          {open ? <ChevronUp /> : <ChevronDown />}
        </motion.div>

        <motion.div
          layout
          transition={{
            layout: { type: "spring", stiffness: 500, damping: 40 },
          }}
        >
          <motion.div
            layout
            animate={{
              opacity: open ? 1 : 0,
              height: open ? "auto" : 0,
            }}
            transition={{ duration: 0.25 }}
            className="px-2"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </LayoutGroup>
  );
};

export default Collapse;
