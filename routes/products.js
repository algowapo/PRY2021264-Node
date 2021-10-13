const express = require('express')
const router = express.Router()
const ProductModel = require('../models/product')
const UserModel = require('../models/user')

// Get all
router.get('/:userId/products', async (req, res) => {
	try {
		const productsObject = await getProductsByUserId(req.params.userId)
		res.json(productsObject)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
})

// Create One
router.post('/:userId/products', async (req, res) => {
	const product = new ProductModel({
		name: req.body.name,
		price: req.body.price,
		color: req.body.color,
		date: req.body.date,
	})
	try {
		let user = await getUserByUserId(req.params.userId)
		let newProduct = await createProduct(user._id, product)
		res.status(201).json(newProduct)
	} catch (e) {
		res.status(400).json({ message: e.message })
	}
})

// Get One
router.get('/:userId/products/:id', getProduct, (req, res) => {
	res.json(res.product)
})

// Update One
router.patch('/:userId/products/:id', getProduct, async (req, res) => {
	if (req.body.name != null) {
		res.product.name = req.body.name
	}
	if (req.body.price != null) {
		res.product.price = req.body.price
	}
	if (req.body.color != null) {
		res.product.color = req.body.color
	}
	if (req.body.date != null) {
		res.product.date = req.body.date
	}
	try {
		const updatedProduct = await res.product.save()
		res.json(updatedProduct)
	} catch (e) {
		res.status(400).json({ message: e.message })
	}
})

// Update ALL
router.patch('/:userId/products/', async (req, res) => {
	let productsObject = await getProductsByUserId(req.params.userId)
	let products = productsObject.products
	for (let i = 0; i < products.length; i++) {
		const product = products[i]
		try {
			await ProductModel.findByIdAndUpdate(product._id, {
				name: req.body.name,
				price: req.body.price,
				color: req.body.color,
				date: req.body.date,
			})
		} catch (e) {
			res.status(400).json({ message: e.message })
		}
	}
	res.json(req.body)
})

// Delete one
router.delete('/:userId/products/:id', async (req, res) => {
	UserModel.findByIdAndUpdate(
		req.params.userId,
		{
			$pull: {
				products: req.params.id,
			},
		},
		function (err, model) {
			if (!err) {
				ProductModel.findByIdAndRemove({ _id: req.params.id }, (err) => {
					if (err) res.json(err)
					else res.json('Succesfully removed product')
				})
			} else {
				res.status(500).json(err)
			}
		}
	)
})

// Delete all by userId
router.delete('/:userId/products', async (req, res) => {
	const productsObject = await getProductsByUserId(req.params.userId)
	let products = productsObject.products
	let indexes = []
	if (products) {
		for (let i = 0; i < products.length; i++) {
			indexes.push(products[i]._id)
		}
	}
	try {
		await UserModel.findByIdAndUpdate(req.params.userId, {
			products: [],
		})
	} catch (e) {
		res.json(e)
	}
	try {
		for (let i = 0; i < indexes.length; i++) {
			ProductModel.findByIdAndRemove({ _id: indexes[i] }, (err) => {
				if (err) res.json(err)
			})
		}
	} catch (e) {
		res.json(e)
	}
	res.json('Succesfully removed all products')
})

// Create Many
router.post('/:userId/massive', async (req, res) => {
	let createdProducts = []
	for (const productRequest of req.body) {
		const product = new ProductModel({
			name: productRequest.name,
			price: productRequest.price,
			color: productRequest.color,
			date: productRequest.date,
		})
		try {
			let newProduct = await createProduct(req.params.userId, product)
			createdProducts.push(newProduct)
		} catch (e) {
			console.error(e)
		}
	}
	res.status(201).json(createdProducts)
})

async function getUserByUserId(userId) {
	let user
	try {
		user = await UserModel.findById(userId)
		if (user == null) {
			return null
		}
	} catch (e) {
		return null
	}
	return user
}

const createProduct = async function (userId, product) {
	let newProduct = await ProductModel.create(product).then(
		async (docProduct) => {
			await UserModel.findByIdAndUpdate(
				userId,
				{ $push: { products: docProduct._id } },
				{ new: true, useFindAndModify: false }
			)
			return docProduct
		}
	)
	return newProduct
}

async function getProduct(req, res, next) {
	let product
	try {
		product = await ProductModel.findById(req.params.id)
		if (product == null) {
			return res.status(404).json({ message: 'Cannot find product' })
		}
	} catch (e) {
		return res.status(500).json({ message: e.message })
	}
	res.product = product
	next()
}

const getProductsByUserId = function (userId) {
	return UserModel.findById(userId).populate('products')
}

module.exports = router
