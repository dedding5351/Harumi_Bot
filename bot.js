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
  apiKey: botSettings.apiKey,
  authDomain: botSettings.authDomain,
  databaseURL: botSettings.databaseURL,
  storageBucket: botSettings.storageBucket,
  messagingSenderId: botSettings.messagingSenderId
});

//Settings States && Logic
var database = Firebase.database();
let challenging = false
let challenger = "";
let ongoing = false;
let postChallenge = false;

// => short way of writing function(args)
client.on("ready", () => {
    console.log('Bot is ready!' + " " + client.user.username + " is online!")
});


client.on("message",  message => {
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
    //console.log(command)
    let args = messageArray.slice(1); // Array of elements when cutting out one
    /*
    console.log(messageArray);
    console.log(command);
    console.log(args);
    */

    //console.log(message.content)

    if (command === "Y" && challenging === true && message.author.username === challenger && ongoing === false) {
        //console.log("Y")
        message.reply("okay you have 30 minutes..... Go!")
        let acceptRef = database.ref("/Score/" + challenger + "/Accepted")
        //console.log(acceptRef);
        acceptRef.once("value").then(snapshot => {
            //console.log(snapshot.val())
            if (snapshot.val() === null) {
                acceptRef.set({
                    Accepted : 1
                })
            } else {
                acceptRef.set({
                    Accepted : Number(snapshot.val().Accepted) + 1
                })
            }

            })
        ongoing = true;
        setTimeout( () => {
            message.reply("time is up! Did you finish? (Y/N)")
            postChallenge = true;



        }, 60000 * 30 )// 30 minutes)

    } else if (command === 'N' && challenging === true && message.author.username == challenger && ongoing === false) {
        //console.log("N")
        message.reply("alright then, maybe you should try picking another!")
        let denyRef = database.ref("/Score/" + challenger + "/Denied")
        denyRef.once("value").then(snapshot => {
            if (snapshot.val() === null) {
                denyRef.set({
                    Denied : 1
                })
            } else {
                denyRef.set({
                    Denied : Number(snapshot.val().Denied) + 1
                })
            }

            })
        challenger = ""
        postChallenge = false
        challenging = false
        ongoing = false
    }

    if (postChallenge && challenging && challenger === message.author.username && challenging === true && command === "Y") {
        message.reply("awesome! I knew you could do it!")
        let successRef = database.ref("/Score/" + challenger + "/Success")
        successRef.once("value").then(snapshot => {
            if (snapshot.val() === null) {
                successRef.set({
                    Success : 1
                })
            } else {
                successRef.set({
                    Success : Number(snapshot.val().Success) + 1
                })
            }

            })
        challenger = ""
        postChallenge = false
        challenging = false
        ongoing = false
    } else if (postChallenge && challenging && challenger === message.author.username && challenging === true && command === "N") {
        message.reply("that's too bad... You'll do better next time!")
        let failRef = database.ref("/Score/" + challenger +"/Failed")
        failRef.once("value").then(snapshot => {
            if (snapshot.val() === null) {
                failRef.set({
                    Failed : 1
                })
            } else {
                failRef.set({
                    Failed : Number(snapshot.val().Failed) + 1
                })
            }})
        challenger = ""
        postChallenge = false
        challenging = false
        ongoing = false
    }

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

        let challengeRef = database.ref("/Challenges/" + message.author.username)

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
            let challengeRef = database.ref("/Challenges/" + message.author.username).push()
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

        let challengeRef = database.ref("/Challenges/" + message.author.username)

        database.ref("/Challenges/" + message.author.username).once("value").then(snapshot => {
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

        let challengeRef = database.ref("/Challenges/" + message.author.username)

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

    if (command === `${prefix}pickChallenge` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen")) && !challenging) {
        console.log("Pick Challenge Running")
        //console.log(challenging);

        let challengeRef = database.ref("/Challenges/" + message.author.username)


        challengeRef.once("value").then(snapshot => {
            //console.log(snapshot.toJSON())
            let storage = snapshot.toJSON()
            var index = []
            for (var x in storage) {
                index.push(x)
            }

            if (index.length > 0) {

                let min = Math.ceil(0);
                let max = Math.floor(index.length - 1);
                let challengeChoice = Math.floor(Math.random() * (max - min + 1)) + min
                //console.log(challengeChoice)
                //console.log(challengeChoice)
                let randomKey = storage[index[challengeChoice]].Challenge

                console.log("Random Challenge Chosen by " + message.author.username)
                message.reply("I think you should try......" + "\n" + "Challenge #" + (challengeChoice + 1) + " " + randomKey + "\n" + "Do you accept? (Y/N)")
                challenging = true;
                challenger = message.author.username
                //console.log(challenging);
                return;
            } else {

                message.reply("the challenge list is empty! Try adding some challenges!")
            }



        })



    } else if (command === `${prefix}pickChallenge` && ((message.author.username === challenger)) && challenging) {
        message.reply("finish your current challenge first!")
    } else if ((command === `${prefix}pickChallenge` && !((message.author.username === challenger)) && challenging)) {
        message.reply("you can't do that right now! " + challenger + " is currently finishing their challenge!")
    }



    if (command === `${prefix}removeAll` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen"))) {
        console.log(message.author.username + " cleared the challenge list")
        let challengeRef = database.ref("/Challenges/" + message.author.username);
        challengeRef.remove();
        message.reply("I have emptied the current challenge set for you!")
        return;
    }

    if (command === `${prefix}myScore` && ((message.author.username === "Tenchi") || (message.author.username === "Sekai_no_Kamen"))) {
        let score = 0;
        let embed = new Discord.RichEmbed().setColor("#FFC0CB")
        embed.setDescription("Challenge Statistics for " + message.author.username)

        let successRef = database.ref("/Score/" + message.author.username + "/Success")
        successRef.once("value").then(snapshot => {
            //console.log(snapshot.val().Score)
            if (snapshot.val() === null) {
                successRef.set({
                    Success : 0
                })
                embed.addField("Success", 0)
            } else {
                embed.addField("Success", snapshot.val().Success)
            }
        })

        let failRef = database.ref("/Score/" + message.author.username + "/Failed")
        failRef.once("value").then(snapshot => {
            //console.log(snapshot.val().Score)
            if (snapshot.val() === null) {
                failRef.set({
                    Failed : 0
                })
                embed.addField("Failed", 0)
            } else {
                embed.addField("Failed", snapshot.val().Failed)
            }
        })

        let acceptRef = database.ref("/Score/" + message.author.username + "/Accepted")
        acceptRef.once("value").then(snapshot => {
            //console.log(snapshot.val().Score)
            if (snapshot.val() === null) {
                acceptRef.set({
                    Accepted : 0
                })
                embed.addField("Accepted", 0)
            } else {
                embed.addField("Accepted", snapshot.val().Accepted)
            }
        })

        let denyRef = database.ref("/Score/" + message.author.username + "/Denied")
        denyRef.once("value").then(snapshot => {
            //console.log(snapshot.val().Score)
            if (snapshot.val() === null) {
                denyRef.set({
                    Denied : 0
                })
                embed.addField("Denied", 0)
            } else {
                    embed.addField("Denied", snapshot.val().Denied)
            }
        })



        message.reply("here are your stats!")
        message.channel.send(embed)

    }

    if (command === `${prefix}help`) {
        message.reply("here's what I can currently do!")

        let embed = new Discord.RichEmbed().setColor("#FFC0CB")
        embed.setDescription("Command List (Arguments Cannot Contain Spaces)")
        embed.addField("!addChallenge <Challenge>", "Adds a challenge to the list")
        embed.addField("!pickChallenge", "Will randomly select a challenge from the list for you to complete, 25 minutes given")
        embed.addField("!myScore", "Will report the score that you have currently earned")
        embed.addField("!removeChallenge <Challenge>", "If the challenge is in the list, it will be removed")
        embed.addField("!removeAll", "Will remove all challenges from the list")
        embed.addField("!showChallenges", "Will show all available challenges")

        message.channel.send(embed)
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