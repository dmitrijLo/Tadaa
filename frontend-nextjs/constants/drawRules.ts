import { DrawRule } from "@/types/enums";

export type DrawRuleInfo = {
  mode: DrawRule;
  name: string;
  description: string;
};

export const drawRulesMock: readonly DrawRuleInfo[] = [
  {
    mode: DrawRule.EXCHANGE,
    name: "Austausch",
    description:
      "Bei dieser Regel zieht jede Person einen Partner und beide beschenken sich gegenseitig. Es entsteht ein <strong>wechselseitiger Austausch</strong>, bei dem jeder sowohl Schenker als auch Beschenkter ist.",
  },
  {
    mode: DrawRule.CHAIN,
    name: "Kette",
    description:
      "Jede Person zieht einen Partner und beschenkt nur diese Person. Es bildet sich eine <strong>geschlossene Kette</strong>, in der jeder genau eine Person beschenkt und von genau einer anderen Person beschenkt wird.",
  },
  {
    mode: DrawRule.PICK_ORDER,
    name: "Reihenfolge",
    description:
      "Die Teilnehmer ziehen in einer <strong>festgelegten Reihenfolge</strong> ihre Geschenke. Jeder wählt nacheinander aus den verbleibenden Geschenken aus, optional mit der Möglichkeit, bereits gewählte Geschenke zu tauschen.",
  },
] as const;

export const drawRuleByRuleMock: Readonly<Record<DrawRule, DrawRuleInfo>> =
  drawRulesMock.reduce(
    (acc, rule) => {
      acc[rule.mode] = rule;
      return acc;
    },
    {} as Record<DrawRule, DrawRuleInfo>,
  );
