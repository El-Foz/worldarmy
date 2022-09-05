require('dotenv').config()
const { Client, GatewayIntentBits }=require('discord.js');
const client=new Client({ intents: [GatewayIntentBits.Guilds] })
const SQLite3 = require('sqlite3').verbose();
const db = new SQLite3.Database('army.db');
const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
};
client.once('ready', ()=>{
    console.log(`ready at ${client.user.tag}`)
})
client.on('interactionCreate', async interaction=>{
    const { commandName }=interaction
    if (!interaction.isChatInputCommand()) return;
    if(commandName=="docrack") await interaction.reply('*snort*')
    if(commandName=='newcountry') {
        if(interaction.member.id==769872709047681026){
            await console.log(interaction.member.id)
            if(interaction.options.getMentionable('leader')!==null){
                await db.run(`insert into countries (name, wealth, govt, owner) values (?, ?, ?, ?)`, [
                    interaction.options.getString('country'), 
                    interaction.options.getNumber('wealth'),
                    interaction.options.getString('govt'),
                    interaction.options.getMentionable('leader').user.id
                ])
            }else{
                await db.run(`insert into countries (name, wealth, govt, owner) values (?, ?, ?, ?)`, [
                    interaction.options.getString('country'), 
                    interaction.options.getNumber('wealth'),
                    interaction.options.getString('govt'),
                    null
                ])
            }
            await interaction.reply('Inserted into db')
        }else{
            await interaction.reply("you aren't god")
        }

    }
    if(commandName=='stats'){
        let n=false
        let x=await query(`select name, wealth, govt from countries`)
        for(let i=0; i<x.length; i++){
            if(x[i].name.toLowerCase()==interaction.options.getString('country').toLowerCase()) {
                await interaction.reply('Country: '+x[i].name+' Wealth: '+x[i].wealth+' Government: '+x[i].govt)
                n=await true
                break
            }
        }
        if(n==false){
            await interaction.reply('Country does not exist')
        }
    }
    if(commandName=='repo') await interaction.reply('https://github.com/TheDNAHero/worldarmy')
    if(commandName=="add"){
        if(interaction.member.id==769872709047681026){
            await db.each('select wealth from countries where name=(?)', [interaction.options.getString('country')], async (err, row)=>{
                let n= await Number(row.wealth)+interaction.options.getNumber('amount');
                if(err) await console.error(err)
                await db.run(`UPDATE countries set wealth=(?) where name = (?)`, [n, interaction.options.getString('country')])
                await interaction.reply('Added')
            })
        }else{
            interaction.reply("you aren't god")
        }
    }

    if(commandName=="buy"){
        if(interaction.member.id==769872709047681026){
            await db.each('select wealth from countries where name=(?)', [interaction.options.getString('country')], async (err, row)=>{
                let n= await Number(row.wealth)-interaction.options.getNumber('amount')
                if(err) await console.error(err)
                await db.run(`UPDATE countries set wealth=(?) where name = (?)`, [n, interaction.options.getString('country')])
                await interaction.reply('Bought')
            })
        }

    }
})
client.login(process.env.token)
