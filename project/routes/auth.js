const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserData = require("../models/User");

const JWT_SECRET = "my_hardcoded_secret_key";

const Router = (server) => {
  // Middleware to check authentication
  server.post(
    "/api/login",
    [
      body("username", "Username is required").notEmpty(),
      body("password", "Password is required").notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      try {
        // Check if user exists
        const user = await UserData.findOne({ username });
        if (!user) {
          return res
            .status(404)
            .json({ message: "Invalid Username or Password" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: "Invalid Username or Password" });
        }

        // Generate token
        const payload = { userId: user.id, username: user.username };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "20h",
        });

        return res.status(200).json({
          token,
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          contact: user.contact,
          message: "Login successful",
        });
      } catch (err) {
        console.error("login-error", err.message);
        res.status(500).send("Server error");
      }
    }
  );

  // Register new user
  server.post(
    "/api/register",
    [
      body("username", "Username is required").notEmpty(),
      body("name", "Name is required").notEmpty(),
      body("email", "Valid email is required").isEmail(),
      body("password", "Password must be 6 characters or longer").isLength({
        min: 6,
      }),
      body("shop_name", "Shop name is required").notEmpty(),
      body("shop_address", "Shop address is required").notEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        username,
        name,
        email,
        password,
        shop_name,
        shop_address,
        contact,
      } = req.body;

      try {
        const existingUser = await UserData.findOne({
          $or: [{ email }, { username }],
        });
        if (existingUser) {
          return res.status(400).json({
            message: "User already exists with this email or username",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserData({
          username,
          name,
          email,
          password: hashedPassword,
          shop_name,
          contact,
          shop_address,
        });

        await newUser.save();

        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1h",
        });

        res.status(201).json({
          token,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          contact: newUser.contact,
          //   emp_id: `GLUTAPE${Math.floor(1000 + Math.random() * 9000)}`,
          shop_name: newUser.shop_name,
          shop_address: newUser.shop_address,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
          status: "success",
          message: "Registration successful",
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );

  // Get all users with pagination and search
  server.get("/api/users", async (req, res) => {
    const {
      username = "",
      page = 1,
      limit = 30,
      sortBy = "username",
      sortOrder = "asc",
    } = req.query;

    try {
      const query = {
        username: { $regex: username, $options: "i" },
      };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await UserData.countDocuments(query);
      const users = await UserData.find(query)
        .select("-password")
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalPages = Math.ceil(total / limit);
      const currentPage = parseInt(page);

      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      const buildUrl = (pageNum) =>
        `${baseUrl}?username=${username}&page=${pageNum}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

      res.status(200).json({
        currentPage,
        totalPages,
        totalUsers: total,
        nextPage: currentPage < totalPages ? buildUrl(currentPage + 1) : null,
        prevPage: currentPage > 1 ? buildUrl(currentPage - 1) : null,
        users: users.map((user) => ({
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          contact: user.contact,
          shop_name: user.shop_name,
          shop_address: user.shop_address,
        })),
      });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).send("Server Error");
    }
  });
};

module.exports = Router;
