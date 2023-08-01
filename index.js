const config = require("./config.json");
const fs = require("fs");
const Discord = require("discord.js")
const { Client } = require("discord.js-selfbot-v13")
const inquirer = require("inquirer");
const fetch = require('node-fetch')
const client = new Client({
    checkUpdate: false,
    captchaKey: config.capmonsterkey,
    captchaService: "capmonster",
})
const { promisify } = require("util")
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const { createSpinner } = require("nanospinner")
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
const botclient = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.DirectMessageTyping], partials: [Discord.Partials.Channel, Discord.Partials.Message]})
botclient.commands = new Discord.Collection()
async function start() {
    console.clear()
    botclient.login(config.token).catch(() => false);
    botclient.on("ready", () => {
        console.log(`[>] ${botclient.user.tag} est connecté`)
        console.log(`[>] Boost & Join Bot By 1tsubasa (' Tsubasa [1072553881134972970])`)
    
        const guild = "1123951718045077595"
        botclient.guilds.cache.get(guild)?.commands.set([{
            name: "setserv",
            description: "setservinv",
            type: 1,
            options:[
                {
                    name:"servinv",
                    type: 3,
                    required: true,
                    description: "Lien d invitation"
                }
            ]
        },
        {
            name: "join",
            description: "All tokens joins the serv",
            type: 1
        },
        {
            name: "setconfchan",
            description: "defini le salon de configuration",
            type: 1,
            options:[
                {
                    name:"confchan",
                    type: 7,
                    required: true,
                    description: "channel"
                }
            ]
        },
        {
            name: "checktoken",
            description: "Check token",
            type: 1
        },
        {
            name: "guildid",
            description: "Set guild id",
            type: 1,
            options:[
                {
                    name:"id",
                    type: 3,
                    required: true,
                    description: "ID Du serveur"
                }
            ]
        },
        {
            name: "setboostnum",
            description: "set boost num",
            type: 1,
            options:[
                {
                    name:"boostnum",
                    type: 3,
                    required: true,
                    description: "Nombre de boost"
                }
            ]
        },
        {
            name: "boost",
            description: "All tokens boost the serv",
            type: 1
        }
    ])
    })
    let proxyOptions = {};
 
      botclient.on("interactionCreate", async (interaction) => {

        if (!interaction.isCommand()) return;
    
      const { commandName } = interaction;
    
      if (commandName === 'setserv'){
        let invlink = interaction.options.getString("servinv")
        fs.readFile("./config.json", 'utf-8', (err, data) => {
        try{
           console.log(`Commande ${commandName} executer avec succès.`)
            const config = JSON.parse(data)
            config.servinv = invlink
            fs.writeFile("./config.json", JSON.stringify(config, null, 4), 'utf8', (err) => {
                if (err) {
                  interaction.reply('Erreur lors de l\'écriture du fichier de configuration.');
                  return;
                }
                interaction.reply({
                    content : `La valeur de servinv a été mise à jour avec succès: ${invlink}`,
                    ephemeral: true
                });
              });
            } catch (err) {
                interaction.reply('Erreur lors de la modification de la valeur de servinv dans le fichier de configuration.');
            }
        })
        }
        if (commandName === "setconfchan"){
            let confchan = interaction.options.getChannel("confchan")
            let chan = interaction.guild.channels.cache.get(confchan?.id)
            fs.readFile("./config.json", 'utf-8', (err, data) => {
            try{
               console.log(`Commande ${commandName} executer avec succès.`)
                const config = JSON.parse(data)
                config.configchan = chan.id
                fs.writeFile("./config.json", JSON.stringify(config, null, 4), 'utf8', (err) => {
                    if (err) {
                      interaction.reply('Erreur lors de l\'écriture du fichier de configuration.');
                      return;
                    }
                    interaction.reply({
                        content : `La valeur de configchan a été mise à jour avec succès: ${chan}`,
                        ephemeral: true
                    });
                  });
                } catch (err) {
                    interaction.reply('Erreur lors de la modification de la valeur de configchan dans le fichier de configuration.');
                }
            })
        }
        if (commandName === "checktoken"){
            interaction.reply({
                content : `Vérification des tokens...`,
                ephemeral: true
            })
            checkTokens(proxyOptions)
        } 
        if (commandName === "guildid"){
            let guildid = interaction.options.getString("id")
            fs.readFile("./config.json", 'utf-8', (err, data) => {
            try{
               console.log(`Commande ${commandName} executer avec succès.`)
                const config = JSON.parse(data)
                config.guildId = guildid
                fs.writeFile("./config.json", JSON.stringify(config, null, 4), 'utf8', (err) => {
                    if (err) {
                      interaction.reply('Erreur lors de l\'écriture du fichier de configuration.');
                      return;
                    }
                    interaction.reply({
                        content : `La valeur de guildId a été mise à jour avec succès: ${guildid}`,
                        ephemeral: true
                    });
                  });
                } catch (err) {
                    interaction.reply('Erreur lors de la modification de la valeur de guildId dans le fichier de configuration.');
                }
            })
        }
        if (commandName === "join"){
            interaction.reply({
                content : `Ajout des tokens en cours!`,
                ephemeral: true
            })
            joinMember()
        }
        if (commandName === "boost"){
            interaction.reply({
                content : `Boost du serveur avec les tokens en cours!`,
                ephemeral: true
            })
            boostS()
        }
        if (commandName === "setboostnum"){
            let boostnum = interaction.options.getString("boostnum")
            fs.readFile("./config.json", 'utf-8', (err, data) => {
            try{
               console.log(`Commande ${commandName} executer avec succès.`)
                const config = JSON.parse(data)
                config.boostnum = boostnum
                fs.writeFile("./config.json", JSON.stringify(config, null, 4), 'utf8', (err) => {
                    if (err) {
                      interaction.reply('Erreur lors de l\'écriture du fichier de configuration.');
                      return;
                    }
                    interaction.reply({
                        content : `La valeur de boostnum a été mise à jour avec succès: ${boostnum}`,
                        ephemeral: true
                    });
                  });
                } catch (err) {
                    interaction.reply('Erreur lors de la modification de la valeur de boostnum dans le fichier de configuration.');
                }
            })
        }
      })   
}

async function checkTokens(proxyOptions) {
    const spinner = createSpinner('Checking tokens...').start();
    let working = 0;
    let total = 0;
    let validTokens = [];
  
    try {
      const tokens = await readFile('token.txt', 'utf8');
      if (!tokens) {
        spinner.update({ text: 'token.txt file is empty. Add some tokens!' });
        spinner.error();
        return;
      }
  
      const tkn = tokens.split('\n');
  
      const promises = tkn.map(async (token) => {
        const cleanedToken = token.trim();
  
        if (cleanedToken) {
          try {
            const fetchOptions = {
              method: 'GET',
              headers: {
                'Authorization': cleanedToken
              }
            };
            
            if (proxyOptions && proxyOptions.ip && proxyOptions.port) {
              const { user, ip, port, password } = proxyOptions;
              const proxyUrl = `http://${user}:${password}@${ip}:${port}`;
            
              fetchOptions.agent = new HttpsProxyAgent.HttpsProxyAgent(proxyUrl);
            }
            
            let response;
            if (proxyOptions && proxyOptions.ip && proxyOptions.port) {
              response = await new Promise((resolve, reject) => {
                fetch('https://discord.com/api/v9/users/@me', fetchOptions)
                  .then(resolve)
                  .catch(reject);
              });
            } else {
              response = await fetch('https://discord.com/api/v9/users/@me', fetchOptions);
            }
  
            if (response.status === 200) {
              working++;
              validTokens.push(cleanedToken);
            }
            total++;
  
            if (!proxyOptions || !proxyOptions.ip) {
              await sleep(500);
            }
          } catch (error) {
            console.error(`Error occurred while checking token: ${cleanedToken}`);
            console.error(error);
          }
        }
      });
  
      await Promise.allSettled(promises);
      await writeFile('token.txt', validTokens.join('\n'), 'utf8');
  
      spinner.update({ text: 'Finished checking tokens' });
      spinner.success();
      console.log(`Checked all tokens, ${working}/${total} working. Removed invalid ones.`);
    } catch (error) {
      spinner.update({ text: 'Error occurred while reading tokens file' });
      spinner.error();
      console.error(error);
    }
}
async function joinMember() {
    const spinner = createSpinner('Joining member...').start();
    try {
        const tokens = await readFile('token.txt', 'utf8');
        if (!tokens) {
          spinner.update({ text: 'token.txt file is empty. Add some tokens!' });
          spinner.error();
          return;
        }
        const tok = tokens.split('\n');
        await client.login(tok[0])
        await client.fetchInvite(config.servinv).then(async invite => {
            await invite.acceptInvite()
        })
        const guild = await client.guilds.cache.get(config.guildId)
        for (let index = 0; index <= guild.memberCount; index+= 100) {
            await guild.members.fetchMemberList(index, index !== 100).catch(() => {})
            await sleep(500)
        }
        spinner.update({ text: 'Finished joining member' });
        spinner.success();
    } 
    catch (error) {
      spinner.update({ text: 'Error occurred while joining member' });
      spinner.error();
      console.error(error);
    }

}
async function boostS(proxyOptions) {
    const spinner = createSpinner('Boosting server...').start();
    try {
        const guildId = config.guildId;
        const boostNum = config.boostNum;
        const tokens = await readFile('token.txt', 'utf8');
        if (!tokens) {
          spinner.update({ text: 'token.txt file is empty. Add some tokens!' });
          spinner.error();
          return;
        }
        const tok = tokens.split('\n');
        for (const token of tok) {
            if (cleanedToken) {
                try {
                    const joinOpt = {
                        method: 'POST',
                        headers: {
                            'Authorization': cleanedToken
                        }
                    }
                    if (proxyOptions && proxyOptions.ip && proxyOptions.port) {
                        const { user, ip, port, password } = proxyOptions;
                        const proxyUrl = `http://${user}:${password}@${ip}:${port}`;
                        joinOptions.agent = new HttpsProxyAgent(proxyUrl);
                    }
                    const joinResponse = await fetch(`https://discord.com/api/v9/invites/${guildId}`, joinOptions);
                    if (joinResponse.status === 200) {
                        const boostOptions = {
                            method: 'GET',
                            headers: {
                              'Authorization': cleanedToken
                            }
                        }
                    }
                    if (proxyOptions && proxyOptions.ip && proxyOptions.port) {
                        const { user, ip, port, password } = proxyOptions;
                        const proxyUrl = `http://${user}:${password}@${ip}:${port}`;
                        boostOptions.agent = new HttpsProxyAgent(proxyUrl);
                    }
                    const boostResponse = await fetch(`https://discord.com/api/v9/guilds/${guildId}`, boostOptions);
                    const serverData = await boostResponse.json();
                    if (boostResponse.status === 200 && !serverData.premium_subscription_count) {
                        for (let i = 0; i < BoostNum; i++) {
                            const boostOptions = {
                                method: 'POST',
                                headers: {
                                  'Authorization': cleanedToken,
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  guild_id: guildId,
                                  channel_id: null
                                })
                              };
                              if (proxyOptions && proxyOptions.ip && proxyOptions.port) {
                                const { user, ip, port, password } = proxyOptions;
                                const proxyUrl = `http://${user}:${password}@${ip}:${port}`;
                                boostOptions.agent = new HttpsProxyAgent(proxyUrl);
                              }
                              const boostResponse = await fetch(`https://discord.com/api/v9/guilds/boost`, boostOptions);

                              if (boostResponse.status === 204) {
                                spinner.update({ text: `Server boosted using token: ${cleanedToken}` });
                            } else {
                              console.error(`Error boosting server using token: ${cleanedToken}`);
                              }

                              if (!proxyOptions || !proxyOptions.ip) {
                                await sleep(500);
                              }
                        }
                        spinner.update({ text: 'Finished boosting server' });
                        spinner.success();
                    }
                    else {
                        spinner.update({ text: `Server is already boosted using token: ${cleanedToken}` });
                    }
                } 
                catch (error) {
                    console.error(error);
                }
            }
        }
    }
    catch (error) {
      spinner.update({ text: 'Error occurred while boosting server' });
      spinner.error();
      console.error(error);
    }
}
start();