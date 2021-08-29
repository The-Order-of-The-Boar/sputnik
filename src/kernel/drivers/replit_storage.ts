
// local
import {Storage} from "./driver";
import {min} from "../../utils";

// extern
import * as Replit from "@replit/database";
import { isThisTypeNode } from "typescript";



export class ReplitStorage implements Storage
{
    data: Map<string, any> = new Map<string, any>();
    database_connection: Replit.Client;
    modified: boolean = false;
    interval_id: NodeJS.Timer;

    async init()
    {
        this.database_connection = new Replit.Client();
        await this.read_data();

        this.interval_id = setInterval(this.dump, 10000); // TODO: fazer com que o intervalo seja configurável
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
        return JSON.stringify(this.data);
    }

    async destruct()
    {
        clearInterval(this.interval_id);
    }
}