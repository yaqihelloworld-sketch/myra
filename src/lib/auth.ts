import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      // Persist the Google account ID so it's stable across devices
      if (account?.providerAccountId) {
        token.googleId = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Use Google account ID (stable) instead of token.sub (random per device)
        session.user.id = (token.googleId as string) || token.sub!;
      }
      return session;
    },
  },
});
