import type { Result } from "./Result";

export type Athlete = {
    id: number;
    firstName: string;
    lastName: string;
    country: string;
    totalPoints: number;
    results: Result[];
};
