import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";  

export async function POST(
  request: Request, 
) {
  const currentUser = await getCurrentUser(); // get the current user from the database. 

  if (!currentUser) {
    return NextResponse.error();
  } // if the current user is not found in the database then return an error.

  const body = await request.json();
  const { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
   } = body; // get the listing data from the body object.

   // if any of the listing data is not found in the body object then return an error.
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  }); // create the listing in the database.

  return NextResponse.json(listing); // return the listing object.
}