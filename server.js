//#region IMPORTING EXPRESS AND MYSQL
const express = require('express');
const app = express();
const mysql = require("mysql");
//#endregion IMPORTING EXPRESS AND MYSQL END

//#region CONFIGURATION OF DATABASE
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "22Bb9061990",
    database: "users",
    multipleStatements: true
})
//#endregion CONFIGURATION OF DATABASE END


//#region CONNECTION TO DATABASE
connection.connect((err) => {
    if (!err) {
        console.log('Connected to database!')
    } else {
        console.log(err)
    }
})
//#endregion CONNECTION TO DATABASE END

//#region JSON SUPPORTING
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//#endregion JSON SUPPORTING END

//#region GET METHOD FROM DATABASE
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users WHERE isRemoved=0;', (err, data) => {
        if (err) return res.status(500);
        res.json(data);
    })
})
//#endregion

//#region GET METHOD FROM DATABASE WITH ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM users WHERE id=? AND isRemoved=0', id, (err, data) => {
        if (err) return res.status(500);
        res.json(data)
    })

})
//#endregion GET METHOD FROM DATABASE WITH ID END

//#region PUT METHOD FROM SERVER TO DATABASE
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const modifiedData = req.body;
    if (!Object.keys(modifiedData).length) {
        return res.send({ error: "The modification body has not been sent!" })
    }
    connection.query('UPDATE users SET ?  WHERE id=?;', [modifiedData, id], (err, data) => {
        if (!err) {
            connection.query('SELECT * FROM users WHERE id=?;', [id], (err, data) => {
                if (!err) {
                    res.send({ change: "successfull", data })
                }
            })
        }
    })
})
//#endregion PUT METHOD FROM SERVER TO DATABASE END

//#region POST METHOD FROM SERVER TO DATABASE

app.post('/users/', (req, res) => {
    const newUser = req.body;
    console.log(newUser)
    connection.query('INSERT INTO USERS SET ?;', [newUser], (err, data) => {
        if (!err) return res.send({ newUser, POST: "SUCCESSFULL" });
        res.send(err)
    })
})
//#endregion POST METHOD FROM SERVER TO DATABASE END

//#region DELETE METHOD FROM SERVER TO DATABASE WITH DETELE 
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM users WHERE id= ?;', id, (err, data) => {
        if (err) return res.status(500).send(err);
        res.send({ deleted: true })
    })
})
//#endregion DELETE METHOD FROM SERVER TO DATABASE WITH DELETE END


//#region DELETE METHOD FROM SERVER TO DATABASE WITH FILTER 
app.delete("/users/delete/:id", (req, res) => {
    const { id } = req.params;
    connection.query("UPDATE users SET isRemoved=true WHERE id=? ", [id], (err, data) => {
        if (err) return res.status(500).send(err);
        res.send({ isRemoved: true })
    })
})

//#endregion DELETE METHOD FROM SERVER TO DATABASE WITH FILTER END

//#region CONNECTION TO THE SERVER
app.listen(3000, () => {
    console.log('Connected to the server on port 3000!')
})
//#endregion CONNECTION TO THE SERVER END