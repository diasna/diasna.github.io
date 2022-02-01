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
![Microsoft Store](/assets/2022-01-28-arduino-vscode-platformio/msstore.png){:style="display:block; margin-left:auto;

## Install PlatformIO extension