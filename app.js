// --- CONFIGURATION FIREBASE (À REMPLACER) ---
const firebaseConfig = {
    apiKey: "AIzaSyCd-hCs4F9bgIkGXHg6I4qcPJb_0QE496c",
    authDomain: "mfgnu-presse-b8256.firebaseapp.com",
    projectId: "mfgnu-presse-b8256",
    storageBucket: "mfgnu-presse-b8256.firebasestorage.app",
    messagingSenderId: "1038101862363",
    appId: "1:1038101862363:web:497eaeda7871f069db79fe"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// --- ÉLÉMENTS DOM ---
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const errorMessage = document.getElementById('error-message');

const postitForm = document.getElementById('postit-form');
const postitTitle = document.getElementById('postit-title');
const postitContent = document.getElementById('postit-content');
const btnAddPostit = document.getElementById('btn-add-postit');
const postitContainer = document.getElementById('postit-container');

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const btnSend = document.getElementById('btn-send');

const adminPanel = document.getElementById('admin-panel');
const newMemberEmail = document.getElementById('new-member-email');
const newMemberRole = document.getElementById('new-member-role');
const btnAddMember = document.getElementById('btn-add-member');

// --- AUTHENTICATION & WHISTELIST ---
btnLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => errorMessage.innerText = e.message);
});

auth.onAuthStateChanged((user) => {
    if (user) {
        checkWhitelist(user.email);
    } else {
        loginScreen.style.display = 'block';
        appScreen.style.display = 'none';
    }
});

async function checkWhitelist(email) {
    const userDoc = await db.collection('utilisateurs').doc(email).get();
    if (userDoc.exists) {
        showApp(userDoc.data().role);
    } else {
        auth.signOut();
        errorMessage.innerText = "Accès refusé : Votre email n'est pas autorisé.";
    }
}

btnLogout.addEventListener('click', () => auth.signOut());

// --- AFFICHAGE DE L'APP ---
function showApp(role) {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    
    loadPostIts();
    loadChat();

    if (role === 'admin') {
        postitForm.style.display = 'block';
        adminPanel.style.display = 'block';
    }
}

// --- FONCTIONNALITÉS ---

// 1. Post-its
btnAddPostit.addEventListener('click', () => {
    db.collection('postits').add({
        title: postitTitle.value,
        content: postitContent.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    postitTitle.value = ''; postitContent.value = '';
});

function loadPostIts() {
    db.collection('postits').orderBy('createdAt', 'desc').onSnapshot(snap => {
        postitContainer.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            postitContainer.innerHTML += `<div class="postit-item"><h3>${d.title}</h3><p>${d.content}</p></div>`;
        });
    });
}

// 2. Chat
btnSend.addEventListener('click', () => {
    if (chatInput.value) {
        db.collection('chat').add({
            text: chatInput.value,
            user: auth.currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        chatInput.value = '';
    }
});

function loadChat() {
    db.collection('chat').orderBy('createdAt', 'asc').onSnapshot(snap => {
        chatMessages.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            chatMessages.innerHTML += `<p><strong>${d.user}:</strong> ${d.text}</p>`;
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// 3. Admin: Gestion des membres
btnAddMember.addEventListener('click', () => {
    const email = newMemberEmail.value;
    const role = newMemberRole.value;
    if (email) {
        db.collection('utilisateurs').doc(email).set({ role: role });
        newMemberEmail.value = '';
        alert("Membre ajouté/modifié !");
    }
});
