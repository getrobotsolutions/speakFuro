var waveform = window.Waveform();
var message = document.getElementById('message');
var config, conversation;
message.textContent = 'Tap to ask Question!';
var flag = false;


    document.getElementById('audio-control').onclick = function () {
        if (flag === false) {
            flag = true;
            console.log("Flag: " + flag);

            //$('#audio-control').children().off('click');

            var id1 = "U2FsdGVkX1+xA9zzR4BBZ0Aw4P9LE4FOYwX3r4G/cdDcbb3LnuY2pjJZtvgOmUUb6KkwwYohRDHcwWfzUJ2COXwSZr5Eb+8JsMalfUGmTsY9Jygrp4aEkyFq7BxSqyXz";
            var id2 = "U2FsdGVkX1+f+FHPNvzND7pHmbG2IhMmlGl8cfgPhsmqUApX/47nK8A/v4Yt8YBi1JpLm0+reZbWstgxjiadM446fys2dLjPKRhTQTY9h43fWdLTQEVZ+o4ek28ggtKUieo0idNiGyqw3ENFbyDMig==";
            var key = "iloverobots@ARS";
            var decryptedBytes = CryptoJS.AES.decrypt(id1, key);
            decryptedBytes = CryptoJS.AES.decrypt(decryptedBytes.toString(CryptoJS.enc.Utf8), key);
            id1 = decryptedBytes.toString(CryptoJS.enc.Utf8);

            decryptedBytes = CryptoJS.AES.decrypt(id2, key);
            decryptedBytes = CryptoJS.AES.decrypt(decryptedBytes.toString(CryptoJS.enc.Utf8), key);
            id2 = decryptedBytes.toString(CryptoJS.enc.Utf8);


            //AWS.config.credentials = new AWS.Credentials(document.getElementById('ACCESS_ID').value, document.getElementById('SECRET_KEY').value, null);
            AWS.config.credentials = new AWS.Credentials(id1, id2, null);
            AWS.config.region = 'us-east-1';

            config = {
                lexConfig: {botName: 'ottawa_topQ'}
                //lexConfig: { botName: document.getElementById('BOT').value }
            };

            conversation = new LexAudio.conversation(config, function (state) {
                message.textContent = state + '...';
                if (state === 'Listening') {
                    waveform.prepCanvas();


                }
                if (state === 'Sending') {
                    waveform.clearCanvas();
                }
            }, function (data) {
                flag = false;
                console.log('Transcript: ', data.inputTranscript, ", Response: ", data.message);
                dataKey = data.message;
                console.log("sending Key:" + dataKey);

                $.ajax({
                    type: "GET",
                    type: "GET",
                    data: {key: dataKey},
                    url: "/api/sendresponse"
                });

                key = data.message;

                if (key === "Please go to the Treasurer's Office. Here's a map that shows how to get there.") {
                    ShowPopupMap(1);
                }
                else if (key === "Please go to the Sheriff's Office. It's to your left.") {
                    ShowPopupMap(2);
                }
                else if (key === "Please go to the Clerks's Office. Here's a map that shows how to get there.") {
                    ShowPopupMap(3);
                }
                else if (key === "Please go to Fiscal Services. Here's a map that shows you how to get there.") {
                    ShowPopupMap(4);
                }
                else if (key === "Please go to Human Resources. It's to your right. Here's a map that shows you how to get there.") {
                    ShowPopupMap(5);
                }
                else if (key === "I'm sorry, I don't know that answer yet. Please scroll through this screen for your answer.") {
                    window.location = "http://localhost:3000/Contents/Info/index.html";
                }





            }, function (error) {
                //flag = false;
                message.textContent = error;
            }, function (timeDomain, bufferLength) {
                waveform.visualizeAudioBuffer(timeDomain, bufferLength);
            });
            conversation.advanceConversation();
        }
};
