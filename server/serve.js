const port = process.argv.length > 2 ? parseInt(process.argv[2]) : 3001;
const express = require("express");
const app = express();
app.use(express.static("./public"));
app.listen(port, function () {
    console.log(`Listening on port "${port}"`);
});