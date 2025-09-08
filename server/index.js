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

// to get the todo displayed on the website 
app.get('/get',(req,res)=>{
    TodoModel.find()
    .then(result=> res.send(result))
    .catch(err=> res.json(err))
})

//to update i.e check the task once it is completed
app.put('/update/:id',(req,res)=>{
    const {id}=req.params;
    const update = req.body;  // can contain {done: true/false} or {task: "..."}

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