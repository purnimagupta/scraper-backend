function convertStrToObj(str){
  var obj = {};
  if(str&&typeof str ==='string'){
      var objStr = str.match(/\{(.)+\}/g);
      eval("obj ="+objStr);
  }
  return obj
}

module.exports = convertStrToObj