package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func ping(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "pong\n")
}

func get(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "GET\n")
}

func post(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "POST\n")
}

func main() {
	router := httprouter.New()
	router.GET("/ping", ping)
	router.GET("/msgwebhook", get)
	router.POST("/msgwebhook", post)
	log.Fatal(http.ListenAndServe(":8080", router))
}
