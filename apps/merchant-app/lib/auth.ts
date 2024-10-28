import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async signIn({ user, account }: {
      user: {
        email: string;
        name: string
      },
      account: {
        provider: "google" | "github"
      }
    }) {
      if (!user || !user.email) {
        return false;
      }

      await db.merchant.upsert({
        select: {
          id: true
        },
        where: {
          email: user.email
        },
        create: {
          email: user.email,
          name: user.name,
          auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
        },
        update: {
          name: user.name,
          auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
        }
      });

      return true;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.auth_type = token.auth_type;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.auth_type = user.auth_type;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "secret"
}