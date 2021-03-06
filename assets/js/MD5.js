
var MD5 = function (q) {
    function to_zerofilled_hex(n) {
        var a = (n >>> 0).toString(16);
        return "00000000".substr(0, 8 - a.length) + a
    }

    function chars_to_bytes(a) {
        var b = [];
        for (var i = 0; i < a.length; i++) {
            b = b.concat(str_to_bytes(a[i]))
        }
        return b
    }

    function int64_to_bytes(a) {
        var b = [];
        for (var i = 0; i < 8; i++) {
            b.push(a & 0xFF);
            a = a >>> 8
        }
        return b
    }

    function rol(a, b) {
        return ((a << b) & 0xFFFFFFFF) | (a >>> (32 - b))
    }

    function fF(b, c, d) {
        return (b & c) | (~b & d)
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c)
    }

    function fH(b, c, d) {
        return b ^ c ^ d
    }

    function fI(b, c, d) {
        return c ^ (b | ~d)
    }

    function bytes_to_int32(a, b) {
        return (a[b + 3] << 24) | (a[b + 2] << 16) | (a[b + 1] << 8) | (a[b])
    }

    function str_to_bytes(a) {
        var b = [];
        for (var i = 0; i < a.length; i++)if (a.charCodeAt(i) <= 0x7F) {
            b.push(a.charCodeAt(i))
        } else {
            var c = encodeURIComponent(a.charAt(i)).substr(1).split('%');
            for (var j = 0; j < c.length; j++) {
                b.push(parseInt(c[j], 0x10))
            }
        }
        return b
    }

    function int128le_to_hex(a, b, c, d) {
        var e = "";
        var t = 0;
        var f = 0;
        for (var i = 3; i >= 0; i--) {
            f = arguments[i];
            t = (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | (f & 0xFF);
            f = f >>> 8;
            t = t << 8;
            t = t | f;
            e = e + to_zerofilled_hex(t)
        }
        return e
    }

    function typed_to_plain(a) {
        var b = new Array(a.length);
        for (var i = 0; i < a.length; i++) {
            b[i] = a[i]
        }
        return b
    }

    var r = null;
    var s = null;
    if (typeof q == 'string') {
        r = str_to_bytes(q)
    } else if (q.constructor == Array) {
        if (q.length === 0) {
            r = q
        } else if (typeof q[0] == 'string') {
            r = chars_to_bytes(q)
        } else if (typeof q[0] == 'number') {
            r = q
        } else {
            s = typeof q[0]
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (q instanceof ArrayBuffer) {
            r = typed_to_plain(new Uint8Array(q))
        } else if ((q instanceof Uint8Array) || (q instanceof Int8Array)) {
            r = typed_to_plain(q)
        } else if ((q instanceof Uint32Array) || (q instanceof Int32Array) || (q instanceof Uint16Array) || (q instanceof Int16Array) || (q instanceof Float32Array) || (q instanceof Float64Array)) {
            r = typed_to_plain(new Uint8Array(q.buffer))
        } else {
            s = typeof q
        }
    } else {
        s = typeof q
    }
    if (s) {
        alert('MD5 type mismatch, cannot process ' + s)
    }
    function _add(a, b) {
        return 0x0FFFFFFFF & (a + b)
    }

    return do_digest();
    function do_digest() {
        function updateRun(e, f, g, h) {
            var i = d;
            d = c;
            c = b;
            b = _add(b, rol(_add(a, _add(e, _add(f, g))), h));
            a = i
        }

        var j = r.length;
        r.push(0x80);
        var k = r.length % 64;
        if (k > 56) {
            for (var i = 0; i < (64 - k); i++) {
                r.push(0x0)
            }
            k = r.length % 64
        }
        for (i = 0; i < (56 - k); i++) {
            r.push(0x0)
        }
        r = r.concat(int64_to_bytes(j * 8));
        var l = 0x67452301;
        var m = 0xEFCDAB89;
        var n = 0x98BADCFE;
        var o = 0x10325476;
        var a = 0, b = 0, c = 0, d = 0;
        for (i = 0; i < r.length / 64; i++) {
            a = l;
            b = m;
            c = n;
            d = o;
            var p = i * 64;
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(r, p), 7);
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(r, p + 4), 12);
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(r, p + 8), 17);
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(r, p + 12), 22);
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(r, p + 16), 7);
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(r, p + 20), 12);
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(r, p + 24), 17);
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(r, p + 28), 22);
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(r, p + 32), 7);
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(r, p + 36), 12);
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(r, p + 40), 17);
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(r, p + 44), 22);
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(r, p + 48), 7);
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(r, p + 52), 12);
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(r, p + 56), 17);
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(r, p + 60), 22);
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(r, p + 4), 5);
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(r, p + 24), 9);
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(r, p + 44), 14);
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(r, p), 20);
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(r, p + 20), 5);
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(r, p + 40), 9);
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(r, p + 60), 14);
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(r, p + 16), 20);
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(r, p + 36), 5);
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(r, p + 56), 9);
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(r, p + 12), 14);
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(r, p + 32), 20);
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(r, p + 52), 5);
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(r, p + 8), 9);
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(r, p + 28), 14);
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(r, p + 48), 20);
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(r, p + 20), 4);
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(r, p + 32), 11);
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(r, p + 44), 16);
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(r, p + 56), 23);
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(r, p + 4), 4);
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(r, p + 16), 11);
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(r, p + 28), 16);
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(r, p + 40), 23);
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(r, p + 52), 4);
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(r, p), 11);
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(r, p + 12), 16);
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(r, p + 24), 23);
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(r, p + 36), 4);
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(r, p + 48), 11);
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(r, p + 60), 16);
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(r, p + 8), 23);
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(r, p), 6);
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(r, p + 28), 10);
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(r, p + 56), 15);
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(r, p + 20), 21);
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(r, p + 48), 6);
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(r, p + 12), 10);
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(r, p + 40), 15);
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(r, p + 4), 21);
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(r, p + 32), 6);
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(r, p + 60), 10);
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(r, p + 24), 15);
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(r, p + 52), 21);
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(r, p + 16), 6);
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(r, p + 44), 10);
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(r, p + 8), 15);
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(r, p + 36), 21);
            l = _add(l, a);
            m = _add(m, b);
            n = _add(n, c);
            o = _add(o, d)
        }
        return int128le_to_hex(o, n, m, l).toUpperCase()
    }
};

module.exports = MD5;