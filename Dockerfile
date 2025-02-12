# Utiliser une image officielle de Node.js comme base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances
RUN npm install

# Installation de Puppeteer (inclut également les dépendances manquantes)
# Ceci installe les fichiers manquants nécessaires pour Puppeteer (ex : Chromium)
RUN apt-get update && apt-get install -y \
ca-certificates \
 fonts-liberation \
 libasound2 \
 libatk-bridge2.0-0 \
 libatk1.0-0 \
 libc6 \
 libcairo2 \
 libcups2 \
 libdbus-1-3 \
 libexpat1 \
 libfontconfig1 \
 libgbm1 \
 libgcc1 \
 libglib2.0-0 \
 libgtk-3-0 \
 libnspr4 \
 libnss3 \
 libpango-1.0-0 \
 libpangocairo-1.0-0 \
 libstdc++6 \
 libx11-6 \
 libx11-xcb1 \
 libxcb1 \
 libxcomposite1 \
 libxcursor1 \
 libxdamage1 \
 libxext6 \
 libxfixes3 \
 libxi6 \
 libxrandr2 \
 libxrender1 \
 libxss1 \
 libxtst6 \
 lsb-release \
 wget \
 xdg-utils \
    && npm i puppeteer --save

RUN npx puppeteer browsers install chrome

# Créer le répertoire .cache/puppeteer
RUN mkdir -p /app/.cache/puppeteer

# Télécharger et installer Google Chrome dans le répertoire .cache/puppeteer
WORKDIR /app/.cache/puppeteer
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer
RUN  npx puppeteer browsers install chrome --install-deps

RUN ls -ld /app/.cache/puppeteer
# Télécharger et installer Google Chrome
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt-get install -y ./google-chrome-stable_current_amd64.deb


# Revenir au répertoire principal de travail
WORKDIR /app

COPY . .

# Créer un utilisateur non-root
RUN groupadd -r puppeteer && useradd -r -g puppeteer -d /app puppeteer

# Attribuer au nouvel utilisateur le dossier de l'application
RUN chown -R puppeteer:puppeteer /app

# Changer l'utilisateur actif
USER puppeteer

# Exposer le port d'écoute du projet (si un serveur est configuré pour répondre sur un port)
EXPOSE 8081

# Définir les variables d'environnement requises
#ENV MONGO_URI=mongodb://mongodb:27017/marketData
#ENV CODES=code-1,code-2

# Commande pour démarrer l'application
CMD ["node", "index.js"]

# Note: Assurez-vous de remplacer "index.js" par le nom correct de votre fichier principal