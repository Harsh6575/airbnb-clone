import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams{
    reservationId?: string;
}

export async function DELETE(
    request: Request,
    {params}: {params: IParams}
){
    const currentUser = await getCurrentUser(); // get the current user from the database.

    if(!currentUser){
        return NextResponse.error();
    } // if the current user is not found in the database then return an error.

    const reservationId = params.reservationId; // get the reservationId from the params object. 

    if(!reservationId || typeof reservationId !== 'string'){
        throw new Error('Invalid reservation id');
    } // if the reservationId is not found in the params object or the reservationId is not a string then throw an error.

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR:[
                {userId: currentUser.id},
                {listing: {userId: currentUser.id}}
            ]
        },
    }) // delete the reservation in the database with the reservationId. 

    return NextResponse.json(reservation); // return the reservation.
}