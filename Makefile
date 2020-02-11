docker-build:
	docker-compose -f docker-compose.yml build

docker-up:
	docker-compose -f docker-compose.yml up

docker-test:
	docker-compose exec server python manage.py test