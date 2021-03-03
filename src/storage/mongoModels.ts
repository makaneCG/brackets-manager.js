

 
import { Document, Model, model, Types, Schema, Query } from 'mongoose';
 

export interface IParticipant extends Document{
    id: number;
    tournament_id: number;
    name:string;
};

const ParticipantSchema = new Schema({
    id: {
        type: Number,
        required:true,
    },
    tournament_id: {
        type: Number,
    },
    name: {
        type: String,
    },
});
const Participant = model('TournamentParticipant', ParticipantSchema);

export interface IStage extends Document{
    id: number;
    tournament_id: number;
    name:string;
    type: string;
    number: number;
    settings: {
        groupCount: number
    }
}


const StageSchema = new Schema({
    id: {
        type: Number,
        required:true,
    },
    tournament_id: {
        type: Number,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    number: {
        type: Number,
    },
    settings: {
        groupCount: {
            type: Number,
        },
    },
});
const Stage = model('TournamentStage', StageSchema);


export interface IGroup extends Document{
    id: number;
    stage_id: number;
    group_id: number;
    name:string;
    number: number;
}
const groupSchema = new Schema({
    id: {
        type: Number,
        required:true,
    },
    stage_id: {
        type: Number,
    },
    group_id:{
        type: Number,
    },
    name: {
        type: String,
    },
    number: {
        type: Number,
    },
});
const Group = model('TournamentGroup', groupSchema);


export interface IRound extends Document{
    id: number;
    stage_id: number;
    group_id: number;
    number: number;
}
const roundSchema = new Schema({
    id: {
        type: Number,
        required:true,
    },
    stage_id: {
        type: Number,
    },
    group_id: {
        type: Number,
    },
    number: {
        type: Number,
    },
});
const Round = model('TournamentRound', roundSchema);



export interface IMatch extends Document{
    id: number;
    stage_id: number;
    group_id: number;
    number: number;
    round_id: number;
    child_count: number;
    status: string;
    locked: boolean;
    scheduled_datetime: string;
    start_datetime: string;
    end_datetime: string;
    opponent1: {
        id: number,
        position:number,
        score: number,
        result:string,
    };
    opponent2: {
        id: number,
        position: number,
        score: number,
        result:string,
    };
}
const matchSchema = new Schema({
    id: {
        type: Number,
        required:true,
    },
    number: {
        type: Number,
    },
    stage_id: {
        type: Number,
    },
    group_id: {
        type: Number,
    },
    round_id: {
        type: Number,
    },
    child_count: {
        type: Number,
    },
    status: {
        type: String,
    },
    locked: {
        type: Boolean,
    },
    scheduled_datetime: {
        type: String,
    },
    start_datetime: {
        type: String,
    },
    end_datetime: {
        type: String,
    },
    opponent1: {
        id: {
            type: Number,
        },
        position: {
            type: Number,
        }, 
        score: {
            type: Number,
        },
        result:{
            type:String,
        },
    },
    opponent2: {
        id: {
            type: Number,
        },
        position: {
            type: Number,
        }, 
        score: {
            type: Number,
        },
        result:{
            type:String,
        },
    },
});
const Match = model('TournamentMatch', matchSchema);

export interface IMatch_game extends Document{
    id:string
}

const match_gameSchema = new Schema({
    parent_id: Number,
    number: Number,
});

const Match_game = model('TournamentMatch_game', match_gameSchema);
 
export { Match, Round, Group, Stage, Participant, Match_game };

