let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const replyTo = document.getElementById("replyTo");

function renderMessages() {
  chatBox.innerHTML = "";
  messages.forEach((msg, i) => {
    const div = document.createElement("div");
    div.className = "message " + (msg.sender === "أنا" ? "sent" : "received");
    div.innerHTML = `
      <strong>${msg.sender}:</strong> ${msg.replyTo ? `<blockquote>${msg.replyTo}</blockquote>` : ""}
      ${msg.text}
      <div class="meta">${msg.time}</div>
    `;
    div.addEventListener("click", () => {
      replyTo.hidden = false;
      replyTo.value = msg.text;
      replyTo.dataset.index = i;
    });
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("chatForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const msg = {
    sender: "أنا",
    text,
    time: new Date().toLocaleTimeString(),
    replyTo: replyTo.value || null
  };

  messages.push(msg);
  localStorage.setItem("chatMessages", JSON.stringify(messages));

  chatInput.value = "";
  replyTo.value = "";
  replyTo.hidden = true;

  renderMessages();
});

renderMessages();

// استبدل هذه البيانات بمعلومات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIza...xxx",
  authDomain: "school-chat.firebaseapp.com",
  databaseURL: "https://school-chat-default-rtdb.firebaseio.com",
  projectId: "school-chat",
  storageBucket: "school-chat.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messagesRef = db.ref("messages");

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const usernameInput = document.getElementById("username");

// إرسال رسالة
document.getElementById("chatForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const text = chatInput.value.trim();
  const user = usernameInput.value.trim() || "مجهول";
  if (!text) return;

  const msg = {
    sender: user,
    text,
    time: new Date().toLocaleTimeString()
  };

  messagesRef.push(msg);
  chatInput.value = "";
});

// عرض الرسائل مباشرة
messagesRef.on("child_added", snapshot => {
  const msg = snapshot.val();
  const div = document.createElement("div");

  const isMe = msg.sender === usernameInput.value.trim();
  div.className = "message " + (isMe ? "sent" : "received");
  div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}
                   <div class="meta">${msg.time}</div>`;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

