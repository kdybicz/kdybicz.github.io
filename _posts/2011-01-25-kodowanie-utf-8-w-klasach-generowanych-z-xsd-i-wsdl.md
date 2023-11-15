---
title: Kodowanie UTF-8 w klasach generowanych z xsd i wsdl
category:
  - technologies
  - java
tag:
  - java
  - jboss
  - wsd
  - wsdl
permalink: /kodowanie-utf-8-w-klasach-generowanych-z-xsd-i-wsdl-448.html
date: 2011-01-25 08:37:51 +00:00
modified: 2018-07-18 17:54:22 +00:00
---


Jeśli zdarzyło się Wam zabrać za *WebService*'y w Javie zapewne natknęliście się na kilka ciekawych problemów, których rozwiązanie nastręczyło Wam nieraz wielu kłopotów. Ja sam miałem takowy przypadek podczas generowania klas ze schem i wsdl'i pod Winzgrozą.

<!--more-->

Narzędzia dostarczone z JDK 1.6, tj. *xjc.exe* i *wsimport.exe,* czy też z JBoss'em, tj. *wsconsume.exe* generują kod bazując na kodowaniu konsolowym i nie dają możliwości zmiany tego kodowania. Nie było to dla mnie zbytnio korzystne, gdyż docelowym kodowaniem w projekcie było UTF-8.

Rozwiązań widziałem kilka. Otóż, można było ręcznie, przy użyciu np: Notepad++, konwertować kodowanie każdego z plików osobno, albo też można było poszukać programu, który przetworzy pliki "wsadowo". Okazało się jednak, że można nieco na około zmusić JDK i JBossa do użycia wybranego przeze mnie kodowania. Trzeba się niestety nieco "ubabrać" tworząc sobie na podorędziu pomocnicze pliki BAT. Poniżej załączam przykłady pokazujące, jak można stworzyć sobie takie pliki dla narzędzi z JDK, z JBossem postępujemy analogicznie.

Przykładowy plik *xjc.bat*:

```plaintext
ECHO OFF
SETLOCAL

IF "%JAVA_HOME%" == "" (
	ECHO System property JAVA_HOME is't set.
	EXIT /B
)

IF EXIST %1 (
	IF NOT EXIST %2 (
		MKDIR %2
		ECHO %2 directory was created.
	)

	ECHO Trying to generate source code from %1 to directory %2
) ELSE (
	ECHO Proper usage: xcj.bat file.xsd dest_dir
	EXIT /B;
)

SET JAVA_OPTS=%JAVA_OPTS% -Dfile.encoding=utf-8
SET JAVA=%JAVA_HOME%\bin\java
SET XSD_FILE="%1"
SET SRC_DIR="%2"

CALL "%JAVA_HOME%\bin\java" %JAVA_OPTS% -cp "%JAVA_HOME%\lib\tools.jar" com.sun.tools.internal.xjc.XJCFacade -d %SRC_DIR% -no-header %XSD_FILE%

ENDLOCAL
PAUSE
```

Przykładowy plik *wsimport.bat*:

```plaintext
ECHO ON
SETLOCAL

IF "%JAVA_HOME%" == "" (
	ECHO System property JAVA_HOME is't set.
	EXIT /B
)

IF EXIST %1 (
	IF NOT EXIST %2 (
		MKDIR %2
		ECHO %2 directory was created.
	)

	ECHO Trying to generate source code from %1 to directory %2
) ELSE (
	ECHO Proper usage: wsimport.bat file.wsdl dest_dir
	EXIT /B;
)

SET JAVA_OPTS=%JAVA_OPTS% -Dfile.encoding=utf-8
SET JAVA=%JAVA_HOME%\bin\java
SET WSDL_FILE="%1"
SET SRC_DIR="%2"

CALL "%JAVA_HOME%\bin\java" %JAVA_OPTS% -cp "%JAVA_HOME%\lib\tools.jar" com.sun.tools.internal.ws.WsImport -s %SRC_DIR% -Xnocompile WSDL_FILE%

ENDLOCAL
PAUSE
```
