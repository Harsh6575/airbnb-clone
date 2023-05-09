import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
}

export default async function getListingsById(params : IParams) {
    try {
        const {listingId} = params;

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true,
            }
        }); // find the listing with the id that was passed in the params

        if(!listing) return null; // if the listing is not found then return null

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user:{
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: 
                    listing.user.emailVerified?.toISOString() || null,
            } // return the listing with the user object and the createdAt and updatedAt properties converted to ISOString format and the emailVerified property converted to ISOString format or null if it is not verified. 
        }
    } catch (error: any) {
        throw new Error(error); 
    }
}