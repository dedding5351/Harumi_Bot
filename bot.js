const botSettings = require("./botsettings.json");
// ./ Requires file to be on file system
const Discord = require("discord.js");
const Firebase = require("firebase");
//const Music = require("discord.js-music");
const prefix = botSettings.prefix;


//Creating a ready event
const client = new Discord.Client();
//Music(client);
// Initialize default app
// Retrieve your own options values by adding a web app on
// https://console.firebase.google.com
Firebase.initializeApp({
  apiKey: "AIzaSyCsKtXg4yM-ADai9t4jHCcIdLowFaMnoJE",                             // Auth / General Use
  authDomain: "eve-challenger.firebaseapp.com",         // Auth with popup/redirect
  databaseURL: "https://eve-challenger.firebaseio.com", // Realtime Database
  storageBucket: "eve-challenger.appspot.com",          // Storage
  messagingSenderId: "430517639152"                  // Cloud Messaging
});

var database = Firebase.database();

// => short way of writing function(args)
client.on("ready", () => {
    console.log('Bot is ready!' + " " + client.user.username + " is online!")
});


client.on("message", async message => {
    if(message.author.bot) {
        return;
    }


  /*  let author = message.author.username;
    console.log(author);

    defaultDatabase.ref("/chatLog").set({
        author : message.content
    });*/

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

    if (command === `${prefix}addChallenge` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen"))) {// Change later
        console.log("Add Challenge Running")

        let challengeRef = database.ref("/Challenges")

        challengeRef.once("value").then(snapshot => {
            //console.log(snapshot.toJSON())
            let storage = snapshot.toJSON()
            var index = []
            for (var x in storage) {
                index.push(x)
            }
            for (var i = 0; i < index.length; i++) {
                if (storage[index[i]].Challenge == args[0]) {
                    message.reply("that's already in the Challenge set! Try something else!")
                    console.log(message.author.username + " tried to add " + args[0] + " to the challenge list")
                    return;
                }
            }
            let keyString = "Challenge"
            let challengeRef = database.ref("/Challenges").push()
            challengeRef.set({
                [keyString] : args[0]
            })
            message.reply(`okay I've added ${args[0]} to the challenge set!`)
            console.log(message.author.username + " added " + args[0] + " to the challenge list")

        })

       /* database.ref("/Challenges").once("value").then(snapshot => {
            let keyString = "Challenge"
            let challengeRef = database.ref("/Challenges").push()
            challengeRef.set({
                [keyString] : args[0]
            })
            //console.log("Logged" + ": " + keyString)
        });

        challengeRef.once("value").then(snapshot => {
            //console.log(snapshot.toJSON())
            let storage = snapshot.toJSON()
            var index = []
            for (var x in storage) {
               */ //index.push(x)
            //}
            //console.log(storage[index[0]].Challenge)
            //console.log(obj[index[1]].Challenge) PERFECT
    }



        //let keyString = `Challenge ${challengeRef.numChildren()}`;
        /*challengeRef.set({
            [keyString] : "SET"
        });*/

    if (command === `${prefix}showChallenges` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen"))) {
        console.log("Show Challenges Running")

        let challengeRef = database.ref("/Challenges")

        database.ref("/Challenges").once("value").then(snapshot => {
            if (snapshot.numChildren() > 0) {
                let stringBuild = ""
                challengeRef.once("value").then(snapshot => {
                    //console.log(snapshot.toJSON())
                    let storage = snapshot.toJSON()
                    var index = []
                    for (var x in storage) {
                        index.push(x)
                    }

                    let embed = new Discord.RichEmbed().setColor("#FFC0CB").setDescription("Current Challenge List:")

                    for (var i = 0; i < index.length; i++) {
                        let challengeIndentifier = "Challenge #" + (i + 1)
                        embed.addField(challengeIndentifier, storage[index[i]].Challenge)
                    }

                    message.reply("alright! Here is a list of the current challenges, did I miss any?")
                    message.channel.send(embed);
                    console.log(message.author.username + " viewed the challenge list")
                })


            } else {
                message.reply("there aren't any at the moment! How about you add some?")
                console.log(message.author.username + " tried to view the challenge list")
            }

        })


    }

    if (command === `${prefix}removeChallenge` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen"))) {
        console.log("Remove Challenge Running")

        let challengeRef = database.ref("/Challenges")

        challengeRef.once("value").then(snapshot => {
            //console.log(snapshot.toJSON())
            let storage = snapshot.toJSON()
            var index = []
            for (var x in storage) {
                index.push(x)
            }
            for (var i = 0; i < index.length; i++) {
                if (storage[index[i]].Challenge == args[0]) {
                    message.reply(`alright, I have removed "${args[0]}" from the Challenge set!`)
                    challengeRef.child(index[i]).remove()
                    console.log(message.author.username + " removed " + args[0])
                    return;
                }

            }

            message.reply(`I couldn't find "${args[0]}" in the Challenge set.`)
            console.log(message.author.username + " tried to remove " + args[0])
            return;

        })





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

    if (command === `${prefix}pickChallenge`) {
        console.log("Pick Challenge Running")

        let challengeRef = database.ref("/Challenges")

        challengeRef.once("value").then(snapshot => {
            //console.log(snapshot.toJSON())
            let storage = snapshot.toJSON()
            var index = []
            for (var x in storage) {
                index.push(x)
            }

            if (index.length > 0) {

                let min = Math.ceil(0);
                let max = Math.floor(index.length);
                let challengeChoice = Math.floor(Math.random() * (max - min + 1)) + min

                let randomKey = storage[index[challengeChoice]].Challenge
                console.log(challengeChoice)
                console.log("Random Challenge Chosen by " + message.author.username)
                message.reply("I think you should try......" + "\n" + "Challenge #" + (challengeChoice + 1) + " " + randomKey)
                return;
            } else {

                message.reply("the challenge list is empty! Try adding some challenges!")
            }



        })



    }

    if (command === `${prefix}shutdown`) {
        message.reply('okay! See you soon!');



        process.exit();
    }
});


client.login(botSettings.token)









// defaultDatabase.ref().set({
//     username: "Hello",
//     email: "No",
//     profile_picture : "Isee"
//   });