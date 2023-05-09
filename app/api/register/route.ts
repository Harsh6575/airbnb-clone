import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request, 
) {
  const body = await request.json(); // get the body from the request object. 
  const { 
    email,
    name,
    password,
   } = body; // get the email, name and password from the body object. 

   const hashedPassword = await bcrypt.hash(password, 12); // hash the password with bcrypt. 

   const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    }
  }); // create a user in the database with the email, name and hashedPassword. 

  return NextResponse.json(user); // return the user object.
}
