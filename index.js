require('dotenv').config();
const fs = require('fs');
const request = require('request');
var HTMLParser = require('node-html-parser');
var CronJob = require('cron').CronJob;
var moment = require('moment');

console.log('Good morning, master!\n\n');


// new CronJob('*/10 * * * * *', function() {
// 	console.log('it works!');
//   }, null, true, 'America/Los_Angeles');

function parseCardapio(refeicao) {

	var cardapioRaw = fs.readFileSync('./exemplos/cardapio.html','utf8')
	//console.log (cardapioRaw);
	var cardapio = HTMLParser.parse(cardapioRaw);
	var cardapioParse = cardapio.querySelector('#post').structuredText;
	//console.log(cardapioParse);

	var dataHoje = moment().format("DD/MM");

	if (cardapioParse.includes(dataHoje) == false) {
		console.log('AVISO: data de hoje não encontrada no cardáipio');
	} else {
		console.log('cardápio de hoje encontrado!');
		var cardapioSplit = cardapioParse.split(/\d\d\/\d\d/igm); // separa um array, cada um com o cardápio completo de cada dia.
		var cardapioMatch = cardapioParse.match(/\d\d\/\d\d/igm); // cria um array com as datas listadas no cardapio (pra utilizar o índice depois)

		var cardapioHoje = (cardapioSplit[cardapioMatch.indexOf(dataHoje)+1]); // cria uma var com o cardápio de hoje, utilizando o index + 1 do array da data
		//console.log(cardapioHoje);

		var refeicoes = cardapioHoje.split(/CAFÉ DA MANHÃ|ALMOÇO|JANTAR/gm); // separa o cardápio de hoje em café, almoço e jantar
		console.log(refeicoes[refeicao]);

		// envia webhook
		// TO-DO: adicionar data e dia da semana aqui, antes do texto em si.
		sendWebhook(refeicoes[refeicao]);

	}

}

function sendWebhook(conteudo) {
	
	const url = process.env.WEBHOOK;
	request.post(
	{
		headers : { 'Content-type' : 'application/json' },
		url,
		form : {value1: conteudo}
	},
	(error, res, body) => console.log(error, body, res.statusCode)
	);

}

parseCardapio(3); // 1 pra café, 2 pra almoço, 3 pra jantar
