const express = require('express');
const app = express();

app.use(express.json());

app.use('/static', express.static("public"));

// Middleware logowania zapytań
app.use((req, res, next) => {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

// Middleware autoryzacji
app.use('/admin', (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'secret-token') {
    return res.status(403).send({
      error: 'Dostęp zabroniony',
      message: 'Brak ważnego nagłówka Authorization',
    });
  }

  next();
});

// Import expenses.js
const expensesRouter = require('./routes/expenses');
app.use('/expenses', expensesRouter);

// main
app.get('/', (req, res) => {
  res.send('API Śledzenia wydatków w Express.js');
});

// 500
app.use((err, req, res, next) => {
  console.error('Wystąpił błąd:', err.message);
  res.status(500).send({
    error: 'Wystąpił błąd serwera',
    message: 'Spróbuj ponownie później',
  });
});

// 404
app.use((req, res) => {
  res.status(404).send({
    error: 'Nie znaleziono zasobu',
    message: 'Sprawdź poprawność ścieżki URL',
  });
});

// Start serwera
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
