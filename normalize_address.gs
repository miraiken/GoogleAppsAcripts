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
function remove_prefectures_name(str){
	if(is("String", str)) return "error: unexpected input.";
	var buf = "";
	var tmp = str.charCodeAt(2);
	if("道".charCodeAt(0) === tmp || "都".charCodeAt(0) === tmp || "府".charCodeAt(0) === tmp || "県".charCodeAt(0) === tmp){
		buf = str.slice(3);
	}
	else if("県".charCodeAt(0) === str.charCodeAt(3)){
		buf = str.slice(4);
	}
	return (buf.length === 0) ? str : buf;
}
function match_in_array(arr, str){
	var is_matched = false;
	for(var i = 0; !is_matched && i< arr.length; ++i){
		is_matched = (arr[i] === str);
	}
	return is_matched;
}
function add_City(str){
	var case_do_not_add_City = ["市", "区", "町", "村", "県", "都", "道", "府", "県"];
	return (match_in_array(case_do_not_add_City, str.slice(-1))) ? str : str + "市";
}
function normalize_adress_helper(main_input, case1_input, case4_input){
	if(!is("String", main_input) || !is("String", case1_input) || !is("String", case4_input)){
		throw new TypeError("main_input(type:" + typeof main_input + ")unexpected input.");
	}
	var re = "";
	switch(main_input){
	case "1.東京23区内":
		re = (case1_input === "無記入" || case1_input === "") ? "無記入" : "1-" + case1_input + "区";
	break;
	case "4.その他":
		var do_not_edit = ["アメリカ", "韓国", "korea"];
		re = (case4_input === "無記入" || case4_input === "") ? "無記入" :  (match_in_array(do_not_edit, case4_input)) ? case4_input : add_City(remove_prefectures_name(case4_input));
	break;
	default:
		re = main_input;
	}
	return re;
}
function normalize_adress(main_input, case1_input, case4_input){
	if(!is("String", main_input) || !is("String", case1_input) || !is("String", case4_input)){
		return normalize_adress_helper(main_input, case1_input, case4_input);
	}
	else if(Array.isArray(main_input) && Array.isArray(case1_input) && Array.isArray(case4_input) && main_input.length == case1_input.length && case1_input.length == case4_input.length){
		var re = [];
		for(var i = 0; i < main_input.length; ++i){
			re.push(normalize_adress_helper(main_input[i][0], case1_input[i][0], case4_input[i][0]));
            // Logger.log(decltype(main_input) + decltype(main_input[0]));
		}
		return re;
	}
	else{
		throw new TypeError("main_input(type:" + typeof main_input + ")unexpected input.");
	}
}