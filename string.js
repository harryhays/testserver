'use strict';
// var s = this.valueOf();

// ***************************************************************************************************************

// any whitespace characters and newline \n
String.prototype.noSpace = function () { // any whitespace characters and newline \n
    return this.replace(/\s+/g, ' ').trim();
};
// ..............................................................................................................

// .trimC  removes commas and spaces at the edges
String.prototype.trimC = function () {
    return this.replace(/(^[,\s]+)|([,\s]+$)/g, '');
};

// ..............................................................................................................

String.prototype.rBR = function (sInsteadBR = ', ') { //  replace <br>
    return this.replace(/\s*<br>\s*/g, sInsteadBR).replace(/\s+/g, ' ').trim();
};
// ..............................................................................................................

var striptags = require('striptags'); // .noTag
String.prototype.noTag = function () { return striptags(this.replace(/<br/g, ' <br')) };

// ..............................................................................................................

var Entities = require('html-entities').AllHtmlEntities; // .noEnti   &nbsp;
var entities = new Entities();
String.prototype.noEnti = function () {return entities.decode(this)};

// ..............................................................................................................

String.prototype.norm = function () {  // after .html .htm;
    let s = this.replace(/<br/g, ' <br');
    s = striptags(s);
    s = entities.decode(s);
    return s.replace(/\s+/g, ' ').trim();
};
Number.prototype.norm = function () {return this};

// ..............................................................................................................

String.prototype.zero = function (n) { return this.padStart(n, '0')}; // n =  total number of digits in a row
Number.prototype.zero = function (n) { return this.toString().padStart(n, '0')};

// ..............................................................................................................
String.prototype.isNmb = function () { return /^\d[\d,.]*$/.test(this) };
String.prototype.toNmb = function () { return parseFloat(this.replace(/,/g, '')) }; // string to Number
// ..............................................................................................................

Array.prototype.psh = function (z) { // clean chi-object
    this.push(JSON.parse(JSON.stringify(z)))
};
Array.prototype.unshft = function (z) { // clean chi-object
    this.unshift(JSON.parse(JSON.stringify(z)))
};

// ..............................................................................................................


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

// убирает первый символ из строки, по умолчанию это доллар.
String.prototype.rem$ = function (c = '\\$') { // $€£
    let reg = new RegExp(String.raw`^${c}`, 'i');
    return this.replace(reg, '').trim();
};

String.prototype.remDot = function () {
    return this.replace(/^\./g, '').trim();
};
String.prototype.remYr = function () {
    return this.replace(/\s*\/\s*yr$/g, '');
};
// ..............................................................................................................

Number.prototype.toPrice = function (years) {
    let price = this;
    if (years !== undefined) {
        let y = yersToNmb(years);
        if (y === 0) return 'toPrice: wrong parameter: ' + years;
        price = (price / y);
    }
    return price.toFixed(2);
};

String.prototype.toPrice = function (years, nocheck) {
    if (nocheck && years == 1) return this;
    let price = this.replace(/,/g, '');
    if (!/^\d+$/.test(price.replace('.', ''))) return this;
    price = Number(price);
    return (isNaN(price) ? this : price.toPrice(years)); // call Number.prototype.toPrice
};

function yersToNmb(years) {
    if (typeof years === 'number' && !isNaN(years)) return years;
    if (typeof years !== 'string') return 0;
    if (!/^\d+$/.test(years)) return 0;
    return Number(years);
}
// -------------------------------------------------
String.prototype.isPrice = function (xIgnoreCommas) {
    if (xIgnoreCommas || !this.includes(',')) return /^\d+\.\d{2}$/.test(this.replace(/,/g, ''));
    let a = this.match(/^\d{1,3}(,\d{3})+\.\d{2}$/) || [1]; // 1.length === undefined
    return this.length === a[0].length;
};
// ..............................................................................................................

String.prototype.isCurr = function () {
    return /^[A-Z]{3}$/.test(this);
};
// ..............................................................................................................


// ***************************** Глобальные функции ***********************************************************************
// добавляет значение в массив, если массива нет, создает его и добавляет туда значение
// параметры: объект, его ключ, значениеДобавляемоеВмассив (ключБудетСоздаенЕслиЕгоНетИемуБудетПрисовенМассив)
global.gfPush = function (o, key, val) {
    Array.isArray(o[key]) ? o[key].push(val) : o[key] = [val];
};
// тоже, что и выше, но со строкой
global.gfAddStr = function (o, key, str) {
    o[key] = o[key] ? (o[key] + ' ' + str).noSpace() : str;
};

// .....................................................................................................................
// доступ к ключу объекта, аналог arra.jVal() gfj(b, 'one¦0¦two')
global.gfj = function (o, sKeys, val) {
    if (typeof o !== 'object' || o === null || Array.isArray(o)) return '';
    let aS = 'o' + sKeys.split('¦').map(s => `["${s}"]`).join('');
    try {
        if (!val) return (v => v == undefined ? '' : v)(eval(aS)); // если значение undefined или null вернет пустую строку
        aS = aS + '=' + val; // o['a'][1]=5
        return eval(aS); // установит значение
    } catch (e) {return ''}
};

// ...................................................................................................................
// глубокое копирование, может удалять, добвалять ключи
let v8 = require('v8');
global.gfc = function (o, ...rest) {
    o = v8.deserialize(v8.serialize(o));
    rest.forEach(a => {
        let aS = 'o' + a[0].split('¦').map(s => `["${s}"]`).join('');
        if (a[1] === 'del') aS = 'delete ' + aS; // delete o['bb']
        else {
            let v = typeof a[1] === 'string' ? `'${a[1]}'` : a[1];
            aS = `${aS}=${v}`; // o['a'][1]=5
        }
        eval(aS);
    });
    return o;
};
// ..............................................................................................................



















