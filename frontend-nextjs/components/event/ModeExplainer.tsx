"use client";

import { Col, Collapse, Row } from "antd";
import type { ModeData } from "./ModeSelector";

type ModeExplainerProps<T = string | number> = {
  activeMode: T;
  modeData: Record<T extends string | number ? T : never, ModeData<T>>;
  collapseLabel: string;
  className?: string;
};

export default function ModeExplainer<T extends string | number>({
  activeMode,
  modeData,
  className,
  collapseLabel,
}: ModeExplainerProps<T>) {
  const mode = modeData[activeMode as T extends string | number ? T : never];

  if (!mode) {
    return null;
  }

  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Collapse
            size="small"
            ghost
            items={[
              {
                key: String(activeMode),
                label: collapseLabel,
                children: (
                  <div dangerouslySetInnerHTML={{ __html: mode.description }} />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
