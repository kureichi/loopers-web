import type { User } from 'better-auth';

export interface ThemeProps {
    count: number;
    isClaimed: boolean;
    user: User;
    percentNumber: number;
}
