// جلب مكتبات Firebase الخاصة بعامل الخدمة
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// يجب وضع نفس الـ Config هنا أيضاً لكي يعمل في الخلفية
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// استقبال الإشعار عندما يكون الموقع مغلقاً (Background)
messaging.onBackgroundMessage((payload) => {
    console.log("تم استقبال رسالة في الخلفية: ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png' // يمكنك وضع مسار أي أيقونة لديك
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
