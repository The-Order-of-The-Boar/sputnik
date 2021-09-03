// import { Storage } from "./kernel/drivers/driver";

class Kernel
{

    storage: Storage;

    constructor()
    {

    }

    async init()
    {
        this.initialize_drivers();
    }

    async initialize_drivers()
    {
        // let storage_driver_config = "./kernel/drivers/filesystem_storage";
        // const StorageDriver = (await import(storage_driver_config)).Driver;
        // 
        // this.storage = new StorageDriver();
        // await this.storage.init();
        // 
        // console.log(this.storage.get("foo"));
        // console.log(this.storage.data);
    }
}


(async () =>
{
    let kernel = new Kernel();
    await kernel.init();
})();