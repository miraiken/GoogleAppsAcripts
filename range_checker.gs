/*! (c) 2014-2017 みらい研究室実行委員会
* Released under the MIT license.
*/
require("colors");
var jsdiff = require("diff");
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
 * @brief convert 2d-array to 1d-array.
 * @param {numbers[]|numbers[][]} range
 * @returns {numbers[]}
 */
function range2array(range){
  if(!Array.isArray(range)) throw new TypeError("unexpected input. range:" + decltype(range));
  switch(decltype(range[0])){
  case "Number":
    return range;
  case "String":
    return range.map(function(e){ return parseInt(e, 10); });
  case "Array":
    switch(decltype(range[0][0])){
    case "Number":
      return function(){
        var arr = [];
        var i;
        var l = range.length;
        for(i = 0; i < l; ++i) arr.push.apply(arr, range[i]);
        return arr;
      }();
    case "String":
      return function(){
        var arr = [];
        var i;
        var l = range.length;
        for(i = 0; i < l; ++i) arr.push.apply(arr, range[i].map(function(e){ return parseInt(e, 10); }));
        return arr;
      }();
    default:
      throw new TypeError(
        "unexpected input. range:" + decltype(range)
         + " range[0]:" + decltype(range[0])
         + " range[0][0]:" + decltype(range[0][0])
      );
    }
  default:
      throw new TypeError(
        "unexpected input. range:" + decltype(range)
         + " range[0]:" + decltype(range[0])
      );
  }
}
/**
 * @brief check range and list-up missing numbers.
 * @param {numbers[]|numbers[][]|string[]|string[][]} numbers investigate target.
 * @param {numbers} min
 * @param {numbers} max
 * @returns {string} missing numbers string(separated ,).
 */
function list_missing_num(numbers, min, max) {
  if(
    Array.isArray(numbers) && is("Number", min) && is("Number", max) && (
      (Array.isArray(numbers[0]) && (is("Number",  numbers[0][0]) || is("String",  numbers[0][0])))
      || is("Number",  numbers[0]) || is("String",  numbers[0])
    )
  ){
    var arr = range2array(numbers);
    var i;
    var j;
    arr.sort(function(a, b){ return a- b; });
    //重複を弾く
    //http://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
    arr = arr.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    var re = [];
    var push_back = function(min, max){
      for(var i = min; i <= max; ++i) re.push(i);
    };
    if(arr[arr.length - 1] < min || max < arr[0]) {
      return Array(max - min + 1).fill(0).map(function(_,i){ return i + min; }).join();
    }
    for(i = 0; arr[i] < min; ++i);//skip
    for(j = min; i < arr.length && arr[i] <= max; j = arr[i] + 1, ++i) {
      if(0 !== arr[i] - j){
        push_back(j, arr[i] - 1);
      }
    }
    push_back(arr[i - 1] + 1, max);
    return (re.length === 0) ? "nothing" : re.join();
  }
  else{
    throw new TypeError("unexpected input. numbers:" + decltype(numbers) + " min:" + decltype(min) + " max:" + decltype(max));
  }
}
/**
 * @brief check range and list-up duplicated numbers.
 * @param {numbers[]|numbers[][]} numbers investigate target.
 * @returns
 */
function list_duplicate_num(numbers) {
  if(
    Array.isArray(numbers) && (
      (Array.isArray(numbers[0]) && (is("Number",  numbers[0][0]) || is("String",  numbers[0][0])))
      || is("Number",  numbers[0]) || is("String",  numbers[0])
    )
  ){
    var re = range2array(numbers);
    re.sort(function(a, b){ return a- b; });
    //重複のみをリスト
    //http://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
    re = re.filter(function (x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });
    return (re.length === 0) ? "nothing" : re.join();
  }
  else{
    throw new TypeError("unexpected input. numbers:" + decltype(numbers));
  }
}
/**
 *
 * @callback JudgeCallback
 * @param {string} param
 * @return {boolean}
 */
/**
 * @brief check 2*n range and list-up when `cond_f` return true.
 * @param {object[][]} params An array of pair of number and string.
 * @param {JudgeCallback} cond_f A function whether list-up or not.
 * @return {numbers[]}
 */
function list_if(params, cond_f) {
  if(Array.isArray(params) && 2 === params[0].length && Array.isArray(params[0]) && is("Number",  params[0][0]) && is("String", params[0][1]) && is("Function", cond_f)){
    var i;
    var re = [];
    for(i = 0; i < params.length; ++i){
      if(!is("Number", params[i][0]) || !is("String", params[i][1]) || 2 !== params[i].length){
        throw new TypeError("unexpected input. params[" + i + "][0]:" + decltype(params[i][0]) + " params[" + i + "][1]:" + decltype(params[i][1]));
      }
      if(cond_f(params[i][1])) re.push(params[i][0]);
    }
    return re;
  }
  else{
    throw new TypeError("unexpected input. params:" + decltype(params));
  }
}
/**
 * @brief check 2*n range and list-up when `params[i][1]` is equal to `check_string`.
 * @param {object[][]} params
 * @param {string} check_string
 * @returns
 */
function list_if_equal(params, check_string){
  return list_if(params, function(s){ return s === check_string; });
}
function testf(){
  var f = function(expression_statements, correct){
    console.log(expression_statements);
    var re = eval(expression_statements);
    if(re !== correct){
      console.log("fail:");
      jsdiff.diffChars(re, correct).forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var color = part.added ? "green" :
          part.removed ? "red" : "grey";
        process.stderr.write(part.value[color]);
      });
      process.stderr.write("\n");
    }else{
      console.log("pass.");
    }
  };
  f("list_missing_num([1, 2, 3], 1, 3)", "nothing");
  f("list_missing_num([1, 3, 4], 1, 4)", "2");
  f("list_missing_num([1, 3, 4], 5, 6)", "5,6");
  f("list_missing_num([3, 4, 8, 11], 1, 12)", "1,2,5,6,7,9,10,12");
  f("list_missing_num([3, 4, 8, 11, 13], 1, 12)", "1,2,5,6,7,9,10,12");
  f("list_missing_num([3, 4, 8, 11, 13, 14, 15, 17, 18, 19, 20, 21, 23, 16, 15, 24, 32, 27], 1, 33)", "1,2,5,6,7,9,10,12,22,25,26,28,29,30,31,33");
}
testf();
