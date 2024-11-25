const express = require('express');
const router = express.Router();

let rawdataExpenses = require('../data/expenses.json');

// wszystkie wydatki
/**
 * @swagger
 * /expenses:
 *   get:
 *     description: Pobierz wszystkie wydatki
 *     responses:
 *       200:
 *         description: Lista wydatków w formacie JSON.
 */
router.get('/', (req, res) => {
    res.json(rawdataExpenses);
});

// filtrowanie wydatków
/**
 * @swagger
 * /expenses/search:
 *   get:
 *     description: Wyszukaj wydatki na podstawie kategorii i/lub maksymalnej kwoty.
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Kategoria wydatku do filtrowania.
 *         required: false
 *         schema:
 *           type: string
 *           example: Jedzenie
 *       - name: maxAmount
 *         in: query
 *         description: Maksymalna kwota wydatku do filtrowania.
 *         required: false
 *         schema:
 *           type: number
 *           example: 200
 *     responses:
 *       200:
 *         description: Lista wydatków pasujących do kryteriów filtrowania.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 title: Zakupy spożywcze
 *                 category: Jedzenie
 *                 amount: 150
 *                 date: "2024-11-24"
 *               - id: 2
 *                 title: Restauracja
 *                 category: Jedzenie
 *                 amount: 100
 *                 date: "2024-11-23"
 */
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
/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     description: Pobierz szczegóły wydatku na podstawie ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID wydatku
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Szczegóły wydatku.
 *       404:
 *         description: Wydatek nie znaleziony.
 */
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

//dodawanie nowego wydatku
/**
 * @swagger
 * /expenses:
 *   post:
 *     description: Dodaj nowy wydatek.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tytuł wydatku.
 *                 example: "Nowa książka"
 *               category:
 *                 type: string
 *                 description: Kategoria wydatku.
 *                 example: "Edukacja"
 *               amount:
 *                 type: number
 *                 description: Kwota wydatku.
 *                 example: 100.0
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data wydatku.
 *                 example: "2024-11-25"
 *     responses:
 *       201:
 *         description: Nowy wydatek został dodany.
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               title: Nowa książka
 *               category: Edukacja
 *               amount: 100.0
 *               date: "2024-11-25"
 *       400:
 *         description: Brak wymaganych danych w żądaniu.
 */
router.post('/', (req, res) => {
    const { title, category, amount, date } = req.body;

    if (!title || !category || !amount || !date) {
        return res.status(400).send({ error: 'Brak wymaganych danych' });
    }

    const newExpense = {
        id: rawdataExpenses.length + 1,
        title,
        category,
        amount,
        date,
    };

    rawdataExpenses.push(newExpense);
    res.status(201).json(newExpense);
});

//aktualizowanie cale
/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     description: Zaktualizuj cały wydatek o podanym ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID wydatku do aktualizacji.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Zakupy spożywcze"
 *               category:
 *                 type: string
 *                 example: "Jedzenie"
 *               amount:
 *                 type: number
 *                 example: 200.0
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-24"
 *     responses:
 *       200:
 *         description: Zaktualizowany wydatek.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: Zakupy spożywcze
 *               category: Jedzenie
 *               amount: 200.0
 *               date: "2024-11-24"
 *       404:
 *         description: Wydatek nie został znaleziony.
 */
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = rawdataExpenses.findIndex(exp => exp.id === id);

    if (index === -1) {
        return res.status(404).send({ error: 'Wydatek nie znaleziony' });
    }

    const { title, category, amount, date } = req.body;

    rawdataExpenses[index] = { id, title, category, amount, date };
    res.json(rawdataExpenses[index]);
});

//aktualizacja danych pol
/**
 * @swagger
 * /expenses/{id}:
 *   patch:
 *     description: Zaktualizuj wybrane pola wydatku o podanym ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID wydatku do aktualizacji.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Zmiana tytułu"
 *               amount:
 *                 type: number
 *                 example: 250.0
 *     responses:
 *       200:
 *         description: Zaktualizowany wydatek.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               title: Zakupy spożywcze
 *               category: Jedzenie
 *               amount: 250.0
 *               date: "2024-11-24"
 *       404:
 *         description: Wydatek nie został znaleziony.
 */

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const expense = rawdataExpenses.find(exp => exp.id === id);

    if (!expense) {
        return res.status(404).send({ error: 'Wydatek nie znaleziony' });
    }

    const { title, category, amount, date } = req.body;

    if (title) expense.title = title;
    if (category) expense.category = category;
    if (amount) expense.amount = amount;
    if (date) expense.date = date;

    res.json(expense);
});

//usuwanie
/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     description: Usuń wydatek o podanym ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID wydatku do usunięcia.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Wydatek został usunięty.
 *       404:
 *         description: Wydatek nie został znaleziony.
 */

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = rawdataExpenses.findIndex(exp => exp.id === id);

    if (index === -1) {
        return res.status(404).send({ error: 'Wydatek nie znaleziony' });
    }

    rawdataExpenses.splice(index, 1);
    res.status(204).send();
});






module.exports = router;
