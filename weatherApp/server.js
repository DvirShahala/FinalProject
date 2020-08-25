const express = require('express');
const app = express();

app.use(express.static('./dist/weatherApp'));
app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: './dist/weatherApp' }
    );
});

app.listen(process.env.PORT || 8080);