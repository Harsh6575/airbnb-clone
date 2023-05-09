import { PrismaClient } from "@prisma/client";
 
declare global {
    var prisma: PrismaClient | undefined;
} // declare a global variable called prisma. 

const client = globalThis.prisma || new PrismaClient(); // create a new PrismaClient and assign it to the client variable. or if the global variable prisma is defined then assign it to the client variable. 

if (process.env.NODE_ENV !== "production") globalThis.prisma = client; // if the NODE_ENV environment variable is not equal to production then assign the client variable to the global variable prisma. 

export default client;