---
title: Zdradliwe komentarze – ku przestrodze
category:
  - java
  - technologies
tag:
  - java
permalink: /zdradliwe-komentarze-ku-przestrodze-289.html
date: 2010-01-09 22:58:32 +00:00
modified: 2018-07-19 07:03:08 +00:00
---


Przeglądając zasoby serwisu [Roflcopter](http://roflcopter.pl/) znalazłem fragment kodu, który mnie... urzekł. Pomijam już roztrząsanie kwestii, czy ma sens rozwijanie pętli w Javie. Chodzi o to, że autor poniższego kawałka kodu, *zabił* mnie wygenerowanym przez siebie, jednym z trudniejszych do wykrycia przez tą samą osobę, błędów programisty.
<!--more-->
Zresztą, spójrzcie sami:

```java
for ( j=0; j<array_len; j+=8 ) {
    total += array[j+0];
    total += array[j+1];
    total += array[j+2]; /* Main body of
    total += array[j+3];  * loop is unrolled
    total += array[j+4];  * for greater speed.
    total += array[j+5];  */
    total += array[j+6];
    total += array[j+7];
}
```

Niby wszystko w porządku, ale jak to mawiają "Diabeł tkwi w szczegółach" 🙂
