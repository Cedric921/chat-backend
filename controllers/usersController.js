const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
	try {
		//get user information
		const { username, email, password } = req.body;

		// check if username or email exist
		const usernameCheck = await User.findOne({ username });
		const emailCheck = await User.findOne({ email });
		if (usernameCheck)
			return res.json({ msg: 'Username already used', status: false });
		if (emailCheck)
			return res.json({ msg: 'Email already used', status: false });

		//cryp the password
		const hashedPassword = await bcrypt.hash(password, 12);

		//
		const user = await User.create({
			email,
			username,
			password: hashedPassword,
		});
		delete user.password;

		return res.json({ status: true, user });
	} catch (error) {
		next(error);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		//get user information
		const { username, password } = req.body;

		// check if username or email exist
		const user = await User.findOne({ username });
		if (!user)
			return res.json({
				msg: 'Incorrect username or password ',
				status: false,
			});
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid)
			return res.json({
				msg: 'Incorrect username or password ',
				status: false,
			});
		delete user.password;
		return res.json({ status: true, user });
	} catch (error) {
		next(error);
	}
};

module.exports.setAvatar = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const avatarImage = req.body.image;
		const userData = await User.findByIdAndUpdate(userId, {
			isAvatarImageSet: true,
			avatarImage,
		});
		return res.json({
			isSet: userData.isAvatarImageSet,
			image: userData.avatarImage,
		});
	} catch (error) {
		next(error);
	}
};
module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ _id: { $ne: req.params.id } }).select([
			'email',
			'username',
			'avatarImage',
			'_id',
		]);
		return res.json(users);
	} catch (error) {
		next(error);
	}
};
