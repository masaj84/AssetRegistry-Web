export const CarTimelineEventTypes = {
  SERVICE: 'SERVICE',
  INSPECTION: 'INSPECTION',
  REPAIR: 'REPAIR',
  DETAILING: 'DETAILING',
  MILEAGE_CHECK: 'MILEAGE_CHECK',
  OWNERSHIP_CHANGE: 'OWNERSHIP_CHANGE',
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  ACCIDENT_REPORT: 'ACCIDENT_REPORT',
  OTHER: 'OTHER',
} as const;

export type CarTimelineEventType = keyof typeof CarTimelineEventTypes;

export const CAR_TIMELINE_EVENT_TYPES: CarTimelineEventType[] = [
  'SERVICE',
  'INSPECTION',
  'REPAIR',
  'DETAILING',
  'MILEAGE_CHECK',
  'OWNERSHIP_CHANGE',
  'PURCHASE',
  'SALE',
  'ACCIDENT_REPORT',
  'OTHER',
];

export interface CarTimelineEntry {
  id: string;
  carAssetId: string;
  type: string;
  description: string;
  mileage?: number | null;
  workshop?: string | null;
  occurredAt: string;
  createdByUserId: string;
  createdAt: string;
}

export interface AddCarTimelineEntryRequest {
  type: string;
  description: string;
  mileage?: number | null;
  workshop?: string | null;
  occurredAt?: string | null;
}

export interface PublicCarTimelineEntry {
  id: string;
  type: string;
  description: string;
  mileage?: number | null;
  workshop?: string | null;
  occurredAt: string;
}
