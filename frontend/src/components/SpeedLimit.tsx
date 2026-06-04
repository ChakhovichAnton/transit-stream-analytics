interface SpeedLimitSignProps {
  limit?: number;
  unit?: string;
  size?: number;
}

const SpeedLimitSign = ({
  limit,
  unit = "km/h",
  size = 80,
}: SpeedLimitSignProps) => {
  if (limit === undefined) return null;

  const outer = size;
  const inner = size * 0.8;

  const numberSize = size * 0.38;
  const unitSize = size * 0.12;

  return (
    <div className="flex items-center justify-center">
      <div
        className="rounded-full bg-red-500 flex items-center justify-center shadow-lg"
        style={{ width: outer, height: outer }}
      >
        <div
          className="rounded-full bg-white flex flex-col items-center justify-center text-slate-900"
          style={{ width: inner, height: inner }}
        >
          <div
            className="font-extrabold leading-none"
            style={{ fontSize: numberSize }}
          >
            {Math.round(limit)}
          </div>

          <div
            className="font-medium tracking-wide opacity-70"
            style={{ fontSize: unitSize, marginTop: -2 }}
          >
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedLimitSign;
