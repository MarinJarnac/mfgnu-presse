# 🔥 Configuration Firebase pour MFGNU-PRESSE

## 📋 Étapes de configuration

### 1. Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `mfgnu-presse` (ou le nom de votre choix)
4. Désactivez Google Analytics (facultatif)
5. Cliquez sur "Créer un projet"

### 2. Activer l'authentification Google

1. Dans le menu latéral, cliquez sur **"Authentication"**
2. Cliquez sur **"Get started"** (Commencer)
3. Dans l'onglet **"Sign-in method"** (Méthode de connexion)
4. Cliquez sur **"Google"**
5. Activez le bouton en haut à droite
6. Remplissez :
   - Nom public du projet : `MFGNU-PRESSE`
   - Adresse e-mail d'assistance : votre email
7. Cliquez sur **"Enregistrer"**

### 3. Créer une application Web

1. Dans la page d'accueil de Firebase Console
2. Cliquez sur l'icône **"</>''** (Web) pour ajouter une application web
3. Nom de l'application : `MFGNU-PRESSE Web`
4. **NE COCHEZ PAS** "Firebase Hosting" pour l'instant
5. Cliquez sur **"Enregistrer l'application"**

### 4. Récupérer la configuration

Vous verrez apparaître un code JavaScript ressemblant à ceci :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mfgnu-presse.firebaseapp.com",
  projectId: "mfgnu-presse",
  storageBucket: "mfgnu-presse.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**⚠️ IMPORTANT : Copiez ces valeurs !**

### 5. Mettre à jour index.html

1. Ouvrez le fichier `index.html`
2. Cherchez la section `CONFIGURATION FIREBASE` (ligne ~25)
3. Remplacez les valeurs `VOTRE_XXX` par vos vraies valeurs :

```javascript
const firebaseConfig = {
    apiKey: "VOTRE_VRAIE_API_KEY",              // ← Collez ici
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",  // ← Collez ici
    projectId: "VOTRE_PROJECT_ID",             // ← Collez ici
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",   // ← Collez ici
    messagingSenderId: "VOTRE_SENDER_ID",      // ← Collez ici
    appId: "VOTRE_APP_ID"                      // ← Collez ici
};
```

### 6. Créer Firestore Database

1. Dans le menu latéral Firebase, cliquez sur **"Firestore Database"**
2. Cliquez sur **"Créer une base de données"**
3. Sélectionnez **"Démarrer en mode production"**
4. Choisissez une région proche de vous (ex: `europe-west1` pour l'Europe)
5. Cliquez sur **"Activer"**

### 7. Configurer les règles de sécurité Firestore

1. Dans Firestore Database, cliquez sur l'onglet **"Règles"**
2. Remplacez TOUT le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Configuration (whitelist)
    match /config/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     (request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Post-its
    match /postits/{postitId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor']);
      allow update, delete: if request.auth != null && 
                               (resource.data.authorId == request.auth.uid || 
                                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                      (resource.data.senderId == request.auth.uid || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Événements
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor'];
    }
  }
}
```

3. Cliquez sur **"Publier"**

### 8. Initialiser la whitelist

1. Dans Firestore Database, cliquez sur **"Démarrer une collection"**
2. ID de collection : `config`
3. Cliquez sur **"Suivant"**
4. ID du premier document : `whitelist`
5. Ajoutez un champ :
   - Nom du champ : `emails`
   - Type : **array**
   - Valeurs : Cliquez sur "Ajouter un élément" et ajoutez vos emails autorisés
     - Exemple : `admin@mfgnu.com`
     - Exemple : `redacteur@mfgnu.com`
     - Exemple : `votre-email@gmail.com`
6. Cliquez sur **"Enregistrer"**

### 9. Ajouter votre domaine autorisé

Si vous utilisez GitHub Pages :

1. Dans Firebase Console, allez dans **Authentication**
2. Cliquez sur l'onglet **"Settings"** (Paramètres)
3. Scrollez jusqu'à **"Authorized domains"** (Domaines autorisés)
4. Cliquez sur **"Add domain"** (Ajouter un domaine)
5. Ajoutez : `VOTRE-USERNAME.github.io`
6. Cliquez sur **"Add"**

### 10. Tester la configuration

1. Ouvrez `index.html` dans votre navigateur
2. Ouvrez la console (F12)
3. Vous devriez voir : `✅ Firebase initialisé avec succès`
4. Cliquez sur "Se connecter avec Google"
5. Choisissez un compte Google **qui est dans la whitelist**
6. Vous devriez être connecté !

## 📊 Structure de données Firestore

Votre base de données Firestore aura cette structure :

```
firestore/
├── config/
│   └── whitelist
│       └── emails: ['email1@example.com', 'email2@example.com']
│
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── role: 'admin' | 'editor' | 'member'
│       ├── avatar: string
│       └── createdAt: timestamp
│
├── postits/
│   └── {postitId}
│       ├── title: string
│       ├── content: string
│       ├── color: 'yellow' | 'green' | 'red' | 'blue'
│       ├── author: string
│       ├── authorId: string
│       ├── date: string (YYYY-MM-DD)
│       └── createdAt: timestamp
│
├── messages/
│   └── {messageId}
│       ├── sender: string
│       ├── senderId: string
│       ├── text: string
│       ├── time: string
│       ├── avatar: string
│       └── timestamp: timestamp
│
└── events/
    └── {eventId}
        ├── title: string
        ├── date: string (YYYY-MM-DD)
        ├── time: string (HH:MM)
        ├── description: string
        └── createdAt: timestamp
```

## 🔐 Gestion des rôles

### Admin
- Peut tout faire
- Peut modifier la whitelist
- Peut créer/modifier/supprimer tous les post-its
- Peut créer/modifier/supprimer tous les événements
- Peut modifier les rôles des utilisateurs

### Éditeur (Editor)
- Peut créer des post-its
- Peut modifier/supprimer ses propres post-its
- Peut créer/modifier des événements
- Peut envoyer des messages

### Membre (Member)
- Peut voir tous les contenus
- Peut envoyer des messages
- Accès en lecture seule pour post-its et événements

## 🎯 Promouvoir un utilisateur en Admin

### Méthode 1 : Via Firestore Console

1. Allez dans **Firestore Database**
2. Collection **users** > Document de l'utilisateur
3. Modifiez le champ `role` : changez `member` en `admin`
4. Cliquez sur **"Update"**

### Méthode 2 : Via code (pour le premier admin)

Ajoutez temporairement ce code dans la console du navigateur après connexion :

```javascript
db.collection('users').doc(firebase.auth().currentUser.uid).update({
    role: 'admin'
}).then(() => {
    console.log('✅ Vous êtes maintenant admin !');
    window.location.reload();
});
```

## ❓ Dépannage

### Erreur "Firebase not initialized"
- Vérifiez que vous avez bien remplacé les valeurs dans `firebaseConfig`
- Vérifiez que les scripts Firebase sont chargés (F12 > Network)

### Erreur "Permission denied"
- Vérifiez vos règles Firestore
- Vérifiez que l'utilisateur est bien dans la collection `users`

### "Accès refusé" lors de la connexion
- Vérifiez que l'email est bien dans `config/whitelist/emails`
- Vérifiez l'orthographe de l'email

### Les données ne se sauvegardent pas
- Ouvrez la console (F12) pour voir les erreurs
- Vérifiez les règles de sécurité Firestore
- Vérifiez que Firebase est initialisé (message de console)

## 📞 Support

Pour toute question :
- Documentation Firebase : https://firebase.google.com/docs
- Console Firebase : https://console.firebase.google.com/

---

**Bon courage pour la configuration ! 🚀**
