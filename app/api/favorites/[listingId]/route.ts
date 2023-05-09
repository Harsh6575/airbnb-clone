import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser(); // get the current user from the database.

  if (!currentUser) {
    return NextResponse.error();
  } // if the current user is not found in the database then return an error.

  const { listingId } = params; // get the listingId from the params object.

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID"); // if there is no listingId  or listingId is not a string then throw an error.
  }

  let favoriteIds = [...(currentUser.favoriteIds || [])]; // get the favoriteIds from the current user. or if there is no favoriteIds then set it to an empty array.

  favoriteIds.push(listingId); // push the listingId to the favoriteIds array.

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  }); // update the user in the database with the new favoriteIds array.

  return NextResponse.json(user); // return the user object.
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser(); // get the current user from the database.

  if (!currentUser) {
    return NextResponse.error();
  } // if the current user is not found in the database then return an error.

  const { listingId } = params; // get the listingId from the params object.

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ID");
  } // if there is no listingId  or listingId is not a string then throw an error.

  let favoriteIds = [...(currentUser.favoriteIds || [])]; // get the favoriteIds from the current user. or if there is no favoriteIds then set it to an empty array.

  favoriteIds = favoriteIds.filter((id) => id !== listingId); // filter the favoriteIds array and remove the listingId from it.

  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds,
    },
  }); // update the user in the database with the new favoriteIds array.

  return NextResponse.json(user); // return the user object.
}
