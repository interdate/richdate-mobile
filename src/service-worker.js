/**
 * Check out https://googlechrome.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js?test=12');
importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.5.6/firebase-messaging.js");

if (firebase.messaging.isSupported()) {

    firebase.initializeApp({
        'messagingSenderId': '854262669808'
    });

    var messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function (payload) {
        console.log('Received background message ', payload);
        alert(JSON.stringify(payload));
        // here you can override some options describing what's in the message;
        // however, the actual content will come from the Webtask
        var notificationTitle = 'Background Message Title';
        var notificationOptions = {
            body: 'Background Message body.',
            icon: 'assets/img/icon.png'
        };
        return self.registration.showNotification(notificationTitle, notificationOptions);
    });
}


self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js?test=12',
    './build/vendor.js?test=12',
    './build/main.css?test=12',
    './build/polyfills.js?test=12',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.networkFirst);
//self.toolbox.router.any('/*', self.toolbox.cacheFirst);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
