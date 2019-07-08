const fs = require('fs');
var HTMLParser = require('node-html-parser');
var CronJob = require('cron').CronJob;
var moment = require('moment');

console.log('Good morning, master!');


// new CronJob('*/10 * * * * *', function() {
// 	console.log('it works!');
//   }, null, true, 'America/Los_Angeles');

function parseCardapio() {
	var cardapioRaw = fs.readFileSync('./exemplos/cardapio.html','utf8')
	//console.log (cardapioRaw);
	var cardapio = HTMLParser.parse(cardapioRaw);
	console.log(cardapio.querySelector('#post').structuredText);
}

parseCardapio();