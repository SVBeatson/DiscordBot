const Discord = require("discord.js")
const {token} = require("./token")
const {prefix} = require("./config")
const libraryHours = require("./libraryhours")

const client = new Discord.Client()

client.on('ready', function() {
    console.log("Hello Im alive!")
})

client.on('message', async function(message) {
    const content = message.content
    const messagePrefix = content.charAt(0)
    if (prefix !== messagePrefix)
        return

    const command = content.substring(1)
    if (command === 'hello')
        message.channel.send('How do you do, fellow humans')

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
});

client.login(token);



