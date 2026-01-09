export enum EventStatus {
  CREATED = 'created',
  INVITED = 'invited',
  ASSIGNED = 'assigned',
  DONE = 'done',
}

export enum EventMode {
  CLASSIC = 'classic',
  SCRAP = 'scrap',
  CUSTOM = 'custom',
}

export enum DrawRule {
  CHAIN = 'chain',
  EXCHANGE = 'exchange',
  PICK_ORDER = 'pick-order',
}

export enum InviteStatus {
  INVITED = 'invited',
  OPENED = 'opened',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
}
