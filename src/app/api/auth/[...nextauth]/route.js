import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "../../login/login";

export const authOptions ={
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "아이디",
          type: "text",
          placeholder: "아이디를 입력하세요",
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        const { username, password, csrfToken } = credentials;

        const response = await login(username, password);

        if (response.status == 200) {
          //alert("로그인 성공!");
          //setCookie(encryptedPassword, username);
           return response.user;
        } else {
          return null;
        }

      },

      callbacks: {
        async jwt({ token, account }) {
          // Persist the OAuth access_token to the token right after signin
          if (account) {
            token.accessToken = account.access_token
          }
          return token
        },
        async session({ session, token, user }) {
          // Send properties to the client, like an access_token from a provider.
          session.accessToken = token.accessToken
          return session
        }
      }
    }),
  ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
