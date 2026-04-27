import { ChartConfig } from '@/components/ui/chart';
import { Area } from 'recharts';

export type Config = {
  label: string;
  dataKey: string;
};

export function buildConfig(data: Config[]) {
  const config: ChartConfig = {};

  data.forEach((item, index) => {
    config[item.dataKey] = {
      label: item.label,
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });

  return config;
}

export function LineGradients({ configs }: { configs: Config[] }) {
  return (
    <defs>
      {configs.map((config, index) => (
        <linearGradient key={index} id={`fill_${config.dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={`var(--color-${config.dataKey})`} stopOpacity={0.8} />
          <stop offset="95%" stopColor={`var(--color-${config.dataKey})`} stopOpacity={0.1} />
        </linearGradient>
      ))}
    </defs>
  );
}

export function AreaContents({ configs }: { configs: Config[] }) {
  return configs.map((config, index) => (
    <Area
      key={index}
      dataKey={config.dataKey}
      type="natural"
      fill={`url(#fill_${config.dataKey})`}
      stroke={`var(--color-${config.dataKey})`}
      stackId="a"
    />
  ));
}
