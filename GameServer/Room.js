function Room (name, status, id, cursize, size){

	this.name = name;
	this.status = status;

	this.id = id;

	this.cursize = cursize;
	this.size = size;
};

module.exports.room = Room;