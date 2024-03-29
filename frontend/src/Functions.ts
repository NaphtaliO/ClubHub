export function bitwise(str: string) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// 10进制转化成62进制以内的进制
// convert 10 binary to customized binary, max is 62
export function binaryTransfer(integer: number, binary: number) {
    binary = binary || 62;
    var stack = [];
    var num;
    var result = '';
    var sign = integer < 0 ? '-' : '';

    function table(num: number) {
        var t = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return t[num];
    }

    integer = Math.abs(integer);

    while (integer >= binary) {
        num = integer % binary;
        integer = Math.floor(integer / binary);
        stack.push(table(num));
    }

    if (integer > 0) {
        stack.push(table(integer));
    }

    for (var i = stack.length - 1; i >= 0; i--) {
        result += stack[i];
    }

    return sign + result;
}


/**
 * why choose 61 binary, because we need the last element char to replace the minus sign
 * eg: -aGtzd will be ZaGtzd
 */
export function unique(text: string) {
    var id = binaryTransfer(bitwise(text), 61);
    return id.replace('-', 'Z');
}

export function random(_len: number) {
    /*
    var len = _len || 8 ;
    return require('crypto').randomBytes(len).toString('hex');
    */

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var rs = '';
    var len = _len || 8;
    for (var i = 0; i < len; i++) {
        var pos = Math.floor(Math.random() * chars.length);
        rs += chars.substring(pos, pos + 1);
    }
    return rs;
}