import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth,{ AuthOptions } from "next-auth";

import prisma from "../../../app/libs/prismadb";
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma), // PrismaAdapter is a class, not a function so we can't use it as a provider like the others below (GitHubProvider, GoogleProvider, CredentialsProvider) 
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials', // this is the name of the provider, not the name of the credentials
            credentials: {
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
            }, //credentials is an object with the name of the credentials as keys and the type of the credentials as values (text, password, etc.) 
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid credentials');
                }; // if the credentials are not valid, throw an error 

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                }); // find the user in the database if it exists

                if(!user || !user?.hashedPassword){
                    throw new Error('Invalid credentials');
                }; // if the user doesn't exist or doesn't have a hashed password, throw an error 

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword); // compare the password in the credentials with the hashed password in the database 

                if(!isCorrectPassword){
                    throw new Error('Invalid credentials');
                }; // if the password is not correct, throw an error 

                return user; // if the password is correct, return the user 
            }
        }), 
    ],
    pages: {
        signIn: '/',
    }, // this is the page that the user will be redirected to when they try to access a page that requires authentication 
    debug: process.env.NODE_ENV === 'development', // if the environment is development, debug is true, otherwise it is false
    session: {
        strategy: 'jwt',
    }, // the strategy is jwt, which means that the session will be stored in a cookie 
    secret: process.env.NEXTAUTH_SECRET as string, // the secret is the secret used to sign the JWT token 
}

export default NextAuth(authOptions);