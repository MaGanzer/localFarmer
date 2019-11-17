# Was ist Local Farmer?
Mit Local Farmer können sich Landwirte mit ihren Endkunden vernetzten.

## Konzept
Das Konzept, das wir als Gruppe für das Projekt verwirklichen wollte, war die Schaffung einer Online-Plattform, auf der Landwirte ihre Produkte veröffentlichen können. Hier können Anwender schnell und einfach die gewünschten Produkte finden, die von Landwirten zur Verfügung gestellt werden. 
Ein einzigartiges Merkmal unserer Website ist, dass es zusätzlich zu den Merkmalen einer normalen Plattform dazu beiträgt, durch ein virtuelles Profil des Landwirts Vertrauen in die Landwirte zu schaffen. Auf der Grundlage des gewonnenen Vertrauens kann der Landwirt eine loyalere und zuverlässigere Kundschaft gewinnen. Um die Suche innerhalb der Plattform zu erleichtern, wird jeder Landwirt seinen Verkaufsort angeben, damit der Käufer leicht auf die Angebote in seiner Nähe zugreifen kann.

## Verwendung
* Um auf den Inhalt der Webseite zugreifen zu können, muss zunächst das Programm Node.js gemeinsam mit npm installiert werden.
* Zum Öffnen der Seite wird der Befehl `npm run start` im Projektpfad in einem Kommandozeilen-Fenster eingegeben. Dadurch wird der Inhalt der Anwendung geladen, ein lokaler Webserver gestartet und im Browser ein Tab mit der Startseite angezeigt.
* Die Anwendung kann mittels `npm run build` erzeugt und die so erstellten Dateien beispielsweise auf einen Webserver kopiert werden.

## Testfälle
In der Website ist eine Suchfunktion nach Orten und nach Produkten hinterlegt. Um diese testen zu können, sind bereits Beispieldatensätze hinterlegt.
Produktsuche: Unter anderem zu den Produkten Kartoffeln, Milch, Lauch und Eiern sind Beispieldatensätze angelegt. Diese sind jedoch ortsabhängig und lassen sich nicht in jedem Kartenausschnitt finden. 
Ortssuche: Beispieldatensätze wurden unter anderem in den Orten Berlin, Mainz und Karlsruhe angelegt. Auf der Karte werden alle Datensätze per Marker suchunabhängig angezeigt.
