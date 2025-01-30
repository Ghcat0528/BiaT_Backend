const express = require('express');
const app = express();
const authRoutes = require('./mow/routes/authRoutes');
const userRoutes = require('./mow/routes/userRoutes')

const PORT = 3155

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(3155, () => {
    console.log(`running on ${PORT}`)
});