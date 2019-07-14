require('dotenv').config();
const fs = require('fs');
const request = require('request');
var HTMLParser = require('node-html-parser');
var CronJob = require('cron').CronJob;
var moment = require('moment');

moment.locale('pt-br');  
console.log('Good morning, master!\n\n');

// função separada só pra pegar o cardápio no site, que depois chama a função parseCardapio.
// feito dessa forma porque o request() é assíncrono
function pegaCardapio(refeicao) {
    request("http://www.pra.ufpr.br/portal/ru/ru-central/", function (error, response, body) {
        if (!error) {
            parseCardapio(body, refeicao);
        } else {
            console.log(error);
        }
    });
}

function parseCardapio(html, refeicao) {

	//var cardapioRaw = fs.readFileSync('./exemplos/cardapio.html','utf8'); // Le o cardapio salvo local, pra testes
	var cardapioRaw = html; // Le o cardapio salvo local, pra testes
	//console.log (cardapioRaw);
	var cardapio = HTMLParser.parse(cardapioRaw);
	var cardapioParse = cardapio.querySelector('#post').structuredText;
	//console.log(cardapioParse);

	var dataHoje = moment().format("DD/MM");
	// determina string da refeição pra inserir no conteúdo
	var refeicaoString = '';
	switch(refeicao) {
		case 1:
			refeicaoString = 'Café da manhã'
			break;
		case 2:
			refeicaoString = 'Almoço'
			break;
		case 3:
			refeicaoString = 'Jantar'
			break;
		default:
	}

	if (cardapioParse.includes(dataHoje) == false) { // se o cardápio não tiver a data de hoje

		// monta string com todas as informações pra postagem
		var conteudo = moment().format('DD/MM - dddd') + ', '+ refeicaoString +':\n' + "Cardápio não atualizado no site da PRA. :(";
		console.log(':: AVISO: data de hoje não encontrada no cardáipio');
		console.log(':: CONTEUDO:\n\n' + conteudo + '\n');

		// envia webhook
		sendWebhook(conteudo);

	} else { // se o cardápio tiver a data de hoje

		console.log('cardápio de hoje encontrado!');
		var cardapioSplit = cardapioParse.split(/\d\d\/\d\d/igm); // separa um array, cada um com o cardápio completo de cada dia.
		var cardapioMatch = cardapioParse.match(/\d\d\/\d\d/igm); // cria um array com as datas listadas no cardapio (pra utilizar o índice depois)

		var cardapioHoje = (cardapioSplit[cardapioMatch.indexOf(dataHoje)+1]); // cria uma var com o cardápio de hoje, utilizando o index + 1 do array da data
		//console.log(cardapioHoje);

		var refeicoes = cardapioHoje.split(/CAFÉ DA MANHÃ|ALMOÇO|JANTAR/gm); // separa o cardápio de hoje em café, almoço e jantar
		console.log(refeicoes);

		if(refeicoes[refeicao] === undefined) { // se não encontrar a refeição selecionada

			var conteudo = moment().format('DD/MM - dddd') + ', '+ refeicaoString +':\n' + cardapioParse.split(/\*/igm)[0];
			console.log(':: AVISO: Data de hoje encontrada, porém não foi encontrada a refeição selecionada. Ou é um erro de digitação, ou é um comunicado incluindo a data de hoje. Postando cardápio completo.');
			console.log(':: CONTEUDO:\n\n' + conteudo + '\n');
			// envia webhook
			sendWebhook(conteudo);

		} else {

			// monta string com todas as informações pra postagem
			var conteudo = moment().format('DD/MM - dddd') + ', '+ refeicaoString +':\n' + refeicoes[refeicao];
			console.log(':: CONTEUDO:\n\n' + conteudo + '\n');
			// envia webhook
			sendWebhook(conteudo);

		}
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

pegaCardapio(3); // 1 pra café, 2 pra almoço, 3 pra jantar


// café da manhã cron
new CronJob('0 0 6 * * *', function() {
	parseCardapio(1);
}, null, true, 'America/Sao_Paulo');

// almoço cron
new CronJob('0 30 10 * * *', function() {
	parseCardapio(2);
}, null, true, 'America/Sao_Paulo');

// jantar cron
new CronJob('0 0 17 * * *', function() {
	parseCardapio(3);
}, null, true, 'America/Sao_Paulo');