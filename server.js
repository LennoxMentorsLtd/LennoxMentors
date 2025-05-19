'use strict';

import express from 'express';

const app = express();
const port = 3030;

app.use(express.static('wwwroot', {
    index: ['index.html'],
    extensions: ['html'],
}));

app.listen(port, () => {
    console.log(`Dev server listening on port ${port}!`);
});
