# Api NestJs pour une application mobile de Tetris

## Installation 

Installation en local simplifié avec docker 

- Créer un fichier ``.env`` en y mettant les variables présentes dans ``.env.exemple``

- Lancer docker 

- Lancer l'api en local avec la commande 
```sh
  docker compose -f docker-compose.dev.yml up --build
```

- L'api sera accessible en localhost sur le port spécifié dans le ``.env``


## Outils

### Authentification

L'api utilise PassportJs pour gérer l'authentification avec des JWT. 

### Base de données

L'accès à la base de données et sa modification est géré par l'ORM sequelize. 

La modification et l'ajout de table se fait directement via des migrations trouvable dans ``/src/sequelize/migrations``

Pour mettre à jour la base de donnée il faut lancer la commande
```sh
npm run db:migrate
```

Il est aussi possible d'annuler la dernière migration avec la commande
```sh
npm run db:rollback
```

**Attention !** ces commandes doivent être lancer directement dans le conteneurs docker

```sh
docker exec -it api sh
```