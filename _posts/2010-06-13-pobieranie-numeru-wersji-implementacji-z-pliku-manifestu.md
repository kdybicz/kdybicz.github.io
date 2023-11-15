---
title: Pobieranie numeru wersji implementacji z pliku Manifestu
category:
  - technologies
  - java
tag:
  - jar
  - java
permalink: /pobieranie-numeru-wersji-implementacji-z-pliku-manifestu-348.html
date: 2010-06-13 12:52:31 +00:00
modified: 2018-07-18 18:00:44 +00:00
---


Jak obiecałem już [jakiś czas temu]({% post_url 2010-05-27-numerowanie-wersji-oprogramowania %}), pokażę w jaki sposób można pobrać numer wersji, który umieściłem w pliku *MANIFEST.MF* pod atrybutem *Implementation-Version*. Wcześniej jednak, chciałbym zwrócić Waszą uwagę na [listę wszystkich dostępnych atrybutów](http://java.sun.com/javase/6/docs/technotes/guides/jar/jar.html#Main%20Attributes) oraz specyfikację klasy [Package](http://java.sun.com/javase/6/docs/api/java/lang/Package.html#method_summary), z której będę korzystać.

<!--more-->

W czasie lektury zwróciliście zapewne uwagę na zbieżność nazw niektórych atrybutów z nazwami metod klasy [Package](http://java.sun.com/javase/6/docs/api/java/lang/Package.html#method_summary). Zbieżność ta w żadnym razie nie jest przypadkowa. I tak oto, do wyciągnięcia wartości atrybutu *Implementation-Version* posłuży nam metoda [Package#getImplementationVersion()](http://java.sun.com/javase/6/docs/api/java/lang/Package.html#getImplementationVersion()).

Poniższy kod pokazuje, jak może wyglądać metoda zwracająca numer wersji naszej implementacji:

```java
/**
 * This method is used for retriveing Implementation-Version value as
 * {@link String} from MANIFEST.MF from Jar file that is containing
 * {@code clazz}.
 *
 * @param clazz
 * @return {@link String} representing Implementation-Version value
 */
public static String getImplementationVersion(Class clazz) throws IllegalArgumentException {
	if (clazz == null) {
		throw new IllegalArgumentException("Class must be not-null");
	}

	Package pkg = clazz.getPackage();
	if (pkg != null) {
		return pkg.getImplementationVersion();
	} else {
		log.warn("There is no package for class " + clazz);
	}

	return null;
}
```

Należy zawsze **pamiętać**, aby pobierać wartości atrybutów pliku *Manifestu* za pośrednictwem klasy znajdującej się w tym samym pliku *Jar* co plik *Manifest* z którego chcemy pobierać te wartości!

*Voila!*
