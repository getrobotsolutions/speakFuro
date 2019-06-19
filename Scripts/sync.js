//Create an account on Firebase, and use the credentials they give you in place of the following
var firebaseConfig = {
    apiKey: "AIzaSyBXzcGDkfDK1Pd9IK2SrULFylzdOF6QBkU",
    authDomain: "websitebeaver-6d9c7.firebaseapp.com",
    databaseURL: "https://websitebeaver-6d9c7.firebaseio.com",
    projectId: "websitebeaver-6d9c7",
    storageBucket: "websitebeaver-6d9c7.appspot.com",
    messagingSenderId: "1060779787413",
    appId: "1:1060779787413:web:62cfd5773721b0df"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database().ref();
var yourVideo = document.getElementById("yourVideo");
var friendsVideo = document.getElementById("friendsVideo");
var yourId = Math.floor(Math.random()*1000000000);
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'webrtc.websitebeaver@gmail.com'}]};
var pc = new RTCPeerConnection(servers);
pc.onicecandidate = (event => event.candidate?sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

function sendMessage() {
    var msg = database.push("hello");
    msg.remove();
}

function readMessage(data) {

    //alert(data.val().message);
    PlaySpeech(data.val().message);
    document.getElementById("speak").innerHTML = data.val().message;



}

database.on('child_added', readMessage);

function showMyFace() {
    navigator.mediaDevices.getUserMedia({audio:true, video:true})
        .then(stream => yourVideo.srcObject = stream)
        .then(stream => pc.addStream(stream));
}

function showFriendsFace() {
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer) )
        .then(() => sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}
