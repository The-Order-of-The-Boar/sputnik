
interface Driver
{
    init(): void;
    destroy(): void;
}


export interface Storage extends Driver
{
    data: Map<string, any>;
    dump(): void;
    get_dump(): string;
}
