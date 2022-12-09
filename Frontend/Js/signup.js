const url="http://localhost:3000";


async function signUp(event){
    event.preventDefault();


    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value
    const phoneNo=document.getElementById("telno").value
    const password=document.getElementById("password").value
    
    const signupObj={
        name:name,
        email:email,
        phoneNo:phoneNo,
        password:password,
    }
    try {
        let res=await axios.post(`${url}/user/signup`,signupObj)
        // console.log(res);
        
        if(res.data.alreadyexisting==true){
            //console.log(res.data)
            window.alert("User Already Registered");
        }else{
            window.alert("User Registered")
        }

    } catch (err) {
        console.log(err);
    }

    document.getElementById("name").value=" ";
    document.getElementById("email").value=" ";
    document.getElementById("telno").value=" ";
    document.getElementById("password").value="";


}