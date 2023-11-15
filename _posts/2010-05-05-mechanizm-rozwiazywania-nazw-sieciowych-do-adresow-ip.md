---
title: Mechanizm rozwiązywania nazw sieciowych do adresów IP
category:
  - technologies
  - java
tag:
  - java
permalink: /mechanizm-rozwiazywania-nazw-sieciowych-do-adresow-ip-323.html
date: 2010-05-05 13:50:41 +00:00
modified: 2018-07-19 06:53:44 +00:00
---


Miałem okazję przeczytać dzisiaj małe opracowanie, traktujące o sposobie w jaki *Java* przechowuje i rozwiązuje nazwy adresów sieciowych do numerów IP, z którymi próbuje się połączyć. Nie jest to może szalenie istotne zagadnienie, jednak dobrze jest mieć chociaż z grubsza świadomość, jak ów mechanizm funkcjonuje.

<!--more-->

Załóżmy, że wykonujemy następujący kod *Javy*:

```java
URL url = new URL("http://www.google.pl");
InputStream in = url.openConnection().getInputStream();
IOUtils.copy(in, System.out);
```

Przystępując do ustalania adresu IP *Java* zagląda najpierw do pliku *hosts* (domyślnie: *c:\Windows\System32\drivers\etc\hosts*). Jeśli nie znajdzie tam adresu IP powiązanego z rozpatrywanym adresem internetowym łączy się ze skonfigurowanym w systemie  serwerem DNS.

Zapewne dla większości z Was, nie ma w tym nic odkrywczego. Warto jednak wiedzieć, że jako programiści, mamy wpływ na czas, przez jaki *Java* przechowuje informacje o poszukiwanych adresach IP.

Określają to dwa poniższe parametry:

1. **networkaddress.cache.ttl** - określa czas, przez jaki *Java* przechowywać będzie w pamięci podręcznej znalezione adresy IP (wartość ujemna - bezterminowo, wartość dodatnia - liczba sekund do wygaśnięcia adresu, zero - przechowywanie wyłączone)
2. **networkaddress.cache.negative.ttl** - określa czas, przez jaki *Java* przechowywać będzie w pamięci podręcznej informację o braku możliwości znalezienia adresu IP. Po tym czasie nastąpi kolejna próba odpytania serwera DNS (wartość ujemna - bezterminowo, wartość dodatnia - liczba sekund do wygaśnięcia adresu, zero - przechowywanie wyłączone)

Domyślne wartości wynoszą:

1. **networkaddress.cache.ttl = 30** - tryb *zwykły*, domyślny dla aplikacji SE,
2. **networkaddress.cache.ttl = -1** - tryb *cache forever*, gdy używany jest Security Manager, np. w przypadku apletów,
3. **networkaddress.cache.negative.ttl = 10**

Wartości te możemy zmienić na trzy poniższe sposoby:

1. Ustawiając parametry systemowe w kodzie programu:
```java
java.security.Security.setProperty("networkaddress.cache.ttl", "10");
java.security.Security.setProperty("networkaddress.cache.negative.ttl", "5");
```
2. Edytując plik *java.security* w katalogu *JAVA_HOME\jre\lib\security\* - to wymaga jednak fizycznego dostęp do komputera.
3. Z poziomu linii komend ustawiając parametry:
	- **-Dsun.net.inetaddr.ttl** powiązany z parametrem **networkaddress.cache.ttl**
	- **-Dsun.net.inetaddr.negative.ttl** powiązany z parametrem **networkaddress.cache.negative.ttl**

Więcej informacji na temat parametrów funkcji sieciowych *Javy* znaleźć można pod adresem:

[http://java.sun.com/javase/6/docs/technotes/guides/net/properties.html](http://java.sun.com/javase/6/docs/technotes/guides/net/properties.html)

W  *Javie 1.5* zachowanie w kontekście cache'owania adresów różni się nieco od *Javy 1.6*. Otóż, w  *Javie 1.5:*

1. Można było przekazać parametry w parametrach uruchomienia programu w postaci np.: **-Dnetworkaddress.cache.ttl=20**.
2. Adres w środowisku bez Security Managera cache'owany był w nieskończoność.
