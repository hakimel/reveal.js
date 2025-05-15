Dauer: 35 min

Rollen:  
CISO: begeistert ohne zu verstehen worum es eigentlich geht, naiv  
Architektin: Kritisch zu SBOMs, versucht, alles anschaulich zu erklären

# Dialog [30min]

## Setting the Stage

Slides:
- Disclaimer
- No CISOs were harmed
- 1. Akt

Architektin sitzt mit Laptop am Tisch und arbeitet
CISO kommt herein, kommt zu Architektin, setzt sich 'legere' auf die Tischkante

## Akt 1 [5min]

C: Einen wunderschönen guten Morgen, Frau Mair! Wie geht's uns denn heute?

A [verdreht Augen]: Guten Morgen. Ich kann ja nur für mich sprechen, aber wir haben gerade monsterviel Stress mit...

C: Mir geht es grandios, danke der Nachfrage!

A [seufzt]: Was kann ich denn für Sie tun?

C: Haben Sie schon von den ganzen Supply Chain Angriffen gehört? Die sind gerade überall! Wir müssen uns hier wirklich _schnellstmöglich_ dagegen schützen! Aber ich habe auch schon die Lösung dafür: S-B-O-M-S

A: Bitte was?

C: S-B-O-M-S

<<<<<<< HEAD
A: SBOMs??
=======
A: Was?
>>>>>>> 53e51699 (Erster Akt)

C: Software... Billy...

<<<<<<< HEAD
A: waren sie wieder auf einem Compliance Kongress? *-> compliance meme*
=======
A: Software Bills of Materials? SBOMs?
>>>>>>> 53e51699 (Erster Akt)

C: Ja genau, hab ich ja gesagt! Die müssen jetzt alle erstellen, um ihre Security Posture zu verbessern!.

<<<<<<< HEAD
A: SBOMs die Lösung von supply chain attacks? Wissen sie was eine SBOMs ist? Ich glaube wir müssen auch noch kurz das Thema Supply Chain Angriff näher beleuchten! *-> SBOM meme*
=======
A: Waren sie wieder auf einem Compliance Kongress? **-> compliance meme**
>>>>>>> 53e51699 (Erster Akt)

C: Woher... [sammelt sich kurz] Die Anzahl an Supply Chain Attacks wie log4j hat in den letzten Jahren so stark zugenommen und wir müssen uns dagegen schützen. Hier gibt es mit SBOMs wirklich eine tolle Lösung!

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 64618adb (docs: review act 1 & 2)
A: Gar nicht soooo schlecht. Nur ist das sehr realitätsfern. In der modernen Softwareentwicklung schreibt die Entwickler:in nicht jede Zeile Code selbst, sondern verwendet vorgefertigte Bibliotheken. Nehmen wir die Datumsauswahl Funktion in einer x-beliebigen Anwendung -> x edge cases und komplexität -> somit library die wiederverwendet wird. Je nach Report (Github, Blackduck) kursieren Zahlen zwischen 70 - 90% third party vs. first party code. Das unterstreicht schon den Bedarf einer Inventarisierung der genutzten Komponenten.
=======
A: SBOMs als Lösung für Supply Chain Attacks? Wissen sie denn, was eine SBOMs ist?
>>>>>>> 53e51699 (Erster Akt)

C: Ja klar, eine SBOM ist wie so eine Zutatenliste, die mir sagt was in einem Lebensmittel enthalten ist, nur halt für Software. Also 30 Zeilen HTML, 50 Zeilen Java, sowas halt.

A: Gar nicht mal soooo schlecht. Aber fangen wir mal etwas kleiner an: In der modernen Softwareentwicklung schreiben die Entwickler:innen nicht jede Zeile Code selbst, sondern greifen auf vorgefertigte Teile zurück. Nehmen wir die Datumsauswahlfunktion in einer x-beliebigen Anwendung: das ist einerseit recht komplex, andererseits wird es immer wieder benötigt. Somit ist es effizienter, solchen Code in Form von Bibliotheken oder Frameworks aus dem Internet zu laden, statt jedes Mal das Rad neu zu erfinden.

C: Die Entwickler:innen nehmen schon fertigen Code aus dem Internet? Wofür geben wir denn dann Unmengen an Geld für die Entwicklungsteams aus?

<<<<<<< HEAD
A: Laut der technischen Richtlinie des BSI: Eine “Software Bill of Materials” (SBOM) ist eine maschinenlesbare Datei, die Informationen über Lieferkettenbeziehungen und Details zu den Komponenten enthält, die in einem Softwareprodukt verwendet werden. *-> Spdx Slide im Background*
<<<<<<< HEAD
  
=======
A: Wollen Sie das Geld ausgeben, damit jedes Team sein Datumsauswahltool selbst schreibt, oder sollen sie lieber Business Value generieren? :D

C: Ja, Business Value...

A: Das wäre ohne den Einsatz solcher externen Komponenten heutzutage kaum mehr möglich. Unterschiedliche Analysen kommen zu dem Schluss, dass durchschnittlich 70-90% aller halbwegs moderner Software aus externen Komponenten besteht.

C: So viel?! Aber so viele Datumsfelder haben wir doch gar nicht in unserer Software?!

A: Es geht ja nicht nur um Datumsfelder, sondern um ganz unterschiedliche, grundlegende Funktionalitäten, die in Form von Bibliotheken oder Frameworks aus unterschiedlichen Fremdquellen geladen werden und ihrerseits wiederum von anderen Komponenten abhängen, den sogenannten 'Transitiven Abhängigkeiten' - wie beispielsweise von log4j

C: log4j, ja, genau! Da wusste ja auch niemand, wo das alles drinhängt.

A: Richtig. Und diese Komponenten haben wiederum ihre eigenen Abhängigkeiten, auf die sie zurückgreifen.

C: ...und die wiederum...

A: So können also auch schon wenige _direkte_ Komponenten einen Rattenschwanz an weiteren Abhängigkeiten nachladen.

C: Das wird ja dann immer komplexer! Wie behalten Sie denn da den Überblick?

A [grinst] ...und genau da kommen SBOMs ins Spiel!

C: Ja klar, die Zutatenliste, wusste ich doch!

A: Sehr gut! SBOMs sind folglich standardisierte Strukturen, in denen die wichtigsten Datenpunkte zu all diesen Abhängigkeiten aufgeführt werden. Was ist das für eine Komponente, wo kommt sie her, welche Version hat sie, welche Lizenz,... Wollen Sie mal eine solche SBOM sehen?

C: Oh, ja, gerne!

[SPDX Slide]

>>>>>>> 53e51699 (Erster Akt)
C: Oh, das kann ja kein Mensch lesen!!

A: Korrekt, SBOMs sind auch eigentlich in erster Linie für Maschinen gedacht.

<<<<<<< HEAD
C: Haben sie das geschrieben??   
=======
A: Laut der technischen Richtlinie des BSI: Eine “Software Bill of Materials” (SBOM) ist eine maschinenlesbare Datei, die Informationen über Lieferkettenbeziehungen und Details zu den Komponenten enthält, die in einem Softwareprodukt verwendet werden. Sie ermöglicht die automatisierte Verarbeitung dieser Informationen. Dabei werden sowohl die sogenannte Primärkomponente als auch verwendete (z. B. externe oder Drittanbieter-) Komponenten erfasst. Hier mal ein Beispiel einer SBOM. *-> Spdx Slide im Background*
=======
>>>>>>> 64618adb (docs: review act 1 & 2)
  
C: Oh, das kann ja kein Mensch lesen!!

A: Korrekt, SBOMs sind auch eigentlich nur für Maschinen gedacht. SBOMs sind liste an Komponenten....minimum elements im Background

Machen wir das Beispiel mit einem Auto, die SBOM ist eine Liste aller Komponenten die im Auto verbaut wurden. Motor wurde von X hergestellt, Bremsen von Y, Airbags von Z. Die SBOM ist eine Liste aller Teile, Komponenten und Frameworks die für die Entwicklung eines digitalen Produkts eingesetzt wurden mit der verwendeten Versionsnummer, Lizenzen und Herstellern. Genau wie beim Auto ist das wichtig für z.B. Wartungsarbeiten, man weiß was man updaten muss oder austauschen. Oder bei Rückrufaktionen, z.B. wenn die software kritische Schwachstellen beinhalten. Bei Hardware Teilelisten ist die Industrie daran gewohnt bill of materials zu generieren und die Liste hat eine physische Grenze.

Bei Software und digitalen Komponenten ist es ein bisschen komplizierter, da die Industrie erst jetzt damit anfängt und das sehr schnell sehr unübersichtligh wird. Da verschiedenen Komponenten, sub-komponenten vielleicht auch in verschiedenen Versionen in einem Programm verwendet werden. Jede Software-Entwickler:in nutzt unzählige Bibliotheken und Komponenten in ihrer Arbeit. Der "2025 Open Source Security and Risk Analysis Report" von Blackduck berichtet dass sich die Anzahl an Open Source files in einer Applikation sich in den letzten 4 Jahren verdreifacht hat, und mehr als die Hälfte davon sind indirekte Abhängigkeiten. Es wird sehr wichtig die Beziehung zwischen den Komponenten darzustellen um direkte und indirekte Abhängigkeiten handhaben zu können. Außerdem ist ein wichtiger Bestandteil der SBOM Lizenzinformationen zu den benutzen Bibliotheken. *-> Slide mit SBOM tree?*

<<<<<<< HEAD
C: Haben sie das geschrieben??  
>>>>>>> d510adae (docs: update dialog, finisch act 1)
=======
C: Haben sie das geschrieben??   
>>>>>>> 64618adb (docs: review act 1 & 2)
=======
C: ...und für solche Top-Talente wie Sie! Haben sie das geschrieben??   
>>>>>>> 53e51699 (Erster Akt)

A: Nein, das wäre unmöglich. Diese SBOM haben wir von einem unserer Software-Lieferanten erhalten.

C: Ach, das stammt gar nicht von unserer Software?  

A: Nein, diese nicht. Die listet die Komponenten auf, die in seiner Software genutzt werden. Aber für unsere eigene Software können wir auch SBOMs erstellen, die wiederum unsere Abhängigkeiten auflistet.

C: ...und die geben wir dann wiederum an unsere Kunden?

A: Ja, genau!

C: Aber dann wissen die ja, wie unsere Software gebaut wurde! Können die das dann nicht einfach nachbauen?

A: Nein, in der SBOM steht ja nur drin, welche externen Komponenten genutzt werden. Die Geschäftslogik und wie die diese Komponenten nutzt, ist ja nicht aufgeführt.

C: Okay... aber wenn wir so viele Komponenten in unserer Software nutzen, müsste die SBOM ja jedes Mal neu erstellt werden, wenn sich daran etwas ändert...

A: Richtig.

C: Ist das nicht ein Riesenaufwand? Ist das der Grund, warum die Entwickler:innen immer so stark ausgelastet sind?

A: In moderner Software-Entwicklung glücklicherweise nicht, weil sich die Erstellung im Build Process automatisieren lässt; die SBOM wird also jedes Mal automatisch generiert, wenn wir aus dem Quellcode das entsprechende Programm kompilieren.

C: Ach, das ist ja praktisch!


## Akt 2 [15min]

C: Wow, also haben wir mit diesen ganzen SBOMs die Zutatenliste von jeder Software die wir einsetzen?  

<<<<<<< HEAD
<<<<<<< HEAD
A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben! Jeder macht das ja und alle tun das
<<<<<<< HEAD

A: Es geht aber nicht nur um die Lieferanten, die komplette Software Industrie hinkt noch sehr stark bei der Erstellung von SBOMs hinterher. Der State of Software Supply Chain von Sonatype hat die veröffentlichten Open Source Software Komponenten im Vergleich zu den veröffentlichten SBOMs dargestellt. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. Außerdem, ist Open Source aus den aktuellen Regularien wie den Cyber Resilience Act oder die Executive Direktive, und FDA in den USA, die SBOMs vorschreiben, großteils ausgenommen. (zunahme nimmt nicht ansatzweise so schnell zu wie die der Entwicklung neuer komponenten)

C: Na das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung wie viel Open Source bei uns im Unternehmen verwendet wird, oder? Blackduck hat im "2025 Open Source Security and Risk Analysis Report" veröffentlicht, dass 97% der Anwendungen die Sie gescannt haben, open source Komponenten im Einsatz haben. Es geht nicht nur um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen und nicht immer das Rad neu erfinden, sondern auch bei Datenbanktechnologien, CI/CD tools, Programmiersprachen und Containertechnologie.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie bringen SBOMs zur Verfügung zu stellen um den Marktanteil zu erhöhen.

A: Kritisch ;) Die meisten open source Projekte sind tatsächlich von einzelnen Maintainern abhängig und wie wir im xz-Utils backdoor Szenario letztes Jahr gesehen haben, kann dies potentiell kritische Folgen haben. Overload, wenig zeit, kein support. Wir als Unternehmen könnten da sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

C: Ach nein, das wurde in diesem fiscal year nicht budgetiert und die Finanzplanung ist bereits abgeschlossen. Vielleicht nächstes Jahr.

A: Mal abgesehen von den Open Source Projekten gibt es noch weitere Challenges, ich habe es vorhin kurz angedeutet. SBOMs sind im Kontext neuer Projekte und aktueller Technologien kein Hexenwerk. Bei interpretierten Programmiersprachen wie JavaScript oder Python sind die externen Abhängigkeiten in manifests wie package.json gelistet und können weiterverarbeitet werden. Da erhält man direkt den direkten Bibliotheken die eingesetzt werden. Bei kompilierten Sprachen, werden Abhängigkeiten und Libraries in Binaries verpackt und erfordern deutlich mehr Maintenance und Arbeit von den Entwicklungsteams. Und wir reden gar nicht über Legacy code, bei dem keiner so genau weiß was da reingepackt wurde. Dann sind wir schon beim Endgegner: Compilierte 20 Jahre alte legacy anwendung, die nicht mehr gewartet wird aber trotzdem weiter im Einsatz bleibt.
  
C: Naja da wird es wohl eine technische Lösung geben, um diese SBOMs ganz einfach zu erstellen. Das kann ja nicht so schwer sein.
  
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. Es gibt Richtlinien und Standards bezüglich der Struktur, alles andere wie Granularität, Tiefe, Beziehung zwischen den Komponenten sidn nicht definiert und jeder macht das ein bisschen anders. Dazu kommt dass eine neue SBOM bei jedem Software Update notwendig ist. Da kann man sehr schnell den Überblick verlieren, außerdem ist noch gar nicht definiert ob die gelieferte SBOM korrekt und vollständig ist.

C: Tools gibt es ja bereits, ich habe bereits den Prozess initiiert um ein kostenloses Tool für uns auszuwählen um das alles zu beschleunigen.

A: Einige unserer Teams haben bereits SBOMs, die aus den automatisierten Pipelines herauspurzeln. Bei den anderen Teams, wo es um Kompilate geht hängt die Qualität der Tools von den Frameworks und Programmiersprachen ab und worauf sich ein Tool für die automatische SBOM Generierung fokussiert. Die heterogene Landschaft in diesem Kontext bringt weitere Herausforderungen. Man nehme eine Applikation und lässt 2 Tools zur Erstellung von SBOMs drüber laufen: die Ergebnisse werden unterschiedlich sein, und womöglich keine komplett falsch, sondern eher unvollständig.
Diese Herausforderung wird es für jedes Produkt, in jeder Version wieder geben. Letztendlich haben wir irgendwann einen Haufen SBOMs, in verschiedenen Tiefen mit denen man wenig anfangen kann.

C: Dann sollten wir diese ganzen SBOMs ja einfach harmonisieren, das geht bestimmt mit irgendeiner KI.
  
A: *schappatmung* Ich will ja keine Spielverderberin sein, aber da kommt schon das nächste Problem: die Übermittlung von SBOMs ist auch nicht standardisiert. Manche Hersteller stellen diese auf ihrer Website zum Download zur Verfügung, andere als Metadaten des Produkts, andere wieder stellen sie via Email auf Anfrage zur Verfügung.

C: Können wir nicht allen einfach einen link zu unserem Sharepoint geben?  

A: *verdrehte augen* Aktuell kommen die SBOMs auf verschiedene Wege zu uns, den größten Teil müssen wir aber bei den Suppliern anfragen und je nach Unternehmensgröße ist die Reaktion darauf. Abgesehen davon müsste man sich auch überlegen wie man die Integrität dieser Dokumente sicherstellt. 

C: Wenn wir die SBOMs von allen Applikationen, in jeder Version bei uns dann haben...ist das ein vollständiges Inventar in dem ich nach log4j und anderen Supply Chain Attacken suchen kann.

=======
A: Nicht so wirklich. Die Erstellung von SBOMs hinkt aktuell noch sehr stark hinterher. Der State of Software Supply Chain von Sonatype hat die veröffentlichten Software Komponenten im Vergleich zu den veröffentlichten SBOMs dargestellt. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. 
=======
A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.
>>>>>>> b5126ecd (docs: update akt 2)

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben!
=======
>>>>>>> 64618adb (docs: review act 1 & 2)

A: Es geht aber nicht nur um die Lieferanten, die komplette Software Industrie hinkt noch sehr stark bei der Erstellung von SBOMs hinterher. Der State of Software Supply Chain von Sonatype hat die veröffentlichten Open Source Software Komponenten im Vergleich zu den veröffentlichten SBOMs dargestellt. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. Außerdem, ist Open Source aus den aktuellen Regularien wie den Cyber Resilience Act oder die Executive Direktive, und FDA in den USA, die SBOMs vorschreiben, großteils ausgenommen. (zunahme nimmt nicht ansatzweise so schnell zu wie die der Entwicklung neuer komponenten)

C: Na das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung wie viel Open Source bei uns im Unternehmen verwendet wird, oder? Blackduck hat im "2025 Open Source Security and Risk Analysis Report" veröffentlicht, dass 97% der Anwendungen die Sie gescannt haben, open source Komponenten im Einsatz haben. Es geht nicht nur um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen und nicht immer das Rad neu erfinden, sondern auch bei Datenbanktechnologien, CI/CD tools, Programmiersprachen und Containertechnologie.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie bringen SBOMs zur Verfügung zu stellen um den Marktanteil zu erhöhen.

A: Kritisch ;) Die meisten open source Projekte sind tatsächlich von einzelnen Maintainern abhängig und wie wir im xz-Utils backdoor Szenario letztes Jahr gesehen haben, kann dies potentiell kritische Folgen haben. Overload, wenig zeit, kein support. Wir als Unternehmen könnten da sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

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
>>>>>>> d510adae (docs: update dialog, finisch act 1)
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

## Akt 3 [10min]

C:

# Q&A [5min]
