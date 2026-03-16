// 1. ضع إعدادات Firebase الخاصة بك هنا
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messaging = firebase.messaging();

// 2. المفتاح العام للإشعارات
const VAPID_KEY = "YOUR_VAPID_KEY_HERE";

let currentToken = "";

// طلب صلاحية الإشعارات والحصول على التوكن
document.getElementById('enable-notifications').addEventListener('click', async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            currentToken = await messaging.getToken({ vapidKey: VAPID_KEY });
            console.log("FCM Token:", currentToken);
            
            // حفظ التوكن في قاعدة البيانات لكي يعرف السيرفر لمن يرسل
            db.ref('tokens/' + currentToken).set(true);
            alert("تم تفعيل الإشعارات بنجاح!");
        } else {
            alert("لم يتم إعطاء صلاحية الإشعارات.");
        }
    } catch (error) {
        console.error("خطأ في تفعيل الإشعارات:", error);
    }
});

// 3. الاستماع للرسائل الجديدة وعرضها لحظياً
const chatBox = document.getElementById('chat-box');
db.ref('messages').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const msgElement = document.createElement('div');
    msgElement.className = 'message';
    msgElement.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // التمرير للأسفل تلقائياً
});

// 4. إرسال رسالة جديدة
document.getElementById('send-btn').addEventListener('click', () => {
    const text = document.getElementById('msg-input').value;
    const sender = document.getElementById('sender-name').value || "مجهول";
    
    if (text.trim() !== "") {
        db.ref('messages').push({
            sender: sender,
            text: text,
            senderToken: currentToken, // نرسل التوكن لتجنب إرسال إشعار لنفس الشخص
            timestamp: firebase.database.ServerValue.TIMESTAMP // مهم جداً للسيرفر
        });
        document.getElementById('msg-input').value = "";
    }
});
