const url = "http://localhost:3000";
localStorage.clear();
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    const loginObj = {
        email: email,
        password: password
    }


    try {
        let res = await axios.post(`${url}/user/login`, loginObj)
        console.log(res);
        if (res.data.success == true) {
            window.localStorage.setItem('token', res.data.token)
            window.location.href = '../Views/index.html'

        } else if (res.data.password == "incorrect") {
            window.alert("Password is Incorrect")

        } else {
            window.alert("User Not Registered")
        }
    } catch (err) {
        console.log(err);
    }
}