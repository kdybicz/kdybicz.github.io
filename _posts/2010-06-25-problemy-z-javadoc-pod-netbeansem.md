---
title: Problemy z JavaDoc pod NetBeans'em
category:
  - java
  - technologies
tag:
  - ant
  - java
  - netbeans
permalink: /problemy-z-javadoc-pod-netbeansem-436.html
date: 2010-06-25 19:46:52 +00:00
modified: 2018-07-19 06:45:33 +00:00
---


Natknąłem się dzisiaj na ciekawy problem. Otóż, chciałem do *JavaDoc*'a opisywanej przeze mnie klasy dodać obrazek. Niby nic niezwykłego, bo podobno wystarczy dodać katalog *doc-files* w pakiecie z klasą, wrzucić tam obrazek, a w *JavaDoc*'u wpisać coś a'la:

```java
 /*
  * ...
  * <img src="/doc-files/grafika.png" alt="Opis obrazka...">
  * ...
  */
```

<!--more-->

Zrobiłem więc jak kazali i odpaliłem generowanie *JavaDoc*'a wybierając z menu *NetBeans*'a *Run -> Generate JavaDoc*. I co? I nic. No, może nie do końca. Wszakże dokumentacja została wygenerowana, jednak zamiast obrazka, była ikona mówiąca, że nie znaleziono grafiki wskazywanej przez adres znacznika *&lt;img&gt;*. Adres według mnie wskazywał gdzie trzeba, więc przyjrzałem się strukturze katalogów dokumentacji. Okazało się, że katalog *doc-files* w ogóle nie został skopiowany. Nie zauważyłem również, aby ustawienia projektu (*Build -> Documenting*) zawierały jakieś ciekawe opcje, którymi mógłbym włączyć kopiowanie *doc-files.* Jak zwykle w takich sytuacjach skorzystałem z pomocy [Google](https://www.google.pl/search?&amp;q=images+in+Javadoc), aby upewnić się, że czynności które wykonałem, wykonałem prawidłowo.

W jednym ze zwróconych linków znalazłem [ten artykuł](http://www.javaworld.com/community/node/2587). Okazało się, że nie kopiowanie *doc-files* to przypadłość *NetBeans*'a i że jest na nią prosty sposób... który, jak wynikło z autopsji (i komentarza), nie działa. Dalsze poszukiwania nie były również zbyt owocne, więc postanowiłem wykorzystać pomysł, który znalazłem w jednym ze [źródłowych](http://forums.sun.com/thread.jspa?threadID=5244465) linków zacytowanych we wskazanym artykule.

Zatem, aby zaczarować *NetBeans*'a tak, aby kopiował *doc-files* należy do pliku *build.xml* dodać poniższy kod:

```xml
<target name="javadoc" depends="init,-javadoc-copy-doc-files,-javadoc-build,-javadoc-browse" description="Build Javadoc."/>

<target name="-javadoc-copy-doc-files">
    <copy todir="${dist.javadoc.dir}" overwrite="true" failonerror="true">
        <fileset dir="${src.dir}">
            <include name="**/doc-files/**"/>
        </fileset>
    </copy>
</target>
```

Zastępuje on stary *target* *"javadoc"* dodając do niego zależność do" *-javadoc-copy-doc-files"*, który dodany jest poniżej i który odpowiada za przekopiowanie wszystkich znalezionych katalogów *doc-files* wraz z całą zawartością.

W takiej sytuacji pozostaje mi tylko powiedzieć, jak to programiści zwykli mawiać do testerów: *u mnie działa* 🙂
