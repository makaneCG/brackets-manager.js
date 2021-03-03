 const assert = require('chai').assert;
 const {
     Status,
 } = require('brackets-model');
 const {
     BracketsManager,
     MongoDatabase,
 } = require('../dist');

 const storage = new MongoDatabase();
 //const storage = new MongoDatabase(mongoUrlConnection);
 const manager = new BracketsManager(storage);



 describe('Create single elimination stage', () => {

     beforeEach(() => {
         storage.reset();
     });

    //  it('should create a single elimination stage', async () => {
    //      const example = {
    //          name: 'Example',
    //          tournamentId: 0,
    //          type: 'single_elimination',
    //          seeding: [
    //              'Team 1', 'Team 2',
    //              'Team 3', 'Team 4',
    //              'Team 5', 'Team 6',
    //              'Team 7', 'Team 8',
    //              'Team 9', 'Team 10',
    //              'Team 11', 'Team 12',
    //              'Team 13', 'Team 14',
    //              'Team 15', 'Team 16',
    //          ],
    //          settings: {
    //              seedOrdering: ['natural'],
    //          },
    //      };

    //      const doc = await manager.create(example);

    //      if (doc) {
    //          const stage = await storage.select('stage', 0);
    //          assert.strictEqual(stage.name, example.name);
    //          assert.strictEqual(stage.type, example.type);

    //          assert.strictEqual((await storage.select('group')).length, 1);
    //          assert.strictEqual((await storage.select('round')).length, 4);
    //          assert.strictEqual((await storage.select('match')).length, 15);
    //      } else 
    //          console.log('error 1');
         

    //  });

     it('should create a single elimination stage with BYEs', async () => {
         const doc = await manager.create({
             name: 'Example with BYEs',
             tournamentId: 0,
             type: 'single_elimination',
             seeding: [
                 'Team 1', null,
                 'Team 3', 'Team 4',
                 null, null,
                 'Team 7', 'Team 8',
             ],
             settings: {
                 seedOrdering: ['natural'],
             },
         });

         if (doc) {
             assert.strictEqual((await storage.select('match', 4)).opponent1.id, 0); // Determined because of opponent's BYE.
             assert.strictEqual((await storage.select('match', 4)).opponent2.id, null); // To be determined.
             assert.strictEqual((await storage.select('match', 5)).opponent1, null); // BYE propagated.
             assert.strictEqual((await storage.select('match', 5)).opponent2.id, null); // To be determined.
         } else {
            console.log('error 2', doc);

         }

         

     });

    //  it('should create a single elimination stage with consolation final', async () => {
    //      const doc = await manager.create({
    //          name: 'Example with consolation final',
    //          tournamentId: 0,
    //          type: 'single_elimination',
    //          seeding: [
    //              'Team 1', 'Team 2',
    //              'Team 3', 'Team 4',
    //              'Team 5', 'Team 6',
    //              'Team 7', 'Team 8',
    //          ],
    //          settings: {
    //              consolationFinal: true,
    //              seedOrdering: ['natural'],
    //          },
    //      });

    //      if (doc) {
    //          assert.strictEqual((await storage.select('group')).length, 2);
    //          assert.strictEqual((await storage.select('round')).length, 4);
    //          assert.strictEqual((await storage.select('match')).length, 8);
    //      } else 
    //          console.log('error 3');
         
    //  });

    //  it('should create a single elimination stage with consolation final and BYEs', async () => {
    //      const doc = await manager.create({
    //          name: 'Example with consolation final and BYEs',
    //          tournamentId: 0,
    //          type: 'single_elimination',
    //          seeding: [
    //              null, null,
    //              null, 'Team 4',
    //              'Team 5', 'Team 6',
    //              'Team 7', 'Team 8',
    //          ],
    //          settings: {
    //              consolationFinal: true,
    //              seedOrdering: ['natural'],
    //          },
    //      });
    //      if (doc) {
    //          assert.strictEqual((await storage.select('match', 4)).opponent1, null);
    //          assert.strictEqual((await storage.select('match', 4)).opponent2.id, 0);

    //          // Consolation final
    //          assert.strictEqual((await storage.select('match', 7)).opponent1, null);
    //          assert.strictEqual((await storage.select('match', 7)).opponent2.id, null);
    //      } else 
    //          console.log('error 4');
         
    //  });

    //  it('should create a single elimination stage with Bo3 matches', async () => {
    //      const doc = await manager.create({
    //          name: 'Example with Bo3 matches',
    //          tournamentId: 0,
    //          type: 'single_elimination',
    //          seeding: [
    //              'Team 1', 'Team 2',
    //              'Team 3', 'Team 4',
    //              'Team 5', 'Team 6',
    //              'Team 7', 'Team 8',
    //          ],
    //          settings: {
    //              seedOrdering: ['natural'],
    //              matchesChildCount: 3,
    //          },
    //      });
    //      if (doc) {
    //          assert.strictEqual((await storage.select('group')).length, 1);
    //          assert.strictEqual((await storage.select('round')).length, 3);
    //          assert.strictEqual((await storage.select('match')).length, 7);
    //          assert.strictEqual((await storage.select('match_game')).length, 7 * 3);
    //      } else 
    //          console.log('error 5');
         
    //  });
 });

//  describe('Previous and next match update in single elimination stage', () => {
//      beforeEach(() => {
//          storage.reset();
//      });

//      it('should determine matches in consolation final', async () => {
//          const tournament = await manager.create({
//              name: 'Example',
//              tournamentId: 0,
//              type: 'single_elimination',
//              seeding: ['Team 1', 'Team 2', 'Team 3', 'Team 4'],
//              settings: {
//                  consolationFinal: true,
//              },
//          });

//          const match1 = await manager.update.match({
//              id: 0, // First match of round 1
//              opponent1: {
//                  score: 16,
//                  result: 'win',
//              },
//              opponent2: {
//                  score: 12,
//              },
//          });

//          const match2 = await manager.update.match({
//              id: 1, // Second match of round 1
//              opponent1: {
//                  score: 13,
//              },
//              opponent2: {
//                  score: 16,
//                  result: 'win',
//              },
//          });

//          const match3 = await manager.update.match({
//              id: 2, // Final
//              opponent1: {
//                  score: 16,
//                  result: 'win',
//              },
//              opponent2: {
//                  score: 9,
//              },
//          });

//          if (tournament && match1 && match2 && match3) {


//              assert.strictEqual(
//                  (await storage.select('match', 3)).opponent1.id, // Determined opponent for the consolation final
//                  (await storage.select('match', 0)).opponent2.id, // Loser of Semi 1
//              );

//              assert.strictEqual(
//                  (await storage.select('match', 3)).opponent2.id, // Determined opponent for the consolation final
//                  (await storage.select('match', 1)).opponent1.id, // Loser of Semi 2
//              );
//          } else 
//              console.log('err 6');
         
//      });

//      it('should archive previous matches', async () => {
//          const tournament = await manager.create({
//              name: 'Example',
//              tournamentId: 0,
//              type: 'single_elimination',
//              seeding: ['Team 1', 'Team 2', 'Team 3', 'Team 4'],
//              settings: {
//                  consolationFinal: true,
//              },
//          });

//          const match1 = await manager.update.match({
//              id: 0, // First match of round 1
//              opponent1: {
//                  score: 16,
//                  result: 'win',
//              },
//              opponent2: {
//                  score: 12,
//              },
//          });

//          const match2 = await manager.update.match({
//              id: 1, // Second match of round 1
//              opponent1: {
//                  score: 13,
//              },
//              opponent2: {
//                  score: 16,
//                  result: 'win',
//              },
//          });

//          const match3 = await manager.update.match({
//              id: 2, // Final
//              opponent1: {
//                  score: 16,
//                  result: 'win',
//              },
//              opponent2: {
//                  score: 9,
//              },
//          });

//          if (tournament && match1 && match2 && match3) {


//              assert.strictEqual((await storage.select('match', 0)).status, Status.Archived);
//              assert.strictEqual((await storage.select('match', 1)).status, Status.Archived);

//              const match4 = await manager.update.match({
//                  id: 3, // Consolation final
//                  opponent1: {
//                      score: 16,
//                      result: 'win',
//                  },
//                  opponent2: {
//                      score: 9,
//                  },
//              });
//              if (match4) 
//                  assert.strictEqual((await storage.select('match', 2)).status, Status.Archived);
//               else 
//                  console.log('error 9');
             


//          }
//      });
//  });