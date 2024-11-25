const express = require('express');
const router = express.Router();

let rawdataExpenses = require('../data/expenses.json');

// wszystkie wydatki
router.get('/', (req, res) => {
    res.json(rawdataExpenses);
});

// filtrowanie wydatków
router.get('/search', (req, res) => {
    const { category, maxAmount } = req.query;
    let filteredExpenses = rawdataExpenses;

    if (category) {
        filteredExpenses = filteredExpenses.filter(exp =>
            exp.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (maxAmount) {
        filteredExpenses = filteredExpenses.filter(exp =>
            exp.amount <= parseFloat(maxAmount)
        );
    }

    res.json(filteredExpenses);
});

// wydatek o podanym ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const expense = rawdataExpenses.find(exp => exp.id === id);

    if (!expense) {
        return res.status(404).send({ error: 'Wydatek nie znaleziony' });
    }

    res.json(expense);
});

// ---
// CRUD
// ---




module.exports = router;
