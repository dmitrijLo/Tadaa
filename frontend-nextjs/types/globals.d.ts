import type * as Enums from "./enums";

declare global {
  type EventStatus = Enums.EventStatus;
  type EventMode = Enums.EventMode;
  type DrawRule = Enums.DrawRule;
  type InviteStatus = Enums.InviteStatus;

  var EventStatus: typeof Enums.EventStatus;
  var EventMode: typeof Enums.EventMode;
  var DrawRule: typeof Enums.DrawRule;
  var InviteStatus: typeof Enums.InviteStatus;
}

export {};
