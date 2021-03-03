 
 const assert = require('chai').assert;
 const {
     Status
 } = require('brackets-model');
 const {
     BracketsManager,
     JsonDatabase
 } = require('../dist');

 const storage = new JsonDatabase();
 //const storage = new MongoDatabase(mongoUrlConnection);
 const manager = new BracketsManager(storage);


 
 
 process.on('unhandledRejection', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err);
    //console.log(err.name, err.message);
    process.exit(1);
  });
    
    


 (async function () {


   const reset = await storage.reset();//.then(async (result, error)=>{
    console.log('reseted ',reset);
    

     if (reset) {

        

        await manager.create({
            name: 'Example with BYEs',
            tournamentId: 0,
            type: 'single_elimination',
            seeding: [
                'Team 1', null,
                'Team 3', 'Team 4',
                null, null,
                'Team 7', 'Team 8',
            ],
            settings: { seedOrdering: ['natural'] },
        });

     
    }
     return;
 })();
 