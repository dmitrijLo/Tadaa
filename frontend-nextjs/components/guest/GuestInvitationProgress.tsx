"use client";

import { Progress, theme, Tooltip } from "antd";

interface Props {
  total: number;
  accepted: number;
  denied: number;
}
export function GuestInvitationProgress({ total, accepted, denied }: Props) {
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
        <span>Bisher sind noch keine Gäste angelegt.</span>
      </div>
    );
  }

  const { token } = theme.useToken();
  const acceptedPercent = Math.round((accepted / total) * 100);
  const declinedPrecent = Math.round((denied / total) * 100);
  const totalResponsePercent = acceptedPercent + declinedPrecent;
  return (
    <Tooltip
      title={
        <div>
          <div>{accepted} Zugesagt</div>
          <div>{denied} Abgesagt</div>
          <div>{total - accepted - denied} Offen</div>
        </div>
      }
    >
      <div className="flex items-center justify-center cursor-help">
        <Progress
          type="circle"
          size={80}
          percent={totalResponsePercent}
          strokeColor={token.colorError}
          railColor={token.colorFillSecondary}
          strokeWidth={10}
          success={{
            percent: acceptedPercent,
            strokeColor: token.colorSuccess,
          }}
          format={() => (
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-lg font-bold text-gray-700">{total}</span>
              <span className="text-[10px] text-gray-800 uppercase">Gäste</span>
            </div>
          )}
        />
      </div>
    </Tooltip>
  );
}
