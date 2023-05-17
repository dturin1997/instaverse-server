import mongoose from "mongoose";
//import { restart } from "nodemon";
import Story from "../models/storyContent.js";

const getStories = async (req, res) => {
    
    
    try {
        const story = await Story.find();
        //console.log(story);
        res.status(200).json(story);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
    //res.send("instaverse");
}

const createStory = async (req, res) => {
    const body = req.body;

    const newStory = new Story({
        ...body,
        userId: req.userId,
        postDate: new Date().toISOString()
    })

    try {
        newStory.save();
        res.status(201).json(newStory)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateStory = async (req, res) => {
    const { id: _id } = req.params;
    
    const story = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("This id doesnt belong to any story")
    }

    const updatedStory = await Story.findByIdAndUpdate(_id, story, { new: true });
    
    //Acá se cometió error TYPO y no actualizaba al momento
    //en el frontend
    res.json(updatedStory);
}

const deleteStory = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("This id doesnt belong to any story");
    }

    await Story.findByIdAndRemove(id);

    res.json({ message: "Story deleted successfully" });

}

const likeStory = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "Unauthenticated User" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("This id doesnt belong to any story");
    }

    const story = await Story.findById(id);

    const index = story.likes.findIndex(id => id === String(req.userId));

    if (index === -1) { // if user has not liked the story
        story.likes.push(req.userId);
    } else {
        story.likes = story.likes.filter(id => id !== String(req.userId));
    }

    //const updatedStory = await Story.findByIdAndUpdate(id, { likes: story.likes + 1 }, { new: true } );
    const updatedStory = await Story.findByIdAndUpdate(id, story, { new: true } );

    res.json(updatedStory);

}

export { getStories, createStory, updateStory, deleteStory, likeStory }