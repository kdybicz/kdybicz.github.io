---
title: PMD, czyli Programming Mistake Detector…
category:
  - technologies
  - java
tag:
  - java
  - testing
permalink: /pmd-czyli-programming-mistake-detector-21.html
date: 2009-11-10 11:41:45 +00:00
modified: 2009-11-10 11:41:45 +00:00
---


[*Programming Mistake Detector*](http://pmd.sourceforge.net/) jest jednym z [wielu](http://pmd.sourceforge.net/meaning.html) proponowanych rozwinięć skrótu PMD, ale według mnie właśnie to rozwinięcie najdokładniej opisuje przeznaczenie opisywanej biblioteki.

PMD jest narzędziem, którego zadaniem jest znajdowanie w kodzie źródłowym potencjalnych błędów, takich jak puste bloki *try/catch/finally*, niewykorzystywane fragmenty kodu, nieoptymalne wykorzystanie klas *String* i *StringBuffer*, niepotrzebne użycie bloków *if* w pętlach, które można zamienić na pętle *while* oraz wykrywanie duplikatów bloków kodu.

<!--more-->

Można go używać jako aplikacji okienkowej, odpalając skrypt *bin/cpdgui.bat* lub z poziomu *Ant'a* wykorzytując na przykład poniższy *Task*:

```xml
<taskdef name=„pmd” classname=„net.sourceforge.pmd.ant.PMDTask” classpathref=„pmd.classpath” />
<target name=„pmd” depends=„compile”>
    <pmd rulesetfiles=„basic,imports,unusedcode”>
        <formatter type=„xml” toFile=„${build.dir}/test-reports/pmd_report.xml”/>
        <fileset dir=„${src.dir}”>
            <include name=„**/*.java”/>
        </fileset>
    </pmd>
</target>
```

Jako rezultat uruchomienia PMD dostajemy raport opisujący wszystkie odnalezione nieprawidłowości i ewentualne uwagi.

Mam jednak osobiście pewne małe zastrzeżenia do tej biblioteki. Otóż, jeśli w projekcie korzystamy z edytora GUI wbudowanego w NetBeans'a i tworzymy w nim wiele podobnych okienek, to bardzo prawdopodobne jest, że wśród zgłoszeń w raporcie będziemy mieli trochę informacji o duplikatach bloków kodu wskazujących na metodę inicjalizującą GUI lub bloki obsługi zdarzeń i wyjątków. Jest to jednak problem, którego raczej nie da się przeskoczyć. Nie jest on z resztą na tyle duży, aby zrezygnować z wykorzystanie tego narzędzia.

Strona projektu: [http://pmd.sourceforge.net/](http://pmd.sourceforge.net/)
