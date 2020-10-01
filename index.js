const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://lha5:rgdd0207gg@boilerplate.f1r3z.mongodb.net/boilerplate?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB is connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})