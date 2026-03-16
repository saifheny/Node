// إعداداتك الخاصة بـ Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAjE-2q6PONBkCin9ZN22gDp9Q8pAH9ZW8",
    authDomain: "story-97cf7.firebaseapp.com",
    databaseURL: "https://story-97cf7-default-rtdb.firebaseio.com",
    projectId: "story-97cf7",
    storageBucket: "story-97cf7.firebasestorage.app",
    messagingSenderId: "742801388214",
    appId: "1:742801388214:web:32a305a8057b0582c5ec17",
    measurementId: "G-9DPPWX7CF0"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messaging = firebase.messaging();

// مفتاح الـ VAPID الخاص بك
const VAPID_KEY = "BFKrRIt1JQLuYy78HJOQZrOSXYZdmKqd54PFVmysxkhEPoY_XW4qkTYEjFOFeDJ8Ffo7rHWn4isp2aV-VQFqPcc";

let currentToken = "";

// طلب صلاحية الإشعارات
document.getElementById('enable-notifications').addEventListener('click', async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            currentToken = await messaging.getToken({ vapidKey: VAPID_KEY });
            console.log("FCM Token:", currentToken);
            
            // حفظ التوكن في مسار tokens لكي يستخدمه السيرفر
            db.ref('tokens/' + currentToken).set(true);
            alert("تم تفعيل الإشعارات بنجاح!");
        } else {
            alert("لم يتم إعطاء صلاحية الإشعارات.");
        }
    } catch (error) {
        console.error("خطأ في تفعيل الإشعارات:", error);
    }
});

// الاستماع للرسائل وعرضها
const chatBox = document.getElementById('chat-box');
db.ref('messages').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const msgElement = document.createElement('div');
    msgElement.className = 'message';
    msgElement.innerHTML = `<strong>${data.sender}:</strong> ${data.text}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// إرسال رسالة
document.getElementById('send-btn').addEventListener('click', () => {
    const text = document.getElementById('msg-input').value;
    const sender = document.getElementById('sender-name').value || "مجهول";
    
    if (text.trim() !== "") {
        db.ref('messages').push({
            sender: sender,
            text: text,
            senderToken: currentToken, // لتجنب إرسال إشعار لك عن رسالتك
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        document.getElementById('msg-input').value = "";
    }
});
