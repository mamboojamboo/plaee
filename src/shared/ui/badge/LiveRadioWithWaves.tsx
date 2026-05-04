const RADIO_PATHS = [
  "M16.247 7.761a6 6 0 0 1 0 8.478",
  "M19.075 4.933a10 10 0 0 1 0 14.134",
  "M4.925 19.067a10 10 0 0 1 0-14.134",
  "M7.753 16.239a6 6 0 0 1 0-8.478",
] as const;

type LiveRadioWithWavesProps = {
  size?: number | string;
  className?: string;
  "aria-hidden"?: boolean;
};

export const LiveRadioWithWaves = ({
  size = 24,
  className = "",
  "aria-hidden": ariaHidden = true,
}: LiveRadioWithWavesProps) => {
  const dim = size ?? 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`.trim()}
      aria-hidden={ariaHidden}
    >
      {RADIO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
      <circle cx={12} cy={12} r={2} />
      <circle cx={12} cy={12} r={3.5} fill="none" className="stroke-accent-live" strokeWidth={2}>
        <animate attributeName="r" values="3.5;11" dur="1.75s" repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          values="0.72;0.22;0"
          keyTimes="0;0.55;1"
          dur="1.75s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx={12} cy={12} r={3.5} fill="none" className="stroke-accent-live" strokeWidth={2}>
        <animate
          attributeName="r"
          values="3.5;11"
          dur="1.75s"
          repeatCount="indefinite"
          begin="0.55s"
        />
        <animate
          attributeName="opacity"
          values="0.58;0.15;0"
          keyTimes="0;0.55;1"
          dur="1.75s"
          repeatCount="indefinite"
          begin="0.55s"
        />
      </circle>
    </svg>
  );
};
