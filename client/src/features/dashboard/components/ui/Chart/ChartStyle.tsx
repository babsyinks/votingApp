import { THEMES } from "./types";
import type { ChartConfig } from "./types";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, cfg]) => cfg.theme || cfg.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  const css = Object.entries(THEMES)
    .map(
      ([theme, prefix]) =>
        `\n${prefix} [data-chart=${id}] {\n${colorConfig
          .map(([key, itemConfig]) => {
            const color =
              itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
              itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          })
          .filter(Boolean)
          .join("\n")}\n}\n`,
    )
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export default ChartStyle;
