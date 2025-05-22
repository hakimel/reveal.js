Dauer: 35 min

Rollen:
- CISO: begeistert ohne zu verstehen worum es eigentlich geht, naiv
- Architektin: Kritisch zu SBOMs, versucht, alles anschaulich zu erklären

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

A [verdreht Augen]: Guten Morgen, Chef. Ich kann ja nur für mich sprechen, aber wir haben gerade monsterviel Stress mit...

C: Mir geht es grandios, danke der Nachfrage!

A [seufzt]: Was kann ich denn für Sie tun?

- Slide: State of Supply Chain Attacks

C: Haben Sie schon von den ganzen Supply Chain Angriffen gehört? Die sind gerade überall! Wir müssen uns hier wirklich _schnellstmöglich_ dagegen schützen!

A: Naja, also...

C: Aber ich habe auch schon die Lösung dafür: S-B-O-M-S

- Slide: Spongebob SBOMs

A: Bitte was?

C: S-B-O-M-S

<<<<<<< HEAD
A: SBOMs??
=======
A: Was?
>>>>>>> 53e51699 (Erster Akt)

C: Software... Billy...

<<<<<<< HEAD
<<<<<<< HEAD
A: waren sie wieder auf einem Compliance Kongress? *-> compliance meme*
=======
A: Software Bills of Materials? SBOMs?
>>>>>>> 53e51699 (Erster Akt)
=======
A: Software Bill of Materials? SBOMs?
>>>>>>> a7f351ce (docs: vendor vs. oss)

C: Ja genau, hab ich ja gesagt! Die müssen jetzt alle erstellen, um ihre Security Posture zu verbessern!

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
A: Waren sie wieder auf einem Compliance Kongress?
=======
- #5 Spongebob SBOMs
>>>>>>> e5ae364b (docs: fixed all comments in act 2)
=======
A: Waren sie mal wieder auf einem Compliance Kongress?
>>>>>>> e9caac23 (Dialog Update)

- Slide: Distracted by SBOMs

C: Woher... [sammelt sich kurz] Die Anzahl an Supply Chain Attacks wie log4j hat in den letzten Jahren so stark zugenommen und wir müssen uns dagegen schützen. Hier gibt es mit SBOMs wirklich eine tolle Lösung!

<<<<<<< HEAD
A: SBOMs als Lösung für Supply Chain Attacks? Wissen sie denn, was eine SBOM ist?
>>>>>>> a7f351ce (docs: vendor vs. oss)
=======
A: Ähm... SBOMs als Lösung für Supply Chain Attacks? Wissen sie denn, was eine SBOM ist?
>>>>>>> e9caac23 (Dialog Update)

C: Ja klar, eine SBOM ist wie so eine Zutatenliste, die mir sagt was in einem Lebensmittel enthalten ist, nur halt für Software. Also 30 Zeilen HTML, 50 Zeilen Java, sowas halt.

- Slide: Dependency Tree

A: Gar nicht mal sooo schlecht. Aber fangen wir mal etwas kleiner an: In der modernen Softwareentwicklung schreiben die Entwickler:innen nicht jede Zeile Code selbst, sondern greifen auf vorgefertigte Teile zurück. Nehmen wir die Datumsauswahlfunktion in einer x-beliebigen Anwendung: das ist einerseits recht komplex, andererseits wird sie immer wieder benötigt. Somit ist es effizienter, solchen Code in Form von Bibliotheken oder Frameworks aus dem Internet zu laden, statt jedes Mal das Rad neu zu erfinden.

C: Die Entwickler:innen nehmen schon fertigen Code aus dem Internet? Wofür geben wir denn dann Unmengen an Geld für die Entwicklungsteams aus?

<<<<<<< HEAD
A: Laut der technischen Richtlinie des BSI: Eine “Software Bill of Materials” (SBOM) ist eine maschinenlesbare Datei, die Informationen über Lieferkettenbeziehungen und Details zu den Komponenten enthält, die in einem Softwareprodukt verwendet werden. *-> Spdx Slide im Background*
<<<<<<< HEAD
  
=======
A: Wollen Sie das Geld ausgeben, damit jedes Team sein Datumsauswahltool selbst schreibt, oder sollen sie lieber Business Value generieren? :D

C: Ja, Business Value...

- Slide: OS Percentage

A: Das wäre ohne den Einsatz solcher externen Komponenten heutzutage kaum mehr möglich. Unterschiedliche Analysen kommen zu dem Schluss, dass durchschnittlich 70-90% aller halbwegs moderner Software aus externen Komponenten besteht.

C: So viel?! Aber so viele Datumsfelder haben wir doch gar nicht in unserer Software?!

A: Es geht ja nicht nur um Datumsfelder, sondern um ganz unterschiedliche, grundlegende Funktionalitäten, die in Form von Bibliotheken oder Frameworks aus unterschiedlichen Fremdquellen geladen werden und ihrerseits wiederum von anderen Komponenten abhängen, den sogenannten 'Transitiven Abhängigkeiten' - wie beispielsweise von log4j

- Slide: Squid Game log4j

C: log4j, ja, genau! Da wusste ja auch niemand, wo das alles drinhängt.

A: Richtig. Und diese Komponenten haben wiederum ihre eigenen Abhängigkeiten, auf die sie zurückgreifen.

- Slide: Yo Dawg

C: ...und die wiederum haben auch wieder Abhängigkeiten, die ihrerseits wiederum Abhängigkeiten haben, welche...

- Slide: Direct/Transitive Dependencies

A: Genau! So können also auch schon wenige _direkte_ Komponenten einen Rattenschwanz an weiteren Abhängigkeiten nachladen.

C: Das wird ja dann immer komplexer! Wie behalten Sie denn da den Überblick?

- Slide: Big Dependency Graph

A [grinst] ...und genau da kommen SBOMs ins Spiel!

C: Ja klar, die Zutatenliste, wusste ich doch!

- Slide: SBOM contents

A: Sehr gut! SBOMs sind folglich standardisierte Strukturen, in denen die wichtigsten Datenpunkte zu all diesen Abhängigkeiten aufgeführt werden. Was ist das für eine Komponente, wo kommt sie her, welche Version hat sie, welche Lizenz,... Wollen Sie mal eine solche SBOM sehen?

C: Oh, ja, gerne!

- Slide: SPDX JSON

>>>>>>> 53e51699 (Erster Akt)
C: Oh, das kann ja kein Mensch lesen!!

A: Korrekt, SBOMs sind auch eigentlich in erster Linie für Maschinen gedacht.

<<<<<<< HEAD
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
=======
C: [schleimig] ...und für solche Top-Talente wie Sie! Haben sie das geschrieben?
>>>>>>> e9caac23 (Dialog Update)

A: Nein, das wäre unmöglich. Diese SBOM haben wir von einem unserer Software-Lieferanten erhalten.

C: Ach, das stammt gar nicht von unserer Software?

A: Nein, diese nicht. Die listet die Komponenten auf, die in seiner Software genutzt werden. Aber für unsere eigene Software können wir auch SBOMs erstellen, die wiederum unsere Abhängigkeiten auflisten.

C: ...und die geben wir dann wiederum an unsere Kunden?

A: Ja, genau!

C: Aber dann wissen die ja, wie unsere Software gebaut wurde! Können die das dann nicht einfach nachbauen?

A: Nein, in der SBOM steht ja nur drin, welche externen Komponenten genutzt werden. Die Geschäftslogik und wie die diese Komponenten nutzt, ist ja nicht aufgeführt.

C: Okay... aber wenn wir so viele Komponenten in unserer Software nutzen, müsste die SBOM ja jedes Mal neu erstellt werden, wenn sich daran etwas ändert...

A: Richtig.

C: Ist das nicht ein Riesenaufwand? Ist das der Grund, warum die Entwickler:innen immer so stark ausgelastet sind?

A: In moderner Software-Entwicklung glücklicherweise nicht, weil sich die Erstellung im Build Process automatisieren lässt; die SBOM wird also jedes Mal automatisch generiert, wenn wir aus dem Quellcode das entsprechende Programm bauen.

C: Ach, das ist ja praktisch!

- Slide: SBOM summary

## Akt 2 [15min] 

C: Also haben wir mit diesen ganzen SBOMs die Zutatenliste von jeder Software die wir entwickeln und einsetzen?

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben! Jeder macht das ja und alle tun das
<<<<<<< HEAD
=======
A: Ja, teilweise. Unsere Entwickler:innen arbeiten dran, SBOMs für unsere Produkte zu erstellen. 

<<<<<<< HEAD
C: ..und dann sind wir ja fertig damit! Prima!
>>>>>>> a7f351ce (docs: vendor vs. oss)
=======
C: ...dann sind wir ja bald fertig damit! Prima!
>>>>>>> a8cef1d4 (Polished 2nd Act)

A: Nicht so schnell! Damit wir die SBOMs für unsere Produkte finalisieren können, brauchen wir die SBOMs von Komponenten, die von unseren Lieferanten kommen.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu. Jeder macht heutzutage SBOMs, da müssen wir auch mithalten!

- Slide: Cumulative SBOMs

A: Naja... es stimmt schon, dass immer mehr SBOMs erstellt werden, aber wir sind noch lange nicht da, wo wir sein sollten. 2024 gab es auf npm ganze 7 Mio. veröffentlichte Komponenten, von denen gerade einmal 61k SBOMs besaßen.

- Slide: 61k SBOMs

C: Nur so wenige???

A: Ja, und die Rate, mit der die Bereitstellung von SBOMs zunimmt, macht da auch nicht viel mehr Hoffnung.

- Slide Cumulative vs. Packages

A: Die großen Hersteller sind dabei gar nicht einmal so problematisch; die kleinen Lieferanten, in bestimmten Nischen, die nicht auf Software-Entwicklung spezialisiert sind, haben es schon schwieriger.

C: SBOMs sollten dann trotzdem bei den nächsten Verlängerungen in die Verträge mit aufgenommen werden!

A: Wie vorhin kurz angedeutet, beinhalten unsere Anwendungen nicht nur Komponenten von unseren Lieferanten, sondern auch...

C: Open Source Teile?

A: Genau, und diese Projekte müssen nicht unbedingt eine SBOM liefern. Verträge haben wir in diesen Fällen auch nicht.

C: Na, das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen einfach, Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung, wie viel Open Source bei uns im Unternehmen verwendet wird, oder? 

C: Das kann doch nicht so viel sein...

- Slide: OSS Proliferation

A: Naja, einzelne Untersuchungen schätzen, dass Open Source in 97% der modernen Anwendungen verwendet werden

C: Dann nutzen wir halt einfach kein Linux mehr... 

A: Es geht hierbei nicht nur um Betriebssysteme, sondern um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen, Datenbanktechnologien, CI/CD-Tools, Programmiersprachen und Containertechnologin.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie dazu bringen, SBOMs zur Verfügung zu stellen. Das erhöht ja schlussendlich auch deren Marktanteil

- Slide: Open Source Maintainer

A: Marktanteile spielen im Open Source Kontext nicht wirklich eine Rolle. Hinzu kommt, dass die meisten Open Source Projekte von einzelnen oder wenigen Menschen gewartet werden. Diese haben wenig Zeit, wenig Support und sind sehr unter Druck und kommen nicht wirklich dazu. Da könnten wir als Unternehmen sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

- Slide: Sponsor More Open Source Projects!

C: Ach nein, das wurde in diesem Geschäftsjahr nicht budgetiert und die Finanzplanung ist auch bereits abgeschlossen. Vielleicht aber nächstes Jahr?

A: Mal abgesehen von diesen Herausforderungen hängt die Komplexität für die Erstellung einer SBOM stark von der Programmiersprache und den verwendeten Frameworks ab.

C: Hä, warum denn das? Code ist doch Code, egal in welcher Sprache!

A: Die Sprachen und wie sie funktionieren unterscheiden sich recht stark. In der modernen Web-Welt erhält man häufig schon automatisch die direkten Abhängigkeiten einer Applikation. Bei den nächsten Ebenen, den Transitiven Abhängigkeiten, kann es aber schon schwieriger werden.

C: Wir haben aber nicht nur Web-Applikationen bei uns...

A: Genau! Bei Server-Applikationen oder Hardware-naher Entwicklung werden Drittanbieter-Bibliotheken oftmals anders eingebunden und es gibt keine schöne Liste wie in der Web-Welt. Da müssen die Entwicklungsteams daran arbeiten, die Abhängigkeiten klar zu dokumentieren. Je älter die Technologie, desto schwieriger wird es, eine SBOM dafür zu erstellen.

- Slide: SBOM holding back Developers
  
C: Naja, da wird es wohl schon irgendeine technische Lösung geben, um diese SBOMs ganz einfach zu erstellen. Das kann doch nicht so schwer sein.
  
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. 

C: Es gibt doch Richtlinien und Standards!

A: Ja, die Richtlinien und Standards beziehen sich auf die Struktur.

C: Das ist ja, was wir brauchen!

A: Das ist wichtig, aber nicht genug. Granularität, Tiefe, oder die Beziehung zwischen den Komponenten sind nicht definiert und jeder macht das ein bisschen anders. 

C: Stellt das ein echtes Problem dar?

A: So ist es sehr schwer herauszufinden, ob eine gelieferte SBOM korrekt und vollständig ist.

C: Das sollte man aber technisch lösen können, es gibt ja bereits verschiedenste Tools auf dem Markt! Ich habe sogar bereits den Prozess initiiert, um ein kostenloses Tool für uns auszuwählen und das alles zu beschleunigen.

A: Wie vorhin bereits angedeutet: einige unserer Teams erstellen bereits SBOMs als Teil der automatisierten Build Pipelines. Würden wir aber jetzt zwei Tools zur automatischen Erstellung von SBOMs über die Anwendungen laufen lassen, würden diese mit hoher Wahrscheinlichkeit verschiedene Ergebnisse liefern.

C: Na, da muss doch dann eins falsch sein!

A: Womöglich ist keine SBOM falsch, sondern beide unvollständig.

C: Dann sollten wir diese ganzen SBOMs einfach harmonisieren. Das geht bestimmt mit irgendeiner KI.

- Slide: Nevermind

A: [Schnappatmung] Ich will ja keine Spielverderberin sein, aber da kommt schon das nächste Problem...

C: Was kann denn jetzt noch fehlen?

- Slide: SBOM Transmission

A: Die Übermittlung von SBOMs ist auch nicht standardisiert. Manche Hersteller stellen diese auf ihrer Website zum Download zur Verfügung, andere als Metadaten des Produkts, andere wiederum stellen sie via e-Mail auf Anfrage zur Verfügung.

C: Das ist doch super aufwendig. Mit Sharepoint ginge das bestimmt einfacher.

A: [Verdreht die Augen] Aktuell fragen wir die SBOMs meistens per e-Mail an und auf demselben Weg erhalten wir diese dann auch. Aber so richtig können wir dabei auch die Integrität und Authentizität der SBOMs nicht überprüfen; wir können also nichtmal automatisiert sicherstellen, dass die aus der richtigen Quelle kommen und auf dem Weg zu uns nicht manipuliert wurden.

C: Dafür gibt es doch bewährte Methoden, wie z.B. Signaturen oder Checksums, die man ja auch an anderer Stelle benutzt.

- Slide: Trustworthy

A: Ok, dann bekommen wir eine signierte SBOM, aber woher wissen wir, dass es sich um eine legitime Signatur handelt und nicht von jemandem, der uns etwas unterschieben möchte?

C: [schleimig] Sie haben wohl wirklich Zero Trust, hm?

A: [seufzt]

C: Nun ja, dann nehmen wir erstmal das, was wir bekommen können. Das ist dann mein Inventar in dem ich nach log4j und anderen Supply Chain Attacken suchen kann.

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
//fehlt menge an einzelnen SBOMs und thats it, in jeder SBOM einzeln prüfen müssen

<<<<<<< HEAD
<<<<<<< HEAD
=======
A: Nicht so wirklich. Die Erstellung von SBOMs hinkt aktuell noch sehr stark hinterher. Der State of Software Supply Chain von Sonatype hat die veröffentlichten Software Komponenten im Vergleich zu den veröffentlichten SBOMs dargestellt. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. 
=======
A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.
>>>>>>> b5126ecd (docs: update akt 2)

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben!
=======
>>>>>>> 64618adb (docs: review act 1 & 2)

A: Es geht aber nicht nur um die Lieferanten, die komplette Software Industrie hinkt noch sehr stark bei der Erstellung von SBOMs hinterher. Fast 7M veröffentlichte Komponenten und nur 61k SBOMs. So ähnlich sieht es auch bei unseren Lieferanten aus, die großen sind nicht so problematisch, kleine Nichen-Hersteller die nicht auf Software Entwicklung spezialisiert sind stehen hier vor großen Herausforderungen. Außerdem, ist Open Source aus den aktuellen Regularien wie den Cyber Resilience Act oder die Executive Direktive, und FDA in den USA, die SBOMs vorschreiben, großteils ausgenommen. **-> review OSS sentence**

C: Na das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung wie viel Open Source bei uns im Unternehmen verwendet wird, oder? Je nach 97% der Anwendungen die Sie gescannt haben, open source Komponenten im Einsatz haben. Es geht nicht nur um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen, sondern auch bei Datenbanktechnologien, CI/CD tools, Programmiersprachen und Containertechnologie.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie bringen SBOMs zur Verfügung zu stellen um den Marktanteil zu erhöhen.

A: Kritisch ;) Die meisten open source Projekte sind tatsächlich von einzelnen Maintainern abhängig...overload, wenig zeit, kein support. Wir als Unternehmen könnten da sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

C: Ach nein, das wurde in diesem fiscal year nicht budgetiert und die Finanzplanung ist bereits abgeschlossen. Vielleicht nächstes Jahr.

A: Mal abgesehen von den Open Source Projekten gibt es noch weitere Challenges, ich habe es vorhin kurz angedeutet. SBOMs sind im Kontext neuer Projekte und aktueller Technologien kein Hexenwerk. Bei interpretierten Programmiersprachen wie JavaScript oder Python sind die externen Abhängigkeiten in manifests wie package.json gelistet und können weiterverarbeitet werden. Da erhält man direkt den direkten Bibliotheken die eingesetzt werden. Bei kompilierten Sprachen, werden Abhängigkeiten und Libraries in Binaries verpackt und erfordern deutlich mehr Maintenance und Arbeit von den Entwicklungsteams. Und wir reden gar nicht über Legacy code, bei dem keiner so genau weiß was da reingepackt wurde. Dann sind wir schon beim Endgegner: Compilierte 20 Jahre alte legacy anwendung, die nicht mehr gewartet wird aber trotzdem weiter im Einsatz bleibt. **weniger technisch**
  
C: Naja da wird es wohl eine technische Lösung geben, um diese SBOMs ganz einfach zu erstellen. Das kann ja nicht so schwer sein.
  
<<<<<<< HEAD
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. Es gibt Richtlinien und Standards bezüglich der Struktur, alles andere wie Granularität, Tiefe, Beziehung zwischen den Komponenten sidn nicht definiert und jeder macht das ein bisschen anders. Dazu kommt dass eine neue SBOM bei jedem Software Update notwendig ist.
----------

=======
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. Es gibt Richtlinien und Standards bezüglich der Struktur, alles andere wie Granularität, Tiefe, Beziehung zwischen den Komponenten sind nicht definiert und jeder macht das ein bisschen anders. Da kann man sehr schnell den Überblick verlieren, außerdem ist noch gar nicht definiert ob die gelieferte SBOM korrekt und vollständig ist.

C: Tools gibt es ja bereits, ich habe bereits den Prozess initiiert um ein kostenloses Tool für uns auszuwählen um das alles zu beschleunigen.

A: Einige unserer Teams haben bereits SBOMs, die aus den automatisierten Pipelines herauspurzeln. Bei den anderen Teams, wo es um Kompilate geht hängt die Qualität der Tools von den Frameworks und Programmiersprachen ab und worauf sich ein Tool für die automatische SBOM Generierung fokussiert. Die heterogene Landschaft in diesem Kontext bringt weitere Herausforderungen. Man nehme eine Applikation und lässt 2 Tools zur Erstellung von SBOMs drüber laufen: die Ergebnisse werden unterschiedlich sein, und womöglich keine komplett falsch, sondern eher unvollständig. Letztendlich haben wir irgendwann einen Haufen SBOMs, in verschiedenen Tiefen mit denen man wenig anfangen kann.

**compiled vs anderes weg lassen**

C: Dann sollten wir diese ganzen SBOMs ja einfach harmonisieren, das geht bestimmt mit irgendeiner KI.
  
A: *schappatmung* Ich will ja keine Spielverderberin sein, aber da kommt schon das nächste Problem: die Übermittlung von SBOMs ist auch nicht standardisiert. Manche Hersteller stellen diese auf ihrer Website zum Download zur Verfügung, andere als Metadaten des Produkts, andere wieder stellen sie via Email auf Anfrage zur Verfügung.

C: Können wir nicht allen einfach einen link zu unserem Sharepoint geben?  

A: *verdrehte augen* Aktuell kommen die SBOMs auf verschiedene Wege zu uns, den größten Teil müssen wir aber bei den Suppliern anfragen und je nach Unternehmensgröße ist die Reaktion darauf. Abgesehen davon müsste man sich auch überlegen wie man die Integrität dieser Dokumente sicherstellt. 

C: Wenn wir die SBOMs von allen Applikationen, in jeder Version bei uns dann haben...ist das ein vollständiges Inventar in dem ich nach log4j und anderen Supply Chain Attacken suchen kann.
>>>>>>> a5a09447 (docs: review act2)

<<<<<<< HEAD
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
=======
A: Vergessen Sie nicht, dass die SBOMs nur maschienenlesbar sind - oder wollen SIE noch einmal einen blick reinwerfen? Bedeutet wir brauchen ein Tool, das die SBOMs verwalten kann um diese durchsuchbar zu machen und in einem zweitern Schritt Schwachstellen anzeigen kann.
>>>>>>> 8a678b5e (docs: finish act 2 and start act 3)
=======
A: Vergessen Sie nicht, dass die SBOMs nur maschienenlesbar sind - oder wollen SIE noch einmal einen blick reinwerfen? Bedeutet wir brauchen ein Tool, das die SBOMs verwalten kann um diese durchsuchbar zu machen und in einem zweitern Schritt Schwachstellen anzeigen kann.
>>>>>>> 71610d9c (docs: finish act 2 and start act 3)

C: Ja, dann haben wir das ja zusammen. Noch ein Tool einkaufen kriegen wir auch noch hin. Dann wissen wir direkt welche Schwachstellen die ganzen Produkte besitzen und die Supply Chain Angriffe beheben. Großartig!

A: Hier sollten wir kurz einige Missverständnisse rund um Supply Chain Angriffe und Vulnerabilities aus dem Weg Räumen.
<<<<<<< HEAD
<<<<<<< HEAD
Fangen wir mit den Supply Chain Angriffen an: Ein Supply Chain Angriff ist ein Cyberangriff, bei dem ein Angreifer Schwachstellen in der Lieferkette von Software und/oder Dienstleistungen ausnutzt, um indirekt das eigentliche Zielsystem zu kompromittieren. Das Ziel davon kann somit eine opensource-Bibliothek, ein CI/CD tool oder eine Drittanbieter-Software sein. Z.B. Beim SolarWinds Angriff in 2020 wurde Schadcode in ein Tool eingeschleust, dass dan bei Kunden weltweit installiert wurde, da die Software legitim ist. Es wir auch regelmäßig versucht z.B. in python pakete schadcode einzuführen. Log4j war eine kritische 0-day Schwachstelle, keine supply chain attacke.

**angriff auf die supply chain um das eigentliche Opfer anzugreifen**
=======
Fangen wir mit den Supply Chain Angriffen an: Ein Supply Chain Angriff ist ein Cyberangriff, bei dem ein Angreifer Schwachstellen in der Lieferkette von Software und/oder Dienstleistungen ausnutzt, um indirekt das eigentliche Zielsystem zu kompromittieren. Das Ziel davon kann somit eine opensource-Bibliothek, ein CI/CD tool oder eine Drittanbieter-Software sein. Z.B. Beim SolarWinds Angriff in 2020 wurde Schadcode in ein Tool eingeschleust, dass dan bei Kunden weltweit installiert wurde, da die Software legitim ist oder bei xz-utils, wo ein Contributor eine backdoor in ein opensource Paket eingeschleust hat. Es wir auch regelmäßig versucht z.B. in python pakete schadcode einzuführen. Log4j war eine kritische 0-day Schwachstelle, keine supply chain attacke.
>>>>>>> 71610d9c (docs: finish act 2 and start act 3)
=======
Fangen wir mit den Supply Chain Angriffen an: Ein Supply Chain Angriff ist ein Cyberangriff, bei dem ein Angreifer Schwachstellen in der Lieferkette von Software und/oder Dienstleistungen ausnutzt, um indirekt das eigentliche Zielsystem zu kompromittieren. Das Ziel davon kann somit eine opensource-Bibliothek, ein CI/CD tool oder eine Drittanbieter-Software sein. Z.B. Beim SolarWinds Angriff in 2020 wurde Schadcode in ein Tool eingeschleust, dass dan bei Kunden weltweit installiert wurde, da die Software legitim ist. Es wir auch regelmäßig versucht z.B. in python pakete schadcode einzuführen. Log4j war eine kritische 0-day Schwachstelle, keine supply chain attacke.

**angriff auf die supply chain um das eigentliche Opfer anzugreifen**
>>>>>>> a5a09447 (docs: review act2)
=======
A: Vergessen Sie nicht, dass die SBOMs nur maschienenlesbar sind - oder wollen SIE noch einmal einen blick reinwerfen? 
=======
A: Erstmal haben Sie nur eine Menge einzelner Dokumente die händisch durchsucht werden müssten. Und vergessen Sie nicht, dass die SBOMs nur maschienenlesbar sind - oder wollen SIE noch einmal einen blick reinwerfen? 
>>>>>>> e5ae364b (docs: fixed all comments in act 2)
=======
=======
- Slide: SBOMs everywhere

>>>>>>> 8ce77939 (docs: update slides & dialog)
A: Erstmal haben Sie nur eine Menge einzelner Dokumente, die händisch durchsucht werden müssten. Und vergessen Sie nicht, dass die SBOMs in erster Linie maschinenlesbar sind - oder wollen SIE noch einmal einen Blick reinwerfen? [grinst]
>>>>>>> a8cef1d4 (Polished 2nd Act)

C: Nein, nein, auf keinen Fall!

A: Das bedeutet also, wir brauchen ein Tool, das die SBOMs verwalten kann, um diese durchsuchbar zu machen.

C: Ja, dann haben wir das ja zusammen. Noch ein weiteres Tool einkaufen kriegen wir auch noch hin! Dann wissen wir endlich, welche Schwachstellen die ganzen Produkte besitzen und können die Supply Chain Angriffe beheben. Großartig!

A: Hier sollten wir kurz einige Missverständnisse rund um Supply Chain Angriffe und Vulnerabilities aus dem Weg räumen.

<<<<<<< HEAD
C: Wie das? 
>>>>>>> f9d0146c (docs: supply chain attack explained)
=======
C: Wie das?

- Slide: Supply Chain Attack Vectors
>>>>>>> 38a68973 (Added more slides with memes)

A: Fangen wir mit den Supply Chain Angriffen an: Bei einem Supply Chain Angriff wird ein Opfer über seine Supply Chain angegriffen, anstatt direkt seine Systeme zu penetrieren. Zum Beispiel über einen Softwarelieferanten mit schlechteren Sicherheitsmaßnahmen. Andere Beispiele wären, Schadcode in einem legitimen Code-Repository zu injizieren oder die Entwickler:innen zu täuschen, dass sie schadhafte Abhängigkeiten installieren.

C: War das bei log4j nicht der Fall?

A: Nein, log4j war eine kritische Zero-Day Schwachstelle.

C: Aber Supply Chain Angriffe nehmen doch zu...

A: Ja, das stimmt. Ein sehr bekanntes Beispiel für eine Supply Chain Attacke war, als der Software-Hersteller Solarwinds in 2020 gehackt wurde: dabei haben die Angreifer das Build System kompromittiert und es ihnen so ermöglicht, Schadcode in das entwickelte Produkt einzubauen. Die Kunden haben dann die Software installiert, weil diese von ihrem Lieferanten kam. Dadurch haben sich die Angreifer dann Zugriff auf die Zielsysteme verschafft.

C: Ja, aber das würden wir ja anhand der SBOM verstehen, dass da was drin ist, was nicht da sein sollte.

A: Aber woher erhalten wir die SBOM?

C: Ja... vom Anbieter!

A: ...der von einem Angreifer kompromittiert wurde, welcher dann wahrscheinlich auch die SBOM entsprechend anpasst, um seine Absichten zu verschleiern. ...und selbst wenn es eine Änderung an der SBOM geben sollte, haben wir als Konsumenten kaum Anhaltspunkte, um eine bösartige Änderung der Software von einer regulären Weiterentwicklung zu unterscheiden.

C: Verstanden... also helfen SBOMs gar nicht gegen Supply Chain Attacken?

- Slide: SBOM vs Supply Chain Attacks

A: Nein.

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
**zusammenhang zwischen SBOM und vulnerabilities**

=======
>>>>>>> 71610d9c (docs: finish act 2 and start act 3)
=======
**zusammenhang zwischen SBOM und vulnerabilities**

>>>>>>> a5a09447 (docs: review act2)
C: Ich habe doch letztens von einer neuen Datenbank in Europa gelesen, das sollte damit ja abgedeckt sein.
=======
C: Wozu soll der gut sein?

A: Bei der Veröffentlich von Schwachstellen, werden die gleichen Informationen abgefragt, die in der SBOM enthalten sind...sodass jede Schwachstelle einem oder mehreren CPEs zugewiesen wird. 
>>>>>>> ef9b1027 (docs: vulnerabilities expanded)
=======
C: Was ist denn mit log4j?

A: Ja, das schon eher, weil es Dependency mit einer kritischen Schwachstelle ist.
>>>>>>> 04669493 (docs: added comments to review, added notes for finale)
=======
C: ...und was ist denn dann mit log4j?

- Slide: Log4j Vendors

A: Ja, da wären SBOMs schon eher hilfreich, weil es eine Dependency mit einer kritischen Schwachstelle war.
>>>>>>> a8cef1d4 (Polished 2nd Act)

C: Das war ein Alptraum herauszufinden wo das im Einsatz war! Aber mit den SBOMs hätten wir ja jetzt die Schwachstellen alle in der SBOM gelistet.

A: Mooooooment, machen wir einen kurzen Schritt zurück. Durch dieses Inventar bekommt ein Entwicklungsteam in erster Linie einen Überblick über die Abhängigkeiten ihrer Software. Durch die Informationen wie Hersteller, Name und Version der Komponenten werden diese zunächst einmal eindeutig identifiziert.

C: Und woher kriegen wir dann die Schwachstellen zu diesen Abhängigkeiten?

- Slide: CVE-2021-44228

A: Indem wir öffentliche Schwachstellen-Datenbanken nach Informationen dazu durchsuchen.

C: Öffentliche Schwachstellen-Datenbanken? Kann man sich da einfach anschauen, in welcher Software Sicherheitslücken enthalten sind?

A: Ja, genau. In diesen Datenbanken werden alle möglichen Sicherheitslücken dokumentiert, die von Unternehmen und Sicherheitsforscher:innen veröffentlicht werden. Die größte Datenbank an Schwachstellen wird nebenbei vom US-amerikanischen MITRE betrieben. Das Programm ist ein Eckpfeiler der globalen Sicherheit, da es weltweit von Unternehmen genutzt wird, um Schwachstellen zu veröffentlichen und von Security-Tool-Herstellern, um ihre Services damit zu füttern.

C: Welch ein Glück, dass wir uns in Punkto Sicherheit mal wieder auf die USA verlassen können!

- Slide: Reuters on CVE

A: Genau da liegt das nächste Problem: Durch die monetäre Abhängigkeit von der US-amerikanischen Regierung können sich politische Entscheidungen, z.B. von freidrehenden Präsidenten, recht schnell auf die Verfügbarkeit solcher zentralen Services auswirken.

C: Oh, ja, das könnte problematisch sein... Vielleicht sollten wir auch an dieser Stelle in Europa ein bisschen suveräner werden und unsere eigene Datenbank bauen.

A: Ja, die ENISA arbeitet bereits daran und hat gerade die Beta-Version ihrer Platform im Einsatz. Damit bewegen wir uns weg von der aktuellen "single source of truth", welche die Datenbank von MITRE war, hin zu mehreren Datenbanken und das Ganze wird fragmentiert.

C: Na gut, dann haben wir halt mehrere Quellen die mir sagen wo ich angreifbar bin. Doppelt gemoppelt hält ja besser!

A: Naja, wir haben dann eine sehr lange, eventuell inkonsistente Liste an Schwachstellen. Aber nur weil eine verwendete Bibliothek eine Schwachstelle enthält, bedeutet es nicht zwangsläufig, dass diese ausgenutzt werden kann.

C: Wie geht das denn?

A: Wenn die Entwickler:innen den verwundbaren Teil nicht benutzen der von der Schwachstelle betroffen ist, dann haben Angreifende häufig auch nicht die Möglichkeit, diese zu missbrauchen. Das ist das Konzept der sogenannten "Exploitability".

C: Aber woher wissen wir denn dann, ob wir angreifbar sind oder nicht?

A: Das müssen wir entsprechend testen und das damit verbundene Risiko bewerten.

C: Das klingt nach ganz schön viel Aufwand... Hah, warum lassen wir das nicht die Anbieter selber testen und die Ergebnisse mit uns teilen?

A: Ja, das gibt es auch schon. Das ist das sogenannte "Vulnerability Exploitability eXchange", kurz "VEX"

- Slide: Anatomy of VEX

C: Lassen Sie mich raten: Wieder ein nur maschinell lesbares Dokument?

A: Ja, damit kann der Anbieter die SBOM erweitern, um die Ausnutzbarkeit von Schwachstellen in den aufgelisteten Komponenten zu klären.

C: Das klingt doch vielversprechend!

A: Naja, nicht wirklich. Die VEX ist ein statisches Dokument, Schwachstellen sind aber leider ein bisschen dynamischer. Der VEX gibt mir nur einen Snapshot zu einem gewissen Zeitpunkt. Wenn neue Schwachstellen entdeckt werden, muss der Hersteller diese neu für jede noch aktiv genutzte Version seiner Software bewerten und neue VEX-Dateien für diese Produkte schicken.

C: Ohje, dann ertrinken wir ja diesen Unterlagen!

A: Nicht nur das: Hersteller haben natürlich einen impliziten Anreiz zu zeigen, dass sie von möglichst wenigen Schwachstellen betroffen sind. Und wir können auch nicht bewerten, ob und wie der Hersteller die Anwendbarkeit getestet hat. 

C: ...weil es auch hier an einheitlichen Ansätzen fehlt?

A: Ja, sowohl bei SBOMs als auch VEX-Dokumente müssen wir darauf vertrauen, dass die Verfasser:innen ordentlich arbeiten und wissen was sie tun...

- Slide: SBOM challenges

## Akt 3

C: Lohnt sich der scheinbar riesige Aufwand dann überhaupt bei all den Unzulänglichkeiten...

- Slide: Silver Bullet

A: SBOMs können einen Mehrwert bieten, sie sind bloß schlicht nicht die Silver Bullet, die viele sich erhoffen.

C: Aber wofür brauchen wir die denn dann?

A: Allein schon, weil sie direkt oder indirekt in einigen neuen Cybersecurity Regularien abgebildet werden.

- Slide: Regulations

C: Also müssen wir das in unserem Kontext sowieso machen

A: Ja, aber lassen Sie uns das nicht als Compliance-Checkbox betrachten, sondern was sinnvolles damit anstellen.

- Slide: Regulatory Requirements

C: Wie soll dass jetzt funktionieren? All meine Ideen haben sie auseinandergenommen...

A: In der Software Entwicklung ist ein Thema von vitaler Wichtigkeit: Abhängigkeiten tracken! Das macht man in Bezug auf Open Source Packages mit einer sogenannten "Software Composition Analysis".

C: Was bringt mir das?

A: Naja mit der Software Composition Analysis wird die Applikation nach externen Abhängigkeiten durchsucht und überprüft, ob die Komponenten aktuell sind, Schwachstellen enthalten und gegebenenfalls problematische Lizenzen beinhalten.

C: Das klingt aber nach nichts Neuem...

A: Ist es auch nicht, durch die Einführung von SBOMs ist dieses Thema wieder in den Vordergrund getreten und um kommerzielle Komponenten erweitert worden. Die Notwendigkeit einer ordentlichen Inventarisierung von Software gibt es aber schon seit einiger Zeit.

C: Aber was soll das dann konkret bringen?

A: Die Inventarisierung schafft die Datengrundlage um die Qualität der Software und die damit verbundenen operativen Risiken bewerten zu können. Die Information/Metadaten einfach nur rumliegen zu haben bringt uns nichts, aber diese Transparenz ermöglicht uns folglich zu priorisieren wo die Entwicklungsteams patchen und nacharbeiten müssen.

- Slide: No Need to spend Efforts

C: Wer kontrolliert denn das das auch wirklich gemacht wird? Das bedarf ja auch einer neuen Governance Funktion

A: Ja wir sollten ein Auge darauf haben, dass zumindest die kritischen Punkte zeitnah behoben werden, wissen Sie wie häufig noch heute die veraltete und verwundabare log4j Version verwendet wird?

C: Nirgends hoffe ich mal!

- Slide: log4j legacy versions

A: Weit verfehlt, diese wird noch regelmäßig heruntergeladen und in Software eingebunden. Daher müssen wir bei den Entwickler:innen das Bewusstsein für einen verantwortungsvollen Umgang mit Abhängigkeiten schärfen.

C: Z.B. nur Abhängigkeiten ohne jegliche Schwachstellen...

A: Ganz ohne Schwachstellen wird es sehr schwierig...allerdings könnte ein adequates Risikoprofil als eines der Auswahlkriterien sein, die wir mit den Entwicklungsteams ausarbeiten. Andere wären z.B., dass sie aktiv gepflegt werden, ob sie von einem vertrauenswürdigen Publisher kommen, oder wie schnell Schwachstellen oder issues gelöst werden.

C: Woran können sie das denn erkennen? Gibt es da vielleicht etwas was wir direkt einsetzen können? (Ratiopharm meme)

- Slide: OpenSSF Scorecard Report

A: Hier gibt es z.B. die openssf scorecard zur Bewertung von open source projekten die man auch direkt in den Pipelines einbinden kann um den Entwickler:innen direkt Rückmeldung zu geben.

C: Was hat den das alles mit SBOMs zu tun?

A: SBOMs stellen ein mögliches Artefakt dar um eine Inventarisierung der Software darzustellen. Schlußendlich ist das nur ein Format in dem bestimmte Informationen dargestellt und ausgetauscht werden. Und wenn man einmal die Basics gemeistert hat...und die Entwicklungsteams besser Acht geben auf was sie so einbinden...gestaltet sich auch die ganze SBOM generierung und Gvernance einfacher.

C: Also sind SBOMs doch nicht gänzlich nutzlos?

A: Nicht gänzlich...

C: Großartig! Toll, dass ich Sie überzeugen konnte...

[C schaut auf's Handy]

C: Oh, entschuldigen Sie bitte, da muss ich rangehen. Arbeiten Sie mir dann bitte mal ein Konzept aus, wie wir die besprochenen Sachen alle im nächsten Quartal umsetzen können. Schaffen Sie das bis nächste Woche?

[C nimmt Handy ans Ohr und läuft von der Bühne]

C: Ja Tachchen Hermann! Du, wir machen jetzt auch SBOMs... ja, richtig, die Supply Chain Attacken sind damit abgewehrt

[A schlägt die Hände vor's Gesicht]

# Q&A [5min]
