/*! (c) 2014-2016 みらい研究室実行委員会
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
 * @brief calcurate summary if `range[i][0]` include `cond_str`.
 * @param {any} range
 * @param {any} cond_str
 * @returns {numbers}
 */
function sumif_include(range, cond_str) {
  if(Array.isArray(range) && 2 === range[0].length && Array.isArray(range[0]) && is("String",  range[0][0]) && is("Number", range[0][1]) && is("String", cond_str)){
    var i;
    var re = 0;
    for(i = 0; i < range.length; ++i){
      if(2 !== range[i].length || !is("String", range[i][0]) || !is("Number", range[i][1])) continue;
      if(-1 !== range[i][0].indexOf(cond_str)) re += range[i][1];
    }
    return re;
  }
  else{
    throw new TypeError("unexpected input. range:" + decltype(range));
  }
}