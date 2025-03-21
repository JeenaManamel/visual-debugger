const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the directory containing Program.cs
app.use(express.static('C:/Users/jeena/SeleniumSetup/MyConsoleApp'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
