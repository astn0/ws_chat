window.onload = () => {

class Users{
    constructor(user){
        console.log('USERS START ')
        this.me = user
        console.log('11111111111111111')
        this.lusers = []
        
        console.log('his.users - ', this.lusers)
    }
    set_lusers(data){
        console.log('SETTER = ', this.lusers)
        // this.lusers =  this.lusers ? this.lusers : []
        this.lusers.concat(data)
       //  console.log('~~~~~~~~~~~~~~~~ ', this.users)
    
    }
}    

class View {
    constructor() {
        // this.ws_server = new WebSocket('ws://localhost:2000')
        this.input = document.getElementById('input')
        this.output = document.getElementById('output')
        this.button = document.getElementById('send_message')
        
        this.loged_users = new Users('test')

        this.button_connect = document.getElementById('connect')
        this.button_disconnect = document.getElementById('disconnect')
        
        this.status = document.getElementById('status')
        this.login = document.getElementById('login')
        this.password = document.getElementById('password')
        
        this.users = document.getElementById('users')
        // this.users.children[1].innerHTML = '<li>1</li><li>1</li><li>1</li><li>1</li><li>1</li>'
        
        this.users_open = document.getElementById('users_open')
        this.users_close = document.getElementById('users_close')



        this.users_open.onclick = () => {
            this.users.style = `
            grid-column-start:2;
            grid-column-end:30;
            grid-row-start:2;
            grid-row-end:30;
            z-index:99999;
            `
            
            
            this.users.children[1].style = `
              overflow: none;
              height:100%;
              
            `
            this.users.children[0].style = `
              display:block;
              
            `
            this.users.children[2].style = `
              display:none;
              
            `
        } 
        this.users_close.onclick = () => {
            this.users.style = `
            grid-column-start:25;
            grid-column-end:30;
            grid-row-start:2;
            grid-row-end:15;
            `
            
            
            this.users.children[1].style = `
            overflow-y: scroll;
              height:400px
              
            `
            this.users.children[0].style = `
              display:none;
              
            `
            this.users.children[2].style = `
              display:block;
              
            `
        } 

        this.button_disconnect.disabled = true





        this.button_connect.onclick = async () => {
           this.ws_server = new WebSocket('ws://localhost:2000')
           this.ws_server.onopen = () => this.status_online()
           this.ws_server.close = () => this.status_disconnect() 
           this.ws_server.onerror = () => this.status_error() 
           
           
           
           this.ws_server.onmessage = mess => this.get_message(mess)

           this.button_connect.disabled = true
           this.button_disconnect.disabled = false
           
           
           

        }

        this.button_disconnect.onclick = () => {
           this.ws_server.close() 
           this.button_connect.disabled = false
           this.button_disconnect.disabled = true
        }

        this.button.onclick = () => {
            this.send_mess()
        }
    }
    // API ===========================================================
    signin(){
        let mess = {
            meta: {
               source: 'client_admin',
               from: null
               
            },
            data: {
              api: 'signin',
              login: this.login.value,
              password: this.password.value
            }

        }
        this.ws_server.send(JSON.stringify(mess))
    }
    send_mess(){
        let mess = {
            meta:{
                name: this.login.value,
                token: this.token,
                api:'message'
                },
            data:this.input.value
            
        }
        this.ws_server.send(JSON.stringify(mess))
        this.input.value = ''
    }
    status_online(){
        this.signin()
        this.status.innerHTML = 'online'
        this.status.style = 'color:green'
    }
    status_disconnect(){
        this.status.innerHTML = 'disconnect'
        this.status.cssText = 'color:red'
    }
    status_error(){
        this.status.innerHTML = 'error'
        this.status.cssText = 'color:red'
    }

    get_message(mess){
       let data = JSON.parse(mess.data) 
       
       if(data.meta.api === 'signin'){
        
        this.output.innerHTML = 'Подключение ... '
       }

       if(data.meta.api === 'users'){
          let ul = data.data.users.reduce((ak, user) => ak += `<li>${user.name}</li>`, '') 
          console.log('----------------> ', data.data.users)
          this.loged_users.set_lusers(data.data.users)
          console.log('users = ', this.loged_users.lusers)
          this.users.children[1].innerHTML = ul
       }
       if(data.meta.api === 'message'){
        
        this.output.innerHTML = data.data
       }

       console.log(data)

    }
}

const view = new View()
}