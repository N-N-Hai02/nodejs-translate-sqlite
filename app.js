const express = require("express");
const path = require("path");
const app = express();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/translate_eg.db");

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    // Truy vấn dữ liệu từ cơ sở dữ liệu SQLite
    db.all("SELECT * FROM tbl_word", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            // Hiển thị dữ liệu lên view .ejs
            res.render("Home", { data: rows });
        }
    });
});

app.post("/insert", (req, res) => {
    const { en, vn } = req.body;
    db.run("INSERT INTO tbl_word (en, vn) VALUES (?, ?)", [en, vn], (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Data inserted successfully!");
            res.redirect("/");
        }
    });
});

app.post("/delete", (req, res) => {
    const { id } = req.body;
    db.run(`DELETE FROM tbl_word WHERE ID = ?`, id, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`delete successfully!`);
        res.redirect("/");
    });
});

// --------- edit ------------------
app.get('/edit', (req, res) => {
    const id = req.query.id;

    db.get('SELECT * FROM tbl_word WHERE id = ?', [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.render('Edit', { dataEdit: row });
        console.log("data edit: ",row);
    });
});
// --------- update ------------------
app.post('/update', (req, res) => {
    const id = req.body.id;
    const en = req.body.en;
    const vn = req.body.vn;

    db.run('UPDATE tbl_word SET en = ?, vn = ? WHERE ID = ?', [en, vn, id], function(err) {
        if (err) {
            return console.error(err.message);
        }
        // console.log(`Row(s) updated: ${this.changes}`);
        // res.send('Data updated successfully!');
        console.log("updated successfully!");
        res.redirect("/");
    });
});

app.listen(8080, function (error) {
    if (error) throw error;
    console.log("http://localhost:8080/");
    console.log("Server created Successfully");
});
