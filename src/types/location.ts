export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  activeProductions?: string[];
  deviceCount: number;
  networkProfiles: string[];
}

export enum LocationType {
  FILM_SET = 'film_set',
  THEME_PARK = 'theme_park',
  CORPORATE_OFFICE = 'corporate_office',
  EVENT_VENUE = 'event_venue'
}