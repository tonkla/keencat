build:
	gcloud builds submit --tag gcr.io/keencat-1/webhook

deploy:
	gcloud run deploy webhook --image gcr.io/keencat-1/webhook --platform managed --region asia-northeast1

bad:
	make build && make deploy
