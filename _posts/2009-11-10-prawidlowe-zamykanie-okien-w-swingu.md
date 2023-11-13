---
title: Prawidłowe zamykanie okien w Swing'u
category:
  - java
  - technologies
tag:
  - java
  - swing
  - window-closing
permalink: /prawidlowe-zamykanie-okien-w-swingu-10.html
date: 2009-11-10 10:34:16 +00:00
modified: 2018-07-19 07:56:17 +00:00
---


Bawiąc się Swingiem od samego początku wydawało mi się, że aby prawidłowo zamknąć okno, wystarczy w akcji przycisku **Zamknij** wywołać:

```java
private void closelButtonActionPerformed(java.awt.event.ActionEvent evt) {
    this.dispose();
}
```

Okazuje się jednak, że niekoniecznie jest to prawidłowe podejście, ponieważ jeśli wywołamy bezpośrednio *dispose()*, to nie zostaną poinformowane listenery okna oczekujące na zdarzenie zamykania okna. Co za tym idzie, zachowanie aplikacji będzie inne, niż w przypadku wciśnięcia przycisku **X** zamykającego okno. Zazwyczaj jednak chcemy zachować spójność działania aplikacji i obsługi zdarzeń.
<!--more-->
Dlatego też, lepszym rozwiązaniem może okazać się wysłanie komunikatu o chęci zamknięcia okna do systemowej kolejki zdarzeń:

```java
private void closelButtonActionPerformed(java.awt.event.ActionEvent evt) {
    java.awt.Toolkit.getDefaultToolkit().getSystemEventQueue().postEvent(new java.awt.event.WindowEvent(this, java.awt.event.WindowEvent.WINDOW_CLOSING));
}
```

Dzięki temu, nie musimy sami wywoływać *dispose()*, pod warunkiem, że ustawimy:

```java
setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
```

Jeśli potrzebujemy większej elastyczności, możemy napisać WindowListener'a, który w przypadku zamykania okna będzie np. zapisywać stan aplikacji lub pytać się użytkownika, czy jest pewien, że chce zamknąć nasz cudowny program &#x1f609; Wtedy jednak, powinniśmy ustawić:

```java
setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);
```

i sami na końcu naszego listenera powinniśmy wywołać *dispose()*.
