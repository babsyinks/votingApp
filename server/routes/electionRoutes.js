const path = require("path");

const express = require("express");

const {
  checkAuthenticationStatus,
  checkAuthorizationStatus,
} = require("../middleware/auth");
const { upload } = require("../middleware/uploadMedia");
const { Votes } = require("../models");
const { Contestants } = require("../models");
const { Timer } = require("../models");

const router = express.Router();
router.use(express.json());

router.post("/contestants", upload.single("picture"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { surname, firstName, post, manifesto } = req.body;
  const contestant = {
    surname,
    firstname: firstName,
    position: post,
    manifesto,
    picture: req.file.path, // Image link from cloudinary
  };
  // Save contestant to database
  await Contestants.create(contestant);

  res.json({ message: "success", imageUrl: req.file.path });
});

router.get("/details", checkAuthenticationStatus, async (req, res) => {
  const user = req.user;

  const allContestants = await Contestants.findAll();
  const allElections = await Votes.findAll();

  if (allContestants.length === 0) {
    return res.status(404).send({ message: "There Is Currently No Election." });
  } else {
    const positionRank = {
      president: 0,
      "vice president": 1,
      "general secretary": 2,
      "assistant general secretary": 3,
      "national treasurer": 4,
      "national financial secretary": 5,
      "national social welfare officer": 6,
      "national public relations officer": 7,
      "national legal adviser": 8,
      "national internal auditor": 9,
      "chief whip": 10,
    };

    const arrOfVotes = new Array(Object.keys(positionRank).length).fill(null);

    for (let obj of allContestants) {
      let pos = arrOfVotes[positionRank[obj.dataValues.position.toLowerCase()]];
      //check if position obj is already inserted
      if (!pos) {
        const myObj = {};
        const contestant = {};
        myObj.allVotes = allElections
          .filter((v) => v.dataValues.position === obj.dataValues.position)
          .map((fv) => fv.dataValues.user_id);

        myObj.position = obj.dataValues.position;
        myObj.contestants = [];
        const contestantVote = allElections
          .filter(
            (v) => v.dataValues.contestant_id === obj.dataValues.contestant_id,
          )
          .map((fv) => fv.dataValues.user_id);

        contestant.votes = contestantVote;
        const { dataValues } = await Contestants.findOne({
          where: { contestant_id: obj.dataValues.contestant_id },
        });
        contestant.contestant_id = dataValues.contestant_id;
        contestant.surname = dataValues.surname;
        contestant.firstname = dataValues.firstname;
        contestant.manifesto = dataValues.manifesto;
        contestant.picture = dataValues.picture;

        myObj.contestants.push(contestant);
        arrOfVotes[positionRank[obj.dataValues.position.toLowerCase()]] = myObj;
      } else {
        //since pos is inserted push a new contestant in votes array under the given position category
        if (
          !pos.contestants.find(
            (v) => v.contestant_id === obj.dataValues.contestant_id,
          )
        ) {
          const contestant = {};

          //everyone that voted for a particular contestant
          const contestantVote = allElections
            .filter(
              (v) =>
                v.dataValues.contestant_id === obj.dataValues.contestant_id,
            )
            .map((fv) => fv.dataValues.user_id);

          contestant.votes = contestantVote;
          const { dataValues } = await Contestants.findOne({
            where: { contestant_id: obj.dataValues.contestant_id },
          });
          contestant.contestant_id = dataValues.contestant_id;
          contestant.surname = dataValues.surname;
          contestant.firstname = dataValues.firstname;
          contestant.manifesto = dataValues.manifesto;
          contestant.picture = dataValues.picture;

          arrOfVotes[
            positionRank[obj.dataValues.position.toLowerCase()]
          ].contestants.push(contestant);
        }
      }
    }

    const totalVotes = arrOfVotes.filter((v) => v !== null);
    res.json({
      electionData: totalVotes, // totalVotes to be renamed
      userId: user.user_id,
      username: user.username,
      role: user.role,
    });
  }
});

router.post("/vote", checkAuthenticationStatus, async (req, res) => {
  const { userId, contestantId, position } = req.body;

  await Votes.create({
    user_id: userId,
    contestant_id: contestantId,
    position,
  });
  const allElections = await Votes.findAll();

  const allVotes = allElections
    .filter((v) => v.dataValues.position === position)
    .map((fv) => fv.dataValues.user_id);

  const contestantVotes = allElections
    .filter((v) => v.dataValues.contestant_id === contestantId)
    .map((fv) => fv.dataValues.user_id);
  res.json({ allVotes, contestantVotes });
});

router.delete("/delete", checkAuthorizationStatus, async (req, res) => {
  await Votes.destroy({ truncate: true });
  await Timer.destroy({ truncate: true });
  res.json({ message: "success" });
});

module.exports = router;
