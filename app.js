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

// 2. Éléments HTML
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const errorMessage = document.getElementById('error-message');

// 3. LOGIQUE DE CONNEXION ET WHISTELIST
btnLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Vérifier si l'email est dans la collection 'utilisateurs'
            checkWhitelist(user.email);
        })
        .catch((error) => {
            console.error(error);
            errorMessage.innerText = "Erreur de connexion.";
        });
});

async function checkWhitelist(email) {
    const userDoc = await db.collection('utilisateurs').doc(email).get();
    
    if (userDoc.exists) {
        // Utilisateur autorisé !
        showApp();
    } else {
        // Utilisateur non autorisé, déconnexion forcée
        auth.signOut();
        errorMessage.innerText = "Accès refusé : Votre email n'est pas autorisé.";
    }
}

// 4. GESTION DE L'AFFICHAGE
function showApp() {
    loginScreen.style.display = 'none';
    appScreen.style.display = 'block';
    // Charger ici les données (post-its, chat, etc.)
}

btnLogout.addEventListener('click', () => {
    auth.signOut().then(() => {
        location.reload();
    });
});

// 5. OBSERVER L'ÉTAT DE CONNEXION (pour rester connecté)
auth.onAuthStateChanged((user) => {
    if (user) {
        checkWhitelist(user.email);
    }
});
