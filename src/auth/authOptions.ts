import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserFromDb, saltAndHashPassword } from "./login";
import prisma from "src/db/prisma";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username?: string;
      role?: 'admin' | 'trainee';
      provider?: 'credential' | 'google' | null;
      uid?: string;
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

    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google') {
        user.provider = account.provider;

        const userData = await getUserDataGoogle(user.id);
        if (userData) {
          user.username = userData.username;
          user.role = userData.role;
        }
        console.log('<signin>');
      }
      return true
    },
    // signin을 하면 jwt에 토큰, user가 전달됌.
    // 이때 signin-user = jwt-user
    //

    async jwt({ token, session, user, trigger }) {

      if (trigger == 'update') {
        console.log('<jwt update>', session, token);
        const user = await canUpdateSessionData(token.id, session.username);
        console.log(user);
        if (user) {
          token.username = user.username;
          token.role = user.role;
        }
        return token;
      }
      return { ...token, ...user };
    },

    async session({ session, token, user, trigger, newSession }) {
      if (trigger == 'update') {
        console.log('<session update>', newSession);
        session.user.username = newSession.username;
        session.user.role = newSession.role;
        session.user.provider = newSession.provider;
        session.user.uid = newSession.id;
      }
      if (session.user) {
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.uid = token.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

async function canUpdateSessionData(uid: string, username: string) {
  const user = await prisma.auth.findUnique({
    where: {
      uid_provider: {
        uid: uid,
        provider: 'google',
      }
    },
    include: {
      user: true,
    }
  });

  if (username == user?.user.username) {
    return {
      username: user.user.username,
      role: 'trainee',
      provider: 'google'
    }
  }

}


async function getUserDataGoogle(uid: string) {
  const user = await prisma.auth.findUnique({
    where: {
      uid_provider: {
        uid: uid,
        provider: 'google',
      }
    },
    include: {
      user: true,
    }
  });

  if (user) {
    return {
      username: user.user.username,
      role: 'trainee',
      provider: 'google'
    }
  }

}