---
title: Konfiguracja log4j
category:
  - java
  - technologies
tag:
  - java
  - log4j
permalink: /konfiguracja-log4j-17.html
date: 2009-11-10 11:40:19 +00:00
modified: 2018-07-19 07:47:51 +00:00
---


Poniżej załączam przykłady konfiguracji log4j'a, które wykorzystuje w kilku projektach.

<!--more-->

Logowanie informacji z wybranego pakietu na poziomie INFO na konsolę oraz logowanie informacji z wszystkich pakietów na poziomie DEBUG do wybranego pliku:

```xml
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">

     <appender name="CONSOLE">
         <layout>
         </layout>
     </appender>

     <appender name="FILE">
         <layout>
         </layout>
     </appender>

     <logger name="pl.test">
         <appender-ref ref="CONSOLE" />
     </logger>

     <root>
         <appender-ref ref="FILE" />
     </root>

</log4j:configuration>
```

Logowanie do pliku i na konsolę informacji z wszystkich pakietów na poziomie INFO oraz logowanie dodatkowo, tylko do pliku informacji na poziomie DEBUG z wybranego pakietu:

```xml
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">

     <appender name="CONSOLE">
         <layout>
         </layout>
     </appender>

     <appender name="FILE">
         <layout>
         </layout>
     </appender>

     <logger name="pl.test">
         <level value="DEBUG"/>
         <appender-ref ref="FILE" />
     </logger>

     <root>
         <appender-ref ref="FILE" />
         <appender-ref ref="CONSOLE" />
     </root>

</log4j:configuration>
```
