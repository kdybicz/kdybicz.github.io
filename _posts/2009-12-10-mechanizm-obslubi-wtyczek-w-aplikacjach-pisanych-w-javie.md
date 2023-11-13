---
title: Mechanizm obsługi wtyczek w aplikacjach pisanych w Javie
category:
  - java
  - technologies
tag:
  - java
permalink: /mechanizm-obslubi-wtyczek-w-aplikacjach-pisanych-w-javie-89.html
date: 2009-12-10 21:13:46 +00:00
modified: 2018-07-19 07:34:22 +00:00
---


Services (ang. usługi) jest to mechanizm wbudowany w środowisko Java, umożliwiający tworzenie aplikacji rozszerzalnych o dodatkowe funkcje dostarczane za pomocą plug-in'ów, zwanych też wtyczkami.

Zanim przejdę do przykładowej implementacji, pozwolę sobie odnieść się do oryginalnego dokumentu, w którym omawiany jest mechanizm działania *services*, a który możemy znaleźć na stronach [Sun'a](http://java.sun.com/developer/technicalArticles/javase/extensible/).

<!--more-->

> **Definitions**
> A service is a set of programming interfaces and classes that provide access to some specific application functionality or feature. *[…]*
>
> A service provider interface (SPI) is the set of public interfaces and abstract classes that a service defines. The SPI defines the classes and methods available to your application.
>
> A service provider implements the SPI. An application with extensible services will allow you, vendors, and perhaps even customers to add service providers without modifying the original application.

Czyli, przekładając na polski:

> *Usługa,* to zestaw klas i interfejsów, które dostarczają aplikacji pewną specyficzną funkcjonalność. *[…]*
> *Interfejs dostawcy usług (SPI)*, to zestaw publicznych interfejsów i abstrakcyjnych klas, które definiują *usługę*. SPI definiuje zestaw klas i metod udostępnianych aplikacji.
>
> Dostawca usług implementuje SPI. Aplikacja z rozszerzalnymi usługami umożliwi tobie, dostawcy, być może nawet klientowi na dodawanie nowej funkcjonalności bez modyfikowania oryginalnej aplikacji.

W praktyce wygląda to tak, że najpierw definiujemy interfejs lub klasę abstrakcyjną, która będzie udostępniać naszej aplikacji jakąś funkcjonalność. Idąc dalej za przykładem Sun'a, załóżmy, że będzie to interfejs słownika:

```java
package com.example.dictionary.spi;

public interface Dictionary {
    String getDefinition(String word);
}
```

Następnie, damy naszej aplikacji możliwość ładowania *usług*, czy też po prostu wtyczek, znajdujących się w *classpath* oraz metodę, która odwoła się do nich w poszukiwaniu definicji wskazanego przez użytkownika słowa:

```java
package com.example.dictionary;

import com.example.dictionary.spi.Dictionary;
import java.util.Iterator;
import java.util.ServiceConfigurationError;
import java.util.ServiceLoader;

public class DictionaryService {

    private static DictionaryService service;
    private ServiceLoader loader;

    /**
    * Creates a new instance of DictionaryService
    */
    private DictionaryService() {
        loader = ServiceLoader.load(Dictionary.class);
    }

    /**
    * Retrieve the singleton static instance of DictionaryService.
    */
    public static synchronized DictionaryService getInstance() {
        if (service == null) {
            service = new DictionaryService();
        }
        return service;
    }

    /**
    * Retrieve definitions from the first provider
    * that contains the word.
    */
    public String getDefinition(String word) {
        String definition = null;

        try {
            Iterator dictionaries = loader.iterator();
            while (definition == null &amp;amp;&amp;amp; dictionaries.hasNext()) {
                Dictionary d = dictionaries.next();
                definition = d.getDefinition(word);
            }
        } catch (ServiceConfigurationError serviceError) {
            definition = null;
            serviceError.printStackTrace();
        }
        return definition;
    }
}
```

Teraz jesteśmy gotowi do zaimplementowania pierwszej wtyczki:

```java
package com.example.dictionary;

import com.example.dictionary.spi.Dictionary;
import java.util.SortedMap;
import java.util.TreeMap;

public class GeneralDictionary implements Dictionary {

    private SortedMapmap;

    /** Creates a new instance of GeneralDictionary */
    public GeneralDictionary() {
        map = new TreeMap();
        map.put("book", "a set of written or printed pages, usually bound with " +
        "a protective cover");
        map.put("editor", "a person who edits");
    }

    public String getDefinition(String word) {
        return map.get(word);
    }
}
```

Gdy już to zrobimy, pozostaje nam tylko zbudowanie pliku JAR ze stworzoną przez nas klasą, który powinien posiadać następującą strukturę:

![Zawartość pliku JAR](/assets/images/uploads/2009/12/jarcontent.gif)

W katalogu */META-INF/services/* umieszczamy plik o nazwie takiej samej, jak pełna, kwalifikowana nazwa klasy rozszerzanego interfejsu, który musi zawierać pełną, kwalifikowaną nazwę klasy stworzonej przez nas wtyczki.

I ot, cała filozofia. Teraz pozostaje tylko napisać program, który będzie korzystał z naszego mechanizmu wtyczek i *voila*!
