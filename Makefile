.DEFAULT_GOAL := slides

.PHONY: slides
slides:
	docker-compose up --detach \
	&& docker-compose logs --follow --timestamp

.PHONY: remake
remake:
	docker-compose up --detach --build --force-recreate \
	&& docker-compose logs --follow --timestamp
