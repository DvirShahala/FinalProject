const express = require('express');
const app = express();

app.use(express.static('./weatherApp/dist/weather-app'));
app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: 'weatherApp/dist/weather-app' }
    );
});

app.listen(process.env.PORT || 8080);
