# Utiliser une image Node.js officielle basée sur Debian slim
FROM node:18-slim

# Installation de Puppeteer (inclut également les dépendances manquantes)
# Ceci installe les fichiers manquants nécessaires pour Puppeteer (ex : Chromium)
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
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
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*


# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de configuration de Node.js
COPY package*.json ./

# Installer les dépendances Node
RUN npm install

# Copier le reste de l'application
COPY . .
# Commande pour démarrer l'application
CMD ["node", "test.js"]

# Note: Assurez-vous de remplacer "index.js" par le nom correct de votre fichier principal
