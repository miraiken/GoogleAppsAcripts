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
 * @brief concat all element as string.
 * @param args {onject} array-like object.
 */
function concat_all_as_string(args) {
    var s = "";
    for (var i = 0; i < args.length; i++) {
      s += args[i];
    }
    return s;
}
/**
 * @brief ひらがな⇒全角カタカナ, 全角英数⇒半角英数
 * @param args {string|string[]|string[][]} target string
 * @return {string|string[]|string[][]}
 */
function phonetic(args) {
  var type = decltype(args);
  switch (type) {
  case "String":
    // ひらがな⇒カタカナ
    var s = [];
    for (var i = 0; i < args.length; i++) {
      var c = args[i].charCodeAt();
      s[i] = (0x3041 <= c && c <= 0x3096) ? c + 0x0060 : c;
    }
    var katakana = String.fromCharCode.apply(null, s);
    // 全角英数⇒半角英数
    return katakana.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  case "Array":
    return function(){
      var i;
      var re = [];
      for(i = 0; i < args.length; ++i) re.push(phonetic(args[i]));
      return re;
    }();
  default:
    return "error. unexpected type.";
  }
}
function asc(args){
  var type = decltype(args);
  switch (type) {
  case "String":
    // 全角カタカナ⇒半角カタカナ
    
    //変換テーブル：2つの配列の要素数が一致しない場合空白文字が戻り値になる、かならず揃えること
    //replace_table_base:変換対象(検索)文字(wchar_t)
    //replace_table_to:置換文字(wchar_t)
    //ッ, ヮ, ワ, ヰ, ヱ, ヲ, ン, ヵ, ヶ
    var replace_table_base = [
      0x30c3, 0x30ee, 0x30ef, 0x30f0, 0x30f1, 0x30f1, 0x30f3, 0x30f5, 0x30f6
    ]
    var replace_table_to = [
      0xff6f, 0xff9c, 0xff9c, 0xff72, 0xff74, 0xff66, 0xff9d, 0xff76, 0xff79
    ]
    if(replace_table_base.length != replace_table_to.length) return "";//プログラミングミス防止
    // 変換テーブルによる変換
    for(var i = 0; i < replace_table_to.length; i++){
      args = args.replace(new RegExp(String.fromCharCode(replace_table_base[i]), "g"), String.fromCharCode(replace_table_to[i]));
    }
    
    args = args
    .replace(/ヴ/g, "ｳﾞ")
    .replace(/[ァ-オ]/g, function(s){
      var c1 = s.charCodeAt(0);
      var c2 = c1 / 2;
      if(c1 % 2){
        return String.fromCharCode(c2 + 0xe717);//小さいカナ
      }
      else{
        return String.fromCharCode(c2 + 0xe720);//普通のかな
      }
    })
    .replace(/[カ-ヂ]/g, function(s){
      var c1 = s.charCodeAt(0);
      var c2 = c1 / 2;
      if(c1 % 2){
        return String.fromCharCode(c2 + 0xe721);//無濁点
      }
      else{
        return String.fromCharCode(c2 + 0xe720, 0xff9f);//有濁点
      }
    })
    .replace(/[ツ-ド]/g, function(s){
      var c1 = s.charCodeAt(0);
      var c2 = c1 / 2;
      if(c1 % 2){
        return String.fromCharCode(c2 + 0xe720, 0xff9f);//有濁点
      }
      return String.fromCharCode(c2 + 0xe720);
    })
    .replace(/[ナ-ハ]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) + 0xcebb);
    })
    .replace(/[バ-ポ]/g, function(s){
      var c1 = s.charCodeAt(0);
      var c2 = c1 / 3;
      switch(c1 % 3){
        case 2:
          return String.fromCharCode(c2 + 0xEF45, 0xff9f);//ﾟ
        case 1:
          return String.fromCharCode(c2 + 0xEF45, 0xff9e);//ﾞ
        default:
          return String.fromCharCode(c2 + 0xEF45);
      }
    })
    .replace(/[マ-モ]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) + 0xceb1);
    })
    .replace(/[ャ-ョ]/g, function(s){
      var c1 = s.charCodeAt(0);
      var c2 = c1 / 2;
      if(c1 % 2){
        return String.fromCharCode(c2 + 0xe6fb);//小さいカナ
      }
      else{
        return String.fromCharCode(c2 + 0xe722);//普通のかな
      }
    })
    .replace(/[ヨ-ロ]/g, function(s){
      return String.fromCharCode(s.charCodeAt(0) + 0xceae);
    });
    return args;
  case "Array":
    return function(){
      var i;
      var re = [];
      for(i = 0; i < args.length; ++i) re.push(asc(args[i]));
      return re;
    }();
  default:
    return "error. unexpected type.";
  }
}
/**
 * @brief remove chars.
 * @param args {string} target string.
 * @return {string} replaced string.
 */
function remove_by_chars(args, chars){
  if(!is("string", chars)) return args;
  if(!is("string", args)) return args;
  return args.replace(new RegExp("[" + chars + "]", "g"), "");
}
