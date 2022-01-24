var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const fetch = require('node-fetch');

// const url = 'https://11jskt4u1d.execute-api.us-east-1.amazonaws.com/prod/items/';
const url ='https://2gloz1qgng.execute-api.us-east-2.amazonaws.com/prod/item'
// used to serve static files from public directory
app.use(express.static('public'));
accounts = [];
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

var data = [];
var root = path.resolve(__dirname) + '/public/';
app.get('/', (req, res) => {
    res.sendFile('block.html', {
        'root': root
    });
});
app.get('/set', function (req, res) {
    console.log(JSON.stringify(req.query));
    var record = {
        x: req.query.x,
        name: 'Sandeep'

    };
    postAllAsync(res, record).then(function (response) {
        console.log("posted data: " + JSON.stringify(record));
    }).catch((err) => {
        console.log("error:" + err);
    });
})

app.get('/pac', function (req, res) {
    res.sendFile('/PacMan' + req.query.id + '.png', {
        'root': root
    });
});
app.get('/get', function (req, res) {
    var theAccounts = getAccount(res);
    //res.send(theAccounts);
});
//   These are the workhourse calls to the AWS API
// update accounts locally
var accounts = [];
async function getAccount(res, email = "") {

    var theAccount = null;
    if (email != "") {
        var account = accounts.filter((item) => {
            if (item.email == email) return item;
        });
        if (account.length > 0) {
            theAccount = account[0];
        } else console.log("Error  - no user identified");
    }
    var urlid = url;
    if (theAccount != null) urlid = url + theAccount.itemId;
    try {
        const response = await fetch(urlid);
        const json = await response.json();
        console.log("json:" + JSON.stringify(json));
        res.send(json);
        accounts = [];
        item = json.filter(function (item) {
            accounts.push(item);
            return item.email == email;
        });
    } catch (error) {
        console.log(error);
    }
}
async function postAllAsync(res, record) {
    try {
        await fetch(url, {
            method: 'POST', // or 'PUT'
            mode: 'no-cors',
            "Access-Control-Allow-Credentials": true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        }).then((response) => {
            res.send("saved data: " + record);
        })
    } catch (error) {
        console.log(error);
    }
}
app.listen(3000);
console.log("Running on port 3000");