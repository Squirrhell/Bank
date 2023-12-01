const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

class UserController {
    static async register(req, res) {
        const { firstName, lastName, email, password } = req.body;

        try {
            const userEmailExist = await User.findOne({ email });
            if (userEmailExist) return res.status(400).json({ success: false, message: 'Email already exist' });
    
            if (firstName.length < 3 || firstName.length > 20) return res.status(400).json({ success: false, message: 'First name must be between 3 and 20 characters' });
            if (lastName.length < 3 || lastName.length > 20) return res.status(400).json({ success: false, message: 'Last name must be at least 3 characters and maximum 20 characters' });     
            
            if (password.length < 6 || password.length > 20) return res.status(400).json({ success: false, message: 'Password must be between 6 and 20 characters' });
    
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email' });
    
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
    
            const user = new User({
                firstName,
                lastName,
                email,
                encryptedPassword,
            });
            
            await user.save();

            res.status(201).json({ success: true, message: 'User created' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    
            const validPassword = await bcrypt.compare(password, user.encryptedPassword);
            if (!validPassword) return res.status(400).json({ success: false, message: 'Invalid email or password' });
    
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    
            res.status(200).json({ success: true, message: 'Logged in', token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async me(req, res) {
        const { user } = req;

        try {

            const userData = await User.findById(user._id);

            const { encryptedPassword, ...data } = userData._doc;

            res.status(200).json({ success: true, message: 'User found', user: data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { firstName, lastName, email, role, money, isShop, isActive } = req.body;

        try {
            const user_target = await User.findById(id);

            if (!user_target) return res.status(404).json({ success: false, message: 'User not found' });

            if(firstName) user_target.firstName = firstName;
            if(lastName) user_target.lastName = lastName;
            if(email) user_target.email = email;
            if(role) user_target.role = role;
            if(money) user_target.money = money;
            if(isShop) user_target.isShop = isShop;
            if(isActive) user_target.isActive = isActive;

            await user_target.save();

            res.status(200).json({ success: true, message: 'User updated', user_target });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async destroy(req, res) {
        const { id } = req.params;

        try {
            const user_target = await User.findById(id);

            if (!user_target) return res.status(404).json({ success: false, message: 'User not found' });

            await user_target.remove();

            res.status(200).json({ success: true, message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = UserController;