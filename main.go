package main

import (
  "fmt"
  "github.com/googollee/go-socket.io"
  "log"
  "net/http"
)

type User struct {
    id string
    ready bool
}

var users = make([]User, 0)

func first(ns *socketio.NameSpace, fc bool) {
  users = append(users, User{ns.Id(), false})
  for i := 0; i < len(users); i++ {
    fmt.Printf("p[%d] == %d\n", i, users[i].id)
  }
}

func ready(ns *socketio.NameSpace, fc bool) {
  for i := 0; i < len(users); i++ {
    if(users[i].id == ns.Id()){
      users[i].ready = true;
    }
  }

 for i := 0; i < len(users); i++ {
    if(!users[i].ready){
      fmt.Printf("not ready")
      return
    }
  }
  ns.Emit("start", true)
}

func onConnect(ns *socketio.NameSpace) {
  fmt.Println("connected:", ns.Id(), " in channel ", ns.Endpoint())
  ns.Session.Values["name"] = "this guy"
  ns.Emit("news", "this is totally news", 3)
}

func onDisconnect(ns *socketio.NameSpace) {
  for i := 0; i < len(users); i++ {
    if(users[i].id == ns.Id()){
      users = append(users[:i], users[i+1:]...) 
    }
  }
}


func main() {
  sock_config := &socketio.Config{}
  sock_config.HeartbeatTimeout = 2
  sock_config.ClosingTimeout = 4

  sio := socketio.NewSocketIOServer(sock_config)

  // Handler for new connections, also adds socket.io event handlers
  sio.On("connect", onConnect)
  sio.On("disconnect", onDisconnect)
  sio.On("first", first)
  sio.On("ready", ready)
  sio.On("key", func(ns *socketio.NameSpace, key int){
    sio.Broadcast("key", key)
  })


  //in politics channel
  sio.Of("/pol").On("connect", onConnect)
  sio.Of("/pol").On("disconnect", onDisconnect)
  sio.Of("/pol").On("first", first)
  sio.Of("/pol").On("ready", ready)
  sio.Of("/pol").On("key", func(ns *socketio.NameSpace, key int){
    sio.Broadcast("key", key)
  })

  //this will serve a http static file server
  sio.Handle("/", http.FileServer(http.Dir("./public/")))
  //startup the server
  log.Fatal(http.ListenAndServe(":3000", sio))
}