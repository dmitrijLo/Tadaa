"use client";

import { Col, Collapse, Row } from "antd";
import { EventMode } from "@/enums/enums";
import { eventModeByModusMock as eventModes } from "@/constants/modes";

type ModeExplainerProps = {
  activeEventMode?: EventMode;
  className?: string;
};

export default function ModeExplainer({
  activeEventMode = EventMode.CLASSIC,
  className,
}: ModeExplainerProps) {
  const mode = eventModes[activeEventMode];

  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Collapse
            size="small"
            ghost
            items={[
              {
                key: activeEventMode,
                label: "Funktionsweise des Modus",
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
