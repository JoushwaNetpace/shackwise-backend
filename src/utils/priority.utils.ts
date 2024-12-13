import { CreatePrioritySchemaType } from '../modules/priority/priority.schema';
import { createPriority } from '../modules/priority/priority.services';
import { UserType } from '../modules/user/user.dto';

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

export const createUserBasePriorityUtil = async (
  user: UserType,
): Promise<void> => {
  try {
    // Define the default priority payload for the new user
    const defaultPriorityPayload: CreatePrioritySchemaType = {
      userId: user._id, // Assuming the user object has an `id` field
      affordability: { rating: 0, note: '' },
      listPMarketV: { rating: 0, note: '' },
      location: { rating: 0, note: '' },
      kitchenSize: { rating: 0, note: '' },
      masterBedroom: { rating: 0, note: '' },
      masterBathroom: { rating: 0, note: '' },
      secondaryBathroom: { rating: 0, note: '' },
      secondaryBedroom: { rating: 0, note: '' },
      livingEntertainment: { rating: 0, note: '' },
      basement: { rating: 0, note: '' },
      outdoorYardSpace: { rating: 0, note: '' },
      parkingGarage: { rating: 0, note: '' },
      overallCondition: { rating: 0, note: '' },
    };

    // Call the createPriority service to create the priority document
    await createPriority(defaultPriorityPayload);
  } catch (error) {
    console.error('Error creating base priority for user:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};
