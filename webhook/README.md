# Webhook

## Messenger

**Test POST webhook**

```
curl -H "Content-Type: application/json" -X POST "localhost:8080/msg" -d '{"object": "page", "entry": [{"messaging": [{"message": "hi"}]}]}'
```

## LINE
