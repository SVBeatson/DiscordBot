const Discord = require('discord.js')
const { token, nasa } = require("./token")
const { prefix, name } = require("./config")
const libraryHours = require("./libraryhours")
const fetch = require('node-fetch')

const client = new Discord.Client()
let activePoll = false

client.on('ready', function() {
    console.log("Hello Im alive!")
})

// Event listener for new message
client.on('message', async function(message) {
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'hello') {
        message.channel.send('How do you do, fellow humans')
    }

    if (command === 'coinflip') {
        var rand = Math.floor(Math.random() * 2)
        if (rand === 0)
            message.channel.send('Heads')
        else    
            message.channel.send('Tails')
    }

    if (command === 'stats') {
        const guild = message.guild

        const name = guild.name
        const created = guild.createdAt
        const members = guild.memberCount


        const embed = new Discord.RichEmbed()
        .setDescription('Information')
        .setColor('#0F0F0F')
        .addField('Server Name', name)
        .addField('Creation Date', created)
        .addField('Number of Members', members)

        message.channel.send(embed)
    }

    if (command === 'library'){
        const days = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ]

        const currentDate = new Date()
        const day = days[currentDate.getDay()]

        message.channel.send('```The library is open today from ' + libraryHours[day].Start + ' to ' + libraryHours[day].Closed + '```')
    }

    if (command === 'ping') {
        message.channel.send('!pong')
    }

    if (command === 'pfp') {
        message.reply(message.author.avatarURL)
    }

    if (command === 'useless') {
        message.channel.send('https://theuselessweb.com/')
        // const uselessWeb = new Discord.Attachment('https://theuselessweb.com/')
        // message.channel.send(uselessWeb)
    }

    if (command === 'help') {
        const embed = new Discord.RichEmbed()
        .setDescription(name + ' Commands')
        .setColor('#00FF00')
        .addField('!cat', 'Random Cat Picture')
        .addField('!coinflip', 'Flip a coin')
        .addField('!food', 'Random Recipe')
        .addField('!hello', 'Say Hello!')
        .addField('!library', "See today's library hours")
        .addField('!pfp', 'See your profile picture')
        .addField('!ping', 'Pong!')
        .addField('!space', 'NASA\'s "Astronomy Picture of the Day"')
        .addField('!stats', 'See server statistics')





        message.channel.send(embed)
    }

    if (command === 'space') {
        const  spacePic = await fetch('https://api.nasa.gov/planetary/apod?api_key=' + nasa).then(response => response.json())

        const embed = new Discord.RichEmbed()
        .setDescription(spacePic.title)
        .setColor('white')
        .setImage(spacePic.url)
        .addField('Photographer', spacePic.copyright)
        .addField('Caption', spacePic.explanation)

        message.channel.send(embed)
    }

    if (command === 'food') {
        const {meals} = await fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(response => response.json())

        const embed = new Discord.RichEmbed()
        .setDescription(meals[0].strMeal)
        .addField('Category', meals[0].strCategory)
        .addField('Culture', meals[0].strArea)
        .addField('Link', (meals[0].strSource) ? meals[0].strSource : meals[0].strYoutube)
        .setThumbnail(meals[0].strMealThumb)

        message.channel.send(embed)
    }

    if (command === 'cat') {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json())
    
        const embed = new Discord.RichEmbed()
        .setImage(file)

        message.channel.send(embed)
    }

    if (command === 'poll') {

        if (args.length == 1 && args[0] === 'stop') {
            if (activePoll == false){
                message.reply('There is no active poll. Try making one with !poll')
                return
            }
    
            pollCollector.stop()
            activePoll = false
            return
        }
        if (args.length < 2) {
            message.reply('Proper Syntax: !poll [title] [options...]')
            return
        }
        if (args.length > 11) {
            message.reply('!poll supports a maximum of 10 poll options\n Options given: ' + (args.length - 1))
            return
        }
        const embed = new Discord.RichEmbed()
        .setDescription(args[0])
        .setColor('blue')
        for (let i = 1 ; i <args.length; ++i) {
            embed.addField(numbers[i], args[i], true)
        }

        const poll = await message.channel.send(embed)
        for (let i = 1; i < args.length; ++i) {
            await poll.react(numbers[i])
        } 
        
        const filter = (reaction) => {
            return numbers.includes(reaction.emoji.name)
        };

        pollCollector = poll.createReactionCollector(filter)
        activePoll = true;

        pollCollector.on('collect', (reaction, reactionCollector) => {
            console.log(`Collected ${reaction.emoji.name}`);
        });

        pollCollector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            collected.sort()
            results = collected.array()
            console.log(results)
           // message.channel.send('The winner of the poll is:' + results[0])
        });


    }

});

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

client.login(token);



