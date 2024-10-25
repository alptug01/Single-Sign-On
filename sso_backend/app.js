const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const dotenv = require("dotenv");
const passportSetup = require("./passport");
dotenv.config();

app.use(
    cookieSession({name: "session", keys: ["alp"], maxAge: 24 * 60 * 60 * 100})
);


app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: ["http://localhost:3001"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

app.use("/auth", authRoute);
app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen("3000", () => {
    console.log("Server is running!");
});