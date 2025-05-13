Dauer: 35 min

Intro Jasmin und Lukas
Intro Vortrag

Slides only  
Disclaimer dass alles frei erfunden ist und alle referenzen zufällig sind  
No CISOs were harmed  
Nach einer wahren Gegebenheit  
  
Setting the scene -> stellt euch vor, ihr arbeitet an xyz, und euer CISO kommt an

Rollen:
CISO: begeistert ohne zu verstehen worum es eigentlich geht, naive
Arch: lass mal gucken
 
3 Minuten

# Dialog

## Akt 1

C: Guten Morgen! Wie geht's uns denn heute? Ich hoffe es war eine produktive Woche, meine war großartig.

A: "augen verdrehen" guten morgen, ja natürlich...wir haben ja nur X Sachen die uns beschäftigen

C: Vielleicht habe ich die Lösung für all unsere Probleme, S-B-O-M-S

A: Bitte was?

C: S-B-O-M-S

A: SBOMs????

C: ja ja, dann halt so: SBOMs werden uns retten

A: waren sie wieder auf einem Compliance Kongress? -> compliance meme

C: Die Anzahl an supply chain attacks wie log4j hat in den letzten Jahren schon stark zugenommen und wir müssen uns dagegen schützen. Hier gibt es mit SBOMs wirklich eine tolle Lösung!

A: SBOMs die Lösung von supply chain attacks? Wissen sie was eine SBOMs ist? Ich glaube wir müssen auch noch kurz das Thema Supply Chain Angriff näher beleuchten! -> SBOM meme 

C: Ja klar, eine SBOM ist eine Zutatenliste, wie wenn man was kochen will und das sagt einem das Rezept was man braucht. 

A: Laut der technischen Richtlinie des BSI: Eine “Software Bill of Materials” (SBOM) ist eine maschinenlesbare Datei, die Informationen über Lieferkettenbeziehungen und Details zu den Komponenten enthält, die in einem Softwareprodukt verwendet werden. Sie ermöglicht die automatisierte Verarbeitung dieser Informationen. Dabei werden sowohl die sogenannte Primärkomponente als auch verwendete (z. B. externe oder Drittanbieter-) Komponenten erfasst. Hier mal ein Beispiel einer SBOM. -> Spdx Slide im Background  
  
C: Oh, das kann ja kein Mensch lesen!!

A: Korrekt, SBOMs sind auch eigentlich nur für Maschinen gedacht. Machen wir das Beispiel mit einem Auto, die SBOM ist eine Liste aller Komponenten die im Auto verbaut wurden. Motor wurde von X hergestellt, Bremsen von Y, Airbags von Z. Die SBOM ist eine Liste aller Teile, Komponenten und Frameworks die für die Entwicklung eines digitalen Produkts eingesetzt wurden mit der verwendeten Versionsnummer, Lizenzen und Herstellern. Genau wie beim Auto ist das wichtig für z.B. Wartungsarbeiten, man weiß was man updaten muss oder austauschen. Oder bei Rückrufaktionen, z.B. wenn die software kritische Schwachstellen beinhalten. Bei Hardware Teilelisten ist die Industrie daran gewohnt bill of materials zu generieren und die Liste hat eine physische Grenze. Bei Software ist es ein bisschen komplizierter, da die Industrie erst jetzt damit anfängt und das sehr schnell sehr unübersichtligh wird. Da verschiedenen Komponenten, sub-komponenten vielleicht auch in verschiedenen Versionen in einem Programm verwendet werden. Jede Software-Entwickler\*in nutzt unzählige Bibliotheken und Komponenten in ihrer Arbeit

Der Inhalt kann sehr unübersichtligh werden  -> insights um die Componenten, Versionen, Relations (minimal component of SBOM), Licenses -> Slide  
C: haben sie das geschrieben??  
A: nein, stammt aus source xyz  
C: ach gar nicht von unserer SW?  
A: nein, Erklärung der verschiedenen Level an SBOMs die da sind -> supplier, own software, … componenten die componenten nutzen, transitive ->

Summary: was ist eine SBOM, wofür ist sie im allgemeinen und mehrschichtige Struktur

## Akt 2

C: wow, also haben wir die Zutatenliste von jeder SW die wir einsetzen?  
A: Nicht so wirklich, nicht alles was wir einsetzen stellt eine SBOM zur Verfügung  
C: dann halt in die Verträge schreiben, Supplier zwingen  
A: Es geht nicht nur im unsere direkten Zulieferer -> z.B. Open source Projekte müssen nicht  
C: ja einfach, dann nutzen wir das nicht mehr  
A: Hinweis, nutzung von Opensource überall im Unternehmen -> software nur in kleinen teilen first party code, ganz viel third party (unzählige pakete!) weil budget, rad neu erfinden, Expertise   
C: können wir die Projekte nicht zwingen das zu machen?  
A: maintenance vieler Projekte ist manchmal von einzelnen Personen abhängig, aber wir könnten da ja als unternehmen unterstützen und sponsoren (-> slide support open source projects, give back ;))  
C: ach nein, das wurde in diesem FY nicht budgetiert, finanzplanung abgeschlossen  
A: mal abgesehen von den Open source projekten, gibt es noch weitere Challenges -> legacy (death by powerpoint/legacy code) -> erklärung warum problematisch, zu alt, nicht maintained, nicht kommentiert  
C: dann halt einfach erstellt werden, muss man dann tun -> kann ja nicht so schwer sein   
A: doch schon, nicht standardisierte erstellung, viele guidelines -> struktur ist definiert, aber nicht granularität, welche tiefe...-> und für jede neue Version und neue SBOM - und niemand garantiert uns, dass diese SBOMs denn auch korrekt und vollständig sind  
C: gibt es ein kostenloses tool das man dafür verwenden kann? das muss man ja irgendwie automatisieren können  
A: automatisierte SBOM erstellung in bestimmten bereichen einfacher ist (Web/Container...) abhängig von technologien, nicht alle tools sind gleich gut -> heterogene landschaft and verschiedenen SBOMs in verschiedenen tiefen -> verschiedenen qualitäten an SBOMs, sehr abhängig vom ersteller -> supplier vs intern  
C: dann harmonisieren wir einfach wenn wir alle zusammen haben, vielleicht mit einer KI?  
A: schappatmung? dann kommt schon das nächste Problem: die übermittlung von SBOMs ist auch nicht standardisiert -> download hersteller website, als metadaten des produkts, email übermittlung, attestations  
C: können wir nicht allen einfach einen link zu unserem Sharepoint geben?  
A: verdrehte augen :D aktuell kommen die SBOMs auf verschiedene Wege zu uns -> integrität anbringen, meistens aktuell noch on demand per e-mail  
C: also haben wir dann bei uns ein vollständiges inventar, in welchem wir nach unseren log4js suchen können  
A: nö, da die ja bisher alle item-spezifisch sind und erst konsolidiert werden müssen. darüber hinaus sind sie ja auch nur maschinenlesbar - oder wollen SIE noch einmal einen blick reinwerfen?  
C: wenn wir das dann alles haben, dann haben wir für alle bekannten dinge auch die log4js zu finden -> log4j meme  
A: ja genau das stimmt  
C: großartig, dann haben wir ja endlich alle schwachstellen, die wir abdecken müssen und wie wir diese beheben!  
A: ähm... nein. Viele Abhängigkeiten z.B. Vulnerability Databases mit gemeldeten vulns (MITRE), Finanzierung (Trump) -> politische Veränderungen können Einfluss an qualität und verwendung habeneinheitliches bild bauen

C: Datenbank in Europa?

A: ENISA --> ABER Potentielles künftiges issue -> fragmentiert und schwierigkeiten   
C: hm, schwierig... ha! dann sollten doch einfach die anbieter am besten selber testen und die ergebnisse in die SBOM mit einfügen!  
A: gibt es schon, "VEX" ABER statisch vs dynamisch --> schnell veraltet, testen nicht standardisiert, schwierige incentives (Provider hat kein incentive Vulnerabilities offen zu legen, und kein Interesse das zu veröffentlichen & patchen) -> glaubwürdigkeit der VEX -> einfach schwachstellen zu finden, exploitability und reachability der schwachstellen kann meistens nur von den Entwicklern selbst eingeschätzt werden.  
C: endlich haben wir es, SBOMs alle gesammelt, konsolidiert, Tools unterstützen bei der Findung von Schwachstellen -> kann uns das ja vor Supply chain angriffe schützen!

C: wenn ich unser Gespräch so mal betrachte macht mir eine Zutatenliste unserer Ganzen SW bauchschmerzen -> dann kann unsere Konkurrenz sich ja abschauen was wir machen und das direkt nachbauen

A: nein

\- Abtrennung zwischen den Akten? Wie wird das mit dem Gesprächsfaden machen

10 Minuten

## Akt 3

Dialog:
C:

5 Minuten

Q&A

5 Minuten