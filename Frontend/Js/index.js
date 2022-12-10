const url="http://localhost:3000";

const parentNode=document.getElementById("chat-msg");

const token=localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async ()=>{
    allGroups();
})

document.getElementById("send-btn").onclick= async()=>{
    const msg=document.getElementById("msg-input").value;
    const id=localStorage.getItem("gid");
    document.getElementById("msg-input").value=" ";
    const groupId=localStorage.getItem("gid");
    const msgs={
        msg:msg,
        groupId:groupId
    }
    try {
        const res=await axios.post(`${url}/message`,msgs,{headers:{'Authorization':token}});
        // console.log(res);
        allMsgs(id);
    } catch (err) {
        console.log(err);
    }
    
}

document.getElementById("chat-grp").onclick=async (event)=>{
    const id=event.target.id;
    localStorage.setItem("gid",id);
    const obj={
     id:id
    }
     try {
        // const res=await axios.get(`${url}/allmessage`);
        // console.log(res);
        getMsgs(id);
     } catch (err) {
         console.log(err);
     }
 }

async function allMsgs(id){
    
    try {
        const oldMsgArray=JSON.parse(localStorage.getItem("msgs"));
        
        const lastMsgId=oldMsgArray[oldMsgArray.length-1].id ||-1;
        //const lastMsgId=-1;
        const res=await axios.get(`${url}/allmessage?id=${lastMsgId}`,{headers:{'Authorization':id}});
        //console.log(res.data);
        const allMsgs=oldMsgArray.concat(res.data);
        //console.log(allMsgs);
        if(allMsgs.length>10){
            const msgToSaveInLs=allMsgs.slice(allMsgs.length-10,allMsgs.length);
            localStorage.setItem("msgs",JSON.stringify(msgToSaveInLs));
        }else{
            localStorage.setItem("msgs",JSON.stringify(allMsgs));
        }
        
        getMsgs(id);
    } catch (err) {
        console.log(err);
    }
}

async function getMsgs(id){
    parentNode.innerHTML=" ";
    const msgArray=JSON.parse(localStorage.getItem("msgs"));
    if(!msgArray){
        try {
            const res=await axios.get(`${url}/allmessage`,{headers:{'Authorization':id}});
            console.log(res.data);
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

async function allGroups(){
    try {
        let res=await axios.get(`${url}/group/allgroups`,{headers:{'Authorization':token}});
        //console.log(res);
        const gparentNode=document.getElementById("chat-grp");
        for(let i=0;i<res.data.length;i++){
            const childHTML=` <li class="group-names" id=${res.data[i].id}>${res.data[i].name}</li>`
            gparentNode.innerHTML=gparentNode.innerHTML+childHTML;
        }
        
    } catch (err) {
        console.log(err);
    }
}



document.getElementById("grpbtn").onclick=async()=>{
    try {
        let users=await axios.get(`${url}/user/allUsers`);
        const popupParentNode=document.getElementById("check-box");
        for (let i=0;i<users.data.length;i++){
            const childHTML=`<input type="checkbox" name=${users.data[i].name} class='cb' id=${users.data[i].id}>
            <label for="user">${users.data[i].name}</label><br>`
            popupParentNode.innerHTML=popupParentNode.innerHTML+childHTML;
        }
    } catch (err) {
        console.log(err);
    }
    
    
}


async function showMsgOnScreen(name,msg){
    //console.log(data);
    const childHTML=`<li class="chat-msg-li">${name} : ${msg}</li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}
if(localStorage.getItem("gid")){
    setInterval(() => {
        const id=localStorage.getItem("gid");
        allMsgs(id);
    }, 3000);
}


document.getElementById("logout").onclick=()=>{
    window.location.href='../Views/Login.html';
    localStorage.clear();
}



{
const open = document.getElementById("grpbtn");
const close = document.getElementById("close");
const container = document.getElementById("container");

open.addEventListener("click", () => {
    container.classList.add("active");
});

close.addEventListener("click", () => {
    container.classList.remove("active");
});
}

async function createNewGroup(event) {
    event.preventDefault();
    const checkBox=document.getElementsByClassName('cb');
    const name=document.getElementById("grpName").value;
    const userArray=[];
    for (var check of checkBox) {  
        if (check.checked)  
          userArray.push(check.id)  
      }
      //console.log(userArray);
      const obj={
        name:name,
        id:userArray
      }
      const res= await axios.post(`${url}/group/createGroup`,obj);
      console.log(res);
      if(res.data.success==true){
        window.alert('Group Created Succesfully');
      }
      //console.log(res)  
}