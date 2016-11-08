"use strict";

class Room {

    constructor (name, status, id, cursize, size){
        this.name = name;
        this.status = status;

        this.id = id;

        this.cursize = cursize;
        this.size = size;
    }
    
    AddClient (){
        this.cursize++;
    };
    
    get Size (){
        return this.size;
    }
    
    get CurSize (){
        return this.cursize;
    }
};

module.exports.room = Room;