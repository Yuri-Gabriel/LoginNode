const MySql = require('./DB');

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

module.exports = {
    GetAllUsers: async () => {
        return await db.Select();
    },
    
    SaveData: async (name, email, password) => {
        await db.Insert(
            NameCapitalizer((name)),
            email,
            password
        );
    },
    
    GetUser: async (Id, Email) => {
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
    },
    
    UpdateUser: async (Id, NewInfo) => {
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
    },
    
    DeleteUser: async (Id) => {
        await db.Delete(Id);
    },
    
    CheckIfTheUserExists: async (email, password) => {
        let exist = false;
        const users = await db.Select();
        for(let p = 0; p < users.length; p++) {
            if (users[p].email === email && users[p].senha === password) {
                exist = true;
                break;
            }
        };
        return exist;
    },

    CheckForRegistration: async (username, email, password) => {
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
    },

    InformationReceived: (username, email, password) => {
        if ((username && email && password) &&
            (username != "" && email != "" && password != "")) {
            return true;
        } else {
            return false;
        }
    }
}