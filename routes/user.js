const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  authenticateUser,
} = require("../controllers/authenticate");

const { ensureAuthenticated } = require("../middleware/middleware");
const router = express.Router();

router.post("/registerAdmin", async (req, res) => {
  try {
    await registerAdmin(req, res);
  } catch (error) {
    console.error("Error in registerAdmin route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/loginAdmin", async (req, res) => {
  try {
    await loginAdmin(req, res);
  } catch (error) {
    console.error("Error in loginAdmin route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/registerUser", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error in registerUser route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/loginUser", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Error in loginUser route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user/authenticate", ensureAuthenticated, authenticateUser);

module.exports = router;
