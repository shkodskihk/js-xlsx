var OFFCRYPTO = {};

var make_offcrypto = function(O, _crypto) {
	var crypto;
	if(typeof _crypto !== 'undefined') crypto = _crypto;
	else if(typeof require !== 'undefined') {
		try { crypto = require('crypto'); }
		catch(e) { crypto = null; }
	}

	O.rc4 = function(key, data) {
		var S = new Array(256);
		var c = 0, i = 0, j = 0, t = 0;
		for(i = 0; i != 256; ++i) S[i] = i;
		for(i = 0; i != 256; ++i) {
			j = (j + S[i] + (key[i%key.length]).charCodeAt(0))&255;
			t = S[i]; S[i] = S[j]; S[j] = t;
		}
		// $FlowIgnore
		i = j = 0; var out = Buffer(data.length);
		for(c = 0; c != data.length; ++c) {
			i = (i + 1)&255;
			j = (j + S[i])%256;
			t = S[i]; S[i] = S[j]; S[j] = t;
			out[c] = (data[c] ^ S[(S[i]+S[j])&255]);
		}
		return out;
	};

	O.md5 = function(hex) {
		if(!crypto) throw new Error("Unsupported crypto");
		return crypto.createHash('md5').update(hex).digest('hex');
	};
};
/*:: declare var crypto:any; */
make_offcrypto(OFFCRYPTO, typeof crypto !== "undefined" ? crypto : undefined);

