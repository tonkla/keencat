build:
	gcloud builds submit --tag gcr.io/keencat-1/api

deploy:
	gcloud run deploy api --image gcr.io/keencat-1/api --platform managed --region asia-northeast1
