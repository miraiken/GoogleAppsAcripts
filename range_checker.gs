/*! (c) 2014-2016 みらい研究室実行委員会
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
function list_missing_num(numbers, min, max) {
  if(Array.isArray(numbers) && ((Array.isArray(numbers[0]) && is("Number",  numbers[0][0])) || is("Number",  numbers[0])) && is("Number", min) && is("Number", max)){
    var arr = [];
    var i;
    var j;
    for(i = 0; i < numbers.length; ++i) if(is("Number",  numbers[0])){
      arr.push(numbers[i]);
    }
    else{
      for(j = 0; j < numbers[i].length; ++j) arr.push(numbers[i][j]);
    }
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
function list_duplicate_num(numbers) {
  if(Array.isArray(numbers) && Array.isArray(numbers[0]) && is("Number",  numbers[0][0])){
    var re = [];
    var i;
    var j;
    for(i = 0; i < numbers.length; ++i) for(j = 0; j < numbers[i].length; ++j) re.push(numbers[i][j]);
    re.sort(function(a, b){ return a- b; });
    //重複のみをリスト
    //http://qiita.com/cocottejs/items/7afe6d5f27ee7c36c61f
    re = re.filter(function (x, i, self) {
      return self.indexOf(x) !== self.lastIndexOf(x);
    });
    return (re.length === 0) ? "nothing" : re.join();
  }
  else{
    throw new TypeError("unexpected input. numbers:" + decltype(numbers));
  }
}
function testf(){
  var f = function(expression_statements, correct){ 
    var re = eval(expression_statements);
    if(re !== correct){
      jsdiff.diffChars(re, correct).forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var color = part.added ? "green" :
          part.removed ? "red" : "grey";
        process.stderr.write(part.value[color]);
      });
    }
  };
  f("list_missing_num([1, 2, 3], 1, 3)", "nothing");
  f("list_missing_num([1, 3, 4], 1, 4)", "2");
  f("list_missing_num([3, 4, 8, 11], 1, 12)", "1,2,5,6,7,9,10,12");
}
testf();
console.log("pass.");
