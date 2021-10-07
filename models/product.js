const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
})

module.exports = mongoose.model('Product', productSchema)
