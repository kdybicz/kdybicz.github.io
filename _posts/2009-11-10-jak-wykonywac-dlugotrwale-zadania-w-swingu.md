---
title: Jak wykonywać długotrwałe zadania w Swing'u
category:
  - java
  - technologies
tag:
  - java
  - swing
  - swingworker
  - threads
permalink: /jak-wykonywac-dlugotrwale-zadania-w-swingu-819.html
date: 2009-11-10 10:28:37 +00:00
modified: 2018-07-19 07:56:03 +00:00
---


Odkąd zacząłem pisać w Javie bardziej złożone aplikacje, które musiały na przykład komunikować się z jakimiś webowymi usługami lub wykonywać dłuższe obliczenia, miewałem problemy z *zamarzającym* GUI. Próbowałem problem ten rozwiązać na wiele sposobów, jednak zawsze znalazło się coś, co nie działało tak jak powinno - jak chociażby labele lub pola tekstowe, które powinny wyświetlać informacje o postępie zadania, a przez cały czas aż do zakończenia zadania pozostawały niezmienione.

<!--more-->

Skonsultowałem się z bratem Google i zapoznałem z kilkoma odnalezionymi przy jego pomocy [linkami](#linki), dzięki którym udało mi się opracować wizję działania Swinga i wątków w Javie.

I tak oto wszystko rozbija się o *EDT*, czyli *Event Dispatch Thread*. Jest to wątek, w którym są odrysowywane okna wraz z zawartością oraz obsługiwane wywołane z GUI akcje i zdarzenia. Ma to swoje plusy, gdyż na przykład zmiana zawartości labela w reakcji na wciśnięcie przycisku odniesie natychmiastowy i widoczny skutek. Jednak, jeśli w akcji tego samego przycisku odpalimy algorytm obliczający liczbę PI, to okaże się, że okienka nie odpowiadają, gdyż wątek *EDT* odpowiedzialny za ich odrysowywanie i obsługę, jest zajęty obliczaniem PI.

Logicznym w takiej sytuacji wydawałoby się, aby w akcji przycisku odpalić nasz algorytm w osobnym wątku, który będzie działał równolegle z *EDT*. Gdy tak zrobimy okaże się, że faktycznie nasze okienko nie będzie już blokowane. Pojawi się jednak inny problem, gdy z wątku obliczającego algorytm będziemy chcieli na przykład zmienić wartość pola tekstowego zawierającego obliczoną dotychczas wartość liczby PI. Problem ten związany jest z tym, że metody zmieniające coś w GUI, takie jak na *setText(...)* powinny być wywoływane z poziomu *EDT*, gdyż wywołanie ich poza kontrolą tego wątku nie daje nam gwarancji, że odniosą natychmiastowy skutek. Rozwiązaniem tego problemu jest klasa *SwingUtilities* i jedna z jej metod, tj. *invokeLater*.

Poniżej złączam przerobiony przeze mnie kod przykładowej aplikacji, pokazujący jak powinno się wykonywać długotrwałe zadania w Swingu oraz jakich pomyłek należy się wystrzegać. Jako, że od Javy 1.6 mamy dostęp do klasy *SwingWorker*, która przeznaczona jest do wykonywania takich właśnie zadań, załączam również przykład wykorzystania tej klasy.

```java
import java.util.List;
import javax.swing.SwingUtilities;
import javax.swing.SwingWorker;

public class InvokeExample extends javax.swing.JFrame {

    private javax.swing.JButton badWayOneButton;
    private javax.swing.JButton badWayTwoButton;
    private javax.swing.JButton goodNewWayButton;
    private javax.swing.JButton goodOldWayButton;
    private javax.swing.JLabel statusLabel;

    public InvokeExample() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        goodOldWayButton = new javax.swing.JButton();
        goodNewWayButton = new javax.swing.JButton();
        badWayOneButton = new javax.swing.JButton();
        badWayTwoButton = new javax.swing.JButton();
        statusLabel = new javax.swing.JLabel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setLocationByPlatform(true);
        getContentPane().setLayout(new java.awt.GridBagLayout());

        goodOldWayButton.setText("Dobrze (po staremu)");
        goodOldWayButton.addActionListener(new java.awt.event.ActionListener() {

            public void actionPerformed(java.awt.event.ActionEvent evt) {
                goodOldWayButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 0.25;
        gridBagConstraints.insets = new java.awt.Insets(10, 10, 5, 5);
        getContentPane().add(goodOldWayButton, gridBagConstraints);

        goodNewWayButton.setText("Dobrze (po nowemu)");
        goodNewWayButton.addActionListener(new java.awt.event.ActionListener() {

            public void actionPerformed(java.awt.event.ActionEvent evt) {
                goodNewWayButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 0.25;
        gridBagConstraints.insets = new java.awt.Insets(10, 5, 5, 5);
        getContentPane().add(goodNewWayButton, gridBagConstraints);

        badWayOneButton.setText("Pierwszy zły");
        badWayOneButton.addActionListener(new java.awt.event.ActionListener() {

            public void actionPerformed(java.awt.event.ActionEvent evt) {
                badWayOneButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 0.25;
        gridBagConstraints.insets = new java.awt.Insets(10, 5, 5, 5);
        getContentPane().add(badWayOneButton, gridBagConstraints);

        badWayTwoButton.setText("Drugi zły");
        badWayTwoButton.addActionListener(new java.awt.event.ActionListener() {

            public void actionPerformed(java.awt.event.ActionEvent evt) {
                badWayTwoButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.fill = java.awt.GridBagConstraints.HORIZONTAL;
        gridBagConstraints.weightx = 0.25;
        gridBagConstraints.insets = new java.awt.Insets(10, 5, 5, 10);
        getContentPane().add(badWayTwoButton, gridBagConstraints);

        statusLabel.setText("Gotowe");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 1;
        gridBagConstraints.gridwidth = 4;
        gridBagConstraints.weightx = 1.0;
        gridBagConstraints.insets = new java.awt.Insets(5, 10, 10, 10);
        getContentPane().add(statusLabel, gridBagConstraints);

        pack();
    }

    private void goodOldWayButtonActionPerformed(java.awt.event.ActionEvent evt) {
        statusLabel.setText("Proszę czekać...");
        setButtonsEnabled(false);

        // Wykonujemy coś, co zajmuje dużo czasu, więc odpalamy to w
        // wątku i aktualizujemy stan, gdy zadanie zostane wykonane.
        Thread worker = new Thread() {

            public void run() {
                // Coś co zajmuje dużo czasu ... w prawdziwym życiu, może to
                // być na przykład pobieranie danych z bazy danych,
                // wywołanie zdalnej metody, itp.
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException ex) {
                }

                // Aktualizujemy status zadania wykorzystując invokeLater().
                SwingUtilities.invokeLater(new Runnable() {

                    public void run() {
                        statusLabel.setText("Gotowe");
                        setButtonsEnabled(true);
                    }
                });
            }
        };

        worker.start(); // Uruchamiamy wątek, aby nie blokować EDT.
    }

    private void goodNewWayButtonActionPerformed(java.awt.event.ActionEvent evt) {
        setButtonsEnabled(false);

        // Wykonujemy to samo zadanie, tym razem korzystając z klasy
        // SwingWorker'a.
        SwingWorker worker = new SwingWorker() {

            @Override
            protected void process(List chunks) {
                // Aktualizujemy status zadania wykorzystując fakt, że metoda
                // process() wykonywana jest w EDT.
                statusLabel.setText(chunks.get(0).toString());
            }

            @Override
            protected Object doInBackground() throws Exception {
                try {
                    publish("Proszę czekać...");

                    Thread.sleep(5000);
                } catch (InterruptedException ex) {
                }

                return null;
            }

            @Override
            protected void done() {
                // Aktualizujemy status zadania wykorzystując fakt, że metoda
                // done() wykonywana jest w ETD.
                statusLabel.setText("Gotowe");
                setButtonsEnabled(true);
            }
        };
        worker.execute(); // Uruchamiamy SwingWorker'a, aby nie blokować EDT.
    }

    private void badWayOneButtonActionPerformed(java.awt.event.ActionEvent evt) {
        statusLabel.setText("Proszę czekać...");
        setButtonsEnabled(false);

        // Wykonujemy to samo zadanie, tym razem jednak bez wykorzystania
        // dodatkowego wątku.
        try {
            Thread.sleep(5000); // Głodzimy wątek EDT
        } catch (InterruptedException ex) {
        }

        // Aktualizujemy status zadania.
        statusLabel.setText("Gotowe");
        setButtonsEnabled(true);
    }

    private void badWayTwoButtonActionPerformed(java.awt.event.ActionEvent evt) {
        statusLabel.setText("Proszę czekać... ");
        setButtonsEnabled(false);

        // Przykład niewłaściwego wykorzystania invokeLater().
        // Runnable nie powinien głodzić wątku EDT.
        SwingUtilities.invokeLater(new Runnable() {

            public void run() {
                try {
                    // Dispatch thread is starving!
                    Thread.sleep(5000);
                } catch (InterruptedException ex) {
                }

                // Aktualizujemy status zadania.
                statusLabel.setText("Gotowe");
                setButtonsEnabled(true);
            }
        });
    }

    // Pozwala włączać i wyłaczać przyciski.
    private void setButtonsEnabled(boolean b) {
        goodOldWayButton.setEnabled(b);
        goodNewWayButton.setEnabled(b);
        badWayOneButton.setEnabled(b);
        badWayTwoButton.setEnabled(b);
    }

    public static void main(String args[]) {
        java.awt.EventQueue.invokeLater(new Runnable() {

            public void run() {
                new InvokeExample().setVisible(true);
            }
        });
    }
}
```

Tak wygląda okno testowej aplikacji:

![invokeExample](/assets/images/uploads/2009/11/invokeExample1.png)

<a name="linki"></a>Przydatne linki:
- [Concurrency in Swing](http://java.sun.com/docs/books/tutorial/uiswing/concurrency/index.html)
- [SwingWorker](http://java.sun.com/javase/6/docs/api/javax/swing/SwingWorker.html)
- [How to handle long-running tasks in a Swing application](http://www.java-tips.org/java-se-tips/javax.swing/how-to-handle-long-running-tasks-in-a-swing-applic.html)

