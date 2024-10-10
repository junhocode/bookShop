const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, deleteCartItem} = require('../controller/cartController')

router.use(express.json());

router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/:id', deleteCartItem);

module.exports = router