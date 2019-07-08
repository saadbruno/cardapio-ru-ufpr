.PHONY: build rebuild run clean stop logs

build:
	docker build -t cardapio-ru-ufpr .

rebuild:
	docker build --no-cache -t cardapio-ru-ufpr .

run:
	docker run -d --restart=unless-stopped --name cardapio-ru-ufpr cardapio-ru-ufpr 

stop:
	docker stop cardapio-ru-ufpr && docker container rm cardapio-ru-ufpr

logs:
	docker logs -f cardapio-ru-ufpr

clean:
	docker system prune -f 
	docker container rm cardapio-ru-ufpr

redeploy: rebuild stop run
