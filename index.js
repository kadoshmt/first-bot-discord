// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

// Dotenv
const dotenv = require('dotenv');
dotenv.config();
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

// Commands import
const fs = require("node:fs");
const path = require("node:path");
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes.`);
    }
}

console.log(client.commands);


// BOT LOGIN
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Pronto! Login realizado como ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

// Bot interections listeners
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isStringSelectMenu()) {
        const selected = interaction.values[0];
        switch (selected) {
            case "javascript":
                await interaction.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript");
                break;

            case "python":
                await interaction.reply("Documentação do Python: https://www.python.org");
                break;

            case"csharp":
                await interaction.reply("Documentação do C#: https://learn.microsoft.com/en-us/dotnet/csharp/");
                break;

            case "discordjs":
                await interaction.reply("Documentação do Discord.js: https://discordjs.guide/#before-you-begin");
                break;

            default:
                break;
        }
    }
    if (!interaction.isChatInputCommand()) return
    //console.log(interection);
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error("Comando não encontrado");
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply("Houve um erro ao executar esse comando!")
    }
})