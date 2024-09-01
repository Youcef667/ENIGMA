const form = document.querySelector(".type-form")
const chatlist = document.querySelector(".chat-list")
const theme = document.querySelector("#theme")
const deletebutton = document.querySelector("#delete")
let user=null 
const suggestion = document.querySelectorAll(".list .sugg")
let isresponding = false

const API_KEY="AIzaSyCSgA3Va0csaKopRhC8LwGDYqVW1hHn5lo"
const KEY =`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`



deletebutton.addEventListener("click", ()=>{
    if(confirm("do you really want to delete ?")){
        localStorage.removeItem("savedchats")
        localdatastorage()
    }

})
theme.addEventListener("click", ()=>{
   const islight = document.body.classList.toggle("light")
   theme.innerText = islight ? "dark_mode" : "light_mode";
})

const typing = (text, textelement) => {
    textelement.innerText = '';
    const words = text.split(' ');  
    let index = 0; 
    const interval = setInterval(() => {
        if (index < words.length) {  
            textelement.innerText += (index === 0 ? '' : ' ') + words[index++];  
        } else {
            clearInterval(interval);  
            isresponding=false
        }
    }, 75); 
};


const api = async(incomingmessage)=>{
    const text = incomingmessage.querySelector("p")
try{
    const response = await fetch(KEY , {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: user 
                        }
                    ]
                }
            ]
        })
    });
   
    const data = await response.json()

     if(!response.ok){
        throw new Error(data.error.message)
    }

    let da = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1');
    text.innerText = da ;
    console.log(data)
    typing(da ,text)
}
catch(error){
    console.log(error)
    isresponding=false
    text.innerText=error.messages
} finally{
    incomingmessage.classList.remove("loading");
}

}
const copy = (icon)=>{
    const messagetext = icon.parentElement.querySelector("p").innerText
    navigator.clipboard.writeText(messagetext)
    icon.innerText="done";
    setTimeout(()=>icon.innerText=" content_copy" ,1000)
}
const loadinganimation = ()=>{

    const html= ` <div class="message">
                <img src="enigma.png" alt="enigma" class="avatar1">
                <p></p>
                <div class="loading-indicator">
                    <div class="loading-bars"></div>
                    <div class="loading-bars"></div>
                    <div class="loading-bars"></div>
                </div>
            </div> 
            <span onclick="copy(this)" class="icon material-symbols-rounded"> content_copy </span>         
             `

    const incomingmessage = createelement(html ,"incoming" ,"loading"); 
    chatlist.appendChild(incomingmessage)

    api(incomingmessage);

}
const createelement = (content , ...classes)=>{
    const div =document.createElement("div")
    div.classList.add("message",...classes)
    div.innerHTML= content
    
    return div;
}

const usermessage = ()=>{
    user = form.querySelector(".inputi").value.trim() || user
    if(!user || isresponding){
        return;
    }
    isresponding=true
    const html= `   <div class="message">
                <img src="user.jpg" alt="user" class="avatar">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, culpa!</p>
            </div>         
             `

   const outgoingmessage = createelement(html ,"outgoing");
   outgoingmessage.querySelector("p").innerText = user;
   chatlist.appendChild(outgoingmessage)
   form.reset();
    document.body.classList.add("header-hide")
   setTimeout(loadinganimation , 500);
}
suggestion.forEach (suggestion =>{
    suggestion.addEventListener("click" , ()=>{
        user = suggestion.querySelector(".text").innerText
        usermessage()
    })})


form.addEventListener("submit" , (e)=>{
e.preventDefault()
usermessage()
})


const localdatastorage =()=>{
    const savedchats = localStorage.getItem("savedChats")
    const islight = (localStorage.getItem("themeColor") === "ligth_mode")

    document.body.classList.toggle("light_mode" ,islight)
    theme.innerText = islight ? "dark_mode" : "light_mode"
    chatlist.innerHTML = savedchats || ""; 
}