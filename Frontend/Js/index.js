const url="http://localhost:3000";

const token=localStorage.getItem('token');

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
    const parentNode=document.getElementById("chat-msg");
    const childHTML=`<li class="chat-msg-li">${data.message}</li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}