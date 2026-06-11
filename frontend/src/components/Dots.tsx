import { useEffect, useState } from "react";

const Dots = () => {
  const [index, setIndex] = useState(0);

  const steps = [".", "..", "..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return <span>{steps[index]}</span>;
};

export default Dots;
