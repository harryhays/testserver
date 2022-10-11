'use strict';


// A regular expression returns an empty string if nothing is found // eg: '12345'.mtch(/1(2)3/, 1); // 2
String.prototype.mtch = function (reg, parentheses, o) { // parentheses: Number of parentheses, default is "0"
    let s = this;
    parentheses = parentheses || 0;
    if (typeof s === 'number') s = s.toString();
    if (typeof s === 'object') s = '';
    let a = s.match(reg);
    s = a ? a[parentheses] : '';
    if (o === undefined) return s;
    else return evl(s, o, reg);

};
String.prototype.evl = function (o = {er: false}) {
    let s = this;
    o.parse = o.parse || true;
    if (typeof s === 'number') s = s.toString();
    if (typeof s === 'object') s = '';
    return evl(s, o);
};
function evl(s, o, reg = '') {
    if (o.parse) {
        try { s = eval('(' + s + ')')} catch (e) { s = ''}
    }
    if (!o.er || s !== '') return s;

    if (o.msg !== undefined) var eMsg = o.msg;
    else {
        eMsg = reg.toString();
        if (typeof o.er === 'string') eMsg = eMsg += ' ' + o.er;
        eMsg = eMsg.trim() ? '\n\n Parsing error: ' + eMsg : '\n\n Parsing error';
    }


    if (typeof o.er === 'function') o.er(eMsg);
    else {
        console.log('\n' + eMsg);
        process.exit();
    }
}
// ..............................................................................................................

// убирает из строки по регулярному выражению
String.prototype.rm = function (...a) {
    let s = this;
    for (let reg of a) s = s.replace(reg, '').trim();
    return s;
};



















