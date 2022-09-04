const { SlashCommandBuilder, Routes }=require('discord.js')
const { REST } = require('@discordjs/rest');
require('dotenv').config()
const commands = [
	new SlashCommandBuilder().setName('docrack').setDescription('snort'),
    new SlashCommandBuilder().setName('newcountry').setDescription('Adds a new county to the db').addStringOption(option=>
        option.setName('country')
            .setDescription("What is the country's name?")
            .setRequired(true))
    .addNumberOption(option=>
        option.setName('wealth')
            .setDescription('How much money is this country worth? (billion)')
            .setRequired(true))
    .addStringOption(option=>
        option.setName('govt')
            .setDescription('What is the Government Type')
            .setRequired(true))
    .addMentionableOption(option=>
        option.setName('leader')
            .setDescription("Who is the leader (optional)")
            .setRequired(false)),
    new SlashCommandBuilder().setName('stats').setDescription('view some stats about the countries').addStringOption(option=>
        option.setName('country')
            .setDescription('View the stats of a specific country')
            .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.token);
rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);