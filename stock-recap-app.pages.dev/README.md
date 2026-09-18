# Hacked by CryBypass

> _"Tidak semua pintu yang terbuka terlihat seperti pintu. Kadang cukup satu request GET untuk mengetahui siapa yang lupa mengunci."_

---

## `01 FIELD NOTE`

Assessment ini lahir dari satu pertanyaan sederhana: **jika seseorang datang tanpa identitas istimewa, apa yang sebenarnya masih bisa ia lihat?**

Tidak ada brute force. Tidak ada eksploitasi agresif. Tidak ada usaha mengubah keadaan sistem. Hanya request yang berbicara seperlunya kepada endpoint REST, kemudian membaca jawaban yang memang diberikan server. Dalam konteks keamanan, terkadang respons paling kecil justru mengatakan paling banyak.

Target menggunakan **Supabase REST API / PostgREST** sebagai lapisan akses data. Karena itu, permukaan yang diperiksa bukan sekadar halaman login, melainkan batas antara frontend, anonymous role, REST endpoint, dan Row Level Security. Assessment difokuskan pada satu hal: **apakah data yang seharusnya membutuhkan otorisasi masih dapat dibaca dari konteks anonymous/public.**

Assessment bersifat **read-only**. Sistem tidak disentuh lebih jauh daripada yang diperlukan untuk membuktikan kondisi akses.

---

## `02 ASSESSMENT PHILOSOPHY`

> _"A quiet request is often enough. The server already knows what it is willing to reveal."_

Pendekatan yang digunakan sengaja minimalis.

Tidak semua pengujian keamanan membutuhkan eksploitasi. Untuk kasus exposure data, sebuah `HTTP 200` dengan payload yang berisi record sering kali sudah cukup untuk menunjukkan bahwa batas akses perlu diperiksa kembali.

Karena itu assessment ini mempertahankan beberapa prinsip:

- `GET` untuk membaca data.
- `HEAD` untuk mengamati metadata response.
- Tidak melakukan `INSERT`.
- Tidak melakukan `UPDATE`.
- Tidak melakukan `DELETE`.
- Tidak melakukan `UPSERT`.
- Tidak melakukan perubahan schema.
- Tidak menjalankan migration.
- Tidak menggunakan `service_role`.
- Tidak mencoba memperoleh privilege yang lebih tinggi.
- Tidak mengubah konfigurasi Supabase.
- Tidak mengubah, menghapus, atau merusak data.
- Tidak melakukan brute force credential.
- Tidak melakukan denial-of-service.
- Tidak melakukan pengujian di luar kebutuhan assessment.
- Fokus pada apa yang dapat diamati dari konteks anonymous/public.

Tujuannya adalah mengetahui **di mana sistem lupa membedakan siapa yang boleh melihat dan siapa yang hanya kebetulan bisa meminta.**

---

## `03 TARGET SURFACE`

```text
Application
└── https://stock-recap-app.pages.dev/

Security Console
└── https://web.haxorai.com/stock-recap-app.pages.dev

Assessment Context
└── Anonymous / Public client context
