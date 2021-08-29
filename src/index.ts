import {ReplitStorage} from "./kernel/drivers/replit_storage";


(async () =>
{
    let storage = new ReplitStorage();
    await storage.init();

    // await storage.destroy();
})();