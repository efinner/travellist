const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = async () => {
    const client = await getConnectedClient(); // Await here to get the actual client
    const collection = client.db("traveldb").collection("todos");
    return collection;
};

// GET /todos
router.get("/todos", async (req, res) => {
    try {
        const collection = await getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    try {
        const collection = await getCollection(); 
        let { todo } = req.body;

        if (!todo) {
            return res.status(400).json({ message: "No todo found in the request body" });
        }

        todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

        const newTodo = await collection.insertOne({ todo, status: false });
        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    try {
        const collection = await getCollection();
        const _id = new ObjectId(req.params.id);

        const deleteResult = await collection.deleteOne({ _id });

        if (deleteResult.deletedCount === 1) {
            
            res.status(200).json({ acknowledged: true, deletedTodoId: req.params.id });
        } else {
            
            res.status(404).json({ acknowledged: false, error: "Todo not found" });
        }
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ acknowledged: false, error: "Internal server error" });
    }
});


// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = await getCollection(); 
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({ mssg: "invalid status"})
        }
        const updatedTodo = await collection.updateOne(
            { _id },
            { $set: { status: !status } }
        );

        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
