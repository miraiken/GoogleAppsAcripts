/*! (c) 2014-2017 みらい研究室実行委員会
* Released under the MIT license.
*/
/**
 * @brief detect type.
 * @param obj {any} target variable
 * @return {string}
 */
function decltype(obj){
    return (typeof(obj) === "undefined") ? "undefined" : Object.prototype.toString.call(obj).slice(8, -1);
}
/**
 * @brief check type.
 * @param type {string} typename(String,Number,Boolean,Date,Error,Array,Function,RegExp,Object, ...)
 * @param obj {any} target variable
 * @return {boolean}

 */
function is(type, obj) {
    return obj !== undefined && obj !== null && decltype(obj) === type;
}
/**
 * @brief normalize phone number.
 * @param args {string|string[]|string[][]} base string(s).
 * @return {string|string[]|string[][]} normalized string(s).
 */
function normalize_phone_number(args){
  switch(decltype(args)){
  case "String":
    if(0 === args.length) return "";
    var re = args
    .replace(/[- ー－]/g, "")
    // 全角英数⇒半角英数
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    //必要なら先頭に'0'を追加
    switch(re.length){
    case 10:
      if(re.charCodeAt(0) < "7" || '9' < re.charCodeAt(0)) break;
      /* FALLTHROUGH */
    case 9:
      re = ('0' != re.charCodeAt(0)) ? "0" : "" + re;
      break;
    default:
      return "error. unknown length.";
    }
    return re;
  case "Number":
    return "0" + args.toString(10);
  case "Array":
    return function(){
      var i;
      var re = [];
      for(i = 0; i < args.length; ++i) re.push(normalize_phone_number(args[i]));
      return re;
    }();
  default:
    return "unsupported type.";
  }
}