const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

//create user
router.post("/user/signup", async (req, res) => {
  const { name, id } = req.body;
  try {
    const user = new User({
      name: name,
      id: id,
      imageIds: [],
    });
    await user.save();
    res.status(200).send(id);
  } catch (error) {
    res.status(500).send("error");
  }
});
//login user
router.post("/user/login", async (req, res) => {
  const { name } = req.body;
  try {
    const doc = await User.findOne({ name: name }).exec();
    res.status(200).send(doc);
  } catch (error) {
    res.status(500).send("error");
  }
});

// get liked images
router.get("/likes/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const doc = await User.findOne({ id: userId }).exec();
    return res.status(200).send(doc);
  } catch (err) {
    res.status(500).send("error");
  }
});

//add like
router.post("/like", async (req, res) => {
  const { userId, imageId } = req.body;

  try {
    await User.updateOne(
      { id: userId },
      { $push: { imageIds: imageId } }
    ).exec();

    res.status(200).send("like added");
  } catch (error) {
    res.status(500).send(error);
  }
});
//delete like
router.delete("/like/:imageId", async (req, res) => {
  const { userId } = req.body;
  const { imageId } = req.params;

  try {
    await User.updateOne(
      { id: userId },
      { $pull: { imageIds: imageId } }
    ).exec();
    res.status(200).send("like deleted");
  } catch (error) {
    res.status(500).send("error");
  }
});

module.exports = router;
