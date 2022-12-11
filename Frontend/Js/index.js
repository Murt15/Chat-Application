const url="http://localhost:3000";

const parentNode=document.getElementById("chat-msg");

const gparentNode=document.getElementById("grp-name");

const token=localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async ()=>{
    allGroups();
})

// if(localStorage.getItem("gid")){
//     setInterval(() => {
//         const id=localStorage.getItem("gid");
//         allMsgs(id);
//     }, 3000);
// }



//Event Listener and Function for sending a Message 
document.getElementById("send-btn").onclick= async()=>{
    if(localStorage.getItem("gid")==null){
        window.alert("You have not selected the group");
    }else{
        const msg=document.getElementById("msg-input").value;
    const id=localStorage.getItem("gid");

    document.getElementById("msg-input").value=" ";
    const groupId=localStorage.getItem("gid");


    const msgs={
        msg:msg,
        groupId:groupId
    }

    try {
        await axios.post(`${url}/message`,msgs,{headers:{'Authorization':token}});
        // console.log(res);
        allMsgs(id);
    } 
    catch (err) {
        console.log(err);
    }
    }
    
    
}


// function for getting message of a Group
 async function showGroupchats(id){
    localStorage.removeItem("msgs")
    
    //const id=event.target.id;
    //console.log(id);
    
    localStorage.setItem("gid",id);
    const obj={
     id:id
    }
     try {
        // const res=await axios.get(`${url}/allmessage`);
        // console.log(res);
        getMsgs(id);
     } 
     catch (err)
      {
         console.log(err);
     }
 }

//function for getting from backend and reading and storing it in local storage 
async function allMsgs(id){
    
    try {

        const oldMsgArray=JSON.parse(localStorage.getItem("msgs"));
        // console.log(id);
        // console.log(oldMsgArray.length)

        let lastMsgId;

        if(oldMsgArray.length!==0)
        {

            lastMsgId=oldMsgArray[oldMsgArray.length-1].id;
        }
        else
        {
            lastMsgId=-1;
        }
        
        //const lastMsgId=-1;
        const res=await axios.get(`${url}/allmessage?id=${lastMsgId}`,{headers:{'Authorization':id}});
        //console.log(res.data);

        const allMsgs=oldMsgArray.concat(res.data);
        //console.log(allMsgs);

        if(allMsgs.length>10)
        {
            const msgToSaveInLs=allMsgs.slice(allMsgs.length-10,allMsgs.length);

            localStorage.setItem("msgs",JSON.stringify(msgToSaveInLs));
        }
        else{
            localStorage.setItem("msgs",JSON.stringify(allMsgs));
        }
        
        getMsgs(id);
    } 
    catch (err)
     {
        console.log(err);
    }
}

async function getMsgs(id)
{
    parentNode.innerHTML=" ";

    const msgArray=JSON.parse(localStorage.getItem("msgs"));
    if(!msgArray)
    {
        try {
            const res=await axios.get(`${url}/allmessage`,{headers:{'Authorization':id}});

            //console.log(res.data);
            const response=res.data.slice(res.data.length-10,res.data.length);
            //console.log(response);

            const messages=JSON.stringify(response);
          
            localStorage.setItem("msgs",messages);

            for(let i=0;i<res.data.length;i++)
            {
                showMsgOnScreen(res.data[i].user.name,res.data[i].message);
            }    
        }
         catch (err) {
            console.log(err);
        }
    }
    else{
        for(let i=0;i<msgArray.length;i++)
        {
            showMsgOnScreen(msgArray[i].user.name,msgArray[i].message)
        }
    }

   
}

//Function for getting all the groups of a particular user
async function allGroups(){
    try {
        let res=await axios.get(`${url}/group/allgroups`,{headers:{'Authorization':token}});
        console.log(res.data);
        for(let i=0;i<res.data.data.length;i++)
        {
           
            showGrpOnScreen(res.data.data[i]);
        }
        
    }
     catch (err) {
        console.log(err);
    }
}

//Event Listener and Function for Creating a Group

document.getElementById("grpbtn").onclick=async()=>{
    try {
        const form=`<form action="" onsubmit="createNewGroup(event)">
                        <label for="group-name">Group Name</label>
                        <input type="text" id="grpName">
                        <button type="submit">New Group</button>
                    </form>`
        
        popupNotification('Create Group',form);
    } 
    catch (err) 
    {
        console.log(err);
    }



//     try {
//         let users=await axios.get(`${url}/user/allUsers`);
//         let popupParentNode=`<div>`
//         popupParentNode.innerHTML=" ";
//         for (let i=0;i<users.data.length;i++){
//             const childHTML=`<input type="checkbox" name=${users.data[i].name} class='cb' id=${users.data[i].id}>
//             <label for="user">${users.data[i].name}</label><br>`
//             popupParentNode+=childHTML;
//         }
//         popupParentNode+=`</div>`
//         const form=`<form action="" onsubmit="createNewGroup(event)">
//        <label for="group-name" >Enter Group Name</label><br>
//        <input type="text" id="grpName"><br>
//       ${popupParentNode}
//        <button type="submit" class="newgroupbtn">Create</button>
//    </form>`
//         popupNotification("Group",form);
//     } catch (err) {
//         console.log(err);
//     }




}

async function createNewGroup(event) {
    event.preventDefault();


    const Name=document.getElementById("grpName").value;
    //console.log(Name);

    const obj={
        name:Name
    }
    try {
        const res= await axios.post(`${url}/group/createGroup`,obj,{headers:{'Authorization':token}});
        //console.log(res);
        showGrpOnScreen(res.data.group);
        if(res.data.success==true)
        {
            window.alert('Group Created Succesfully');
        }
    } 
    catch (err) {
        err
    }
   
}

//Event Listener and function for Joining the Group

document.getElementById("join-grpbtn").onclick=async()=>{
    const form=`<form action="" onsubmit="joinGroup(event)">
                    <label for="groupname">Enter ther Group Url</label>
                    <input type="text" id="grp-Url">
                    <button type="submit">Join</button>
                </form>`
    popupNotification("Join Group",form);
}

async function joinGroup(event){
    event.preventDefault();
    const URL=document.getElementById("grp-Url").value;
    const obj={
        Url:URL
    }
    const res=await axios.post(`${url}/group/joinGroup`,obj,{headers:{'Authorization':token}});
    console.log(res);
    showGrpOnScreen(res.data.group);
}
//Function for making admin
async function makeAdmin(userId,groupId){
    const obj={
        userId:userId,
        groupId:groupId
    }
    const res=await axios.post(`${url}/group/removeUser`,obj)
    console.log(res)
}

async function removeUser(userId,groupId){
    const obj={
        userId:userId,
        groupId:groupId
    }
    const res=await axios.post(`${url}/group/makeAdmin`,obj)
    console.log(res);
}
//function for admin details
async function adminDetails(id){
    const obj={id:id}
    let gid=id;
    try {
        const res=await axios.post(`${url}/group/admindetails`,obj,{headers:{'Authorization':token}});
       //console.log(res.data[0].isAdmin);
       if(res.data[0].isAdmin==true){
        let users=await axios.get(`${url}/group/allUsers`,{headers:{'Authorization':gid}});
        console.log(users.data);
        for(let i=0;i<users.data.length;i++){
            const childHTML=`<li>${users.data[i].name} <button onclick="makeAdmin(${users.data[i].id},${gid})">Make Admin</button> <button onclick="removeUser(${users.data[i].id},${gid})">Remove User</button></li>`
        }
       }else{
        window.alert("You are not an admin of this group");
       }
    } catch (err) {
        console.log(err);
    }
}


//Function for showing Msg and Grps on screen 

function showGrpOnScreen(data){
   
    const childHTML=` <li class="group-names" id=${data.id} onClick="showGroupchats(${data.id})">${data.name}</li>
                        <button type="submit" onClick="adminDetails(${data.id})">i</button>`
    gparentNode.innerHTML=gparentNode.innerHTML+childHTML;
}

function showMsgOnScreen(name,msg){
    //console.log(data);
    const childHTML=`<li class="chat-msg-li">${name} : ${msg}</li>`
    parentNode.innerHTML=parentNode.innerHTML+childHTML;
}

//Logout Event Listener
document.getElementById("logout").onclick=()=>{
    window.location.href='../Views/Login.html';
    localStorage.clear();
}
///////////////////////////////////////////Pop Notification////////////////////////////////////////////////////////////////////
const close = document.getElementById('close');
const popupContainer = document.getElementById('container');
const popupInnerDiv = document.getElementById('popup-inner-div');

close.addEventListener('click', closePopup);

function closePopup() {

    popupContainer.classList.remove('active');

    const childNodes = popupInnerDiv.children;

    popupInnerDiv.removeChild(childNodes[1]);
    popupInnerDiv.removeChild(childNodes[1]);
}

function popupNotification(title, htmlElement, text) {
    //console.log(htmlElement);
    popupContainer.classList.add('active');

    const headingH1 = document.createElement('h1');
    headingH1.append(document.createTextNode(title));

    const innerMessage = document.createElement('div');

    if(htmlElement) {
        innerMessage.innerHTML = htmlElement;
    } else {
        innerMessage.append(document.createTextNode(text));
    }


    // <h1>Success</h1>
    // <p>${message}</p>

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);

}

// const open = document.getElementById("grpbtn");
// const close = document.getElementById("close");
// const container = document.getElementById("container");

// open.addEventListener("click", () => {
//     container.classList.add("active");
// });

// close.addEventListener("click", () => {
//     container.classList.remove("active");
// });

async function rough(){
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