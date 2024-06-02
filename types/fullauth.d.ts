import { JWT, Session } from '@fullauth/core';
import { User } from './types';

declare module '@fullauth/core' {
  interface JWT {
    user: User;
  }

  interface Session {
    user: User;
  }
}
