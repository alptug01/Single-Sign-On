const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:3001/";

const fs = require("fs");

router.get("/login/success", (req, res) => {
    if (req.user) {
        const formattedUserData = {};
        for (const [key, value] of Object.entries(req.user)) {
            if (Array.isArray(value)) {
                formattedUserData[key] = value.map(item => formatItem(item));
            } else {
                formattedUserData[key] = value;
            }
        }

        fs.writeFile("userTestData.json", JSON.stringify(formattedUserData, null, 2), (err) => {
            if (err) {
                console.error("Failed to save user data:", err);
                res.status(500).json({ success: false, message: "Failed to save user data" });
            } else {
                console.log("User data saved successfully");
                res.status(200).json({ success: true, message: "User data saved successfully", user: req.user });
            }
        });
    } else {
        res.status(401).json({ success: false, message: "Authentication failed" });
    }
});


function formatItem(item) {
    if (typeof item === 'object' && item !== null) {
        const formattedItem = {};
        for (const [key, value] of Object.entries(item)) {
            formattedItem[key] = value;
        }
        return formattedItem;
    }
    return item;
}

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		success: false,
		message: "failure",
	});
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(CLIENT_URL + "login");
});

const timer = (req , res , next) => {
	const date = new Date();
	const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
	console.log(`[${time}]`);
	next();
};

router.get("/google", passport.authenticate("google", {scope: ["profile"]}), (req, res) => {
	//time
});

router.get(
	"/google/callback",timer,
	passport.authenticate("google", {
		successRedirect: CLIENT_URL,
		failureRedirect: "/login/failed",
	}),
);

router.get("/github", passport.authenticate("github", {scope: ["profile"]}));

router.get(
	"/github/callback",timer,
	passport.authenticate("github", {
		successRedirect: CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);



router.get("/discord", passport.authenticate("discord"), (req, res) => {
	res.redirect("discord/callback");
});

router.get(
	"/discord/callback",timer,
	passport.authenticate(
		"discord",
		{
			successRedirect: CLIENT_URL,
			failureRedirect: "/login/failed",
		},
	)
);

router.get("/facebook", passport.authenticate("facebook"), (req, res) => {
	res.redirect("facebook/callback");
});

router.get(
	"/facebook/callback",timer,
	passport.authenticate(
		"facebook",
		{
			successRedirect: CLIENT_URL,
			failureRedirect: "/login/failed",
		},
	)
);

module.exports = router;
