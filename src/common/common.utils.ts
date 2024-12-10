import { z, ZodRawShape, ZodSchema } from 'zod';
import { paginatorSchema, successResponseSchema } from './common.schema';

export const defineSuccessResponse = (schema: ZodRawShape) => {
  return successResponseSchema.extend(schema);
};

export const definePaginatedResponse = (schema: ZodSchema) => {
  return defineSuccessResponse({
    data: z.object({
      results: z.array(schema),
      paginatorInfo: paginatorSchema,
    }),
  });
};
const simplyretsapi = {
  privateRemarks:
    'This property is a trial property to test the SimplyRETS. Private agent remarks will be included in this field for use in the SimplyRETS REST API. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  showingContactName: null,
  property: {
    roof: 'Composition',
    cooling: null,
    style: 'Ranch',
    area: 5607,
    bathsFull: 6,
    bathsHalf: 1,
    stories: 5,
    fireplaces: 0,
    flooring: null,
    heating: 'Electric,Heat Pump,See Remarks',
    bathrooms: null,
    foundation: 'Block & Beam',
    laundryFeatures: 'Stackable,Washer Included,Dryer Included,Inside',
    occupantName: null,
    ownerName: null,
    lotDescription: 'Cul-de-sac,Fenced Yard',
    pool: 'Association,Community Pool',
    subType: null,
    bedrooms: 3,
    interiorFeatures:
      'Alarm System - Owned, Breakfast Bar, Drapes/Curtains/Window Cover, Dry Bar, Fire/Smoke Alarm, High Ceiling, Refrigerator Included',
    lotSize: '75X   100',
    areaSource: 'Landlord/Tenant/Seller',
    maintenanceExpense: null,
    additionalRooms:
      'Exercise,Formal Living,Game,Living/Den,Media/Home Theater,Office/Study,Pantry,Workshop',
    exteriorFeatures: 'Back Yard Fenced, Porch, Sprinkler System',
    water: null,
    view: 'None',
    lotSizeArea: null,
    subdivision: 'Towne Lake',
    construction:
      'Gas & Electric Dryer Hookup,Electric Dryer Hookup,In Garage,See Remarks',
    parking: {
      leased: null,
      spaces: 6,
      description: '3 Unassigned',
    },
    lotSizeAreaUnits: null,
    type: 'RES',
    garageSpaces: 7.225777832407546,
    bathsThreeQuarter: null,
    accessibility: 'Manned Gate',
    acres: null,
    occupantType: null,
    subTypeText: null,
    yearBuilt: 1961,
  },
  mlsId: 1005221,
  showingContactPhone: null,
  terms: 'FHA,VA',
  showingInstructions:
    'The showing instructions for this trial property are brought to you by the SimplyRETS team. This field will include any showing remarks for the given listing in your RETS feed. Enjoy!',
  office: {
    contact: {
      email: 'info-office@example.com',
      office: '(795) 421-1554',
      cell: null,
    },
    name: null,
    servingName: null,
    brokerid: null,
  },
  leaseTerm: null,
  disclaimer:
    'This information is believed to be accurate, but without warranty.',
  specialListingConditions: null,
  originalListPrice: null,
  address: {
    crossStreet: 'CASTILLE CT.',
    state: 'Texas',
    country: 'United States',
    postalCode: '77379',
    streetName: 'West MAJESTY STREET Path',
    streetNumberText: '8369',
    city: 'Oak Ridge',
    streetNumber: 8369,
    full: '8369 West MAJESTY STREET Path #1765',
    unit: '1765',
  },
  agreement: 'Exclusive Right To Sell',
  listDate: '1994-10-25T13:58:17.284009Z',
  agent: {
    officeMlsId: null,
    lastName: 'Gardner',
    contact: {
      email: 'agent@example.com',
      office: '(795) 421-1554',
      cell: '(390) 101-5532',
    },
    address: null,
    modified: null,
    firstName: 'Branden',
    id: 'bgardner',
  },
  modified: '2015-01-10T00:35:54.030847Z',
  school: {
    middleSchool: 'Pattison',
    highSchool: 'Dekaney',
    elementarySchool: 'Other',
    district: null,
  },
  photos: [
    'https://s3-us-west-2.amazonaws.com/cdn.simplyrets.com/properties/trial/home15.jpg',
    'https://s3-us-west-2.amazonaws.com/cdn.simplyrets.com/properties/trial/home-inside-15.jpg',
  ],
  listPrice: 9375751,
  internetAddressDisplay: null,
  listingId: '51650230',
  mls: {
    status: 'Active',
    area: 'Kingwood South',
    daysOnMarket: 428,
    originalEntryTimestamp: null,
    originatingSystemName: null,
    statusText: 'Active',
    areaMinor: null,
  },
  internetEntireListingDisplay: null,
  geo: {
    county: 'West',
    lat: 29.78003,
    lng: -95.464775,
    marketArea: 'Kingwood South',
    directions:
      'From 290 exit Barker Cypress to left on Tuckerton, right on Danbury Bridge, right on Bending Post, right on Driftwood Prairie',
  },
  tax: {
    taxYear: 1990,
    taxAnnualAmount: 941,
    id: '878-123-843-6924',
  },
  coAgent: {
    officeMlsId: null,
    lastName: null,
    contact: {
      email: 'coagent@example.com',
      office: '(278) 405-9618',
      cell: null,
    },
    address: null,
    modified: null,
    firstName: null,
    id: 'ACME12',
  },
  sales: {
    closeDate: '2008-06-15T15:12:57.033932Z',
    office: {
      contact: null,
      name: 'Houston Real Estate',
      servingName: 'Houston Real Estate',
      brokerid: 'HOU32',
    },
    closePrice: 5078849,
    agent: {
      officeMlsId: 'HOU32',
      lastName: 'Chen',
      contact: null,
      address: null,
      modified: null,
      firstName: 'Vaughan',
      id: 'vchen',
    },
    contractDate: null,
  },
  ownership: null,
  leaseType: 'None',
  virtualTourUrl: null,
  remarks:
    'This property is a trial property to test the SimplyRETS. This field will include remarks or descriptions from your RETS feed intended for public view. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  association: {
    frequency: null,
    fee: 1000,
    name: 'SimplyRETS Home Owners Association',
    amenities:
      'Club House,Community Pool,Garden/ Greenbelt/ Trails,Playground,Recreation Room,Sauna/ Spa/ Hot Tub',
  },
};
