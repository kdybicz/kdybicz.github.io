---
title: Numerowanie wersji oprogramowania
category:
  - technologies
  - java
tag:
  - ant
  - jar
  - java
permalink: /numerowanie-wersji-oprogramowania-331.html
date: 2010-05-27 10:20:21 +00:00
modified: 2018-07-19 06:41:27 +00:00
---


Nadawanie numerów wersji kolejnym wydaniom bibliotek, czy też aplikacji z oczywistych względów wydaje się być co najmniej wskazanym. Pozostaje jednak pytanie, jak to robić?

<!--more-->

Zasadniczo, zagadnienie to rozłożyć można na dwa mniejsze:

Pierwsze, to logika/strategia wersjonowania kolejnych wydań? Skłania nas ona do odpowiedzenia sobie na kilka pytań, np.: jaki format numeracji wersji przyjmiemy, np.: a'la [JBoss](http://community.jboss.org/wiki/JBossProjectVersioning), czy może a'la [Microsoft](https://msdn.microsoft.com/en-us/library/aa372488(v=VS.85).aspx)? Czy będzie składać się on z 2, 3, 4, a może 5 liczb? Czy uwzględnimy w nim numer *rewizji*, czy może numer *build'a*? Czy będziemy używać oznaczeń rodzajów wydań? Jeśli tak, to czy będą one znaczące, np.: *1.0.0-Alpha < 1.0.0-RC*?  itp...

Drugie, to strona techniczna, tj.: czy numer wersji umieścimy po prostu jako plik tekstowy w katalogu aplikacji lub pliku *Jar*? Czy nazwy kolejnych plików *Jar* lub katalogów będą zawierać numer wersji? Czy może w plikach *Jar* będziemy umieszczać numer wersji tylko i wyłącznie w *Manifeście*? No i oczywiście, w jaki sposób będziemy zapamiętywać, zliczać i umieszczać kolejne numery wersji?...

Odpowiedzi na wszystkie te pytania zależeć będą zapewne głównie od Waszych indywidualnych upodobań lub ewentualnych wymagań, dlatego też nie zamierzam nikogo usilnie przekonywać do stosowania takiego, a nie innego schematu. Postaram się za to przedstawić, jak z tym problemem można poradzić sobie w dość prosty sposób, jako przykład podając praktykowaną przeze mnie strategię.

A zatem:

1\. Format zapisu numeru

Wybrałem zapis trój-liczbowy, gdyż uważam, iż trzy liczby w zupełności wystarczą do oznaczenia małych i dużych poprawek oraz kolejnych wydań. Dodatkowo, za numerem wersji umieszczam 'nieznaczące' informacje, takie jak numer rewizji i ewentualnie rodzaj wydania. Przykładowo: *1.2.2 (347)* lub *1.3.7 (545) Beta*. Określenie, jakie informacje są znaczące, a jakie nie, miało dla mnie znaczenie, gdyż potrzebowałem tej informacji, aby zaimplementować programową obsługę rozróżniania poszczególnych numerów ... ale o tym innym razem.

2\. Miejsce umieszczania numeru wersji

Numer wersji umieszczam w każdym tworzonym przeze mnie pliku *Jar*, w pliku *Manifestu*, wykorzystując do tego celu atrybut *Implementation-Version*. Dodatkowo, numer ten umieszczam w nazwie każdego budowanego plik *Jar* biblioteki, paczki dystrybucyjnej (*zip*, *tar.bz*), czy też pliku instalatora aplikacji. Jednakże, katalogi w archiwach, jak i rozpakowywane przez instalator nie są przeze mnie numerowane.

3\. Sposób zliczania i umieszczania numeru wersji

Do zautomatyzowania kompilacji, budowania *Jar'ów* i paczek wykorzystuje *Ant'a*. Dlatego też, naturalnym wydaje się, iż wykorzystuje jego dobrodziejstwa, do odwalenia za mnie brudnej roboty z numerowaniem 🙂 Nie bawię się jednak w automagiczne zliczanie numerów wersji, gdyż ewentualne ich zmiany zazwyczaj występują dość rzadko i do tego w sposób nie dający się w prosto zautomatyzować. Dlatego też, sam numer wersji przechowuje zapisany w *Ant'owym* *propertisie*:

```xml
<property name="version" value="0.0.9" />
```

Numer rewizji wyciągam z *SVN'a* w poniższy sposób (wymaga zainstalowanej konsolowej wersji klienta):

```xml
   <exec executable="cmd" failonerror="false" osfamily="Windows" resultproperty="svnOk">
        <arg line="/c svn info . --xml > svn_info.xml" />
    </exec>
    <exec executable="/bin/bash" failonerror="false" osfamily="Unix" resultproperty="svnOk">
        <arg line='-c "svn info --xml &amp;gt; svn_info.xml"' />
    </exec>
    <if>
        <equals arg1="${svnOk}" arg2="0" />
        <then>
            <xmlproperty file="svn_info.xml" prefix="svn" />
            <property name="revision" value="${svn.info.entry.commit(revision)}" />
        </then>
        <else>
            <property name="revision" value="unknown" />
        </else>
    </if>
    <echo message="Current revision: ${revision}" />
```

Po czym sklejam sobie wszystko ładnie:

```xml
   <property name="stage" value="Beta" />

    <if>
        <equals arg1="${stage}" arg2="" />
        <then>
            <property name="version.with.stage" value="${version}" />
            <property name="version.full" value="${version} (${revision})" />
        </then>
        <else>
            <property name="version.with.stage" value="${version}-${stage}" />
            <property name="version.full" value="${version} (${revision}) ${stage}" />
        </else>
    </if>
```

I gdy posiadam już pełen numer wersji, mogę umieścić go w pliku *MANIFEST.MF* budowanego pliku Jar. W przypadku *NetBeans'a* do pliku *build.xml* dodaję poniższego  *Task'a*:

```xml
   <target name="-pre-init">
        <manifest file="MANIFEST.MF" mode="replace">
            <attribute name="Built-By" value="${user.name}"/>
            <attribute name="Implementation-Title" value="${application.title}"/>
            <attribute name="Implementation-Version" value="${version.full}"/>
            <attribute name="Implementation-Vendor" value="${application.vendor}"/>
            <attribute name="Implementation-URL" value="${application.homepage}"/>
        </manifest>

        <property name="manifest.file" value="MANIFEST.MF" />
    </target>
```

Dzięki temu, za każdym razem, gdy budowany będzie plik *Jar*, zostanie umieszczony w nim stworzony automatycznie plik *Manifestu* (choć bywają z tym czasem problemy :/). W przypadku *Eclipse'a* postępuje podobnie, umieszczając blok *manifest* (bez atrybutów *file* i *mode*) w bloku *jar* budującym plik *Jar* aplikacji lub biblioteki.

W ostatnim etapie buduję paczkę dystrybucyjną, wykorzystując do tego poniższy fragment kodu:

```xml
       <move file="${dist.jar}" tofile="${dist.dir}/${application.title}-${version.with.stage}.jar" />

        <zip destfile="${application.title}-${version.with.stage}.zip" update="true" >
            <zipfileset dir="${dist.dir}" prefix="${application.title}" />
        </zip>

        <tar destfile="${application.title}-${version.with.stage}.tar.bz" compression="bzip2">
            <tarfileset dir="${dist.dir}" prefix="${application.title}" />
        </tar>
```

W kolejnych wpisach przedstawię, jak można z poziomu kodu wyciągnąć wartości poszczególnych atrybutów z pliku *Manifestu* biblioteki lub aplikacji oraz jak można w całkiem przyjemny i uniwersalny sposób opakować numer wersji w obiekt przygotowanej do tego celu klasy.

P.S.: Zwolenników wykorzystywania numeru *build'a* zamiast numeru *rewizji* może zainteresować [ta strona](https://ant.apache.org/manual/OptionalTasks/propertyfile.html).

```xml
   <property name="stage" value="" />
    <property name="version" value="1.0.0" />

    <if>
        <equals arg1="${stage}" arg2="" />
        <then>
            <property name="version.with.stage" value="${version}" />
            <property name="version.full" value="${version} (rev. ${revision})" />
        </then>
        <else>
            <property name="version.with.stage" value="${version}-${stage}" />
            <property name="version.full" value="${version} (rev. ${revision}) ${stage}" />
        </else>
    </if>
```
