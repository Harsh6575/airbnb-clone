import prisma from "@/app/libs/prismadb";

import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser(); // get the current user from the database.

    if (!currentUser) {
      return [];
    } // if the current user is not found in the database then return an empty array.

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
    }); // find all the listings in the database that have an id that is in the favoriteIds array of the current user. or return an empty array if the favoriteIds array is null.

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    })); // return the favorite listings with the createdAt property converted to a string. 

    return safeFavorites; // return the safe favorites.
  } catch (error: any) {
    throw new Error(error);
  } // if any error occurs then throw an error.
}
