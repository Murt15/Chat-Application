const url="http://localhost:3000";

const parentNode=document.getElementById("chat-msg");

const token=localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async ()=>{getMsgs()})

document.getElementById("send-btn").onclick= async()=>{
    const msg=document.getElementById("msg-input").value;
    
    document.getElementById("msg-input").value=" ";
    const msgs={
        msg:msg
    }
    try {
        const res=await axios.post(`${url}/message`,msgs,{headers:{'Authorization':token}});
        //console.log(res);
        allMsgs();
    } catch (err) {
        console.log(err);
    }
    
}

async function getMsgs(){
    parentNode.innerHTML=" ";
    const msgArray=JSON.parse(localStorage.getItem("msgs"));
    if(!msgArray){
        try {
            const res=await axios.get(`${url}/allmessage`);
            //console.log(res.data);
            const response=res.data.slice(res.data.length-10,res.data.length);
            //console.log(response);
            const messages=JSON.stringify(response);
          
            localStorage.setItem("msgs",messages);

            for(let i=0;i<res.data.length;i++){
                showMsgOnScreen(res.data[i].user.name,res.data[i].message);
            }    
        } catch (err) {
            console.log(err);
        }
    }else{
        for(let i=0;i<msgArray.length;i++){
            showMsgOnScreen(msgArray[i].user.name,msgArray[i].message)
        }
    }

   
}

async function allMsgs(){
    try {
        const oldMsgArray=JSON.parse(localStorage.getItem("msgs"));

        const lastMsgId=oldMsgArray[oldMsgArray.length-1].id ||-1;

        const res=await axios.get(`${url}/allmessage?id=${lastMsgId}`);
        //console.log(res.data);
        const allMsgs=oldMsgArray.concat(res.data);
        //console.log(allMsgs);
        if(allMsgs.length>10){
            const msgToSaveInLs=allMsgs.slice(allMsgs.length-10,allMsgs.length);
            localStorage.setItem("msgs",JSON.stringify(msgToSaveInLs));
        }else{
            localStorage.setItem("msgs",JSON.stringify(allMsgs));
        }
        
        getMsgs();
    } catch (err) {
        console.log(err);
    }
}

async function showMsgOnScreen(name,msg){
    //console.log(data);
    const childHTML=`<li class="chat-msg-li">${name} : ${msg}</li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

setInterval(() => {
    allMsgs();
}, 3000);

document.getElementById("logout").onclick=()=>{
    window.location.href='../Views/Login.html';
    localStorage.clear();
}