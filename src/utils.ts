
// builtin
import {promises as fs} from "fs";


export type Nullable<T> = T | null;

export function min(a: number, b: number): number
{
    return (a < b) ? a : b;
}

export async function file_exists(path: string): Promise<boolean>
{
    let file_exists = false;
    await fs.stat(path).then((value) => { file_exists = value.isFile()}).catch(() => {});

    return file_exists;
}


export class Config
{
    private data: {[key: string]: any};

    constructor(str: string = "{}")
    {
        this.data = JSON.parse(str);
    }

    get(key: string): any
    {
        if (this.data[key] == undefined)
            throw `missing configuration "${key}"`
            
        return this.data[key];
    }

    set(key: string, value: any): void
    {
        this.data[key] = value;
    }

    dump(): string
    {
        return JSON.stringify(this.data);
    }
}