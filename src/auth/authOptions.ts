import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserFromDb, saltAndHashPassword } from "./login";
import prisma from "src/db/prisma";
import { findUserByUidUsername, getUserDataGoogle } from "./google";

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
      // 구글 로그인 시 username 세션에 넣기
      if (account.provider === 'google') {
        user.provider = account.provider;

        const userData = await getUserDataGoogle(user.id);
        if (userData) {
          user.username = userData.username;
          user.role = userData.role;
        }
      }
      return true
    },


    async jwt({ token, session, user, trigger }) {

      // 클라이언트에서 세션을 수정해달라고 할 때 자신의 username으로만 바꿀 수 있어야한다.
      if (trigger == 'update') {
        const user = await getUserDataGoogle(token.id);
        // user.username == session.username 이거 필수, 없으면 보안 다 뚫림
        if (user && user.username == session.username) {
          token.username = user.username;
          token.role = user.role;
        }
        return token;
      }
      return { ...token, ...user };
    },

    async session({ session, token, user, trigger, newSession }) {
      if (trigger == 'update') {
        session.user.username = newSession.username;
        session.user.role = newSession.role;
        session.user.provider = newSession.provider;
        session.user.uid = newSession.id;
        return session;
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



// signin을 하면 jwt에 토큰, user가 전달됌.
// 이때 signin-user = jwt-user
//