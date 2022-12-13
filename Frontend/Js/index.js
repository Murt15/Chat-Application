const url = "http://localhost:3000";

const parentNode = document.getElementById("chat-msg");

const gparentNode = document.getElementById("grp-name");

const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem("gid");
    allGroups();
    
})

// if(localStorage.getItem("gid")){
//     setInterval(() => {
//         const id=localStorage.getItem("gid");
//         allMsgs(id);
//     }, 3000);
// }



//Event Listener and Function for sending a Message 
document.getElementById("send-btn").onclick = async () => {
    // const file=document.getElementById("file-input").value
    //  console.log(file);
    if (localStorage.getItem("gid") == null) {
        window.alert("You have not selected the group");
    }
    else {
        const msg = document.getElementById("msg-input").value;
        const id = localStorage.getItem("gid");

        document.getElementById("msg-input").value = " ";
        const groupId = localStorage.getItem("gid");


        const msgs = {
            msg: msg,
            groupId: groupId
        }


        try {

            await axios.post(`${url}/message`, msgs, { headers: { 'Authorization': token } });
            // console.log(res);
            allMsgs(id);
        }
        catch (err) {
            console.log(err);
        }
    }


}


// function for getting message of a Group
function showGroupchats(id) {
    localStorage.removeItem("msgs");
    localStorage.setItem("gid", id);

    getMsgs(id);

}

//function for getting from backend and reading and storing it in local storage 
async function allMsgs(id) {

    try {

        const oldMsgArray = JSON.parse(localStorage.getItem("msgs"));
        // console.log(id);
        // console.log(oldMsgArray.length)

        let lastMsgId;

        if (oldMsgArray.length !== 0) {

            lastMsgId = oldMsgArray[oldMsgArray.length - 1].id;
        }
        else {
            lastMsgId = -1;
        }

        //const lastMsgId=-1;
        const res = await axios.get(`${url}/allmessage?id=${lastMsgId}`, { headers: { 'Authorization': id } });
        console.log(res.data);

        const allMsgs = oldMsgArray.concat(res.data);
        //console.log(allMsgs);

        if (allMsgs.length > 10) {
            const msgToSaveInLs = allMsgs.slice(allMsgs.length - 10, allMsgs.length);

            localStorage.setItem("msgs", JSON.stringify(msgToSaveInLs));
        }
        else {
            localStorage.setItem("msgs", JSON.stringify(allMsgs));
        }

        getMsgs(id);
    }
    catch (err) {
        console.log(err);
    }
}

async function getMsgs(id) {
    parentNode.innerHTML = " ";

    const msgArray = JSON.parse(localStorage.getItem("msgs"));
    if (!msgArray || msgArray.length<10) {
        try {
            const res = await axios.get(`${url}/allmessage`, { headers: { 'Authorization': id } });

            //console.log(res.data);
            const response = res.data.slice(res.data.length - 10, res.data.length);
            //console.log(response);

            const messages = JSON.stringify(response);

            localStorage.setItem("msgs", messages);

            for (let i = 0; i < response.length; i++) {
                showMsgOnScreen(response[i].user.name, response[i].message);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    else  {
        for (let i = 0; i < msgArray.length; i++) {
            showMsgOnScreen(msgArray[i].user.name, msgArray[i].message)
        }
    }


}

//Function for getting all the groups of a particular user
async function allGroups() {
    try {
        let res = await axios.get(`${url}/group/allgroups`, { headers: { 'Authorization': token } });
        //console.log(res.data);
        for (let i = 0; i < res.data.data.length; i++) {

            showGrpOnScreen(res.data.data[i]);
        }

    }
    catch (err) {
        console.log(err);
    }
}

//Event Listener and Function for Creating a Group

document.getElementById("grpbtn").onclick = async () => {
    try {
        const form = `<form action="" onsubmit="createNewGroup(event)">
                        <label for="group-name">Group Name</label>
                        <input type="text" id="grpName">
                        <button type="submit">New Group</button>
                    </form>`

        popupNotification('Create Group', form);
    }
    catch (err) {
        console.log(err);
    }

}

async function createNewGroup(event) {
    event.preventDefault();

    const Name = document.getElementById("grpName").value;

    const obj = { name: Name }


    try {
        const res = await axios.post(`${url}/group/createGroup`, obj, { headers: { 'Authorization': token } });
        //console.log(res);
        showGrpOnScreen(res.data.group);

        if (res.data.success == true) {
            window.alert('Group Created Succesfully');
        }
    }
    catch (err) {
        console.log(err);
    }

}

//Event Listener and function for Joining the Group

document.getElementById("join-grpbtn").onclick = async () => {
    const form = `<form action="" onsubmit="joinGroup(event)">
                    <label for="groupname">Enter ther Group Url</label>
                    <input type="text" id="grp-Url">
                    <button type="submit">Join</button>
                </form>`
    popupNotification("Join Group", form);
}

async function joinGroup(event) {
    event.preventDefault();
    const URL = document.getElementById("grp-Url").value;
    const obj = {
        Url: URL
    }
    const res = await axios.post(`${url}/group/joinGroup`, obj, { headers: { 'Authorization': token } });
    console.log(res);
    showGrpOnScreen(res.data.group);
}

//function for admin details
async function adminDetails(id) {
    const obj = { id: id }
    let gid = id;
    try {
        const res = await axios.post(`${url}/group/admindetails`, obj, { headers: { 'Authorization': token } });
        //console.log(res.data[0].isAdmin);
        if (res.data[0].isAdmin == true) {
            let ul = `<ul>`;

            let users = await axios.get(`${url}/group/allUsers`, { headers: { 'Authorization': gid } });
            //console.log(users.data);
            for (let i = 0; i < users.data.length; i++) {
                const childHTML = `<li>${users.data[i].name} <button onclick="makeAdmin(${users.data[i].id},${gid})">Make Admin</button> <button onclick="removeUser(${users.data[i].id},${gid})">Remove User</button></li>`
                ul += childHTML;
            }
            ul += `</ul>`
            popupNotification('User', ul);
        } else {
            popupNotification('Error', 'You are not the admin of this Group')
            setTimeout(() => {
                closePopup();
            }, 2000);
        }
    } catch (err) {
        console.log(err);
    }
}
//Function for making admin
async function makeAdmin(userId, groupId) {
    const obj = {
        userId: userId,
        groupId: groupId
    }
    const res = await axios.post(`${url}/group/makeAdmin`, obj)
    //console.log(res);
    if (res.data.success == true) {
        closePopup();
        popupNotification('Message', `${res.data.msg}`);
        setTimeout(() => {
            closePopup();
        }, 3000);
    }

}

//Function for removing user from a group
async function removeUser(userId, groupId) {
    const obj = {
        userId: userId,
        groupId: groupId
    }
    const res = await axios.post(`${url}/group/removeUser`, obj)
    //console.log(res)
    if (res.data.success == true) {
        closePopup();
        popupNotification('Message', `${res.data.msg}`);
        setTimeout(() => {
            closePopup();
        }, 3000);
    }

}

//Function for showing Msg and Grps on screen 

function showGrpOnScreen(data) {

    const childHTML = `
        <li class="group-names" id=${data.id} onClick="showGroupchats(${data.id})">${data.name}
        <button type="submit" class="admin-details-btn"onClick="adminDetails(${data.id})">?</button>
        <button type="submit" class="invite-user-btn" onclick="popupNotification('Invite Users','${data.groupUrl}')">i</button></li>`
    gparentNode.innerHTML = gparentNode.innerHTML + childHTML;
}

function showMsgOnScreen(name, msg) {
    //console.log(data);
    const childHTML = `<li class="chat-msg-li">${name} : ${msg}</li>`
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//Logout Event Listener
document.getElementById("logout").onclick = () => {
    window.location.href = '../Views/Login.html';
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

    if (htmlElement) {
        innerMessage.innerHTML = htmlElement;
    } else {
        innerMessage.append(document.createTextNode(text));
    }


    // <h1>Success</h1>
    // <p>${message}</p>

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);

}

