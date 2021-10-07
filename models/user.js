const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},
	],
})

module.exports = mongoose.model('User', userSchema)
