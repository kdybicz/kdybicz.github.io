---
title: Konwersja Image Base64
category:
  - technologies
  - java
tag:
  - base64
  - image
permalink: /konwersja-image-base64-472.html
date: 2012-01-02 09:48:34 +00:00
modified: 2018-07-18 17:49:31 +00:00
---


Zdarza się czasem, że musimy zapisać na dysku jakąś, wybraną grafikę. O ile możemy zapisać ją w osobnym pliku, nie ma z tym problemu. Inaczej ma się sprawa, gdy chcemy zapisać grafikę w zbiorczym pliku konfiguracyjnym.
<!--more-->
W takiej sytuacji do problemu można podejść na dwa sposoby:

1. Zapisać grafikę w osobnym pliku, a w pliku konfiguracyjnym zapisać ścieżkę do grafiki.

2. Zapisać grafikę bezpośrednio w pliku konfiguracyjnym.

Poniżej przedstawię moje podejście do drugiego z wymienionych przypadków.

W jednej z tworzonych przeze mnie aplikacji pojawiła się konieczność dania użytkownikowi możliwości wybrania grafiki oraz zapisania jej w pliku konfiguracyjnym programu. Jako, że wykorzystywany w aplikacji XMLConfiguration z Apache'owych commons'ów nie daje mi takiej możliwości, doszedłem do wniosku, że najprościej będzie skonwertować posiadany Image do postaci Base64, aby ładnie dało się go zapisać w konfiguracji, ale jako String'a. Oto, co mi z tego wyszło:

```java
public void setImage(Image image) throws IOException {
	if (image == null) {
		conf.setProperty(IMAGE_KEY, IMAGE_DEFAULT_VALUE);
	} else {
		image = new ImageIcon(image).getImage();

		final ByteArrayOutputStream os = new ByteArrayOutputStream();

		ImageIO.write(((ToolkitImage) image).getBufferedImage(), "png", os);

		final String imageBase64 = Base64.encode(os.toByteArray());

		conf.setProperty(IMAGE_KEY, imageBase64);
	}
}

public Boolean isImageSelected() {

	final String imageBase64 = conf.getString(IMAGE_KEY, IMAGE_DEFAULT_VALUE);

	if(StringUtils.isNotBlank(imageBase64)) {
		return Boolean.TRUE;
	} else {
		return Boolean.FALSE;
	}
}

public Image getImage() throws IOException {

	final String imageBase64 = conf.getString(IMAGE_KEY, IMAGE_DEFAULT_VALUE);
	if (imageBase64 == null) {
		return null;
	}

	final byte[] imageBytes = Base64.decode(imageBase64);

	final Image image = Toolkit.getDefaultToolkit().createImage(imageBytes);

	return new ImageIcon(image).getImage();
}
```
