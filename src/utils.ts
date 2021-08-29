
export type Nullable<T> = T | null;

export function min(a: number, b: number): number
{
    return (a < b) ? a : b;
}