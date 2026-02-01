"use client";

import { useState } from "react";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import ModeExplainer from "./ModeExplainer";

export type ModeOption<T = string | number> = {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type ModeData<T = string | number> = {
  mode: T;
  name: string;
  description: string;
};

type ModeSelectorProps<T extends string | number = string> = {
  options: ModeOption<T>[];
  modeData: Record<T extends string | number ? T : never, ModeData<T>>;
  defaultValue?: T;
  collapseLabel: string;
  onModeChange?: (mode: T) => void;
};

export default function ModeSelector<T extends string | number = string>({
  options,
  modeData,
  defaultValue,
  collapseLabel,
  onModeChange,
}: ModeSelectorProps<T>) {
  const [selectedMode, setSelectedMode] = useState<T>(
    defaultValue ?? options[0]?.value,
  );

  const handleChange = (value: T) => {
    setSelectedMode(value);
    onModeChange?.(value);
  };

  const selectedOption = options.find((opt) => opt.value === selectedMode);

  const sharedProps: SelectProps = {
    options,
    prefix: selectedOption?.icon,
  };

  return (
    <Space orientation="vertical" size="small" style={{ display: "flex" }}>
      <Select<T>
        value={selectedMode}
        {...sharedProps}
        style={{ width: "100%" }}
        onChange={handleChange}
        size="large"
      />
      <ModeExplainer
        activeMode={selectedMode}
        modeData={modeData}
        collapseLabel={collapseLabel}
      />
    </Space>
  );
}
