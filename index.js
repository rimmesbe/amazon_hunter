var express = require('express');
var app = express();
var aws = require("./node_modules/aws-lib/lib/aws");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index', { err : " "});
});

app.get('/test', function(request, response) {
  var search = request.query.item;
  var testing;
  prodAdv = aws.createProdAdvClient(process.env.AccessKeyId, process.env.SecretAccessKey, process.env.AssociateTag);

  function doCall(callback) {
    prodAdv.call("ItemLookup", {ItemId: search, ResponseGroup: 'ItemAttributes, Images'}, function(err, result) {
      var data = result;
      callback(data);
      return;
    })
  };

  doCall(function(data){
    testing = data;
    var detailsPageUrl, mediumImageUrl, title;
    if(testing['Items']['Item']){
      detailsPageUrl = testing['Items']['Item']['DetailPageURL'];
      mediumImageUrl = testing['Items']['Item']['MediumImage']['URL'];
      title = testing['Items']['Item']['ItemAttributes']['Title'];
      // var price = testing['Items']['Item']['ItemAttributes']['ListPrice']['FormattedPrice'];
    }

    if(testing['Items']['Item']){
      response.render('pages/search', { image : mediumImageUrl, title : title, details : detailsPageUrl });
    } else {
      response.render('pages/index', { err : "search failed" });
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
