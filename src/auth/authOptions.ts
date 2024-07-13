import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserFromDb, saltAndHashPassword } from "./login";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username?: string;
      role?: 'admin' | 'trainee';
      provider?: string;
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    
    async session({ session, token, user }) {
      if (session.user && token.username) {
        session.user.username = token.username;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      if (session.user && token.provider) {
        session.user.provider = token.provider;
      }
      return session;
    },
    
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google') {
        console.log('signin:', user);

        const userData = await getUserDataGoogle(user.id);

        if (userData) {
          user.username = userData.username;
          user.role = userData.role;
        }
      }
      return true
    },

  },
  pages: {
    signIn: "/auth/signin",
  },
};


async function getUserDataGoogle(uid: string) {
  if (uid == '1074593492211660994386') {
    return {
      username: 'demo',
      role: 'trainee',
      provider: 'Google'
    }
  }
}