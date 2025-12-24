# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar pacotes
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o restante do código
COPY . .

# Expor a porta (Cloud Run usa PORT, mas isso ajuda localmente)
EXPOSE 8080

# Comando para rodar
CMD ["npm", "start"]
