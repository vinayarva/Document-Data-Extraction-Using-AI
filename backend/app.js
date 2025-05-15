const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const route = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use(route);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
