---
title: "How To: Zaufany certyfikat SSL za darmo"
category:
  - technologies
  - web
tag:
  - security
  - free-certificate
  - web
permalink: /how-to-zaufany-certyfikat-ssl-za-darmo-44.html
date: 2009-11-12 09:58:11 +00:00
modified: 2009-11-12 09:58:11 +00:00
---


SSL, jak zapewne wiecie (a jeśli nie wiecie, to zapraszam na [Google](https://www.google.pl/search?hl=pl&amp;q=do+czego+s%B3u%BFy+certyfikat+ssl)), służy do zabezpieczenia strony internetowej przed podsłuchiwaniem przesyłanych poprzez nią danych, jak również umożliwia ochronę przed oszustami próbującymi podszyć się pod nasz serwis, pod warunkiem, że nasi odwiedzający wiedzą, że strona nasza zabezpieczona jest certyfikatem i za każdym razem, gdy na nią wchodzą, sprawdzają, czy informacje o takim certyfikacie wyświetlają się w okolicach paska adresu przeglądarki internetowej (np: tak jak na stronach banków). Sam korzystam z certyfikatu SSL, do zabezpieczenia strony logowania i panelu administracyjnego tego blog'a.

<!--more-->

Zaufanych certyfikatów SSL (czyli takich, które są akceptowane przez przeglądarki bez zbędnego męczenia użytkownika) niestety nikt nie rozdaje za darmo - no, może poza certyfikatami testowymi ważnymi przez 30 dni.  To znaczy, do tej pory myślałem, że tak jest.

Podczas googlowania w sieci dokopałem się do firmy, która najprostsze certyfikaty SSL, przeznaczone tylko dla jednej domeny z jedną subdomeną, bez zbędnej weryfikacji danych i ważne przez 1 rok oferuje właśnie za darmo. Jedyne co trzeba, to mieć konto pocztowe o określonym aliasie (do wyboru z listy, np: postmaster, webmaster...), do którego dostęp pośrednio dowodzi, że jesteśmy właścicielem domeny, dla której tenże certyfikat próbujemy wyrobić.

Jeśli nie ma z tym problemu, pozostaje nam założyć konto na stronie firmy [StartCom](http://www.startssl.com/), tj. wypełnić formularz (Sign-up), aktywować konto kodem z mail'a i odebrać certyfikat do logowania. Następnie logujemy się przy użyciu tego certyfikatu (Authenticate) i z Control Panel poprzez Certificate Wizard'a wyrabiamy sobie Web Server SSL/TSL Certificate. Gdy już go mamy, pozostaje nam tylko zainstalować go na serwerze według wskazówek ze strony [pomocy](http://www.startssl.com/?app=20) i korzystać z jego dobrodziejstw 😉
