import { CHANCE_INDICATOR, CHANCE_INDICATOR_ARC_LENGTH } from "./constants";
import { getIndicatorColorClass } from "./getIndicatorColorClass";

type ChanceIndicatorProps = {
  probability: number;
  label?: string;
  percentTextClassName?: string;
  percentLabel?: string;
};

export const ChanceIndicator = ({
  probability,
  label = "",
  percentTextClassName = "",
  percentLabel,
}: ChanceIndicatorProps) => {
  const normalized =
    probability >= 99.5 ? 1 : probability <= 0.5 ? 0 : probability / 100;

  const progressLength = CHANCE_INDICATOR_ARC_LENGTH * normalized;
  const remainderLength = CHANCE_INDICATOR_ARC_LENGTH - progressLength;

  const { R, CX, BASELINE_Y, STROKE } = CHANCE_INDICATOR;
  const arcPath = `M ${CX - R} ${BASELINE_Y} A ${R} ${R} 0 0 1 ${CX + R} ${BASELINE_Y}`;

  return (
    <svg
      width={CHANCE_INDICATOR.WIDTH}
      height={CHANCE_INDICATOR.HEIGHT}
      viewBox={CHANCE_INDICATOR.VIEW_BOX}
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(0, ${CHANCE_INDICATOR.LAYER_DY})`}>
        <path
          d={arcPath}
          fill="none"
          className="stroke-indicator-track"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        <path
          d={arcPath}
          fill="none"
          className={getIndicatorColorClass(probability)}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progressLength} ${remainderLength}`}
        />

        <text
          x={CX}
          y={CHANCE_INDICATOR.PERCENT_TEXT_Y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`fill-current text-base font-normal letter-spacing-[-0.18px] text-white ${percentTextClassName}`.trim()}
        >
          {percentLabel ?? `${Math.round(probability)}%`}
        </text>

        {label ? (
          <text
            x={CX}
            y={CHANCE_INDICATOR.LABEL_TEXT_Y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground-muted text-xs"
          >
            {label}
          </text>
        ) : null}
      </g>
    </svg>
  );
};
