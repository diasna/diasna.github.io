---
layout: post
title:  "Memulai pemrograman Arduino dengan VSCode + PlatformIO"
date:   2022-01-28 22:54:45 +0700
categories: Tools
--- 

Kali ini saya akan mencoba memberikan tutorial bagaimana cara untuk _develop_/mengembangkan/ngoding Arduino dengan menggunakan IDE VSCode dan plugin PlatformIO sebagai alternatif dari Arduino IDE. IDE singkatan dari _Integrated Development Environment_, IDE sendiri adalah sebuah aplikasi yang membantu kita untuk _develop_ aplikasi lain, biasanya IDE mempunyai fitur yang cukup untuk memenuhi kebutuhan dalam _development_ di dalam satu aplikasi.

Berikut adalah alasan saya menggunakan VSCode sebagai IDE untuk _develop_ aplikasi Arduino adalah: 
1. Dengan fitur _extension_ yang sangat lengkap VSCode dapat digunakan untuk _develop_ aplikasi dengan beragam bahasa pemrograman dan juga dengan banyaknya tools lain yang tersedia di _extensions_ ang membantu untuk _development_, dengan VSCode ini kita dapat membuat aplikasi Web, Desktop, Mobile sampai dengan Microcontroller 
2. VCS atau _Version Control System_ adalah salah satu fitur bawaan dari VSCode untuk menyimpan setiap perubahan pada kode kita, VCS ini juga berguna jika kita melakukan _develop_ berkolaborasi dengan orang lain dan juga jika kita menggunakan VCS dan menghubungkan ke server seperti GitHub kita tidak kawatir kode kita akan hilang, karena sudah tersimpan di Cloud.

## PlatformIO
PlatformIO adalah salah satu extension yang ada di VSCode yang dapat digunakan untuk mendevelop berbagai macam _embedded system_ dalam satu konfigurasi, dengan PlatformIO kita bisa mendevelop di platform Espressif(ESP), Atmel, Teensy dan lain lain bisa di lihat list nya lengkap di [sini](https://docs.platformio.org/en/latest/platforms/index.html#embedded)

## Install VSCode
Untuk installasi VSCode temen-temen tinggal buka aplikasi `Microsoft Store` kemudian ketik `VSCode` di kolom pencarian, kemudian klik install.

![Microsoft Store](/assets/2022-01-28-arduino-vscode-platformio/msstore.png){:style="display:block; margin-left:auto; margin-right:auto"}

Setelah selesai instalasi, maka VSCode sudah bisa di jalankan melalui Start menu windows.

## Install PlatformIO extension
Setelah VSCode terbuka, pada menu kiri ada tab `Extensions`, di menu inilah tempat semua extensions yang bisa digunakan untuk membantu kita pada saat _develop_. Untuk memasang extension PlatformIO temen temen tinggal ketik di kolom pencarian extension seperti gambar di bawah ini dan klik `install`

![](/assets/2022-01-28-arduino-vscode-platformio/plugin1.png){:style="display:block; margin-left:auto; margin-right:auto"}

Setelah plugin terinstall maka di _sidebar_ kiri akan ada tambahan menu PlatformIO
 
![](/assets/2022-01-28-arduino-vscode-platformio/plugin2.png){:style="display:block; margin-left:auto; margin-right:auto"}

## Membuat Project
Untuk memulai membuat project, buka menu `PIO Home` kemudian klik `Open`, setelah halaman `PIO Home` terbuka klik tombol `New Project`

![](/assets/2022-01-28-arduino-vscode-platformio/plugin3.png){:style="display:block; margin-left:auto; margin-right:auto"}

Selanjutnya akan keluar dialog untuk membuatan Project baru, di dalam dialog ini temen-temen di berikan pilihan untuk memilih `Board` dan `Framework`. temen-temen bisa pilih board yang akan di pakai untuk _develop_, disini saya akan menggunakan Board Wemos D1 Mini ESP8266 dan framework Arduino, kemudian klik tombol Finish.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin4.png){:style="display:block; margin-left:auto; margin-right:auto"}

Setelah proses pembuatan project selesai makan di tab Explorer akan terbuat sebuah struktur folder dan file yang sudah di tentukan oleh PlatformIO dan ini menurut saya lebih rapi dibandingkan menggunakan `Arduino IDE`. Berikut adalah folder dan file yang perlu temen-temen ketahui fungsinya:
- `src`, digunakan untuk menaruh semua kode utama kita, contohnya adalah `main.cpp`
- `test`, digunakan untuk menaruh kode unit test, ini adalah salah satu kelebihan dari PlatformIO yang mempunyai fitur Unit Testing engine, mungkin saya akan bahas ini di postingan lain.
- `lib`, digunakan untuk menaruh library pribadi atau library yang tidak terdaftar di `PlatformIO Library`
- `platformio.ini`, file ini adalah file konfigurasi dari project kita, jika teman-teman buka di dalamnya akan ada informasi seperti Board & Platform apa yang kita gunakan dll.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin5.png){:style="display:block; margin-left:auto; margin-right:auto"}

Untuk memulai _develop_ kita akan menulis kode dengan menuliskan text `Hello World` ke Serial, contoh kode bisa di lihat di screenshot bawah ini.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin6.png){:style="display:block; margin-left:auto; margin-right:auto"}

pada kode di atas saya memakai serial dengan baud rate `115200`, sedangkan konfigurasi default PlatformIO adalah `9600`, untuk merubahnya kita dapat melakukanya di file `platformio.ini` dengan menuliskan parameter baru yautu `monitor_speed = 115200` seperti di bawah ini

![](/assets/2022-01-28-arduino-vscode-platformio/plugin7.png){:style="display:block; margin-left:auto; margin-right:auto"}

Untuk menjalankan kode ini biasanya saya menggunakan menu yang ada di PlatformIO extension `Upload and Monitor`, menu ini digunakan jika kita ingin mengupload kode/sketch ini sekaligus menampilkan Serial Monitor.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin9.png){:style="display:block; margin-left:auto; margin-right:auto"}

Jika tidak ada error pada kode kita maka proses build kode dan upload sketch akan seperti di bawah ini, dan Jendela Serial Monitor akan otomatis berjalan.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin10.png){:style="display:block; margin-left:auto; margin-right:auto"}

## Menambahkan Library
Pada mendevelop sebuah kode kita tidak jarang akan menggunakan sebuah `Libary` yang ada untuk mendukung kode kita. di PlatformIO ini kita dapat menambahkan library pada menu `PIO Home` dan buka tab `Libraries` seperti di bawah ini.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin11.png){:style="display:block; margin-left:auto; margin-right:auto"}

kemudian temen-temen bisa masukan kata kunci pencarian untuk library yang di pakai, di sini untuk contoh saya akan memasang library `PubSubClient` oleh Nick O\`Leary. setelah menemukan library yang akan di pakai selanjut nya klik library tersebut dan klik tombol `Add to Project`.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin12.png){:style="display:block; margin-left:auto; margin-right:auto"}

pada dialog `Add project dependency` pilih Project yang telah kita buat untuk dipasang Library tersebut.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin13.png){:style="display:block; margin-left:auto; margin-right:auto"}

Jika tidak ada error maka kode kita di `main.cpp` kita sudah bisa include file header dari library yang sudah kita pasang sebelumnya, seperti di bawah ini

![](/assets/2022-01-28-arduino-vscode-platformio/plugin14.png){:style="display:block; margin-left:auto; margin-right:auto"}

Sebagai informasi tambahan, di VSCode ada menu `Side Bar` yang lokasi nya ada di bawah berwarna biru, di sini ada menu Platform IO seperti `Upload` dan membukan `Serial Monitor`, berbeda dengan yang saya gunakan sebelumnya `Upload dan Monitor` menu di sini digunakan juga temen-temen ingin upload kode saja tanpa membuka `Serial Monitor`, atau membuka `Serial Monitor` tampa upload sketch.

![](/assets/2022-01-28-arduino-vscode-platformio/plugin15.png){:style="display:block; margin-left:auto; margin-right:auto"}

Sekian sedikit share dari saya, semoga artikel ini dapat membantu temen-temen dalam terus berkreasi.