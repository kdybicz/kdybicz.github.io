---
title: Jak zamknąć JFrame z potwierdzeniem?
category:
  - java
  - technologies
tag:
  - java
  - swing
  - window-closing
permalink: /jak-zamknac-jframe-z-potwierdzeniem-309.html
date: 2010-01-30 13:42:54 +00:00
modified: 2018-07-19 06:55:53 +00:00
---


Przeglądając wyniki wujka Google związane z Javą, natknąłem się kilka razy na mniej lub bardziej udane przykłady kodu wyświetlającego okno, które w momencie zamykania wyświetla dialog z zapytaniem, czy użytkownik jest pewien, że chce je zamknąć. Postanowiłem samemu przygotować podobny przykład, który przy okazji uzasadni moje podejście do mechanizmu zamykania okien przedstawione we wpisie [Zamykanie okien poprzez wciśnięcie przycisku Escape]({% post_url 2009-11-10-zamykanie-okient-poprzez-wcisniecie-przycisku-escape %}).

<!--more-->

Oto on:

```java
import javax.swing.JOptionPane;

public class AskWhenClosingFrame extends javax.swing.JFrame {

    /**
    * Konstruktor okna
    */
    public AskWhenClosingFrame() {
        setDefaultCloseOperation(javax.swing.WindowConstants.DO_NOTHING_ON_CLOSE);
        setTitle("Pytające okno");

        addWindowListener(new java.awt.event.WindowAdapter() {

            public void windowClosing(java.awt.event.WindowEvent evt) {
                formWindowClosing(evt);
            }
        });

        net.javaio.swing.SwingUtilities.installWindowClosingActionOnEscapeKey(this);
    }

    /**
    * Metoda wywoływana w przypadku próby zamknięcia okna
    *
    * @param evt
    */
    private void formWindowClosing(java.awt.event.WindowEvent evt) {
        int ans = JOptionPane.showConfirmDialog(this, "Czy na pewno zamknąć to okno?", "Pytanie?", JOptionPane.YES_NO_OPTION, JOptionPane.QUESTION_MESSAGE);

        if (ans == JOptionPane.YES_OPTION) {
            // Zamknięcie okna
            dispose();
        }
    }

    public static void main(String args[]) {
        javax.swing.SwingUtilities.invokeLater(new Runnable() {

            public void run() {
                AskWhenClosingFrame frame = new AskWhenClosingFrame();
                frame.setSize(320, 240);
                frame.setLocationRelativeTo(null);
                frame.setVisible(true);
            }
        });
    }
}
```

Dzięki wykorzystaniu metody *installWindowClosingActionOnEscapeKey* okno na wciśnięcie przycisku Escape zareaguje dokładnie tak samo, jak na użycie przycisku [X].
