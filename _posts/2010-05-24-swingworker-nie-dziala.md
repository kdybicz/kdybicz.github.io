---
title: SwingWorker nie działa!
category:
  - java
  - technologies
tag:
  - java
  - swingworker
permalink: /swingworker-nie-dziala-404.html
date: 2010-05-24 11:49:48 +00:00
modified: 2010-05-24 11:49:48 +00:00
---


Odpalając niedawno jedną z napisanych przeze mnie niegdyś aplikacji na nowej wersji Javy (JRE 1.6.0_20) zauważyłem, iż nie działa ona prawidłowo. Otóż, niektóre operacje trwały dłużej niż powinny. Po krótkim śledztwie z wykorzystaniem *jvisualvm* i inspekcją kodu na czele, okazało się, że to używane przeze mnie *SwingWorker'y* z nieznanych mi przyczyn prawdopodobnie wchodzą sobie w drogę.

<!--more-->

Dalsza część śledztwa prowadzona już przy pomocy *Google*, doprowadziła mnie do zgłoszenia [tego](http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6880336) błędu. O ile sam  jego opis nie wyjaśnia zbyt wiele, to już komentarze zawarte poniżej nie pozostawiają wątpliwości, iż do kodu *Javy* wkradł się dość poważny błąd powodujący, iż w tym samym czasie nie może pracować więcej niż jeden *SwingWorker*. Przez co, wielowątkowe operacje realizowane przy użyciu *SwingWorker'ów* stały się nagle jednowątkowe, a wszystkie aplikacje korzystające z więcej niż jednego *SwingWorker'a* w tym samym czasie zaczęły się "sypać".

Dziwi mnie tylko fakt, iż od czasu zgłoszenia do dnia dzisiejszego ów błąd nie został poprawiony.
