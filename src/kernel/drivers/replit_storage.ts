
// local
import {Storage} from "./driver";
import {min} from "../../utils";

// extern
const ReplitClient = require("@replit/database");



export class Driver implements Storage
{
    private data: Map<string, any>;
    private database_connection: any;
    private modified: boolean;
    private interval_id: NodeJS.Timer;

    constructor()
    {
        this.data = new Map<string, any>();
        this.modified = false;
    }

    async init()
    {
        this.database_connection = new ReplitClient();
        await this.read_data();

        this.interval_id = setInterval(this.interval_dump, 10000); // TODO: fazer com que o intervalo seja configurável
    }

    async read_data()
    {
        const used_key_count = await this.database_connection.get("key_count");

        if (used_key_count == undefined || used_key_count == 0)
            return;


        let content_text = "";
        for (let idx = 0; idx < (used_key_count as number); ++idx)
            content_text += (await this.database_connection.get(`${idx}`)) as string;

        const content_json = JSON.parse(content_text);
        for (let key in content_json)
            this.data.set(key, content_json[key]);
    }

    interval_dump = () => { this.dump(); }

    async dump()
    {
        if (!this.modified)
            return;

        const content = this.get_dump();
        
        // strings do Javascript são armazenadas em UTF-16, cada caracter tem 2 bytes
        // 5000000 é o tamanho máximo suportado em 1 key no banco
        const necessary_key_count = (content.length * 2) / 5000000;

        this.database_connection.set("key_count", necessary_key_count)

        for (let idx = 0; idx < necessary_key_count; ++idx)
            this.database_connection.set(`${idx}`, content.slice(idx * 5000000, min(content.length, (idx + 1) * 5000000)));

        this.modified = false;
    }

    get_dump(): string
    {
        // FIXME: isso não funciona
        return JSON.stringify(this.data);
    }


    get(key: string): any
    {
        this.modified = true;
        return this.data.get(key);
    }

    set(key: string, value: any): void
    {
        this.modified = true;
        this.data.set(key, value);
    }


    async destroy()
    {
        clearInterval(this.interval_id);
        this.dump();
    }
}
