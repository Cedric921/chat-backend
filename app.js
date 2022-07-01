const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', userRoutes);

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((response) => {
		console.log(`connected to mongodb server`);
	})
	.catch((error) => console.error(error));

const server = app.listen(process.env.PORT, () => {
	console.log(`server start on port ${process.env.PORT}`);
});
