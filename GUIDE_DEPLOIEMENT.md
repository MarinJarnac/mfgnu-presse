# 📖 Guide de Déploiement Complet - MFGNU Press Hub

## 🎯 Objectif
Ce guide vous accompagne pas à pas pour mettre en ligne votre webapp sur GitHub Pages et la configurer avec l'authentification Google.

---

## 📋 Table des matières
1. [Préparation](#1-préparation)
2. [Mise en ligne sur GitHub Pages](#2-mise-en-ligne-sur-github-pages)
3. [Configuration Firebase](#3-configuration-firebase)
4. [Configuration Google Drive](#4-configuration-google-drive)
5. [Configuration de la whitelist](#5-configuration-de-la-whitelist)
6. [Tests et vérification](#6-tests-et-vérification)
7. [Maintenance](#7-maintenance)

---

## 1. 📦 Préparation

### Ce dont vous avez besoin :
- ✅ Un compte GitHub (gratuit)
- ✅ Un compte Google (pour Firebase)
- ✅ Le fichier `press-hub.html`
- ✅ 30 minutes de votre temps

### Créer un compte GitHub (si nécessaire)
1. Allez sur https://github.com
2. Cliquez sur "Sign up"
3. Suivez les instructions
4. Vérifiez votre email

---

## 2. 🚀 Mise en ligne sur GitHub Pages

### Étape 2.1 : Créer un repository

1. **Connectez-vous à GitHub**
2. **Cliquez sur le bouton vert "New"** (en haut à gauche)
3. **Remplissez les informations** :
   ```
   Repository name : mfgnu-press-hub
   Description : Application de gestion pour MFGNU Press
   Public ☑️
   Add a README file ☑️
   ```
4. **Cliquez sur "Create repository"**

### Étape 2.2 : Ajouter votre fichier

**Option A : Via l'interface web (recommandé pour débutants)**

1. Dans votre repository, cliquez sur **"Add file" > "Upload files"**
2. Glissez-déposez `press-hub.html`
3. **Renommez le fichier en `index.html`** (très important !)
4. Ajoutez un message de commit : `"Ajout de l'application Press Hub"`
5. Cliquez sur **"Commit changes"**

**Option B : Via Git (pour utilisateurs avancés)**

```bash
# Clonez votre repository
git clone https://github.com/VOTRE-USERNAME/mfgnu-press-hub.git
cd mfgnu-press-hub

# Copiez le fichier et renommez-le
cp /chemin/vers/press-hub.html ./index.html

# Ajoutez et committez
git add index.html
git commit -m "Ajout de l'application Press Hub"
git push origin main
```

### Étape 2.3 : Activer GitHub Pages

1. Dans votre repository, cliquez sur **"Settings"** (⚙️ en haut)
2. Dans le menu de gauche, cliquez sur **"Pages"**
3. Dans **"Source"**, sélectionnez :
   - Branch : `main`
   - Folder : `/ (root)`
4. Cliquez sur **"Save"**
5. **Attendez 2-3 minutes** ⏱️

### Étape 2.4 : Vérifier le déploiement

1. Rafraîchissez la page Settings > Pages
2. Vous devriez voir un message vert :
   ```
   ✅ Your site is live at https://VOTRE-USERNAME.github.io/mfgnu-press-hub/
   ```
3. **Cliquez sur le lien** pour voir votre application !

---

## 3. 🔥 Configuration Firebase

Firebase permet d'avoir une vraie authentification Google et de sauvegarder les données.

### Étape 3.1 : Créer un projet Firebase

1. **Allez sur** https://console.firebase.google.com/
2. **Cliquez sur "Ajouter un projet"**
3. **Nom du projet** : `MFGNU Press Hub`
4. **Google Analytics** : Désactivez (pas nécessaire)
5. **Cliquez sur "Créer un projet"**
6. **Attendez la création** (30 secondes)

### Étape 3.2 : Activer l'authentification Google

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur **"Commencer"**
3. Cliquez sur **"Google"** dans la liste des fournisseurs
4. **Activez** le bouton en haut
5. Remplissez :
   - Nom du projet : `MFGNU Press Hub`
   - Adresse e-mail d'assistance : votre email
6. **Cliquez sur "Enregistrer"**

### Étape 3.3 : Créer une application web

1. Dans la vue d'ensemble, cliquez sur l'icône **"</>''** (Web)
2. **Nom de l'application** : `Press Hub Web`
3. **Cochez** "Configurer aussi Firebase Hosting"
4. **Cliquez sur "Enregistrer l'application"**

### Étape 3.4 : Récupérer la configuration

Vous verrez un code comme celui-ci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mfgnu-press-hub.firebaseapp.com",
  projectId: "mfgnu-press-hub",
  storageBucket: "mfgnu-press-hub.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**⚠️ COPIEZ CES VALEURS** quelque part, vous en aurez besoin !

### Étape 3.5 : Créer Firestore Database

1. Dans le menu de gauche, cliquez sur **"Firestore Database"**
2. **Cliquez sur "Créer une base de données"**
3. Sélectionnez **"Démarrer en mode production"**
4. Choisissez une **région** (europe-west1 pour l'Europe)
5. **Cliquez sur "Activer"**

### Étape 3.6 : Configurer les règles de sécurité

1. Dans Firestore Database, cliquez sur l'onglet **"Règles"**
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tout le monde peut lire si authentifié
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Les utilisateurs peuvent créer/modifier leurs données
    match /users/{userId} {
      allow write: if request.auth.uid == userId;
    }
    
    // Les post-its
    match /postits/{postitId} {
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.authorId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Les événements
    match /events/{eventId} {
      allow create, update, delete: if request.auth != null;
    }
    
    // Les messages
    match /messages/{messageId} {
      allow create: if request.auth != null;
    }
  }
}
```

3. **Cliquez sur "Publier"**

### Étape 3.7 : Intégrer Firebase dans votre code

1. **Ouvrez votre fichier `index.html`** sur GitHub
2. Cliquez sur l'**icône crayon** ✏️ pour éditer
3. **Trouvez la ligne 26** (juste avant `</head>`)
4. **Ajoutez ce code** :

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<script>
// Votre configuration Firebase (remplacez par vos valeurs !)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
</script>
```

5. **Remplacez les valeurs** par celles que vous avez copiées à l'étape 3.4
6. **Scrollez vers le bas** et cliquez sur **"Commit changes"**

### Étape 3.8 : Remplacer la fonction de connexion simulée

1. Dans le fichier, **trouvez la ligne ~850** (fonction `handleGoogleLogin`)
2. **Remplacez** le code existant par :

```javascript
const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        // Vérifier si l'email est dans la whitelist
        const whitelistDoc = await db.collection('config').doc('whitelist').get();
        const allowedEmails = whitelistDoc.exists ? whitelistDoc.data().emails : [];
        
        if (allowedEmails.includes(user.email)) {
            // Récupérer les infos utilisateur
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {
                email: user.email,
                name: user.displayName,
                role: 'member',
                avatar: user.displayName[0].toUpperCase()
            };
            
            // Sauvegarder/mettre à jour l'utilisateur
            await db.collection('users').doc(user.uid).set(userData, { merge: true });
            
            setCurrentUser({ id: user.uid, ...userData });
            setIsLoggedIn(true);
        } else {
            alert('Votre compte n\'est pas autorisé à accéder à cette application. Contactez un administrateur.');
            await firebase.auth().signOut();
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
    }
};
```

3. **Committez les changements**

---

## 4. 📁 Configuration Google Drive

### Étape 4.1 : Créer un dossier partagé

1. **Allez sur** https://drive.google.com
2. **Cliquez sur "Nouveau"** > "Nouveau dossier"
3. **Nommez-le** : `MFGNU Press - Documents`
4. **Clic droit sur le dossier** > "Partager"
5. Dans **"Accès général"**, sélectionnez :
   - ⚪ **Tous les utilisateurs disposant du lien**
   - 📝 **Éditeur** (ou Lecteur si vous préférez)
6. **Cliquez sur "Copier le lien"**
7. Le lien ressemble à : `https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J`

### Étape 4.2 : Intégrer le lien

1. Dans votre `index.html` sur GitHub, **éditez le fichier**
2. **Trouvez la ligne ~1450** (fonction `openDrive`)
3. **Remplacez** l'URL par votre lien :

```javascript
const openDrive = () => {
    window.open('https://drive.google.com/drive/folders/VOTRE_ID_DOSSIER', '_blank');
};
```

4. **Committez les changements**

---

## 5. 🔐 Configuration de la whitelist

Pour sécuriser l'accès, vous devez définir qui peut se connecter.

### Étape 5.1 : Initialiser la whitelist dans Firestore

1. **Retournez sur Firebase Console**
2. Cliquez sur **"Firestore Database"**
3. Cliquez sur **"Démarrer une collection"**
4. **ID de collection** : `config`
5. **Cliquez sur "Suivant"**
6. **ID du document** : `whitelist`
7. **Ajoutez un champ** :
   - Nom du champ : `emails`
   - Type : `array`
   - Valeur : Cliquez sur "Ajouter un élément" et ajoutez vos emails autorisés, par exemple :
     - `admin@mfgnu.com`
     - `editor@mfgnu.com`
     - `member@mfgnu.com`
8. **Cliquez sur "Enregistrer"**

### Étape 5.2 : Ajouter des emails via l'interface admin

Une fois connecté avec un compte admin :
1. Allez dans **"Administration"**
2. Section **"Whitelist des e-mails autorisés"**
3. Ajoutez les emails de vos membres

---

## 6. ✅ Tests et vérification

### Test 1 : Vérifier le chargement
1. Ouvrez votre site : `https://VOTRE-USERNAME.github.io/mfgnu-press-hub/`
2. Vérifiez que la page de connexion s'affiche correctement

### Test 2 : Tester l'authentification
1. Cliquez sur **"Se connecter avec Google"**
2. Sélectionnez un compte Google autorisé
3. Vérifiez que vous êtes bien redirigé vers le tableau de bord

### Test 3 : Tester les fonctionnalités
- ✅ Créer un post-it
- ✅ Ajouter un événement au calendrier
- ✅ Envoyer un message dans le chat
- ✅ Accéder au Google Drive
- ✅ Modifier les paramètres

### Test 4 : Tester la whitelist
1. Essayez de vous connecter avec un email **non autorisé**
2. Vérifiez que l'accès est refusé

---

## 7. 🔧 Maintenance

### Ajouter un nouvel utilisateur

**Via Firebase Console :**
1. Firestore Database > config > whitelist
2. Cliquez sur le champ `emails`
3. Cliquez sur "Ajouter un élément"
4. Entrez le nouvel email
5. Enregistrez

**Via l'interface admin :**
1. Connectez-vous en tant qu'admin
2. Administration > Whitelist
3. Ajoutez l'email
4. (Note : nécessite une implémentation supplémentaire pour sauvegarder dans Firestore)

### Modifier le rôle d'un utilisateur

1. Firestore Database > users > [ID_UTILISATEUR]
2. Modifiez le champ `role` :
   - `admin` : Accès complet
   - `editor` : Peut créer post-its et événements
   - `member` : Lecture seule + chat

### Sauvegarder votre configuration

**Important :** Notez quelque part (en sécurité) :
- ✅ L'URL de votre site
- ✅ Votre configuration Firebase
- ✅ Le lien de votre Google Drive
- ✅ La liste des emails autorisés

---

## 🆘 Dépannage

### Problème : "Site not found"
**Solution :** Attendez 5-10 minutes après l'activation de GitHub Pages. Videz le cache de votre navigateur (Ctrl+F5).

### Problème : Erreur Firebase "apiKey invalid"
**Solution :** Vérifiez que vous avez bien copié TOUTE la configuration Firebase, y compris les guillemets.

### Problème : "Authentification failed"
**Solution :** 
1. Vérifiez que l'email est dans la whitelist
2. Dans Firebase Console, Authentication > Settings > Authorized domains
3. Ajoutez votre domaine GitHub Pages : `VOTRE-USERNAME.github.io`

### Problème : Google Drive ne s'ouvre pas
**Solution :** Vérifiez que le lien est bien au format `https://drive.google.com/drive/folders/ID_DOSSIER`

### Problème : Données non sauvegardées
**Solution :** Vérifiez les règles Firestore. Ouvrez la console (F12) pour voir les erreurs.

---

## 📞 Support

Pour toute question :
- 📧 Email : contact@mfgnu.com
- 🌐 Site : https://mfgnu.com
- 📚 Documentation Firebase : https://firebase.google.com/docs
- 📚 Documentation GitHub Pages : https://pages.github.com

---

## 🎉 Félicitations !

Votre webapp est maintenant en ligne et fonctionnelle ! Vous pouvez :
- ✅ Partager l'URL avec votre équipe
- ✅ Ajouter des utilisateurs à la whitelist
- ✅ Personnaliser les couleurs et le style
- ✅ Ajouter de nouvelles fonctionnalités

**Bon travail et bonne gestion de presse ! 🗞️**
