
interface Driver
{
    init(): Promise<void>;
    destroy(): Promise<void>;
}


export interface Storage extends Driver
{
    dump(): Promise<void>;
    get_dump(): string;

    get(key: string): any;
    set(key: string, value: any): void;
}
