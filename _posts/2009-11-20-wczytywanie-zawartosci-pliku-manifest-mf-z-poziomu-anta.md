---
title: Wczytywanie zawartości pliku MANIFEST.MF z poziomu Ant'a
category:
  - ant
  - technologies
tag:
  - ant
  - java
permalink: /wczytywanie-zawartosci-pliku-manifest-mf-z-poziomu-anta-212.html
date: 2009-11-20 12:27:39 +00:00
modified: 2018-07-19 07:35:30 +00:00
---


Zdarza się czasem, że przydałoby się wyciągnąć z jar'a jakiejś biblioteki informacje na przykład o numerze jej wersji lub jej dostawcy. O ile dostanie się do pliku manifestu (*/META-INF/MANIFEST.MF*) z poziomu Javy nie powinno stanowić problemu, to wyciągnięcie jakichkolwiek informacji z poziomu Ant'a nie wydaje się już takie oczywiste.

<!--more-->

Jeśli zastanawia kogoś, do czego mogą być potrzebne takie informacje, to jako przykład mogę podać konieczność dostarczania tworzonej przez nas biblioteki, która występuje w kilku wersjach, gdzie każda z nich zależna jest od innej wersji jakiejś innej biblioteki. W takiej sytuacji dobrze byłoby w pliku manifestu naszej biblioteki umieścić informację o tym od jakiej wersji tej innej biblioteki zależna jest nasza. Ant może pomóc to zautomatyzować.

Poniżej przedstawiam znaleziony przeze mnie w sieci kod makra, które wczytuje wartości kluczy z pliku *MANIFEST.MF* ze wskazanego pliku JAR, nadaje im określony przedrostek, a następnie dodaje je do properties'ów Ant'a.

```xml
<!--
Loads entries from a manifest file.
@jar     The jar from where to read
@prefix  A prefix to prepend
-->
<macrodef name="loadmf">
    <attribute name="jar"/>
    <attribute name="prefix" default=""/>
    <sequential>
        <loadproperties>
            <!-- Load the manifest entries -->
            <zipentry zipfile="@{jar}" name="META-INF/MANIFEST.MF"/>
            <!-- Add the prefix -->
            <filterchain>
                <prefixlines prefix="@{prefix}"/>
            </filterchain>
        </loadproperties>
    </sequential>
</macrodef>

<target ...>
    <!-- Read mf entries -->
    <loadmf jar="lib/biblioteka.jar" prefix="przedrostek."/>

    <!-- Print them -->
    <echoproperties prefix="przedrostek."/>
</target>
```
