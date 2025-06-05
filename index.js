require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 1000; // Default to 3000 if PORT is not set
const HOST = process.env.HOST || "localhost"; // Default to 'localhost' if HOST is not set

app.use(express.json({ limit: "800mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [process.env.SERVER_URL],
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        maxAge: 86400
    })
);

// Define the API routes
/*---------------------------------*/
const build = path.join(__dirname, "public");
app.use(express.static(build));
app.use("/api", require("./routes/app.routes")); // Ensure this file exports a valid router
/*---------------------------------*/

// Serve the static HTML, CSS, and JS files
/*---------------------------------*/

app.get("/", (req, res) => {
    res.sendFile(path.join(build, "index.html")); // Corrected to use path.join
});

/*---------------------------------*/
// Start the Express server
app.listen(PORT, () => {
    console.log(`\n[+] Server Listening On - ${HOST}:${PORT}`);
});
