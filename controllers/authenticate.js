const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userModel = require("../model/userModel");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

// Middleware for user authentication
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate the request body
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the admin with the given email already exists
    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "Admin with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const adminUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin registered", adminUser);

    res
      .status(201)
      .json({ message: "Admin registered successfully", adminUser });
  } catch (e) {
    console.error("Error registering admin", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await userModel.findOne({ email });

    if (!adminUser) return res.status(400).json("Invalid user or password");

    const isValidPassword = await bcrypt.compare(password, adminUser.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid user or password");

    const token = createToken(adminUser._id);

    if (!token) return res.status(500).json("Error creating token");

    return res.status(200).json({
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      token,
    });
  } catch (e) {
    return res.status(400).json("Error occurred", e);
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(400).json("User already exists");

    if (!name || !email || !password)
      return res.status(400).json("All fields are required");

    if (!validator.isEmail(email))
      return res.status(400).json("Enter a valid email");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Enter a strong password");

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new userModel({ name, email, password: hashedPassword });

    await user.save();

    // Generate token
    const token = createToken(user); // You need to implement this function

    res.status(201).json({ token }); // Return the token to the client
  } catch (e) {
    res.status(500).json("Something unexpected occurred");
    console.log(e);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.status(400).json("Invalid password");

    const token = createToken(user._id);

    if (!token) return res.status(500).json("Error creating token");

    res.status(200).json({
      id: user._id,
      name: user.name,
      email,
      token,
    });
  } catch (e) {
    res.status(500).json("Something unexpected happened");
    console.log(e);
  }
};

module.exports = {
  authenticateUser,
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
};
