function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var half = stars.toString().substring(1,2);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  if(half=="5"){
    array.splice(num, 1, 2)
  }else{
    array = array
  }
  return array;
}
function http(url, callback) {
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    header: {
      'content-type': 'json' // 默认值
    },
    success: function (res) {
      callback(res.data)
    }
  })
}


function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}


module.exports={
  convertToStarsArray: convertToStarsArray,
  http:http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}

