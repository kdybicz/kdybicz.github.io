---
title: Zamykanie okien poprzez wciśnięcie przycisku Escape
category:
  - java
  - technologies
tag:
  - java
  - swing
  - window-closing
permalink: /zamykanie-okient-poprzez-wcisniecie-przycisku-escape-32.html
date: 2009-11-10 11:53:50 +00:00
modified: 2018-07-19 07:43:51 +00:00
---


Zdarzyło się kilka razy, że potrzebowałem takiej właśnie funkcjonalności. Niestety, nie znalazłem nigdzie żadnego sensownego gotowca, więc ostatecznie sam napisałem taką oto prostą klasę narzędziową. Jest ona zależna od biblioteki [commons-lang](https://commons.apache.org/lang/), jednak przy odrobinie chęci można się tejże zależności bez problemu pozbyć.

<!--more-->

```java
/**
 *  SwingUtilities.java
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
package net.javaio.swing;

import java.awt.Window;
import java.awt.event.ActionEvent;
import java.awt.event.KeyEvent;
import java.awt.event.WindowEvent;
import javax.swing.AbstractAction;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.KeyStroke;
import org.apache.commons.lang.RandomStringUtils;

/**
 *
 * @author Kamil Dybicz
 */
public class SwingUtilities {

    /**
     * This method is used to install {@link WindowClosingAction} that will be
     * fired after pressing Escape key by user but only when this frame will be
     * focused window.
     *
     * @param dialog
     */
    public static void installWindowClosingActionOnEscapeKey(JFrame frame) {
        if (frame == null) {
            return;
        }

        String actionName = "WindowClosingAction-" + RandomStringUtils.randomAlphanumeric(10);
        frame.getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).put(KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), actionName);
        frame.getRootPane().getActionMap().put(actionName, new WindowClosingAction(frame));
    }

    /**
     * This method is used to install {@link WindowClosingAction} that will be
     * fired after pressing Escape key by user but only when this dialog will be
     * focused window.
     *
     * @param dialog
     */
    public static void installWindowClosingActionOnEscapeKey(JDialog dialog) {
        if (dialog == null) {
            return;
        }

        String actionName = "WindowClosingAction-" + RandomStringUtils.randomAlphanumeric(10);
        dialog.getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW).put(KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), actionName);
        dialog.getRootPane().getActionMap().put(actionName, new WindowClosingAction(dialog));
    }

    /**
     * This method is posting Window Closing Event to System Event Queue if
     * {@link Window} is not-null, if else do nothing.
     *
     * @param window
     */
    public static void fireWindowClosingEvent(Window window) {
        if (window == null) {
            return;
        }

        window.getToolkit().getSystemEventQueue().postEvent(new WindowEvent(window, WindowEvent.WINDOW_CLOSING));
    }

    /**
     * This class represent an action, that could be used to close {@link Window}
     * using {@link #fireWindowClosingEvent(java.awt.Window)}.
     */
    public static class WindowClosingAction extends AbstractAction {

        private static final long serialVersionUID = 1066322459108218644L;
        private final Window window;

        private WindowClosingAction() {
            this.window = null;
        }

        public WindowClosingAction(Window window) {
            this.window = window;
        }

        @Override
        public void actionPerformed(ActionEvent e) {
            fireWindowClosingEvent(window);
        }
    }
}
```
