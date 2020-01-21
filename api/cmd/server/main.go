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

func main() {
	router := httprouter.New()
	router.GET("/ping", ping)
	log.Fatal(http.ListenAndServe(":8080", router))
}
