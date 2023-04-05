
export interface UserModel{
    id:string;
    name:string;
    avatar:string;
}
export interface comment{
    user:UserModel;
    comment:string;
}

export interface gamesData{
    id:number;
    date:string;
    status:{clock:any;long:string};
    teams:{
        home:{name:string;logo:string;nickname:string};
        visitors:{name:string;logo:string;nickname:string};
    };
    scores:{
        home:{win:number;lose:number};
        visitors:{win:number;lose:number};
    }
    points:{
        home:number;
        visitors:number;
    }
    comments?:comment[] | null;

}
export type predictionsData = {total:number ; visitors:number; home:number} | undefined;
export type vote = {id:string;vote:'home'|'visitors'}

export function convertUTCToLocalTime(utcDateString) {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    const hours = localDate.getUTCHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}