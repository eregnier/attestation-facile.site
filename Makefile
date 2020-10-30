include .env
export

deploy:
	npm run build
	gsutil web set -m index.html -e index.html gs://${PUBLISH_DOMAIN}
	gsutil -m rsync -r dist gs://${PUBLISH_DOMAIN}
