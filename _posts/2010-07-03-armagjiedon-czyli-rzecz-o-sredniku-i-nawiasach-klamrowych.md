---
title: Armagjiedon, czyli rzecz o średniku i nawiasach klamrowych
category:
  - technologies
  - java
tag:
  - java
permalink: /armagjiedon-czyli-rzecz-o-sredniku-i-nawiasach-klamrowych-442.html
date: 2010-07-03 09:14:17 +00:00
modified: 2018-07-18 17:55:46 +00:00
---


Dzisiaj, po raz kolejny miałem przyjemność zobaczyć, jak początkujący programista może na własne życzenie uprzykrzyć życie sobie i kolegom z pracy. Poniżej załączam przykładowy kawałek kodu, który sprawił niektórym z nich niemiłą niespodziankę 🙂

<!--more-->

```java
...
boolean czyPrawda = sprawdzCzyPrawda();
if (czyPrawda);
	wykonajTylkoJesliPrawda();
...
```

Myślę, że jest to dobry przykład, przemawiający za stosowaniem wypracowanych konwencji i stosowania się nawet do takich detali, jak nawiasy klamrowe dla jednolinijkowego *if*'a.
