import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../winnakol-next/server/root';

export const trpc = createTRPCReact<AppRouter>();
