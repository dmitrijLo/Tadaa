"use client";

import { useState } from "react";
import { Card, Select, Space } from "antd";
import type { SelectProps } from "antd";
import { EventMode } from "@/enums/enums";
import { GiftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModeExplainer from "./ModeExplainer";
import { eventModesMock } from "@/constants/modes";

const modeIcons: Record<EventMode, React.ReactNode> = {
  [EventMode.CLASSIC]: <GiftOutlined />,
  [EventMode.SCRAP]: <DeleteOutlined />,
  [EventMode.CUSTOM]: <EditOutlined />,
};

const options: SelectProps["options"] = eventModesMock.map((mode) => ({
  label: mode.name,
  value: mode.modus,
  disabled: mode.modus === EventMode.CUSTOM,
}));

type ModeSelectorProps = {
  onModeChange?: (mode: EventMode) => void;
};

export default function ModeSelector({ onModeChange }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<EventMode>(
    EventMode.CLASSIC,
  );

  const handleChange = (value: EventMode) => {
    setSelectedMode(value);
    onModeChange?.(value);
  };

  const sharedProps: SelectProps = {
    options,
    prefix: modeIcons[selectedMode],
  };

  return (
    <Space orientation="vertical" size="small" style={{ display: "flex" }}>
      <Select<EventMode>
        value={selectedMode}
        {...sharedProps}
        style={{ width: "100%" }}
        onChange={handleChange}
      />
      <ModeExplainer activeEventMode={selectedMode} />
    </Space>
  );
}
