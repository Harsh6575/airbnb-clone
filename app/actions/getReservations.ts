import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params; // destructure the params object. 

    const query: any = {}; // create an empty object called query. 

    if (listingId) {
      query.listingId = listingId;
    } // if the listingId is passed in then add the listingId to the query object.

    if (userId) {
      query.userId = userId;
    } // if the userId is passed in then add the userId to the query object.

    if (authorId) {
      query.listing = { userId: authorId };
    } // if the authorId is passed in then add the authorId to the query object. 

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }); // find all the reservations in the database that match the query object. include the listing object. order the reservations by the createdAt property in descending order. 

    const safeReservations = reservations.map(
        (reservation) => ({
        ...reservation,
        createdAt: reservation.createdAt.toISOString(),
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        listing: {
          ...reservation.listing,
          createdAt: reservation.listing.createdAt.toISOString(),
        },
      })); // return the reservations with the createdAt, startDate, endDate, and listing.createdAt properties converted to a string. 
  
      return safeReservations; // return the safe reservations.

  } catch (error: any) {
    throw new Error(error);
  } // if any error occurs then throw an error.
}
