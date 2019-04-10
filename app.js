const web_socket = require('ws')
console.log('ready')
const server = new web_socket.Server({ port:2000})
let CHAT = ''
class Messages{

}
let SERIAL = 0
let CONNECTIONS = []
class Users {
    constructor(){
        this.admins = [
            {
              uid: 0,
              name: 'Андрей',
              email: 'a',
              password: '12345',
              token: '0_dq3d3dhqw9fhwofh'
            }, {
              uid: 1,
              name: 'Вася',
              email: 'v',
              password: '12345',
              token: '1_dq3d3dhqw9fhwofh'
            }, {
              uid: 2,
              name: 'Наташа',
              email: 'n',
              password: '12345',
              token: '2_dq3d3dhqw9fhwofh'
            }
        ]
    }
    
}


class Controllers {

    static router(message, ws) {
        let meta = {}
        let data = {}
        if (message.data.api === 'signin'){
            // console.log('будем логиниться login = ', message.data.login, ' password = ', message.data.password)
            const users = new Users()
            let user = users.admins.filter(user => (user.email === message.data.login) && (user.password === message.data.password))
            console.log('user ', user)
            if (user.length !== 0) {
               console.log('Подлогинились ', user.name)
               ws.name = user[0].name
               ws.token = user[0].token
               ws.myid = SERIAL 
               SERIAL ++

               CONNECTIONS.push({
                   SERIAL,
                   ws
               })
               // console.log(CONNECTIONS)
               meta.api = 'signin'
               data.sucsess = true
               let result = {
                   meta,
                   data
               }
               ws.send(JSON.stringify(result))

               
               meta.api = 'users'
               data.sucsess = true
               data.users = CONNECTIONS.map(conn => {
                   return {
                       name: conn.ws.name,
                       id: conn.ws.myid
                   }
               })//users.admins
                   
               
               result = {
                   meta,
                   data
               }
               console.log('result ', result.data.users)
               server.clients.forEach(client => {
                if ((client.readyState === web_socket.OPEN) && (client) ){
                    client.send(JSON.stringify(result))
                
                }
            })

                
            } else {
              console.log('Не верный пароль - логин')
              ws.name = ''
              ws.myid = SERIAL 
              SERIAL ++

              
              meta.api = 'signin'
              data.sucsess = false
              let result = {
                  meta,
                  data
              }
              ws.send(JSON.stringify(result))
              server.clients.delete(ws)
            }

        } else if (message.data.api === 'exit'){
            console.log('разорвать соединение')
            server.clients.delete(ws)  

        } else if (message.meta.api === 'message'){
          console.log('Послать сообщение всем пользователям : ', message.data)
          
              meta.api = 'message'
              data = message.meta.name + ' > ' + message.data
              let result = {
                  meta,
                  data
              }

          server.clients.forEach(client => {
              if ((client.readyState === web_socket.OPEN) && (client) ){
                  client.send(JSON.stringify(result))
              
              }
          })
        }

    }
}

server.on('connection', ws => {
    ws.on('message', mess => {
          let message = JSON.parse(mess)
          // console.log(message)

          

          // router
          Controllers.router(message, ws)
        
          console.log(CONNECTIONS)
    })
    greeting = {
        meta:{
          code:200
        },
        data:{
          text:'Подключение к чату',
          api:''    
        }
    }
    ws.send(JSON.stringify(greeting))
    
    console.log('ws.name = ', ws.name)
  })

  
