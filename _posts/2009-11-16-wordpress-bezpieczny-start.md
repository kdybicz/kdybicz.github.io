---
title: WordPress, bezpieczny start
category:
  - technologies
  - web
tag:
  - apache
  - security
  - web
  - wordpress
permalink: /wordpress-bezpieczny-start-71.html
date: 2009-11-16 13:12:19 +00:00
modified: 2018-07-19 07:41:00 +00:00
---


Gdy ostatecznie zdecydowałem, że to WP będzie platformą, na bazie której *zbuduję* swoją stronę, wpadło mi do głowy, że poza funkcjonalnością CMS'a, równie ważne jest też jego bezpieczeństwo. Zrobiłem zatem małe rozpoznanie w tym temacie, a wnioski do jakich doszedłem postaram się streścić poniżej. Jednak, aby nie była to czcza paplanina, przedstawię na praktycznym przykładzie, jak można zabezpieczyć (mam nadzieję w miarę skutecznie) instancję WordPress'a już od pierwszych chwil jej życia.

<!--more-->

**Wstęp**

Jeśli myślisz poważnie o zabezpieczeniu swojego WP, dobrze byłoby zabrać się do tego już na samym początku, zanim jeszcze zaczniesz jego instalacje. Jest to o tyle istotne, że na przykład ingerencja w strukturę bazy danych rozbudowanej już instancji WP z wieloma pluginami, może przysporzyć nam mnóstwa problemów, z rozsypującymi się wtyczkami, czy nawet samym WP na czele. Poniżej przedstawię, jak można przejść przez proces instalacji, dbając o bezpieczeństwo od samego początku. Niestety będzie wymagało to od Was trochę większej wiedzy, głównie znajomości systemu Linux (Ubuntu Server) i konfiguracji Apache'a.

**1.** Przygodę rozpoczniemy od zdobycia [certyfikatu SSL]({% post_url 2009-11-12-how-to-zaufany-certyfikat-ssl-za-darmo %}) dla naszej domeny i odpowiednie skonfigurowanie VirtualHost'ów Apache'a, aby z niego korzystały. Umożliwi nam to przekierowanie strony logowania i panelu administracyjnego na zabezpieczone połączenie. Poniższe pliki, po dostosowaniu do własnych potrzeb, należy umieścić w katalogu konfiguracji stron Apache'a (*/etc/apache2/sites-available/*).

Przykładowy plik *wp*:

```apache
<VirtualHost *:80>
    ServerName domena.net
    ServerAdmin <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="5d2d322e29303c2e29382f1d39323038333c73333829">[email&#160;protected]</a>

    DocumentRoot /var/www/wordpress
    <Directory />
        Options -Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>

    ErrorLog /var/log/apache2/error.log

    LogLevel notice

    CustomLog /var/log/apache2/access.log combined
</VirtualHost>
```

Przykładowy plik *wp-ssl*:

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName domena.net
    ServerAdmin <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="b0c0dfc3c4ddd1c3c4d5c2f0d4dfddd5ded19eded5c4">[email&#160;protected]</a>

    SSLEngine on
    SSLProtocol all -SSLv2
    SSLCipherSuite ALL:!ADH:!EXPORT:!SSLv2:RC4+RSA:+HIGH:+MEDIUM

    SSLCertificateFile    /etc/ssl/certs/domena.pem
    SSLCertificateKeyFile    /etc/ssl/private/domena.key
    SSLCertificateChainFile    /etc/ssl/certs/StartCom-Class1-Sub.pem
    SSLCACertificateFile    /etc/ssl/certs/StartCom-Class1-CA.pem
    SetEnvIf User-Agent ".*MSIE.*" nokeepalive ssl-unclean-shutdown

    DocumentRoot /var/www/wordpress
    <Directory />
        Options -Indexes FollowSymLinks MultiViews
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>

    ErrorLog /var/log/apache2/error.log

    LogLevel warn

    CustomLog /var/log/apache2/access.log combined
</VirtualHost>
</IfModule>
```

Ważne jest, aby w *Directory* znalazła się opcja *-Indexes*, gdyż zabezpieczy nas ona przed wylistowaniem zawartości katalogów. Jeśli z jakichś przyczyn nie mamy możliwości edycji tych ustawień, to możemy zrobić dwie rzeczy. Pierwszym rozwiązaniem jest upewnienie się, że we wszystkich podkatalogach katalogu WP znajdują się pliki *index.html* lub *index.php*. Drugie wymaga dodania do pliku *.htaccess* z katalogu głównego WP poniższej linijki:

```apache
Options -Indexes
```

**2.** Następnie pobieramy na nasz serwer najnowszą wersję instalki WP i rozpakowujemy ją do odpowiedniego katalogu (np: */var/www/*).

**3.** Jeśli będziemy chcieli uruchomić *Bezpośrednie odnośniki*, to w katalogu WordPress'a (np: */var/www/wordpress/*) tworzymy pusty plik *.htaccess*

**4.** Kopiujemy plik *wp-config-sample.php* do pliku o nazwie *wp-config.php*

**5.** Teraz ustawimy własny prefiks dla tabel w bazie danych, co zwiększy bezpieczeństwo przed atakami przy użyciu niezałatanych dziur (zero-day exploit) umożliwiających na przykład wstrzyknięcie kodu, który mógłby odwoływać się do naszej bazy i wylistować wszystkie dane użytkowników. Jeśli atakujący nie wie, że nasze tabele w bazie nazywają się inaczej niż standardowe, to jego exploit ich nie zadziała.

Tak więc edytujemy plik *wp-config.php* i zmieniamy w nim

```php
$table_prefix = 'wp_';
```

na wybraną przez nas, inną niż poniższa wartość (dopuszczalne znaki to litery, cyfry, myślnik i podkreślnik) , np:

```php
$table_prefix = 'moj_prefix_';
```

**6.** Zakładam, że mamy już przygotowaną gotową, najlepiej pustą bazę danych. Zatem w pliku *wp-config.php* wpisujemy od razu dane tejże bazy, czyli jej nazwę, login, hasło i adres hosta oraz ewentualnie też kodowanie.

```php
/** The name of the database for WordPress */
define('DB_NAME', 'nazwa_bazy');
/** MySQL database username */
define('DB_USER', 'użytkownik');
/** MySQL database password */
define('DB_PASSWORD', 'super_tajne_hasło');
/** MySQL hostname */
define('DB_HOST', 'localhost');
/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');
```

**7.** Następnie, w tym samym pliku wprowadzamy unikatowe klucze uwierzytelniania (zabezpieczenie plików Cookie), które możemy wygenerować na stronie [https://api.wordpress.org/secret-key/1.1/](https://api.wordpress.org/secret-key/1.1/) zamieniając całe wiersze w pliku konfiguracyjnym lub tylko wartości kluczy.

```php
define('AUTH_KEY', '...');
define('SECURE_AUTH_KEY', '...');
define('LOGGED_IN_KEY', '...');
define('NONCE_KEY', '...');
```

**8.** Kolejnym krokiem, jest włączenie zabezpieczenia dostępu do panelu administracyjnego i panelu logowania poprzez połączenie szyfrowane (jeśli mamy certyfikat SSL i odpowiednio skonfigurowanego Apache'a). Robimy to dodając do pliku *wp-config.php* dwie poniższe linijki:

```php
define('FORCE_SSL_LOGIN', true);
define('FORCE_SSL_ADMIN', true);
```

**9.** Spotkałem się z odważnymi, którzy zmieniają nazwy katalogów */assets/images/*, */wp-admin/* i */wp-includes/* oraz pliku *wp-config.php*, ale sam się tego nie podejmowałem - temat do rozpatrzenia przez chętnych 😉

**10.** W tym momencie powinniśmy zadbać o nadanie plikom i katalogom odpowiednich uprawnień. Przechodzimy więc do katalogu WordPress'a (*/var/www/wordpress/*) i wywołujemy:

```shell
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chown -R www-data:www-data .
```

Dzięki temu tylko właściciel będzie miał możliwość edycji i uruchamiania plików z katalogu WP, reszta będzie mogła je co najwyżej podejrzeć i poruszać się po drzewie katalogów. Trzecie polecenie ustawia "www-data" jako identyfikator grupy i właściciela plików - musi on być zgodny z konfiguracją Apache'a (plik *envvars* w katalogu konfiguracji Apache'a, */etc/apache2/envvars*).

**11.** Włączamy wirtualne hosty, przeładowujemy Apacha i rozpoczynamy instalację WP. Jako, że mamy stworzony plik *wp-config.php* instalacja ogranicza się do podania nazwy bloga, adresu e-mail administratora i skopiowania tymczasowego hasła administratora.

```shell
a2ensite wp
a2ensite wp-ssl
/etc/init.d/apache2 reload
```

**12.** Teraz, gdy mamy już zainstalowanego WP należy stworzyć nowego użytkownika o wybranym przez nas loginie, różnym jednak od *admin*, *administrator*, *root* itp. oraz ustawić mu solidne hasło i prawa administratora (!!!). Gdy to zrobimy powinniśmy się wylogować z panelu administracyjnego i zalogować ponownie. Następnie przechodzimy do listy użytkowników i usuwamy użytkownika *admin*, zaznaczając, że cały jego dorobek ma przejść w ręce utworzonego przed chwilą użytkownika.

**13.** Aby *GoogleBot* oraz boty innych wyszukiwarek, nie czuły się zbyt swobodnie, indeksując całą zawartość naszej strony przytniemy im trochę pazurki tworząc w katalogu WP (*/var/www/wordpress/*) plik *robots.txt* i wpisując do niego:

```apache
User-agent: *
Disallow: /*.php
Allow: /index.php
Disallow: /wp-admin/
Disallow: /assets/images/
Disallow: /wp-includes/
```

Pamiętajcie tylko, aby nadać mu odpowiednie uprawnienia.
**14.** Dodatkowo możemy usunąć pliki takie jak:

```shell
/var/www/wordpress/license.txt
/var/www/wordpress/readme.html
```

**15.** Ostatnim etapem będzie zainstalowanie i skonfigurowanie kilku przydatnych wtyczek:

[Akismet](https://wordpress.org/extend/plugins/akismet/) - to domyślnie zainstalowana wtyczka, chroniąca nas przed spamem w komentarzach. Dobrze jest ją włączyć i skonfigurować.

[AskApache Password Protect](https://wordpress.org/extend/plugins/askapache-password-protect/) - pozwala dodatkowo zabezpieczyć hasłem dostęp do katalogu */wp-admin/.* **Uwaga**: może powodować problemy z dostępem do Panelu administracyjnego - [szczegóły](https://codex.wordpress.org/Hardening_WordPress#Securing_wp-admin).

[Login LockDown](https://wordpress.org/extend/plugins/login-lockdown/) - blokuje dostęp do konta użytkownika, do którego ktoś próbował się wiele razy nieskutecznie zalogować. Chroni to nas przed skryptami próbującymi metodą *Brute Force* rozpracować czyjeś hasło.

[WordPress Database Backup](https://wordpress.org/extend/plugins/wp-db-backup/) - odpowiedzialna jest za cykliczne tworzenie kopii bezpieczeństwa bazy danych i wysyłanie jej na wybrany adres e-mail.

[WordPress Exploit Scanner](https://wordpress.org/extend/plugins/exploit-scanner/) - szuka na stronie i w bazie fragmentów kodu, które mogą stanowić potencjalne zagrożenie. Polecam odpalać ten skrypt raz na jakiś czas - jeśli wiecie, jak interpretować jego wyniki.

[WP Security Scan](https://wordpress.org/extend/plugins/wp-security-scan/) - powie nam, jeśli możemy jeszcze jakoś poprawić bezpieczeństwo naszego WP. Dodatkowo usuwa znacznik *META* z informacją o wersji zainstalowanego WP oraz wyłącza rozszerzone komunikatu o błędach w komunikacji z bazą danych. Nie polecam natomiast z korzystania z skryptu zmieniającego prefiks bazy danych - u mnie on nieźle narozrabiał - w wersji 2.7.1.1, późniejszych nie sprawdzałem.
