var axios = require('axios');
var data = JSON.stringify({
    "collection": "users",
    "database": "cardata",
    "dataSource": "Cluster0",
    "filter": { "_id": "6200b895b9464e1f48f39262" }
});
            
var config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-yompt/endpoint/data/beta/action/findOne',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': 'h2g64nouASdDZRimVPkwuoe9KbeM7hcDh7XLK6pq91KiSHAfarpi6o5h3iqW3pen'
    },
    data : data
};
            
axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
