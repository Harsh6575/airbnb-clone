import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
    request: Request,
){
    const currentUser = await getCurrentUser(); // get the current user from the database. 

    if(!currentUser){
        return NextResponse.error();
    } // if the current user is not found in the database then return an error. 

    const body = await request.json(); // get the body of the request. 

    const { listingId, startDate, endDate, totalPrice } = body; // destructure the body of the request. 
    
    if(!listingId || !startDate || !endDate || !totalPrice){
        return NextResponse.error();
    } // if the listingId, startDate, endDate, or totalPrice is not found in the body of the request then return an error.

    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId,
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice,
                }
            }
        },
    }) // update the listing in the database with the listingId. create a new reservation for the listing. 

    return NextResponse.json(listingAndReservation); // return the listing and reservation.
}