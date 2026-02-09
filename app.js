// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyCd-hCs4F9bgIkGXHg6I4qcPJb_0QE496c",
    authDomain: "mfgnu-presse-b8256.firebaseapp.com",
    projectId: "mfgnu-presse-b8256",
    storageBucket: "mfgnu-presse-b8256.firebasestorage.app",
    messagingSenderId: "1038101862363",
    appId: "1:1038101862363:web:497eaeda7871f069db79fe"
};
// Initialiser Firebase
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

const newMemberEmail = document.getElementById('new-member-email');
const newMemberRole = document.getElementById('new-member-role');
const btnAddMember = document.getElementById('btn-add-member');

// --- GESTION DE LA NAVIGATION SPA ---
function showPage(pageName) {
    // Cacher toutes les pages
    document.querySelectorAll('.page-content > div').forEach(div => div.style.display = 'none');
    // Afficher la page demandée
    const page = document.getElementById('page-' + pageName);
    if (page) {
        page.style.display = 'block';
        // Mettre à jour le titre dans le header
        document.getElementById('page-title').innerText = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }
}

// --- AUTHENTICATION & WHISTELIST ---
btnLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => {
        console.error(e);
        errorMessage.innerText = "Erreur de connexion : " + e.message;
    });
});

// Observer l'état de la connexion
auth.onAuthStateChanged((user) => {
    if (user) {
        checkWhitelist(user.email);
    } else {
        loginScreen.style.display = 'block';
        appScreen.style.display = 'none';
    }
});

async function checkWhitelist(email) {
    try {
        const userDoc = await db.collection('utilisateurs').doc(email).get();
        if (userDoc.exists) {
            showApp(userDoc.data().role);
        } else {
            auth.signOut();
            errorMessage.innerText = "Accès refusé : Votre email n'est pas autorisé.";
        }
    } catch (e) {
        console.error(e);
        errorMessage.innerText = "Erreur lors de la vérification des droits.";
    }
}

btnLogout.addEventListener('click', () => auth.signOut());

// --- AFFICHAGE DE L'APP ---
function showApp(role) {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'flex'; // Layout flex pour le menu latéral
    
    // Afficher l'email de l'utilisateur
    document.getElementById('user-email').innerText = auth.currentUser.email;

    // Charger les données
    loadPostIts();
    loadChat();

    // Rendre visible les éléments d'admin si nécessaire
    if (role === 'admin') {
        postitForm.style.display = 'block';
        document.getElementById('menu-admin').style.display = 'block';
    }

    // Afficher la page d'accueil par défaut
    showPage('accueil');
}

// --- FONCTIONNALITÉS ---

// 1. Post-its (Affichage + Ajout + Suppression Admin)
btnAddPostit.addEventListener('click', () => {
    const title = postitTitle.value;
    const content = postitContent.value;

    if (title && content) {
        db.collection('postits').add({
            title: title,
            content: content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        postitTitle.value = '';
        postitContent.value = '';
    }
});

function loadPostIts() {
    db.collection('postits').orderBy('createdAt', 'desc').onSnapshot(snap => {
        postitContainer.innerHTML = '';
        const isAdmin = document.getElementById('menu-admin').style.display === 'block';
        
        snap.forEach(doc => {
            const d = doc.data();
            let postitHTML = `
                <div class="postit-item">
                    <h3>${d.title}</h3>
                    <p>${d.content}</p>
            `;
            // Bouton supprimer visible uniquement pour les admins
            if (isAdmin) {
                postitHTML += `<button class="btn-delete" onclick="deletePostIt('${doc.id}')">×</button>`;
            }
            postitHTML += `</div>`;
            postitContainer.innerHTML += postitHTML;
        });
    });
}

// Fonction globale pour être appelée par onclick dans le HTML généré
window.deletePostIt = function(id) {
    if (confirm("Supprimer ce post-it définitivement ?")) {
        db.collection('postits').doc(id).delete();
    }
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

// 3. Mon Compte (Mise à jour email)
document.getElementById('btn-update-email').addEventListener('click', () => {
    const newEmail = document.getElementById('edit-email').value;
    if (newEmail) {
        auth.currentUser.updateEmail(newEmail).then(() => {
            alert("Email mis à jour ! Vous devrez vous reconnecter.");
            auth.signOut();
        }).catch(e => alert(e.message));
    }
});

// 4. Admin: Gestion des membres
btnAddMember.addEventListener('click', () => {
    const email = newMemberEmail.value;
    const role = newMemberRole.value;
    if (email) {
        db.collection('utilisateurs').doc(email).set({ role: role });
        newMemberEmail.value = '';
        alert("Membre " + email + " sauvegardé en tant que " + role + " !");
    }
});
