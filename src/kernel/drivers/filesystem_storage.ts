
// local
import {Storage} from "./driver";

// builtin
import {promises as fs} from "fs";
import {file_exists, Config} from "../../utils";



export class Driver implements Storage
{
    data: {[key: string]: any};
    private modified: boolean;
    private interval_id: NodeJS.Timer;


    constructor()
    {
        this.data = {};
        this.modified = false;
    }

    async init(config: Config)
    {
        await this.read_data();

        this.interval_id = setInterval(this.interval_dump, config.get("storage_dump_delay")); // TODO: fazer com que o intervalo seja configurável
    }

    async read_data()
    {
        if (!(await file_exists("./filesystem_storage")))
            return;

        const file_content = JSON.parse((await fs.readFile("./filesystem_storage")).toString());

        for (let key in file_content)
            this.data[key] = file_content[key];
    }

   
    
    async dump()
    {
        if (!this.modified)
            return;

        await fs.writeFile("./filesystem_storage", this.get_dump());
    }
    
    interval_dump = () => { this.dump(); }
   

    get_dump(): string
    {
        return JSON.stringify(this.data);
    }


    get(key: string): any
    {
        this.modified = true;
        return this.data[key];
    }

    set(key: string, value: any): void
    {
        this.modified = true;
        this.data[key] = value;
    }


    async destroy()
    {
        clearInterval(this.interval_id);
        this.dump();
    }

}