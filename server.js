const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const host = "localhost";
const port = 9999;
const app = express();
let mydb = null;

app.use(bodyParser.text()).use(bodyParser.json());
app.use(cors())

const MySQL = async() => {
      mydb = await mysql.createConnection({
            host: host,
            port: 3306,
            user: "pxng_db",
            password: "ASDfgh132435",
            database: "pxngdb",
      })
};

const validateData = (user) => {
      let userData = user
      let errMes = [];
      if (!userData.name) {
          errMes.push("Name is required");
      }if (!userData.email) {
          errMes.push("Email is required");
      }if (!userData.tel) {
          errMes.push("Tel is required");
      }if (!userData.gender) {
          errMes.push("Gender is required");
      }if (!userData.more) {
          errMes.push("More is required");
      }return errMes
  }

app.get("/", (req, res) => {
      console.log(req.path);
      res.json({
            status: 200,
            message: "Hello World1 This Is Root Page"
      });
})

app.get("/Users", async(req, res) => {
      try {
            let users = await mydb.query("SELECT * FROM users");
            let filterUser = users[0].map(user => {
                  return{
                        id: user.id || 0,
                        name: user.name || 'null',
                  } 
            } ); res.json({
                  status: 200,
                  message: "Users fetched successfully",
                  data: filterUser
                  });
      }catch (error) {
            console.log(error);
            res.status(500).json({error})
      }
});



app.get("/users/:id", async function(req, res) {
      try {
            let id = req.params.id;
            let user = await mydb.query("SELECT * FROM `users` WHERE id = ?", id);;
            if (user[0].length == 0) {
                  throw {statuscode: 404, message: "User not found"}
            }
            res.json({user: user[0][0]})
      } catch (err) {
            statuscode = err.statuscode || 500;
            console.error(err);
            res.status(statuscode).json({err:err.message}) 
      }
});

app.post("/users", async function(req, res) {
      try {
            let user = req.body;
            const error = validateData(user);
            if (error.length > 0) {
                  throw {
                        message: "fill is required: ",
                        err: error,
                        statuscode: 400
                  }
            }
            console.log(user);
            let id = await mydb.query("INSERT INTO users SET ?", user);
            id = id[0].insertId;
            // res.json(id[0].insertId);
            let results = await mydb.query("SELECT * FROM users WHERE id = ?", id);
            res.json({
                  status: 200,
                  message: "User created successfully",
                  data: results[0][0]
            });
      } catch (err) {
            console.error(err);
            res.status(500).json({err: err.err, errMess: err.message})
      };
})

app.put("/users/:id", async(req, res) => { 
      try {
            let id = req.params.id;
            let data = req.body;
            let userOld = await mydb.query("SELECT * FROM users WHERE id = ?", [id]);
            userOld = userOld[0][0];
            let user = {};
            // user.id = id;
            user.name = data["name"] || "null";
            user.email = data["email"] || userOld.email;
            user.tel = data["tel"] || userOld.tel;
            user.gender = data["gender"] || userOld.gender;
            user.more = data["more"] || userOld.more;
            await mydb.query("UPDATE users SET ? WHERE id = ?",[user, id]);
            const results = await mydb.query("SELECT * FROM users WHERE id = ?", [id]);
            res.json({
                  status: 200,
                  message: "User updated successfully",
                  oldData: userOld,
                  dataNew: results[0][0], 
            })
      } catch (err) {
            console.error(err);
            res.status(500).json({err})
      }
});

app.patch("/users/:id", (req, res) => {
      let id = req.params.id;
      let data = req.body;
      let userIndex = users.findIndex(user => user.id == id);

      if (data.name) {
            users[userIndex].name = data.name;
      }
      if (data.age) {
            users[userIndex].age = data.age;
      }

      console.log(users[userIndex]);
      res.json({
            status: 200,
            index: userIndex,
            message: "User updated successfully",
            data: users[userIndex]
      })
});

app.delete("/users/:id", async(req, res) => {
      try {
            let id = req.params.id;
            let results = await mydb.query("SELECT * FROM users WHERE id =?",[id]);
            await mydb.query("DELETE FROM users WHERE id = ?", [id]);
            console.log(results[0]);
            res.json({
                  status: 200,
                  message: "User deleted successfully",
                  data: results[0]
            })
      } catch (err) { 
            console.error(err);
            res.status(500).json({err})
      } 
}) 

app.listen(port, async(req, res) => {
      await MySQL()
      console.log("Server is running on port " + `http://${host}:${port}`);
});
