require('dotenv/config');

const express = require('express');
const app = express();
const cors = require('cors');
const API_Key = process.env.API_Key;

const bodyParser = require('body-parser');

const port = 3030;

const MySql = require('../DataBase/DB');
const DB_User = process.env.DB_User;
const DB_Password = process.env.DB_Password;
const DB_Host = process.env.DB_Host;
const DB_Port = process.env.DB_Port;
const DB_Table = process.env.DB_Table;
const db = new MySql(
    DB_User,
    DB_Password,
    DB_Host,
    DB_Port,
    DB_Table
);

/*
const users = [{
    id: 0,
    name: "Teste",
    email: "teste@teste.com",
    password: "teste1234"
}];
*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.get('/:MyApiKey', async (req, res) => {
    const key = req.params.MyApiKey;
    if (CheckAPIKey(key)) {
        const allUsers = await db.Select();
        res.status(200).json(allUsers);
    } else {
        res.send("Api key errada")
    }
});

app.post('/SingUp', async (req, res) => {
    const { name, email, password } = req.body;
    if (InformationReceived(name, email, password)) {
        if (CheckForRegistration(name, email, password)) {
            if (CheckIfTheUserExists(email, password)) {
                await db.Insert(
                    NameCapitalizer((name)),
                    email,
                    password
                );
                res.send("Cadastrado com sucesso!");
            } else {
                res.send("Usuario ja existente!")
            }
        } else {
            return res.status(404).send("Usuario ja existente!!!");
        }
    } else {
        return res.status(404).send("Envie os dados!");
    }
});

app.get('/SingIn', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (CheckIfTheUserExists(email, password)) {
        const user = await GetUser(1, "");
        res.status(200).json(user);
    } else {
        res.send("Crie esse usuario");
    }
});

app.put('/UpdateUser/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    const newNameUser = req.body.newName;
    const newEmailUser = req.body.newEmail;
    const newPasswordUser = req.body.newPassword;

    const newinfo = {
        name: newNameUser,
        email: newEmailUser,
        password: newPasswordUser
    }
    if (await GetUser(userId, "") != {}) {
        await UpdateUser(userId, newinfo);
        res.send("Usuario atualizado");
    } else {
        res.send("Usuario inexistente");
    }
    
});

app.delete('/DeleteUser/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const user = await GetUser(userId, "");
    if (user) {
        await DeleteUser(userId);
        res.send(`Usuario deletado`);
    } else {
        res.send("Usuario inexistente");
    }
});

app.listen(port, () => {
    console.log(`Server rodando na porta: ${port}`);
});

const CheckAPIKey = (Key) => {
    if (Key == API_Key) {
        return true;
    } else {
        return false;
    }
}

const InformationReceived = (username, email, password) => {
    if ((username && email && password) &&
        (username != "" && email != "" && password != "")) {
        return true;
    } else {
        return false;
    }
}
const CheckForRegistration = async (username, email, password) => {
    const users = await db.Select();
    if (users.length > 0) {
        let permite = false;
        for(let p = 0; p < users.length; p++) {
            if (users[p].name == username || users[p].email == email || users[p].senha == password) {
                permite = false;
                break;
            } else {
                permite = true;
            }
        };
        return permite;
    } else {
        return true;
    }
}
const GetUser = async (Id, Email) => {
    let user = {};
    let query = "";
    if (Id > -1) {
        query = `SELECT * FROM cadastro WHERE id = "${Id}"`;
        [ user ] = await db.Select(query);
    } else if (Email != "") {
        query = `SELECT * FROM cadastro WHERE email = "${Email}"`;
        [ user ] = await db.Select(query);
    }
    return user;
}
const NameCapitalizer = (name) => {
    let namecapitalized = "";
    for(let c = 0; c < name.length; c++) {
        if (c == 0) {
            namecapitalized = name[0].toUpperCase();
        } else {
            namecapitalized += name[c];
        }
    }
    return namecapitalized;
}
const UpdateUser = async (Id, NewInfo) => {
    if (NewInfo.name) {
        await db.Update(`UPDATE cadastro 
                         SET nome = "${NewInfo.name}" 
                         WHERE id = "'${Id}"`);
    }
    if (NewInfo.email) {
        await db.Update(`UPDATE cadastro 
                         SET email = "${NewInfo.email}" 
                         WHERE id = "${Id}"`);
    }
    if (NewInfo.password) {
        await db.Update(`UPDATE cadastro 
                         SET senha = "${NewInfo.password}" 
                         WHERE id = "${Id}"`);
    }
}

const DeleteUser = async (Id) => {
    await db.Delete(Id);
}

const CheckIfTheUserExists = async (email, password) => {
    let exist = false;
    const users = await db.Select();
    for(let p = 0; p < users.length; p++) {
        if (users[p].email == email && users[p].senha == password) {
            exist = true;
            break;
        }
    };
    return exist;
}