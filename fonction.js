const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs");
const proxies = fs.readFileSync("proxies.txt").toString().split("\n");
const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]?.replace("\r", "")?.replace("\n", "");
const config = require("./config.json")
const { HttpProxyAgent } = require("http-proxy-agent")
let JoinTotal = 0;
let JoinFail = 0;
async function readTokens() {
   const tfile = 'token.txt'
   try {
    const data = fs.readFileSync(tfile, 'utf8');
    const tokens = data.trim().split('\n').map(token => token.trim());
    return tokens;
   } catch (err) {
    console.error('Erreur lors de la lecture du fichier de tokens:', err);
   }
   }

async function connectToken() {
    const tfile = "token.txt"
    try {
        const data = fs.readFileSync(tfile, 'utf8').toString();
        const tokens = data.trim().split('\n').map(token => token.trim());
        if (tokens.length === 0) {
            console.log('No tokens found in the file.');
        return;
        }
        var client;
        if (config.proxyu == true) {
            var agent = new HttpProxyAgent(randomProxy);
            client = new Client({  checkUpdate: false,
                                    http: { agent: agent }, });
        tokens.forEach(async (token) => {   
            client.on('ready', () => {
                console.log(`Connecté avec succès en utilisant le token: ${token} [${client.user.username}] (${client.user.id})`);
              });
              client.login(token, {randomProxy})
                .catch((error) => {
                  console.error(`Impossible de se connecter avec le token: ${token}`, error);
                });

                if (client.guilds == 199) {
                    return console.log(`${token} a atteint la limite de serveur`)
                } 
                else {
               await client
               .fetchInvite(config.servinv)
               .then(async (invite) => {
                await invite
                .acceptInvite(true)
                .then(async () => {
                    console.log(`Rejoins avec succès en utilisant le token: ${token} [${client.user.username}] (${client.user.id})`)
                    JoinTotal++
                    console.log(`${JoinTotal} tokens ont rejoins et ${JoinFail} n'ont pas rejoint le serveur`)
                    if (client.token === tokens[tokens.length - 1]) {
                        console.log(`[INFO]
                        ${token} [${client.user.username}] (${client.user.id}) a rejoint : https://discord.gg/${config.servinv}
                        `)
                    }
                })
               })
            }
            
        })
    } else {
                 client = new Client({  checkUpdate: false });
                tokens.forEach(async (token) => {   
                client.on('ready', () => {
            console.log(`Connecté avec succès en utilisant le token: ${token} [${client.user.username}] (${client.user.id})`);
});
client.login(token, {randomProxy})
.catch((error) => {
console.error(`Impossible de se connecter avec le token: ${token}`, error);
});

if (client.guilds == 199) {
return console.log(`${token} a atteint la limite de serveur`)
} 
else {
await client
.fetchInvite(config.servinv)
.then(async (invite) => {
await invite
.acceptInvite(true)
.then(async () => {
console.log(`Rejoins avec succès en utilisant le token: ${token} [${client.user.username}] (${client.user.id})`)
JoinTotal++
console.log(`${JoinTotal} tokens ont rejoins et ${JoinFail} n'ont pas rejoint le serveur`)
if (client.token === tokens[tokens.length - 1]) {
console.log(`[INFO]
${token} [${client.user.username}] (${client.user.id}) a rejoint : https://discord.gg/${config.servinv}
`)
}
})
})
}

})
    }
    
    } catch (err) {
        console.error(err)
    }
   }
 


  module.exports = {
    readTokens,
    connectToken
  }