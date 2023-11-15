---
title: Logowanie wybranych pakietów w log4j z poziomu aplikacji
category:
  - technologies
  - java
tag:
  - java
  - log4j
permalink: /logowanie-wybranych-pakietow-w-log4j-z-poziomu-aplikacji-275.html
date: 2009-12-24 22:20:28 +00:00
modified: 2018-07-19 07:04:54 +00:00
---


Gdy piszemy aplikację, która korzysta ze sprawdzonych bibliotek, które do logowania wykorzystują *log4j'a*, możemy chcieć odpuścić sobie logowanie informacji z klas znajdujących się w wybranych pakietach tychże bibliotek. Poniższy kod przedstawia klasę filtru, który pozwala włączyć lub wyłączyć logowanie informacji z wybranego pakietu i całej jego podrzędnej struktury.

<!--more-->

```java
*
*  PackageFilter.java
*
*  Copyright (C) 2009  Kamil Dybicz
*
*  This library is free software; you can redistribute it and/or
*  modify it under the terms of the GNU Lesser General Public
*  License as published by the Free Software Foundation; either
*  version 3 of the License, or (at your option) any later version.
*
*  This program is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
*  Lesser General Public License for more details.
*
*  You should have received a copy of the GNU Lesser General Public
*  License along with this library. If not, see <http://www.gnu.org/licenses/>.
*/
package net.javaio.log4j.spi;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.spi.Filter;
import org.apache.log4j.spi.LoggingEvent;

/**
*
* @author Kamil Dybicz
*/
public class PackageFilter extends Filter {

    private boolean acceptOnMatch = true;
    private String packageNameToMatch;

    public PackageFilter() {
        setAcceptOnMatch(true);
        setPackageNameToMatch(null);
    }

    public PackageFilter(String packageNameToMatch) {
        setAcceptOnMatch(true);
        setPackageNameToMatch(packageNameToMatch);
    }

    public PackageFilter(String packageNameToMatch, boolean acceptOnMatch) {
        setAcceptOnMatch(acceptOnMatch);
        setPackageNameToMatch(packageNameToMatch);
    }

    @Override
    public int decide(LoggingEvent e) {
        boolean acceptOnMatch;
        String packageNameToMatch;

        synchronized (this) {
            acceptOnMatch = this.acceptOnMatch;
            packageNameToMatch = this.packageNameToMatch;
        }

        String className = e.getLocationInformation().getClassName();
        if (StringUtils.isNotBlank(packageNameToMatch)) {
            if (className.startsWith(packageNameToMatch)) {
                if (acceptOnMatch) {
                    return ACCEPT;
                } else {
                    return DENY;
                }
            }
        }

        return NEUTRAL;
    }

    public synchronized void setAcceptOnMatch(boolean acceptOnMatch) {
        this.acceptOnMatch = acceptOnMatch;
    }

    public synchronized boolean isAcceptOnMatch() {
        return acceptOnMatch;
    }

    public synchronized String getPackageNameToMatch() {
        return packageNameToMatch;
    }

    public synchronized void setPackageNameToMatch(String packageNameToMatch) {
        this.packageNameToMatch = packageNameToMatch;
    }
}
```

Wykorzystanie powyższej klasy jest bardzo proste i może wyglądać następująco:

```java
ConsoleAppender consoleAppender = new ConsoleAppender(new PatternLayout(„%d{ISO8601} %p [%c{1}:%L] %m%n”));
consoleAppender.addFilter(new PackageFilter(„org.apache”, false));
consoleAppender.setThreshold(Level.ALL);

BasicConfigurator.configure(consoleAppender);
```

W efekcie działania powyższego kodu, na konsoli będą wyświetlane wszelkie komunikaty, niezależnie od poziomu logowania oraz nazwy i położenia klasy z której są logowane, z wyłączeniem klas znajdujących się w pakiecie *org.apache*.
