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
}

func onConnect(ns *socketio.NameSpace) {
  fmt.Println("connected:", ns.Id(), " in channel ", ns.Endpoint())
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

  sio.On("connect", onConnect)
  sio.On("disconnect", onDisconnect)
  sio.On("first", first)
  sio.On("ready", func (ns *socketio.NameSpace, fc bool) {
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
  sio.Broadcast("start", true)
})
  sio.On("key", func(ns *socketio.NameSpace, key int){
    sio.Except(ns).Broadcast("key", key)
  })

  


  sio.Handle("/", http.FileServer(http.Dir("./public/")))

  log.Fatal(http.ListenAndServe(":3000", sio))
}