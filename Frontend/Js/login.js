const url="http://localhost:3000";

async function login(event){
    event.preventDefault();

    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;

    
    const loginObj={
        email:email,
        password:password
    }


    try {
        let res=await axios.post(`${url}/user/login`,loginObj)
        console.log(res);
    } catch (err) {
        console.log(err);
    } 
}