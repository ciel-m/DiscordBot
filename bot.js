var Discord = require('discord.io');
var logger = require('winston');
require('dotenv').config()
//var auth = require('./auth.json');
const authtoken = process.env.TOKEN
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: authtoken,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    // messageID = evt.d.id
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // greetings
            case 'hello':
                bot.sendMessage({
                    to: channelID,
                    message: '今日も一日がんばるぞい！'
                });
            break;
            // pin a message
            case 'pin':
                bot.pinMessage({
                    channelID: channelID,
                    messageID: evt.d.id
                });
            break;
            // calculate macro time
            case 'calmac':
                if (args.length == 3) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'time to run the script requires ' + calculateMacro(args[0], args[1], args[2]) + ' minutes.'
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: sendError()
                    });
                }
            break;
            // DAC rolling
            case 'roll':
                if (args.length == 3) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'chances to roll is ' + calculateProbability(args[0], args[1], args[2]) + ' disregarding every other unit in the same pool. (lower bound)'
                    });
                }
                else if (args.length == 2) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'chances to roll is ' + calculateProbability(args[0], args[1]) + ' disregarding every other unit in the same pool. (lower bound)'
                    });
                }
                else {
                    bot.sendMessage({
                        to: channelID,
                        message: sendError()
                    });                    
                }
            break;
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message:  'LIST OF COMMANDS: \n' 
                    		+ '!hello: Hello.\n'
                            + '!pin [message]: Pin message. \n'
                    		+ '!calmac [runtime, HM gain, goal]: calculates script runtime feather acquisition [FEH]\n'
                            + '!roll: [current level (use 1-10), unit rarity (use 1-5), unit count (how many of the same units exist on the board)] [DAC]\n'
                });
           	            case 'help':
         }
     }
});

function calculateMacro(timePer, gain, req) {
    return parseInt(Math.round(req/gain*timePer/60).toFixed(2));
}

function random() {
	max = 5
	min = 1
    return Math.floor(Math.random()*(max-min+1)+min);
}

function sendError(){
    return "PLEASE USE THE COMMANDS PROPERLY"
}

function calculateProbability(lvl, unit, exist) {

    exist = exist || 0

    unit = unit - 1
    lvl = lvl - 1

    rates = [[1, 0.70, 0.60, 0.50, 0.40, 0.33, 0.30, 0.24, 0.22, 0.19], [0, 0.30, 0.35, 0.35, 0.35, 0.30, 0.30, 0.30, 0.30, 0.25], [0, 0, 0.5, 0.15, 0.23, 0.30, 0.30, 0.30, 0.25, 0.25] ,[0, 0, 0, 0, 0.02, 0.07, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0, 0, 0, 0.01, 0.03, 0.06]]
    variation = [13, 14, 15, 11, 7]
    pool = [45, 30, 25, 15, 10]

    total = variation[unit]*pool[unit]
    chance = pool[unit] - exist

    return (1-(Math.pow((1-(rates[unit][lvl]*chance/total)), 5)))*100

}