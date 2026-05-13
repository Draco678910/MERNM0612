# Imatge base oficial de Node.js (versió 24.16.0)
FROM node:latest

# Crea el directori de l'aplicació dins del contenidor
RUN mkdir -p /usr/src/webserver

# Estableix aquest directori com a directori de treball
WORKDIR /usr/src/webserver

# Copia només el fitxer package.json al contenidor
# (això permet aprofitar la cache de Docker si no canvien les dependències)
COPY package.json .

# Instal·la les dependències definides a package.json
RUN npm install

# Copia la resta dels fitxers del projecte al contenidor
# Mateix directori on es troba el Dockerfile, que és el directori de l'aplicació
COPY . .

# Comanda per defecte quan s'executa el contenidor
# En aquest cas, arrenca l'aplicació amb "npm start"
EXPOSE 8081

CMD ["npm", "start"]
