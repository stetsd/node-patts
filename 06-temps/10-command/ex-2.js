const statusUpdateService = {
    statusUpdates: {},
    sendUpdate: function(status){
        console.log('Status sent: ' + status);
        let id = Math.floor(Math.random() * 1000000);
        statusUpdateService.statusUpdates[id] = status;
        return id;
    },

    destroyUpdate: id => {
        console.log('Status removed: ' + id);
        delete statusUpdateService.statusUpdates[id];
    }
};


function createSendStatusCmd(service, status){
    let postId = null;

    const command = () => {
        postId = service.sendUpdate(status);
    };

    command.undo = () => {
        if(postId){
            service.destroyUpdate(postId);
            postId = null;
        }
    };

    command.serialize = () => {
        return {type: 'status', action: 'post', status: status};
    };

    return command;
};

class Invoker {
    constructor(){
        this.history = [];
    }

    run(cmd){
        this.history.push(cmd);
        cmd();
        console.log('Command executed ', cmd.serialize());
    }

    delay(cmd, delay){
        setTimeout(()=>{
            this.run(cmd)
        }, delay)
    }

    undo(){
        const cmd = this.history.pop();
        cmd.undo();
        console.log('COmmand undone ', cmd.serialize());
    }
}


const invoker = new Invoker();

const command = createSendStatusCmd(statusUpdateService, 'HI!');

invoker.run(command);
invoker.undo(command);
invoker.delay(command, 1000 * 60 * 60);
