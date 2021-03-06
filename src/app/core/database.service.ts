import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFire, FirebaseObjectObservable, AngularFireAuth } from 'angularfire2';

@Injectable()
export class DatabaseService {

    constructor(private _af: AngularFire) { }

    auth(): AngularFireAuth{
        return this._af.auth;
    }

    createBattle(obj: Battle){
        return this._af.database.list('/battles').push(obj);
        
    }

    getOpenBattles(pageNo: number){
        return this._af.database.list('/battles', {
                                    query: {
                                        orderByChild: 'isOpen',
                                        equalTo: true,
                                        limitToFirst: (pageNo * 10)
                                    }
                                });
    }

    getBattleByUid(uid: string): FirebaseObjectObservable<Battle>{
        return this._af.database.object('/battles/' + uid);
    }

    getBattleByUidPromise(uid: string){
        return this._af.database.object('/battles/' + uid)
                                .toPromise()
                                .catch((err: any) => {
                                    console.log(err); // again, customize me please
                                    return Promise.reject(err);
                                });
    }

    getTurn(uid:string){
        return this._af.database.object('/battles/' + uid + "turn");
    }

    getBoard(uid: string, type: string) {
        return this._af.database.object('/battles/' + uid + '/' + type)
                                .catch((err: any) => {
                                    console.log(err); // again, customize me please
                                    return Promise.reject(err);
                                });
    }

    updateBattleByUid(uid: string, obj: Battle){
        return this._af.database.list('/battles').update(uid, obj)
                                        .catch((err: any) => {
                                            console.log(err); // again, customize me please
                                        });
    }
}

export class Battle{
    hostBoats: Boat[] = new Array<Boat>();
    opponentBoats: Boat[] = new Array<Boat>();
    isOpen: boolean = true;
    owner: User = new User("","");
    opponent: User = new User("","");
    winner: User;
    shipLength: number = 3;
    isLocal: boolean = false;
    turn: string = "";
}
export class Board{
    constructor(){
        this.matrix = [];

        for(var i: number = 0; i < 7; i++) {
            this.matrix[i] = [];
            for(var j: number = 0; j< 7; j++) {
                this.matrix[i][j] = new BoardItem(i+""+j);
            }
        }
    }
    matrix: any[];
    user: User;
    guesses: number = 0;
}
export class BoardItem{
    constructor(pos: string) {
        this.position = pos;
    }
    hasboat: boolean = false;
    attacked: boolean = false;
    position: string;
}
export class Boat{
    locations: string[] = ["0","0","0"];
    hits: string[] = ["","",""];
}
export class User{
    constructor(_name: string, _uid: string) {
        this.name = _name;
        this.uid = _uid;
    }
    name: string = "";
    uid: string = "";
    guesses: string[] = new Array<string>();
}
