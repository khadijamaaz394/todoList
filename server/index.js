const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const TodoModel = require("./Models/Todo")

const app= express()

// log all incoming requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test')

// display todos
app.get("/get", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    // default = newest first
    const sortOrder = req.query.sort === "asc" ? 1 : -1  

    const todos = await TodoModel.find()
      .sort({ createdAt: sortOrder })   // 👈 sort based on query
      .skip(skip)
      .limit(limit)

    const total = await TodoModel.countDocuments()

    res.json({
      todos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.put('/update/:id',(req,res)=>{
    const {id}=req.params;
    const update = req.body; 
    TodoModel.findByIdAndUpdate({_id:id},update,{new:true})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

app.delete('/delete/:id',(req,res)=>{
    const {id}=req.params;
    TodoModel.findByIdAndDelete({_id:id})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
})

//cause i was getting a warning ( gpt )
app.get('/', (req, res) => {
  res.send('API is running');
});

// add task in the mongodb compass
app.post('/add',(req,res)=>{
    const task= req.body.task;
    TodoModel.create({
        task:task
    }).then(result=>res.json(result))
    .catch(err=>res.json(err))
})

// chat gpt for the console favicon error
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(3001,()=>{
    console.log("server is set on port")
}
)