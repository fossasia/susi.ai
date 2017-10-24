import * as Actions from './ChatApp.actions'

let webSocket = null

// This function tries to connect to WebSocket Server running on Susi Hardware Device
export function connectToWebSocket(serverUrl) {
    try {
        if(webSocket!=null && webSocket.OPEN){
            webSocket.close();
        }
        webSocket = new WebSocket(serverUrl);
        webSocket.onmessage = function incoming(message) {
            console.log('Message Received from Susi Hardware: ' + message);
            Actions.createMessage(message.data, 't_1');
        }
        webSocket.onopen = function connected() {
            alert('Connection Successful');
        }
        webSocket.onerror = function error() {
            alert('Connection Error. Please verify that Susi Hardware is running on address you mentioned.')
        }

        return true;
    }
    catch (e) {
        console.log(e);
        webSocket = null;
        return false;
    }
}

export function sendToHardwareDevice(susiResponse) {
    if (webSocket == null) {
        return;
    }
    webSocket.send(JSON.stringify(susiResponse));
}
