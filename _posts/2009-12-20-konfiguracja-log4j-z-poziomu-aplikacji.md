---
title: Konfiguracja log4j z poziomu aplikacji
category:
  - technologies
  - java
tag:
  - java
  - log4j
permalink: /konfiguracja-log4j-z-poziomu-aplikacji-267.html
date: 2009-12-20 22:23:08 +00:00
modified: 2018-07-19 07:06:24 +00:00
---


Poniżej zamieszczam kod konfigurujący bibliotekę *log4j*, który po zamieszczeniu w naszej aplikacji spowoduje, że nie będziemy już potrzebowali pliku konfiguracyjnego *log4j.configuration*, czy też *log4j.xml*. Dodatkową korzyścią jest fakt, że po niewielkich zmianach będziemy mogli z poziomu naszej aplikacji dostosowywać na bieżąco mechanizm logowania do aktualnych potrzeb, np: rozszerzając lub zawężając zakres logowanych informacji, czy też dodając nowe lub usuwając aktualnie niepotrzebne *appender'y*.

<!--more-->

Poniższy kod konfiguruje *logger'a* tak, aby wszelkie informacje, niezależnie od poziomu logowania archiwizowane były w plikach logów, oraz dodatkowo, komunikaty o poziomie logowania *INFO* i wyższych były wyświetlane na konsoli.

```java
static { // log4j configuration
    final PatternLayout layout = new PatternLayout("%d{ISO8601} %p [%c{1}:%L] %m%n");

    try {
        RollingFileAppender fileAppender = new RollingFileAppender(layout, "logs/application.log", true);
        fileAppender.setThreshold(Level.ALL);
        fileAppender.setEncoding("UTF-8");
        fileAppender.setMaxFileSize("2MB");
        fileAppender.setMaxBackupIndex(9);

        BasicConfigurator.configure(fileAppender);
    } catch (IOException ex) {
        log.error("Error while initializing RollingFileAppender", ex);
    }

    ConsoleAppender consoleAppender = new ConsoleAppender(layout);
    consoleAppender.setThreshold(Level.INFO);

    BasicConfigurator.configure(consoleAppender);
}
```

Szczegółowych informacji na temat konfiguracji *log4j'a* możecie szukać na jego [stronie domowej](https://logging.apache.org/log4j/1.2/index.html) lub poprzez [Google](https://www.google.pl/search?hl=pl&amp;q=log4j+configuration).
