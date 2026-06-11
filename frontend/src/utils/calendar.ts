export const DAYS_OF_THE_WEEK = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOffset = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7; // Shifts so Monday = 0
};

export const getMonthGrid = (viewYear: number, viewMonth: number) => {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const offset = getFirstDayOffset(viewYear, viewMonth);

  // The data grid has 42 cell
  const totalCells = 42;
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - offset + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push(null); // No date in cell
    } else {
      cells.push(dayNumber);
    }
  }

  return cells;
};
