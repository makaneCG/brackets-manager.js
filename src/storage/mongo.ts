import {
    JsonDB,
} from 'node-json-db';
import {
    CrudInterface,
    Table,
} from '../types';
import {
    Document,
    Model,
    model,
    Types,
    Schema,
    Query,
    connect,
    connection,
} from 'mongoose';
import {
    Participant,
    Stage,
    Group,
    Round,
    Match,
    Match_game,
} from './mongoModels';
const clone = require('rfdc')();


type StringIndexedObject = {
    [key: string]: unknown;
};

type Filter < T > = (obj: T) => boolean;



interface I1 {
    [key: string]: Model < Document >

}

const Collection: I1 = {
    'participant': Participant,
    'stage': Stage,
    'group': Group,
    'round': Round,
    'match': Match,
    'match_game': Match_game,
};


export class MongoDatabase implements CrudInterface {


    /**
     * Creates an instance of MongoDatabase, an implementation of CrudInterface for a json file.
     */
    constructor() {
       
        this.init();
    }

 

    /**
     * Initiates the storage.
     */
    private init(): void {
       
        connect('mongodb://localhost:27017/tournament-manager', {
            useNewUrlParser: true,
        });
    }

  
  
   
   

    /**
     * Empties the database and `init()` it back.
     */
    public async reset(): Promise < string > {
        const self = this;
        return new Promise(async function (resolve, reject) {

            await connect('mongodb://localhost:27017/tournament-manager', {
                useNewUrlParser: true,
            });

            connection.db.dropDatabase(function (err, result) {
                if (!err) {
                    console.log('database droped', result);
                    self.init();
                    resolve('succcess');
                } else 
                    reject('failure');
                

            });

        });



    }

    /**
     * Inserts a value in a table and returns its id.
     *
     * @param table Where to insert.
     * @param value What to insert.
     */
    public insert < T > (table: Table, value: T): Promise < number > ;

    /**
     * Inserts multiple values in a table.
     *
     * @param table Where to insert.
     * @param values What to insert.
     */
    public insert < T > (table: Table, values: T[]): Promise < boolean > ;

    /**
     * Inserts a unique value or multiple values in a table.
     *
     * @param table Name of the table.
     * @param arg A single value or an array of values.
     */
    public async insert < T > (table: Table, arg: T | T[]): Promise < number | boolean > {

            let id = (await Collection[table].count({}));
            if (!Array.isArray(arg)) {

                try {
                   const doc = await Collection[table].create({
                        id,
                        ...arg,
                    });
                  // console.log("🚀 ~ insert one ~ doc", doc)
                    if(doc){
                        return id;
                    }else{
                        return -1;
                    }

                } catch (error) {
                    //console.log('🚀 ~ file: mongo.ts ~ line 168 ~ JsonDatabase ~ error', error);
                    return -1;
                }finally{
                   // console.log('insert one');
                }

            }

            try {
                const doc = await Collection[table].create(arg.map(object => ({ id: id++, ...object })));
                 if(doc){
                   // console.log("🚀 ~ insert many doc", doc);
                    return true;
                }else{
                    return -1;
                }
            } catch (error) {
                console.log('🚀 ~ insert many doc ~ error', error);
                return false;
            }finally{
                //console.log('insert many');
            }

            
            // const r = await Promise.all(arg.map(async (object) => {

            //     return new Promise(async (resolve, reject) => {
            //         const doc = await Collection[table].create({
            //             id: id++,
            //             ...object
            //         });

            //         if (doc)
            //             resolve(true);
            //         else
            //             resolve(false);
            //     });
            // }));

             

         
    }

    /**
     * Gets all data from a table. 
     *
     * @param table Where to get from.
     */
    public select < T > (table: Table): Promise < T[] | null > ;

    /**
     * Gets specific data from a table.
     *
     * @param table Where to get from.
     * @param key What to get.
     */
    public select < T > (table: Table, key: number): Promise < T | null > ;

    /**
     * Gets data from a table with a filter.
     *
     * @param table Where to get from.
     * @param filter An object to filter data.
     */
    public select < T > (table: Table, filter: Partial < T > ): Promise < T[] | null >

        /**
         * Gets a unique elements, elements matching a filter or all the elements in a table.
         * 
         * @param table Name of the table.
         * @param arg An index or a filter.
         */
        public async select < T > (table: Table, arg ? : number | Partial < T > ): Promise < T | T[] | null > {
            try {
                if (arg === undefined){
                const docs =     await (Collection[table].find({})) as any;
                //console.log("🚀 ~ select arg undifined ", docs);
                return docs;
                 }
                if (typeof arg === 'number'){
                    const docs =  await (Collection[table].findOne({ id: arg })) as any;
                    //console.log("🚀 ~ select arg number ", docs);
                     return docs;

                }

                 
                const values = (await Collection[table].find(arg)) as any || null;
           
              //  console.log('🚀 ~ select arg object ', arg, values);
                return values;
            } catch (e) {
                console.error('error select', e);
                return null;
            } finally {
              //  console.log('select');
            }
        }

    /**
     * Updates data in a table.
     *
     * @param table Where to update.
     * @param key What to update.
     * @param value How to update.
     */
    public update < T > (table: Table, key: number, value: T): Promise < boolean > ;

    /**
     * Updates data in a table.
     *
     * @param table Where to update.
     * @param filter An object to filter data.
     * @param value How to update.
     */
    public update < T > (table: Table, filter: Partial < T > , value: Partial < T > ): Promise < boolean > ;

    /**
     * Updates one or multiple elements in a table.
     * 
     * @param table Name of the table.
     * @param arg An index or a filter.
     * @param value The whole object if arg is an index or the values to change if arg is a filter.
     */
    public async update < T > (table: Table, arg: number | Partial < T > , value: T | Partial < T > ): Promise < boolean > {
     
            if (typeof arg === 'number') {

                try {
                    await Collection[table].updateOne({ id: arg}, value);
                    return true;
                } catch (error) {
                    return false;
                }
                
            }
           
            const values = await Collection[table].find(arg, value);
            if (!values) return false;

            values.forEach(async (v) => await Collection[table].updateOne({id: v.id}, value, {new:true}));
            return true;

         
    }

    /**
     * Delete data in a table, based on a filter.
     *
     * @param table Where to delete in.
     * @param filter An object to filter data.
     */
    public async delete < T extends {
        [key: string]: unknown
    } > (table: Table, filter: Partial < T > ): Promise < boolean > {
         
        try {
            await Collection[table].deleteMany(filter);
            return true;
        } catch (e) {
            console.error('error delete', e);
            return false;
        } finally {
           // console.log('delete');
        }
    }
}