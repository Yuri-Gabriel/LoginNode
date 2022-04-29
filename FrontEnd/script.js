const urlAPI = "http://localhost:3030";

const newUser = {
    name: "Adalberto",
    email: "aldo@hotmail.com",
    password: "aldo$123",
}

const GetAllUsers = () => {
    
    axios.get(urlAPI).then(res => {
        const data = res.data;
        result.textContent = JSON.stringify(data);
    }).catch(err => {
        console.log(err);
    });
}

const RegisterNewUser = () => {
    axios.post(`${urlAPI}/SingUp`, newUser)
    .then(res => {
        alert(res.data);
    })
    .catch(err => {
        console.log(err);
    });
}

const UpdateUser = () => {
    axios.put(`${urlAPI}/UpdateUser/2`, {
        newPassword: "jp123$321"
    }).then(res => {
        alert(res.data);
    }).catch(err => {
        console.log(err);
    });
}

const DeleteUser = () => {
    axios.delete(`${urlAPI}/DeleteUser/29`).then(res => {
        alert(res.data);
    }).catch(err => {
        console.log(err);
    });
}

//RegisterNewUser();
//UpdateUser();
//DeleteUser();
GetAllUsers();