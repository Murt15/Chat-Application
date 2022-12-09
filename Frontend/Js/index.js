const url="http://localhost:3000";

const parentNode=document.getElementById("chat-msg");

const token=localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async ()=>{getMsgs();})

document.getElementById("send-btn").onclick= async()=>{
    const msg=document.getElementById("msg-input").value;
    document.getElementById("msg-input").value=" ";
    const msgs={
        msg:msg
    }
    try {
        const res=await axios.post(`${url}/message`,msgs,{headers:{'Authorization':token}});
        //console.log(res);
        showMsgOnScreen(res.data);
    } catch (err) {
        console.log(err);
    }
    
}

async function showMsgOnScreen(data){
    
    const childHTML=`<li class="chat-msg-li">${data.message}</li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}
async function getMsgs(){
        parentNode.innerHTML=" ";
    try {
        const res=await axios.get(`${url}/allmessage`);
        //console.log(res);
        for(let i=0;i<res.data.length;i++){
            showMsgOnScreen(res.data[i]);
        }    
    } catch (err) {
        console.log(err);
    }
}
setInterval(() => {
    getMsgs();
}, 3000);