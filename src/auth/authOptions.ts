
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserFromDb, login, saltAndHashPassword } from "./login";

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: 'admin' | 'trainee'
    } & DefaultSession["user"]
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        // const { username, password, csrfToken } = credentials;
        // logic to salt and hash password
        const pwHash = saltAndHashPassword(credentials!.password)

        // logic to verify if user exists
        const user = await getUserFromDb(credentials!.username, pwHash)

        if (!user) {
          return null;
        }
        return user;
      },

    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
