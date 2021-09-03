
// builtin
import {promises as fs} from "fs";

// local
// import { Storage } from "./kernel/drivers/driver";
import {file_exists, Config} from "./utils";




class Kernel
{

    config: Config;
    storage: Storage;

    constructor()
    {

    }

    async init()
    {
        await this.load_configurations();
        await this.initialize_drivers();
    }

    async load_configurations()
    {
        let config: Config;

        if (!(await file_exists("./config.json")))
        {
            config = await this.get_default_config();
            await fs.writeFile("./config.json", config.dump());
        }
        else
        {
            const config_file = await fs.readFile("./config.json");
            config = new Config(config_file.toString());
        }

        this.config = config;
    }

    async initialize_drivers()
    {
        this.storage = new (await import(this.config.get("storage_driver"))).Driver();
        await this.storage.init(this.config);
        
        console.log(this.storage.get("foo"));
        console.log(this.storage.data);
    }


    async get_default_config(): Promise<Config>
    {
        let config = new Config();

        config.set("storage_driver", "./kernel/drivers/filesystem_storage");
        config.set("storage_dump_interval", 10000);

        return config;
    }

}


(async () =>
{
    let kernel = new Kernel();
    await kernel.init();
})();