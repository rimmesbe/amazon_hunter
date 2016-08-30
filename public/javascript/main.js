var aws = require("../../node_modules/aws-lib/lib/aws");

$(document).ready(function(){
  prodAdv = aws.createProdAdvClient(AccessKeyId, SecretAccessKey, AssociateTag);
  $('form').submit(function(e){
    e.preventDefault();
    console.log("???"+AccessKeyId);
    var text = $(this).val();
    prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: text}, function(err, result) {
      console.log(JSON.stringify(result));
    })
  });
});