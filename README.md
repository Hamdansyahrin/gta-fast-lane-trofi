# GTA Fast Lane — Panduan Trofi GTA 6 (Bahasa Indonesia)

Panduan trofi Grand Theft Auto VI berbahasa Indonesia: **55 trofi PlayStation 5** (1 Platinum, 2 Emas, 6 Perak, 46 Perunggu; 28 tersembunyi) dengan panduan berbahasa Indonesia, checklist yang tersimpan di browser, roadmap Platinum, peringatan trofi yang bisa terlewat, plus **checklist 35 syarat 100% completion** yang asli dari dalam game.

Situs live: https://hamdansyahrin.github.io/gta-fast-lane-trofi/

Video harian: https://www.youtube.com/@GTAFastLane

## Jalankan lokal

```sh
python3 -m http.server 8080
# buka http://localhost:8080
```

Tidak ada build step, tidak ada jaringan: halaman ini file statis biasa, dan semua file yang dimuat ada di repo ini. Progres tersimpan di browser (`localStorage`) dan bisa diekspor ke file JSON lalu diimpor kembali.

## Fitur

- **Semua trofi** dengan nama resmi, deskripsi, dan grade persis seperti diterbitkan, plus panduan berbahasa Indonesia yang ditulis dengan kata-kata kami sendiri dan menyebut sumbernya.
- **Checklist trofi**: centang trofi yang sudah didapat, hitungan progres dan persentase, hitungan per grade, tersimpan di `localStorage`, ekspor/impor JSON.
- **Checklist 100%**: 35 syarat asli (Cerita & Tugas, Eksplorasi & Aktivitas, Penemuan) dengan progres sendiri, juga tersimpan di `localStorage`.
- **Filter**: berdasarkan grade, jenis (cerita / penyelesaian / koleksi / aktivitas / lainnya), status (didapat / belum / bisa terlewat / tersembunyi), plus pencarian teks.
- **Pengaturan spoiler**: trofi tersembunyi dan cerita tetap tersembunyi — nama, deskripsi, dan panduan — sampai didapat.
- **Roadmap Platinum**: tiga tahap (cerita 60–80 jam, 100% sekitar 100 jam, bersih-bersih sekitar 10 jam), sekitar 200 jam dan kesulitan 4/10 menurut PowerPyx, dengan simpan manual di awal setiap chapter (tidak ada mission replay).
- **Peringatan bisa terlewat**: satu trofi yang berpotensi terlewat, Positive Mental Attitude — meditasi Lucia di Chapter 1 yang hilang begitu chapter berakhir.
- **Kejujuran soal yang belum terkonfirmasi**: lima trofi tersembunyi yang metodenya belum dikonfirmasi panduan mana pun ditandai begitu, bukan ditebak.

## Data

`data/trophies.json` berisi 55 trofi: nama resmi, deskripsi, grade, jenis, penanda tersembunyi, penanda bisa terlewat, tahap roadmap, chapter bila diketahui, jumlah bila PlayStation melacaknya, panduan, dan kunci sumber per trofi. `data/completion.json` berisi 35 syarat 100% dalam tiga kelompok, dengan target dan penjelasan singkat.

## Sumber data

- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- PowerPyx — GTA 6 100% Completion Checklist & Guide: https://www.powerpyx.com/gta-6-100-completion-checklist-guide/
- GTA Zone — GTA 6 Trophy List: All 55 Trophies and Achievements: https://gta-zone.com/news/gta-6-trophies-achievements/
- Output Lag — GTA 6 Trophy List: All 55 Trophies and Achievements: https://outputlag.com/guides/gta-6-trophy-list/
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap: https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- Daftar resmi itu sendiri (nama, deskripsi, grade) seperti tercantum di Exophase dan PSNProfiles.

Teks panduan ditulis dengan kata-kata kami sendiri; sumber dikutip, tidak pernah disalin.

## Catatan

Halaman penggemar tidak resmi. Tidak berafiliasi dengan, didukung oleh, atau terhubung dengan Rockstar Games atau Take-Two Interactive. Tidak ada logo, artwork, box art, atau screenshot game Rockstar yang dipakai di situs ini.
