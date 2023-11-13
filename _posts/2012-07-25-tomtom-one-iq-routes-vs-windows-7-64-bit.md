---
title: TomTom ONE IQ Routes vs. Windows 7 64-bit
category:
  - technologies
  - other
tag:
  - gps
  - tomtom
permalink: /tomtom-one-iq-routes-vs-windows-7-64-bit-634.html
date: 2012-07-25 20:12:31 +00:00
modified: 2018-07-18 17:30:10 +00:00
---


Od niespełna czterech lat jestem mniej (jeśli chodzi o płacenie za aktualizacje) lub bardziej (jeśli chodzi o użytkowanie) szczęśliwym posiadaczem nawigacji [TomTom ONE IQ Routes](http://www.pcworld.pl/testy/opis/GPS00033-TomTom_ONE_IQ_Routes_Edition_42.html).

Radość moja jednak zmalała znacznie, gdy podczas aktualizacji przy użyciu TomTom Home dostałem raz, a potem drugi, trzeci... i dwudziesty, mniej więcej podobny do poniższego komunikat błędu `ERROR: HomeBase/IO: Error writing file: G:\PNDNavigator`.

<!--more-->

Pełen stacktrace:
```plaintext
ERROR: HomeBase/IO: Error writing file: G:\PNDNavigator
@ .\portable\cfile.cpp(1947)
0000045D
in .\portable\cfile.cpp:1947
Stack:
1. chrome://tthome/content/ui/bindings/commit.js:82
                    error(textOrException);
2. chrome://tthome/content/ui/bindings/ttwizard.xml:1061
                                        this._commitFailed(i, commitPage);
3. chrome://tthome/content/logic/util.js:79
                return func.apply(obj, arguments);
4. chrome://tthome/content/logic/dllUtils.js:77
            this._errorCallback(e);
5. chrome://tthome/content/logic/dllUtils.js:69
            this._errorFatal(error);
```

Myślę więc sobie, OK zdarza się. Pewnie już ktoś to gdzieś pewnie przerabiał, więc przebrnąłem razem z Googlem przez wszelkie możliwe do znalezienia sposoby ratowania nawigacji, od tych ze strony TomTom'a, a na formatowaniu pamięci przy użyciu specjalistycznego programu dostarczonego przez producenta kości. Rezultat? Kaput!?

NIE! Nie ma tak lekko. Kolejny research podpowiedział mi, że można jeszcze wlutować na płycie głównej nawigacji slot na karty SD, albo nawet sam adapter dla tart microSD. Wszystko byłoby jednak fajnie, gdyby tutorial nie tyczył się poprzednich generacji modelu ONE. Mój niestety ma inną płytę, bez odpowiednich wyprowadzeń.

Totalnie zrezygnowany, gdzieś całkiem niechcący trafiłem na teoretycznie niewiele znaczący post, który sugerował, że problem może wynikać z tego, że na kompie z którego puszcza się aktualizację używa się systemu Windows Vista lub 7 w wersji 64-bit i że warto spróbować odpalić tryb XP, albo przesiąść się na kompa z XP'kiem.

I wiecie co? Cały proces od formatowania, poprzez wgrywanie domyślnej wersji oprogramowania, po aktualizację przebiegł bez najmniejszych zakłóceń. Pozwoliłem sobie nawet, nie bez obawy, podogrywać schematy kolorów, lektorów i kilka innych pierdół. I wszystko to, bez jednego najmniejszego problemu!
