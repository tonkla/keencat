# KeenCAT

A prototype of chatbot ecommerce (very MVP of Facebook Shop / LINE MyShop).

* Support Facebook Messenger.
* Integrate with Dialogflow.
* Manage users with Firebase Authentication.
* Dockerized, running on Google Cloud Run.
* React (Hooks), Easy-Peasy (Redux-based), Ant Design.
* Node.js via the elegant middlewares of Koa.js.
* Pure joy of 100% functional TypeScript.

The project consists of four modules,

1. Back-end: REST-like APIs, integrates with Firebase services.
2. Dashboard: for sellers to manage shops and products (goods & services).
3. Webhook: a proxy between the system and Messenger.
4. Webview: a mini shopping catalog that works inside Messenger.

