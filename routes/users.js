const express = require('express')
const router = express.Router()
const UserModel = require('../models/user')
// Get all
router.get('/', async (req, res) => {
	try {
		const users = await UserModel.find()
		res.json(users)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})
// Get One
router.get('/:id', getUser, (req, res) => {
	res.json(res.user)
})
// Create One
router.post('/', async (req, res) => {
	const user = new UserModel({
		username: req.body.username,
		password: req.body.password,
	})
	try {
		const newUser = await user.save()
		res.status(201).json(newUser)
	} catch (e) {
		res.status(400).json({ message: e.message })
	}
})
// Update One
router.patch('/:id', getUser, async (req, res) => {
	if (req.body.username != null) {
		res.user.username = req.body.username
	}
	if (req.body.password != null) {
		res.user.password = req.body.password
	}
	try {
		const updatedUser = await res.user.save()
		res.json(updatedUser)
	} catch (e) {
		res.status(400).json({ message: e.message })
	}
})
// Delete one
router.delete('/:id', getUser, async (req, res) => {
	try {
		await res.user.remove()
		res.json({ message: 'User deleted' })
	} catch (e) {}
})

async function getUser(req, res, next) {
	let user
	try {
		user = await UserModel.findById(req.params.id)
		if (user == null) {
			return res.status(404).json({ message: 'Cannot find user' })
		}
	} catch (e) {
		return res.status(500).json({ message: e.message })
	}
	res.user = user
	next()
}

module.exports = router
