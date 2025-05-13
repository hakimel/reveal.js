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

A: SBOMs die Lösung von supply chain attacks? Wissen sie was eine SBOMs ist? Ich glaube wir müssen auch noch kurz das Thema Supply Chain Angriff näher beleuchten! *-> SBOM meme*

C: Ja klar, eine SBOM ist eine Zutatenliste, wie wenn man was kochen will und das sagt einem das Rezept was man braucht. 

A: Laut der technischen Richtlinie des BSI: Eine “Software Bill of Materials” (SBOM) ist eine maschinenlesbare Datei, die Informationen über Lieferkettenbeziehungen und Details zu den Komponenten enthält, die in einem Softwareprodukt verwendet werden. Sie ermöglicht die automatisierte Verarbeitung dieser Informationen. Dabei werden sowohl die sogenannte Primärkomponente als auch verwendete (z. B. externe oder Drittanbieter-) Komponenten erfasst. Hier mal ein Beispiel einer SBOM. *-> Spdx Slide im Background*
  
C: Oh, das kann ja kein Mensch lesen!!

A: Korrekt, SBOMs sind auch eigentlich nur für Maschinen gedacht. Machen wir das Beispiel mit einem Auto, die SBOM ist eine Liste aller Komponenten die im Auto verbaut wurden. Motor wurde von X hergestellt, Bremsen von Y, Airbags von Z. Die SBOM ist eine Liste aller Teile, Komponenten und Frameworks die für die Entwicklung eines digitalen Produkts eingesetzt wurden mit der verwendeten Versionsnummer, Lizenzen und Herstellern. Genau wie beim Auto ist das wichtig für z.B. Wartungsarbeiten, man weiß was man updaten muss oder austauschen. Oder bei Rückrufaktionen, z.B. wenn die software kritische Schwachstellen beinhalten. Bei Hardware Teilelisten ist die Industrie daran gewohnt bill of materials zu generieren und die Liste hat eine physische Grenze.
Bei Software und digitalen Komponenten ist es ein bisschen komplizierter, da die Industrie erst jetzt damit anfängt und das sehr schnell sehr unübersichtligh wird. Da verschiedenen Komponenten, sub-komponenten vielleicht auch in verschiedenen Versionen in einem Programm verwendet werden. Jede Software-Entwickler:in nutzt unzählige Bibliotheken und Komponenten in ihrer Arbeit. Der "2025 Open Source Security and Risk Analysis Report" von Blackduck berichtet dass sich die Anzahl an Open Source files in einer Applikation sich in den letzten 4 Jahren verdreifacht hat, und mehr als die Hälfte davon sind indirekte Abhängigkeiten. Es wird sehr wichtig die Beziehung zwischen den Komponenten darzustellen um direkte und indirekte Abhängigkeiten handhaben zu können. Außerdem ist ein wichtiger Bestandteil der SBOM Lizenzinformationen zu den benutzen Bibliotheken. *-> Slide mit SBOM tree?*

C: Haben sie das geschrieben??  

A: Nein, das wäre unmöglich. Diese SBOM haben wir von unserem Lieferanten erhalten.

C: Ach, das stammt gar nicht von unserer Software?  

A: Nein. SBOMs werden aus verschiedenen Quellen bezogen. Für unsere Eigenentwicklungen, wird eine SBOM als Teil der CI/CD Pipeline beim Build unserer Software direkt erstellt. Unsere Software-liferanten müssten uns bald auch mit jeder neuen Software-Version eine SBOM mitliefern. Spannend wird es immer dann wenn die eingesetzten Komponenten wiederum auf andere Open Source Bibliotheken aufbauen, denn Open Source Projekte sind bis heute ausgenommen von der Pflicht SBOMs zu erstellen, auch unter dem Cyber Resilience Act.

## Akt 2

C: Wow, also haben wir mit diesen ganzen SBOMs die Zutatenliste von jeder Software die wir einsetzen?  

A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben!

A: Es geht aber nicht nur um die Lieferanten, die komplette Software Industrie hinkt noch sehr stark bei der Erstellung von SBOMs hinterher. Der State of Software Supply Chain von Sonatype hat die veröffentlichten Open Source Software Komponenten im Vergleich zu den veröffentlichten SBOMs dargestellt. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. Außerdem, ist Open Source aus den aktuellen Regularien wie den Cyber Resilience Act oder die Direktive in den USA, die SBOMs vorschreiben, großteils ausgenommen.

C: Na das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung wie viel Open Source bei uns im Unternehmen verwendet wird, oder? Blackduck hat im "2025 Open Source Security and Risk Analysis Report" veröffentlicht, dass 97% der Anwendungen die Sie gescannt haben, open source Komponenten im Einsatz haben, im Schnitt über 900 pro Applikation. Es geht nicht nur um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen und nicht immer das Rad neu erfinden, sondern auch bei Datenbanktechnologien, CI/CD tools, Programmiersprachen und Containertechnologie.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie zwingen SBOMs zur Verfügung zu stellen. 

A: Kritisch ;) Die meisten open source Projekte sind tatsächlich von einzelnen Maintainern abhängig und wie wir im xz-Utils backdoor Szenario letztes Jahr gesehen haben, kann dies potentiell kritische Folgen haben. Wir als Unternehmen könnten da sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

C: Ach nein, das wurde in diesem fiscal year nicht budgetiert und die Finanzplanung ist bereits abgeschlossen. Vielleicht nächstes Jahr.

A: Mal abgesehen von den Open Source Projekten gibt es noch weitere Challenges, ich habe es vorhin kurz angedeutet. SBOMs sind im Kontext neuer Projekte und aktueller Technologien kein Hexenwerk. Bei interpretierten Programmiersprachen wie JavaScript oder Python sind die externen Abhängigkeiten in manifests wie package.json gelistet und können weiterverarbeitet werden. Da erhält man direkt den direkten Bibliotheken die eingesetzt werden. Bei kompilierten Sprachen, werden Abhängigkeiten und Libraries in Binaries verpackt und erfordern deutlich mehr Maintenance und Arbeit von den Entwicklungsteams. Und wir reden gar nicht über Legacy code, bei dem keiner so genau weiß was da reingepackt wurde. Dann sind wir schon beim Endgegner: Compilierte 20 Jahre alte legacy anwendung, die nicht mehr gewartet wird aber trotzdem weiter im Einsatz bleibt.
  
C: Naja da wird es wohl eine technische Lösung geben, um diese SBOMs ganz einfach zu erstellen. Das kann ja nicht so schwer sein.
  
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. Es gibt Richtlinien und Standards bezüglich der Struktur, alles andere wie Granularität, Tiefe, Beziehung zwischen den Komponenten sidn nicht definiert und jeder macht das ein bisschen anders. Dazu kommt dass eine neue SBOM bei jedem Software Update notwendig ist.
----------


nicht standardisierte erstellung, viele guidelines -> struktur ist definiert, aber nicht granularität, welche tiefe...-> und für jede neue Version und neue SBOM - und niemand garantiert uns, dass diese SBOMs denn auch korrekt und vollständig sind  
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