import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _defaults = {
    type:'email',
    name:'',
    anonymous:false
};
// Store handling all User Preferences
let UserIdentityStore = {
    ...EventEmitter.prototype,

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    getIdentity() {
        return _defaults;
    },

    getType(){
        return _defaults.type;
    },

    getName(){
        return _defaults.name;// return email
    },

    getAnonymous(){
        return _defaults.anonymous;
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

};

UserIdentityStore.dispatchToken = ChatAppDispatcher.register(action => {

    switch (action.type) {

        case ActionTypes.INIT_IDENTITY: {
            let identity = action.identity;
            if(identity.hasOwnProperty('type'))
            {
                _defaults.type=identity.type;
            }
            if(identity.hasOwnProperty('name'))
            {
                _defaults.name=identity.name;
            }
            if(identity.hasOwnProperty('anonymous'))
            {
                _defaults.anonymous=identity.anonymous;
            }
            UserIdentityStore.emitChange();
            break;
        }
        default: {
            // do nothing
        }
    }
});

export default UserIdentityStore;
