---
title: Naprawianie starych błędów, czyli wątek o Swingu
category:
  - java
  - technologies
tag:
  - edt
  - java
  - swing
  - testing
  - threads
permalink: /naprawianie-starych-bledow-czyli-watek-o-swingu-410.html
date: 2010-06-07 11:50:07 +00:00
modified: 2018-07-18 18:07:03 +00:00
---


Jeśli nie wiesz, czym dokładnie jest *Event Dispatch Thread* polecam artykuł [Threads and Swing](http://java.sun.com/products/jfc/tsc/articles/threads/threads1.html). Daje on niejakie pojęcie o tym *co, gdzie, jak i dlaczego* działa w *Swing*'u tak, a nie inaczej.

Jeśli wiesz już o co chodzi z *EDT* i rozumiesz, jakie *problemy* może powodować zmienianie *GUI* z poziomu wątku innego niż *EDT*, możesz chcieć zapoznać się z opisem projektu [swinghelper](http://weblogs.java.net/blog/alexfromsun/archive/2006/02/debugging_swing.html) opublikowanego na łamach serwisu [java.net](https://java.net/), a w szczególności z działem *Debugging and testing*.

<!--more-->

O co mi dokładnie chodzi? Otóż, o to, że nie tylko początkującym programistom zdarza się wywoływać np: *setText(...)* z niewłaściwego wątku. Często też, dopiero po jakimś czasie dowiadujemy się, że takie działanie, to *zło* 🙂 Dlatego też, dobrze jest sprawdzić, czy to właśnie nie z powodu takich błędów aplikacje pisane niegdyś lub nawet aktualnie, czasem jakoś dziwnie się zachowują.

A sprawdzić to można naprawdę prosto. Wystarczy do sprawdzanego projektu dołączyć bibliotekę [debug.jar](https://swinghelper.dev.java.net/bin/debug/debug.jar) i na początku *main'a* głównej klasy dodać:

```java
javax.swing.RepaintManager.setCurrentManager(new org.jdesktop.swinghelper.debug.CheckThreadViolationRepaintManager());
```

Osobiście preferuje bardziej ambitny kod, pozwalający na usunięcie z dystrybucji pliku *debug.jar* bez konieczności modyfikowania kodu:

```java
static {
	if (System.getProperty("edt.debug", "false").equals("true")) {
		try {
			Class clazz = Class.forName("org.jdesktop.swinghelper.debug.CheckThreadViolationRepaintManager");
			javax.swing.RepaintManager.setCurrentManager((RepaintManager) clazz.newInstance());

			log.debug("EDT Debug enabled");
		} catch (Exception ex) {
			log.error("Error while initializing EDT Debug mode", ex);
		}
	}
}
```

Dla celów czysto testowych, możesz też  odpalić poniższy przykład:

```java
/*
* TestFrame.java
*
* Copyright (C) 2010 Kamil Dybicz
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library. If not, see <http://www.gnu.org/licenses/>.
*/

public class TestFrame extends javax.swing.JFrame {

	private javax.swing.JButton badOneButton;
	private javax.swing.JButton goodOneButton;
	private javax.swing.JButton goodTwoButton;
	private javax.swing.JScrollPane scrollPane;
	private javax.swing.JTextArea textArea;

	public TestFrame() {
		java.awt.GridBagConstraints gridBagConstraints;

		goodOneButton = new javax.swing.JButton();
		goodTwoButton = new javax.swing.JButton();
		badOneButton = new javax.swing.JButton();
		scrollPane = new javax.swing.JScrollPane();
		textArea = new javax.swing.JTextArea();

		setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
		getContentPane().setLayout(new java.awt.GridBagLayout());

		goodOneButton.setText("Good One");
		goodOneButton.addActionListener(new java.awt.event.ActionListener() {

			public void actionPerformed(java.awt.event.ActionEvent evt) {
				goodOneButtonActionPerformed(evt);
			}
		});
		gridBagConstraints = new java.awt.GridBagConstraints();
		gridBagConstraints.gridx = 0;
		gridBagConstraints.gridy = 0;
		gridBagConstraints.weightx = 0.3;
		gridBagConstraints.insets = new java.awt.Insets(10, 10, 5, 5);
		getContentPane().add(goodOneButton, gridBagConstraints);

		goodTwoButton.setText("Good Two");
		goodTwoButton.addActionListener(new java.awt.event.ActionListener() {

			public void actionPerformed(java.awt.event.ActionEvent evt) {
				goodTwoButtonActionPerformed(evt);
			}
		});
		gridBagConstraints = new java.awt.GridBagConstraints();
		gridBagConstraints.gridx = 1;
		gridBagConstraints.gridy = 0;
		gridBagConstraints.weightx = 0.3;
		gridBagConstraints.insets = new java.awt.Insets(10, 5, 5, 5);
		getContentPane().add(goodTwoButton, gridBagConstraints);

		badOneButton.setText("Bad One");
		badOneButton.addActionListener(new java.awt.event.ActionListener() {

			public void actionPerformed(java.awt.event.ActionEvent evt) {
				badOneButtonActionPerformed(evt);
			}
		});
		gridBagConstraints = new java.awt.GridBagConstraints();
		gridBagConstraints.gridx = 2;
		gridBagConstraints.gridy = 0;
		gridBagConstraints.weightx = 0.3;
		gridBagConstraints.insets = new java.awt.Insets(10, 5, 5, 10);
		getContentPane().add(badOneButton, gridBagConstraints);

		textArea.setColumns(20);
		textArea.setRows(5);
		scrollPane.setViewportView(textArea);

		gridBagConstraints = new java.awt.GridBagConstraints();
		gridBagConstraints.gridx = 0;
		gridBagConstraints.gridy = 1;
		gridBagConstraints.gridwidth = 3;
		gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
		gridBagConstraints.weightx = 1.0;
		gridBagConstraints.weighty = 1.0;
		gridBagConstraints.insets = new java.awt.Insets(5, 10, 10, 10);
		getContentPane().add(scrollPane, gridBagConstraints);

		pack();
	}

	private void goodOneButtonActionPerformed(java.awt.event.ActionEvent evt) {
		textArea.setText("1");
	}

	private void goodTwoButtonActionPerformed(java.awt.event.ActionEvent evt) {
		new Thread() {

			@Override
			public void run() {
				javax.swing.SwingUtilities.invokeLater(new Runnable() {

					public void run() {
						textArea.setText("2");
					}
				});
			}
		}.start();
	}

	private void badOneButtonActionPerformed(java.awt.event.ActionEvent evt) {
		new Thread() {

			@Override
			public void run() {
				textArea.setText("3");
			}
		}.start();
	}

	/**
	* @param args the command line arguments
	*/
	public static void main(String args[]) {
		javax.swing.RepaintManager.setCurrentManager(new org.jdesktop.swinghelper.debug.CheckThreadViolationRepaintManager());

		java.awt.EventQueue.invokeLater(new Runnable() {

			public void run() {
				new TestFrame().setVisible(true);
			}
		});
	}
}
```

Wyświetli on proste okienko z trzema przyciskami i polem tekstowym.

![Test Frame](/assets/images/uploads/2010/05/TestFrame.png)

Przycisk *Good One* ustawi w polu testowym "1", *Good Two* ustawi "2", a *Bad One* ustawi "3" oraz spowoduje, iż na konsoli pojawi się błąd podobny do poniższego:

```java
EDT violation detected
javax.swing.JTextArea[,0,0,278x80,layout=...]
	at java.lang.Thread.getStackTrace(Thread.java:1436)
	at org.jdesktop.swinghelper.debug.CheckThreadViolationRepaintManager.checkThreadViolations(Unknown Source)
	at org.jdesktop.swinghelper.debug.CheckThreadViolationRepaintManager.addDirtyRegion(Unknown Source)
	at javax.swing.JComponent.repaint(JComponent.java:4734)
	at java.awt.Component.repaint(Component.java:3124)
	at javax.swing.text.PlainView.damageLineRange(PlainView.java:572)
	at javax.swing.text.PlainView.updateDamage(PlainView.java:533)
	at javax.swing.text.PlainView.insertUpdate(PlainView.java:425)
	at javax.swing.plaf.basic.BasicTextUI$RootView.insertUpdate(BasicTextUI.java:1590)
	at javax.swing.plaf.basic.BasicTextUI$UpdateHandler.insertUpdate(BasicTextUI.java:1849)
	at javax.swing.text.AbstractDocument.fireInsertUpdate(AbstractDocument.java:185)
	at javax.swing.text.AbstractDocument.handleInsertString(AbstractDocument.java:734)
	at javax.swing.text.AbstractDocument.insertString(AbstractDocument.java:693)
	at javax.swing.text.PlainDocument.insertString(PlainDocument.java:114)
	at javax.swing.text.AbstractDocument.replace(AbstractDocument.java:655)
	at javax.swing.text.JTextComponent.setText(JTextComponent.java:1693)
	at TestFrame$5.run(TestFrame.java:124)
```

Dzięki któremu dowiemy się, iż najprawdopodobniej mamy błąd w linii 124 klasy *TestFrame*, polegający na zmianie *GUI* spoza wątku *EDT*.
