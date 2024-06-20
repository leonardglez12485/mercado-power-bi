

const userName = localStorage.getItem('name');
if(!userName){
    window.location.replace('/')
    throw new Error ('User is required!!!');
}

//Referencias html
const lblSbtatusOnLine = document.querySelector('#status-online');
const lblSbtatusOffLine = document.querySelector('#status-offline');
const userUlElements= document.querySelector('ul');
const  form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');
const time = document.querySelector('#time');
const msgStark = document.querySelector('#message stark')


// const divName = document.querySelector('#name');
// const boxChat = document.querySelector('#boxChat');
// const nameClient = document.getElementsByTagName('li');

const renderUser = (users)=>{
    userUlElements.innerHTML = '';
    users.forEach((user) => {
        const liElemet= document.createElement('li');
        liElemet.innerText = user.name;
        userUlElements.appendChild(liElemet)
    });
};


const renderMessage=(payload)=>{
 
 const {userId, message, name}= payload;
 const divElement = document.createElement('div');
 divElement.classList.add('message');


 if(userId !==socket.id){
    divElement.classList.add('incoming');
 }
 divElement.innerHTML = `
 <small class="bold">${name}</small>
 <p class="margin">${message}</p>
 `
 chatElement.appendChild(divElement)
 //Scroll end message
 chatElement.scrollTop = chatElement.scrollHeight;

 const hour = new Date().getHours()
 const min = new Date().getMinutes()
 time.innerText= `Hoy a las ${hour}:${min}`

}
// const renderBox = (name)=>{
//     const name= name;
//     boxchat.createElement('div');
//     boxChat.classList.add('chat');
//     boxChat.innerHTML = `<div class="chat" id="boxChat">${name}</div>`;
//     boxChat.style.display="block";
// }


// nameClient.addEventListener('submit', (payload)=>{
//     const name=payload;
//     renderBox(name);
// })

form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const message = input.value;
    input.value = '';
    socket.emit('send-message', message);
});

const socket = io({
    auth:{
        token: 'ABC-123',
        name: userName,
    }
});


// const showBox = ()=>{
    
//     const nameClient = document.querySelector('li');
//     const chatElement = document.querySelector('#boxFull');
//     //console.log(nameClient)
//     nameClient.addEventListener('click', ()=> {
//        if(chatElement.classList.contains('hidden')){
//           chatElement.classList.remove('hidden');
//           chatElement.classList.add('show');
//        }else{
//         chatElement.classList.remove('show');
//         chatElement.classList.add('hidden');
//        }
        
        
//     })
// }

socket.on('connect', ()=>{
   
    lblSbtatusOnLine.classList.remove('hidden')
    lblSbtatusOffLine.classList.add('hidden')
});

socket.on('disconnect', ()=>{
    lblSbtatusOnLine.classList.add('hidden')
    lblSbtatusOffLine.classList.remove('hidden')
});

socket.on('welcome-message', (data)=>{
    alert(data);
});

socket.on('on-clients-changed', renderUser);
socket.on('on-message', renderMessage);

// socket.on('on-clients-changed', showBox);
// socket.on('on-message', showBox);