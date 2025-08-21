import { Location, LocationType } from '@/types/location';

export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Universal Studios - Stage 12',
    type: LocationType.FILM_SET,
    address: '100 Universal City Plaza, Universal City, CA',
    activeProductions: ['Jurassic World: Dominion'],
    deviceCount: 87,
    networkProfiles: ['PROD_WIFI', 'GUEST_WIFI']
  },
  {
    id: 'loc-2',
    name: 'Universal Orlando - Islands of Adventure',
    type: LocationType.THEME_PARK,
    address: '6000 Universal Blvd, Orlando, FL',
    deviceCount: 234,
    networkProfiles: ['PARK_WIFI', 'STAFF_WIFI', 'GUEST_WIFI']
  },
  {
    id: 'loc-3',
    name: '30 Rockefeller Plaza',
    type: LocationType.CORPORATE_OFFICE,
    address: '30 Rockefeller Plaza, New York, NY',
    deviceCount: 456,
    networkProfiles: ['CORP_WIFI', 'GUEST_WIFI', 'SECURE_NET']
  },
  {
    id: 'loc-4',
    name: 'Universal Studios Hollywood',
    type: LocationType.THEME_PARK,
    address: '100 Universal City Plaza, Universal City, CA',
    deviceCount: 189,
    networkProfiles: ['PARK_WIFI', 'STAFF_WIFI']
  },
  {
    id: 'loc-5',
    name: 'NBC Sports Production Center',
    type: LocationType.EVENT_VENUE,
    address: '1 Blachley Rd, Stamford, CT',
    deviceCount: 102,
    networkProfiles: ['BROADCAST_NET', 'PRODUCTION_WIFI']
  }
];