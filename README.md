# Bot Cardapio RU UFPR
Um bot que pega o cardápio do RU no site da PRA e solta um Webhook com os dados.

# Setup:
* Crie um arquivo `.env` na raiz do projeto, com a URL para o webhook desejado, seguindo a seguinte formatação:
```
WEBHOOK=https://maker.ifttt.com/trigger/{event}/with/key/{webhook_key}
CARDAPIO=http://www.pra.ufpr.br/portal/ru/ru-central/
```
## Docker (recomendado):
Caso vá utilizar o Docker, o setup é simples:
* `cd` no diretório do bot e rode `make build` e `make run`
* Qualquer alteração no código precisa rodar `make build && make stop && make run`, alternativamente pode rodar `make redeploy`
* Para ver os logs, utilize `make logs`

## Sem docker:
Se não for utilizar o docker, é necessário ter Node.JS instalado.
* `cd` no diretório do bot e rode `npm install`
* rode `node index.js` ou então `node .`