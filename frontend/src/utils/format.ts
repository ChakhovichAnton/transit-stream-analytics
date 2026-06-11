export const pad2 = (n: number) => String(n).padStart(2, "0");

export const formatDateTime = (date: Date) => {
  return date.toLocaleString("gb", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("gb", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("gb", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
