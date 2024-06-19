import NextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { verifyPassword } from './utils';
import prisma from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        if (!credentials.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        console.log(user);
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password as string
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
    jwt: async ({ token, user, account }: any) => {
      if (account && account.type === 'credentials') {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  //   pages: {
  //     signIn: '/login',
  //   },
});
