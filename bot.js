const botSettings = require("./botsettings.json");
// ./ Requires file to be on file system
const Discord = require("discord.js");
//const Music = require("discord.js-music");
const prefix = botSettings.prefix;


//Creating a ready event
const client = new Discord.Client();
//Music(client);

// => short way of writing function(args)
client.on("ready", () => {
    console.log('Bot is ready!' + " " + client.user.username + " is online!")
});


client.on("message", async message => {
    if(message.author.bot) {
        return;
    }


    if (message.channel.type === "dm") { // === is strict equals NO TYPE CONVERSION
        return message.channel.send("Don't DM me! \n" + "   - <3 Harumi");
    }

    let messageArray = message.content.split(" "); // let is variable declaration
    let command = messageArray[0];
    let args = messageArray.slice(1); // Array of elements when cutting out one
    /*
    console.log(messageArray);
    console.log(command);
    console.log(args);
    */
    if (!command.startsWith(prefix)) {
        return;
    }
    //If you start with a back tick you can embed a variable into a string
    if (command === `${prefix}userinfo`) { // Efficient concatenation
        let embed = new Discord.RichEmbed()
            .setColor("#FFC0CB")
            .setAuthor(message.author.username)
            .setDescription(`This is ${message.author.username}'s info`)
            .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
            .addField("True ID", message.author.id);

        message.channel.send(embed);
    }

/*    if (command === `${prefix}join`) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => {
                message.reply(`I have joined ${message.member.voiceChannel}! What now?`);
            })
            .catch(console.log);
            console.log(client.voiceConnections.channel);
        } else {
            message.reply(`you need to join a voice channel first!`);
        }
    }*/

/*    if (command === `${prefix}play`) {
         if (message.member.voiceChannel) {
            //if (message.member.voiceChannel.name === ) Need a check to confirm same server

            message.member.voiceChannel.join().then(connection => {

            connection.playArbitraryInput('https://www.youtube.com/watch?v=Njq_mV6lYZY');
            })
        } else {
            message.reply(`you need to join a voice channel first!`);
        }
    }*/

    if (command === `${prefix}shutdown`) {
        message.reply('okay! See you soon!');



        process.exit();
    }
});


client.login(botSettings.token)
