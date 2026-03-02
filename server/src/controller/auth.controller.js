const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");

async function register(req, res) {
    const { username, email, password } = req.body;
    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if(existingUser){
        return res.status(400).json({message: 'User already exists'})
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = generateToken(user._id);
        res.cookie("token", token, {httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.status(201).json({message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email }})
    } catch(err){
        res.status(500).json({message: 'Error registering user', error: err.message})
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
        return res.status(400).json({message: 'Invalid credentials'})
    }
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
        return res.status(400).json({message: 'Invalid credentials'})
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({message: 'Login successful'})
}

module.exports = { register, login }
