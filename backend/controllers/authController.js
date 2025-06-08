const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// A generic login function for both roles
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// A generic register function, we set role based on endpoint
const registerUser = (role) => async (req, res, next) => {
    const { name, email, password, registrationId } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            registrationId,
            role,
            // Add placeholder data for dashboards
            hostelInfo: { hostelName: 'Block C', roomNumber: '311' },
            academicInfo: { course: 'B.Tech CSE', year: '1st Year' },
            guardianInfo: { name: 'Robert Doe', contact: '+91 9876543211' }
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};


module.exports = { loginUser, registerUser };