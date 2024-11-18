const express = require('express');
const app = express();

app.use(express.json());

let rawdataExpenses = require('../data/expenses.json');

// app.use(express.static('../public'));
app.use('/static', express.static('../public'));

//middleware logowania zapytan
app.use((req, res, next) => {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
});

//main root
app.get('/', (req, res) => {
  res.send('API Śledzenia wydatków w Express.js');
});


//wszystkie
app.get('/expenses', (req, res) => {
  res.json(rawdataExpenses);
});

app.get('/expenses/search', (req, res) => {
  const { category, maxAmount } = req.query;
  console.log("cokolwiek");
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

//jeden konkretny
app.get('/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const expense = rawdataExpenses.find(exp => exp.id === id);

  if (!expense) {
    return res.status(404).send({ error: 'Wydatek nie znaleziony' });
  }

  res.json(expense);
});

//filtrowanie



//test bledu
app.get('/expenses/error', (req, res, next) => {
  const error = new Error('Sztuczny błąd');
  next(error);
});


app.use((err, req, res, next) => {
  console.error('Wystąpił błąd:', err.message);
  res.status(500).send({
    error: 'Wystąpił błąd serwera',
    message: 'Spróbuj ponownie później',
  });
});

app.use((req, res) => {
  res.status(404).send({
    error: 'Nie znaleziono zasobu',
    message: 'Sprawdź poprawność ścieżki URL',
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
