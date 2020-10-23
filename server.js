// Dependencies
// ===============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");

// Sets up the Express app
// ===============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// ===============================================================

// Basic route that sends user first to the AJAX page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays all the saved notes as JSON
app.get("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(notes);
});

app.post("/api/notes", (req, res) => {
    // Receives a new note to save on the request body
    // req.body hosts is equal to the JSON post sent from the user
    const newNote = req.body;

    // Adds new note to the db.json file
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // Assign an id to each note
    if (notes.length == 0) {
        newNote.id = notes.length + 1;
    } else {
        newNote.id = notes[notes.length - 1].id + 1;
    };

    // Push the new note with the id to the notes array
    notes.push(newNote);
    
    // Write the file with the new note in the notes array
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if (err) throw err;
        console.log("The file has been saved!");
    });

    // Returns new note to the client
    res.json(newNote);
});

// Deletes a chosen note, given the id
app.delete("/api/notes/:id", (req, res) => {
    // Grab the id in the URL
    const chosen = req.params.id;

    // Create a notes array by reading db.json
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // If the chosen id in the URL matches the id of the note, delete it from the notes array
    for (let i = 0; i < notes.length; i++) {
        if (chosen == notes[i].id) {
          notes.splice(notes.indexOf(notes[i]), 1);
        };
    };

    // Write the file with the modified notes array
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if (err) throw err;
        console.log("The file has been saved!");
    })
    
    // Returns the notes array to the client
    res.json(notes);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));