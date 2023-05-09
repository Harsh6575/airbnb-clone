import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
    return await getServerSession(authOptions); // getServerSession is a function from next-auth that returns the session object from the request object passed to it. 
}

export default async function getCurrentUser() {
    try{
        const session = await getSession(); // getSession is a function defined in this file that returns the session object from the request object passed to it. 

        if(!session?.user?.email) return null; // if the session object is null or the email property of the user object is null then return null. 

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        }); // find the user in the database with the email property of the user object of the session object. 

        if(!currentUser) return null; // if the user is not found in the database then return null. 

        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null
        }; // return the user object with the createdAt, updatedAt and emailVerified properties converted to ISOString. 
    }
    catch(err: any){
        return null;
    } // if any error occurs then return null. 

}