---
title: Obfuskacja kodu, czyli jak utrudnić życie cracker'om
category:
  - java
  - technologies
tag:
  - security
  - java
  - obfuscation
permalink: /obfuskacja-kodu-czyli-jak-utrudnic-zycie-crackerom-26.html
date: 2009-11-10 10:44:10 +00:00
modified: 2018-07-19 07:46:47 +00:00
---


Obfuskacja, jak możemy przeczytać na [Wikipedii](https://pl.wikipedia.org/wiki/Zaciemnianie_kodu), to "*technika przekształcania programów, która zachowuje ich semantykę, ale znacząco utrudnia zrozumienie."*. Polega ona na takim przetworzeniu kodu lub binariów aplikacji, aby uzyskany po dekompilacji kod był jak najbardziej nieczytelny dla osoby przeprowadzającej analizę działania programu z wykorzystaniem tak zwanej [Inżynierii wstecznej](https://pl.wikipedia.org/wiki/In%C5%BCynieria_odwrotna).

<!--more-->

Obfuskacja objawia się głównie poprzez zmianę nazw pakietów, pól i metod na nazwy nic nie mówiące. Do tego mogą dochodzić również bardziej zaawansowane modyfikacje, takie jak: "*rozdzielenie zmiennych, konwersja statycznych danych do procedury, zmiana kodowania, zmiana długości życia zmiennej, łączenie zmiennych skalarnych, zmiana relacji dziedziczenia, rozłam/łączenie tablic, zmiana porządku instancji zmiennych / metod / tablic, rozszerzenie warunków pętli, zmiana kolejności komend / pętli / wyrażeń, metody inline, ogólnikowe wyrażenia, klonowanie metod"*.

Często obok obfuskacji biblioteki umożliwiają również przeprowadzenie shrinkowania, czyli usuwania niewykorzystywanych fragmentów kodu lub nawet całych klas, kompresji statycznych zmiennych przechowujących długie ciągi znaków lub bajtów, itp.

W sieci możemy znaleźć wiele bibliotek umożliwiających nam przeprowadzenie takich zabiegów, jednak najczęściej spotykałem się z wykorzystaniem dwóch konkretnych. Są to:
- [ProGuard](http://proguard.sourceforge.net/)
- [yGuard](https://www.yworks.com/en/products_yguard_about.htm)

Gdzie ProGuard'a wykorzystuje często w pracy, przy tworzeniu aplikacji dektopowych i apletów, a z yGuarda korzystam pisząc aplikacje dla siebie.
