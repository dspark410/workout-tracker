const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/custommethoddb", { useNewUrlParser: true });

app.get("/index", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/exercise", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.get("/api/workouts", function (req, res) {
    db.Workout.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json(err);
    });
}); 

app.put("/api/workouts/:id", (req, res) => {

    db.Workout.updateOne({ _id: req.params.id }, {
        $push: {exercises: req.body}
        // $push: {
        //     exercises: [
        //         {
        //             "type": req.body.type,
        //             "name": req.body.name,
        //             "duration": req.body.duration,
        //             "distance": req.body.distance,
        //             "weight": req.body.weight,
        //             "reps": req.body.reps,
        //             "sets": req.body.sets
        //         }
        //     ]
        
    }).then(data => {
        res.json(data);
    })
        .catch(err => {
            res.json(err);
        });

});

app.post("/api/workouts", (req, res) => {

    let data = req.body;

    db.Workout.create({
        day: new Date().setDate(new Date().getDate())
    }).then(dbUpdate => {
        res.json(dbUpdate);
    })
        .catch(err => {
            res.json(err);
        });
});


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});