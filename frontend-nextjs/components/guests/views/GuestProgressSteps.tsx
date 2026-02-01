"use client";

import { Steps } from "antd";
import type { StepsProps } from "antd";
import { EventStatus, InviteStatus } from "@/types/enums";

type GuestProgressStepsProps = {
  inviteStatus: InviteStatus | string;
  eventStatus: EventStatus | string;
};

const getStepStatus = (
  stepIndex: number,
  currentStep: number,
): "wait" | "process" | "finish" => {
  if (stepIndex < currentStep) return "finish";
  if (stepIndex === currentStep) return "process";
  return "wait";
};

const getCurrentStep = (
  inviteStatus: InviteStatus | string,
  eventStatus: EventStatus | string,
): number => {
  // Draft: waiting for invitation
  if (inviteStatus === InviteStatus.DRAFT) return 0;

  // Invited but not responded yet
  if (
    inviteStatus === InviteStatus.INVITED ||
    inviteStatus === InviteStatus.OPENED
  )
    return 1;

  // Accepted but waiting for draw
  if (
    inviteStatus === InviteStatus.ACCEPTED &&
    eventStatus === EventStatus.INVITED
  )
    return 2;

  // Draw completed
  if (eventStatus === EventStatus.ASSIGNED) return 3;

  // Event done
  if (eventStatus === EventStatus.DONE) return 4;

  return 0;
};

export default function GuestProgressSteps({
  inviteStatus,
  eventStatus,
}: GuestProgressStepsProps) {
  const currentStep = getCurrentStep(inviteStatus, eventStatus);

  const items: StepsProps["items"] = [
    {
      title: "Registriert",
      description: "Warte auf Einladung",
    },
    {
      title: "Eingeladen",
      description: "Zu- oder absagen",
    },
    {
      title: "Zugesagt",
      description: "Warte auf Auslosung",
    },
    {
      title: "Ausgelost",
      description: "Geschenk besorgen",
    },
    {
      title: "Event",
      description: "Geschenkeaustausch",
    },
  ];

  return (
    <Steps
      size="small"
      current={currentStep}
      items={items.map((item, index) => ({
        ...item,
        status: getStepStatus(index, currentStep),
      }))}
      className="mb-4"
    />
  );
}
