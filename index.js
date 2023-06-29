const config = require("./config.json");
const fs = require("fs");
const Discord = require("discord.js")
const { readTokens , connectToken} = require("./fonction.js")

readTokens()
const botclient = new Discord.Client({ intents: [ Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.DirectMessageTyping], partials: [Discord.Partials.Channel, Discord.Partials.Message]})
botclient.login(config.token).catch(() => false);
botclient.commands = new Discord.Collection()

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
    }
])
})
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

    if (commandName === "join"){
        connectToken()
        interaction.reply({
            content: `Les tokens sont entrain de rejoindre`,
            ephemeral: true
        })
    }
   
  })
