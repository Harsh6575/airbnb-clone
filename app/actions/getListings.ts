import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params; // destructure the params object.

    let query: any = {}; // create an empty object called query.

    if (userId) {
      query.userId = userId;
    } // if the userId is passed in then add the userId to the query object.

    if (category) {
      query.category = category;
    } // if the category is passed in then add the category to the query object.

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    } // if the roomCount is passed in then add the roomCount to the query object.

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    } // if the guestCount is passed in then add the guestCount to the query object.

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    } // if the bathroomCount is passed in then add the bathroomCount to the query object.

    if (locationValue) {
      query.locationValue = locationValue;
    } // if the locationValue is passed in then add the locationValue to the query object.

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    } // if the startDate and endDate are passed in then add the startDate and endDate to the query object.

    const listings = await prisma.listing.findMany({
      where: query, // where the query object is equal to the query object.
      orderBy: {
        createdAt: "desc",
      },
    }); // find all the listings in the database and order them by the createdAt property in descending order.
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings; // return the listings
  } catch (error: any) {
    throw new Error(error);
  } // if any error occurs then throw an error.
}
