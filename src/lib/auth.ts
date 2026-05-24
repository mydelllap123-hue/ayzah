import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await connectDB();
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
          user = await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            provider: "google",
          });
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "IsSignUp", type: "text" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          if (credentials?.isSignUp === "true") {
            const existingUser = await User.findOne({ email: credentials.email });
            if (existingUser) {
              throw new Error("User already exists");
            }

            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const user = await User.create({
              name: credentials.name,
              email: credentials.email,
              password: hashedPassword,
            });

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          const user = await User.findOne({ email: credentials?.email }).select("+password");

          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }

          const isPasswordMatch = await bcrypt.compare(credentials!.password, user.password);

          if (!isPasswordMatch) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth Error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      
      // Handle session update
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      console.log("JWT Callback - Token Role:", token.role);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string;
      }
      console.log("Session Callback - Session Role:", (session.user as any)?.role);
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "next-auth-secret-key-123",
};
