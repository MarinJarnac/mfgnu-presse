# 🗞️ MFGNU Press Hub

Une application web complète pour gérer et organiser votre équipe de presse, avec authentification Google, gestion de contenu, calendrier collaboratif et chat en temps réel.

![MFGNU Press Hub](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- **Connexion Google** : Authentification sécurisée via Google OAuth
- **Système de whitelist** : Seuls les comptes autorisés peuvent se connecter
- **Gestion des rôles** : 3 niveaux de permissions (Admin, Éditeur, Membre)

### 📊 Tableau de bord
- **Post-its interactifs** : Style EcoleDirecte pour afficher des informations importantes
- **Statistiques en temps réel** : Activité, événements, messages
- **Couleurs personnalisables** : Jaune, vert, rouge, bleu pour prioriser l'information
- **Suppression conditionnelle** : Seul l'auteur ou un admin peut supprimer

### 📅 Calendrier collaboratif
- **Vue mensuelle** : Navigation intuitive entre les mois
- **Événements colorés** : Visualisation claire des deadlines
- **Permissions granulaires** : Admins et Éditeurs peuvent créer des événements
- **Liste des événements à venir** : Vue chronologique des prochaines échéances

### 💬 Chat en temps réel
- **Discussion instantanée** : Communication fluide entre membres
- **Avatars personnalisés** : Identification visuelle rapide
- **Horodatage** : Suivi précis des conversations
- **Interface moderne** : Bulles de chat élégantes

### 📁 Intégration Google Drive
- **Accès direct** : Lien vers le Drive partagé de la presse
- **Un seul clic** : Ouverture rapide dans un nouvel onglet
- **Organisation centralisée** : Tous les documents au même endroit

### ⚙️ Paramètres personnalisables
- **Profil utilisateur** : Modification du nom et email
- **Mode sombre/clair** : Confort visuel adapté
- **Notifications** : Gestion des alertes par email

### 👤 Panel d'administration
- **Gestion des utilisateurs** : Modification des rôles en temps réel
- **Whitelist dynamique** : Ajout/suppression d'emails autorisés
- **Statistiques avancées** : Vue d'ensemble de l'activité
- **Table d'utilisateurs** : Interface claire et professionnelle

### 📱 Design responsive
- **Mobile-friendly** : S'adapte à tous les écrans
- **Navigation latérale** : Menu déroulant sur mobile
- **Touch-optimized** : Interactions tactiles fluides

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Un compte Google pour l'authentification
- Un dossier Google Drive partagé (optionnel)

### Déploiement sur GitHub Pages

1. **Créez un nouveau repository sur GitHub**
   ```bash
   # Nom suggéré : mfgnu-press-hub
   ```

2. **Clonez le repository**
   ```bash
   git clone https://github.com/votre-username/mfgnu-press-hub.git
   cd mfgnu-press-hub
   ```

3. **Ajoutez le fichier**
   ```bash
   # Copiez press-hub.html dans le dossier
   mv press-hub.html index.html
   git add index.html
   git commit -m "Initial commit: MFGNU Press Hub"
   git push origin main
   ```

4. **Activez GitHub Pages**
   - Allez dans Settings > Pages
   - Source : Deploy from a branch
   - Branch : main / (root)
   - Sauvegardez

5. **Accédez à votre site**
   ```
   https://votre-username.github.io/mfgnu-press-hub/
   ```

## 🔧 Configuration

### 1. Configuration de l'authentification Google

Pour activer la vraie authentification Google :

```javascript
// Remplacez dans le code (ligne ~850) :
const handleGoogleLogin = () => {
    // Simulation actuelle
    const user = storage.users[0];
    setCurrentUser(user);
    setIsLoggedIn(true);
};

// Par l'authentification réelle avec Firebase :
const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        // Vérifier la whitelist
        if (whitelist.includes(user.email)) {
            setCurrentUser({
                id: user.uid,
                email: user.email,
                name: user.displayName,
                role: getUserRole(user.email),
                avatar: user.displayName[0]
            });
            setIsLoggedIn(true);
        } else {
            alert('Votre compte n\'est pas autorisé à accéder à cette application.');
            firebase.auth().signOut();
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
    }
};
```

### 2. Configuration Firebase (pour production)

1. **Créez un projet Firebase**
   - Allez sur https://console.firebase.google.com/
   - Créez un nouveau projet "MFGNU Press Hub"

2. **Activez l'authentification Google**
   - Authentication > Sign-in method
   - Activez Google

3. **Ajoutez Firebase à votre application**

```html
<!-- Ajoutez avant la fermeture de </body> -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>

<script>
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

firebase.initializeApp(firebaseConfig);
</script>
```

### 3. Configuration du Google Drive

Remplacez le lien du Drive (ligne ~1450) :

```javascript
const openDrive = () => {
    // Remplacez par votre lien Google Drive partagé
    window.open('https://drive.google.com/drive/folders/VOTRE_ID_DOSSIER', '_blank');
};
```

Pour obtenir le lien :
1. Créez un dossier sur Google Drive
2. Clic droit > Partager
3. Paramètres > Toute personne disposant du lien
4. Copiez le lien

## 📊 Architecture des données

### Structure utilisateur
```javascript
{
    id: number,
    email: string,
    name: string,
    role: 'admin' | 'editor' | 'member',
    avatar: string
}
```

### Structure post-it
```javascript
{
    id: number,
    title: string,
    content: string,
    color: 'yellow' | 'green' | 'red' | 'blue',
    author: string,
    authorId: number,
    date: string (ISO 8601)
}
```

### Structure événement
```javascript
{
    id: number,
    title: string,
    date: string (YYYY-MM-DD),
    time: string (HH:MM),
    description: string
}
```

### Structure message
```javascript
{
    id: number,
    sender: string,
    senderId: number,
    text: string,
    time: string (HH:MM),
    avatar: string
}
```

## 🎨 Personnalisation

### Couleurs principales

Modifiez les variables CSS (lignes 11-25) :

```css
:root {
    --primary: #2563eb;        /* Bleu principal */
    --primary-dark: #1e40af;   /* Bleu foncé */
    --success: #10b981;        /* Vert */
    --warning: #f59e0b;        /* Orange */
    --danger: #ef4444;         /* Rouge */
}
```

### Logo

Remplacez l'icône Newspaper par votre logo :

```jsx
<div className="logo">
    <img src="votre-logo.png" alt="MFGNU" style={{ width: '32px', height: '32px' }} />
    <span>MFGNU Press</span>
</div>
```

## 🔒 Sécurité & Bonnes pratiques

### ⚠️ Important pour la production

1. **Ne jamais exposer les credentials Firebase** dans le code source
   - Utilisez des variables d'environnement
   - Configurez les règles de sécurité Firestore

2. **Configurez les règles Firestore** :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /postits/{postitId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                       (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'editor']);
      allow update, delete: if request.auth != null && 
                               (resource.data.authorId == request.auth.uid || 
                                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

3. **Validez toujours les entrées** côté client ET serveur

## 🚀 Fonctionnalités futures

- [ ] Notifications push en temps réel
- [ ] Upload de fichiers directement dans l'app
- [ ] Éditeur de texte riche pour les post-its
- [ ] Export PDF des calendriers
- [ ] Intégration Slack/Discord
- [ ] Application mobile native (React Native)
- [ ] Mode hors ligne (PWA)
- [ ] Statistiques d'engagement détaillées
- [ ] Recherche avancée (full-text)
- [ ] Tags et catégories pour les post-its

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion :
- Site web : https://mfgnu.com
- Email : contact@mfgnu.com

## 🙏 Remerciements

- Design inspiré par EcoleDirecte
- Icônes par [Lucide](https://lucide.dev)
- Authentification Google par Firebase
- Hébergement gratuit par GitHub Pages

---

Fait avec ❤️ pour MFGNU Press
