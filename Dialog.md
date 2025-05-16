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

[SBOM meme]

C: Woher... [sammelt sich kurz] Die Anzahl an Supply Chain Attacks wie log4j hat in den letzten Jahren so stark zugenommen und wir müssen uns dagegen schützen. Hier gibt es mit SBOMs wirklich eine tolle Lösung!

A: SBOMs als Lösung für Supply Chain Attacks? Wissen sie denn, was eine SBOM ist?
>>>>>>> a7f351ce (docs: vendor vs. oss)

C: Ja klar, eine SBOM ist wie so eine Zutatenliste, die mir sagt was in einem Lebensmittel enthalten ist, nur halt für Software. Also 30 Zeilen HTML, 50 Zeilen Java, sowas halt.

A: Gar nicht mal sooo schlecht. Aber fangen wir mal etwas kleiner an: In der modernen Softwareentwicklung schreiben die Entwickler:innen nicht jede Zeile Code selbst, sondern greifen auf vorgefertigte Teile zurück. Nehmen wir die Datumsauswahlfunktion in einer x-beliebigen Anwendung: das ist einerseits recht komplex, andererseits wird es immer wieder benötigt. Somit ist es effizienter, solchen Code in Form von Bibliotheken oder Frameworks aus dem Internet zu laden, statt jedes Mal das Rad neu zu erfinden.

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

A: In moderner Software-Entwicklung glücklicherweise nicht, weil sich die Erstellung im Build Process automatisieren lässt; die SBOM wird also jedes Mal automatisch generiert, wenn wir aus dem Quellcode das entsprechende Programm bauen.

C: Ach, das ist ja praktisch!


## Akt 2 [15min]

C: Wow, also haben wir mit diesen ganzen SBOMs die Zutatenliste von jeder Software die wir entwickeln und einsetzen?  

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
A: Teilweise. Für unsere moderneren Applikationen, dessen build und deployment Prozess durchautomatisiert ist, ist die Erstellung einer SBOM trivial. Viele Legacy Anwendungen, speziell die auf compilierte Sprachen basieren, stehen vor großen Herausforderungen. Und dabei haben wir noch nicht unsere Zulieferer betrachtet.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben! Jeder macht das ja und alle tun das
<<<<<<< HEAD
=======
A: Ja, teilweise. Unsere Entwickler:innen arbeiten dran, SBOMs für unsere Produkte zu erstellen. 

C: ..und dann sind wir ja fertig damit! Prima!
>>>>>>> a7f351ce (docs: vendor vs. oss)

A: Nicht so schnell! Damit wir die SBOMs für unsere Produkte finalisieren können brauchen wir die SBOMs von Komponenten die von unseren Lieferanten kommen.

C: Das geht doch schnell, wir schreiben es in die Verträge und zwingen alle dazu uns die SBOMs zu geben! SBOMs macht ja jeder.

A: Es stimmt, dass immer mehr SBOMs erstellt werden, aber wir sind noch lange nicht da wo wir sein sollten. Fast 7M veröffentlichte Komponenten in 2024 und nur 61k SBOMs. 

C: Nur so wenige???

A: Die großen Hersteller sind nicht so problematisch, die kleinen Lieferanten, in bestimmten Nichen die nicht auf Software-Entwicklung spezialisiert sind haben es schon schwieriger.

C: SBOMs sollten dann trotzdem in den Verträgen bei den nächsten Verlängerungen mit aufgenommen werden...

A: Ja, das stimmt. Das hilt trotzdem nicht ganz so viel, da Open Source Projekte nicht unbedingt eine SBOM liefern müssen.

C: Na das lässt sich ja auch einfach lösen. Wir verbieten unseren Entwickler:innen Open Source zu verwenden. 

A: Sie haben keine wirkliche Ahnung wie viel Open Source bei uns im Unternehmen verwendet wird, oder? 

C: Das kann doch nicht so viel sein

A: 97% der Anwendungen die ein Hersteller gescannt hat, hat open source Komponenten im Einsatz.

C: Dann nutzen wir kein Linux mehr... 

A: Es geht nicht nur um Betriebssysteme sondern um Bibliotheken, die Entwickler:innen verwenden um die Arbeit zu beschleunigen, Datenbanktechnologien, CI/CD tools, Programmiersprachen und Containertechnologie.

C: Dann sollten wir an die Quelle gehen und die Open Source Projekte irgendwie bringen SBOMs zur Verfügung zu stellen um den Marktanteil zu erhöhen.

A: Kritisch ;) Die meisten open source Projekte werden von einzelnen oder wenigen Menschen gewartet. Diese haben wenig Zeit, wenig Support und sind sehr unter Druck...da könnten wir als Unternehmen sowohl mit finanzieller als auch mit fachlicher Unterstützung supporten!

C: Ach nein, das wurde in diesem fiscal year nicht budgetiert und die Finanzplanung ist bereits abgeschlossen. Vielleicht nächstes Jahr.

A: Mal abgesehen von diesen Herausforderungen ist die Erstellung von SBOMs nicht trivial. Die Einfachheit hängt stark von der Programmiersprache und den verwendeten Frameworks ab.

C: Warum denn das? Code ist ja code!

A: Die Sprachen und wie sie funktionieren unterscheiden sich recht stark. In der modernen Web-Welt erhält man automatisch die direkten Abhängigkeiten einer Applikation, bei den nächsten Ebenen, den transitiven Abhängigkeiten ist es schon schwieriger.

C: Wir haben aber nicht nur web-applikationen bei uns...

A: Genau, bei Hardware-naher Entwicklung, werden Drittanbieter Bibliotheken anders eingebunden und es gibt keine schöne Liste wie in der Web Welt. Da müssen die Etnwicklungsteams daran arbeiten die Abhängigkeiten klar zu dokumentieren. Je älter die Applikation, je schwieriger es wird eine SBOM dafür zu erstellen.
  
C: Naja da wird es wohl eine technische Lösung geben, um diese SBOMs ganz einfach zu erstellen. Das kann ja nicht so schwer sein.
  
A: Leider doch schon. Die Erstellung von SBOMs ist nicht standardisiert. 

C: Es gibt doch Richtlinien...

A: Ja, die Richtlinien und Standards beziehen sich auf die Struktur.

C: Das ist ja was wir brauchen!

A: Das ist wichtig, aber nicht genug. Granularität, Tiefe, Beziehung zwischen den Komponenten sind nicht definiert und jeder macht das ein bisschen anders. 

C: Stellt das ein echtes Problem dar?

A: So ist es sehr schwer herauszufinden ob eine gelieferte SBOM korrekt und vollständig ist.

C: Das sollte man ja technisch lösen können, es gibt ha bereits verschiedenste Tools auf dem Markt! Ich habe bereits den Prozess initiiert um ein kostenloses Tool für uns auszuwählen um das alles zu beschleunigen.

A: Wie vorhin bereits angedeutet, einige unserer Teams erstellen SBOMs als Teil der automatisierten Build Pipelines, die direkten Abhängigkeiten sind da auch enthalten, bei den transitiven Abhängigkeiten kann es dann schnell komplex werden und zwei Tools zur automatischen Erstellung von SBOMs würden höchstwahrscheinlich verschiedene Ergebnisse liefern.

C: Na da muss dann eins falsch sein!

A: Womöglich ist keine SBOM falsch, sondern beide unvollständig.

C: Dann sollten wir diese ganzen SBOMs ja einfach harmonisieren, das geht bestimmt mit irgendeiner KI.
  
A: *schappatmung* Ich will ja keine Spielverderberin sein, aber da kommt schon das nächste Problem...

C: Was kann denn jetzt noch fehlen?

A: die Übermittlung von SBOMs ist auch nicht standardisiert. Manche Hersteller stellen diese auf ihrer Website zum Download zur Verfügung, andere als Metadaten des Produkts, andere wieder stellen sie via Email auf Anfrage zur Verfügung.

C: Können wir nicht allen einfach einen link zu unserem Sharepoint geben?  

A: *verdrehte augen* Aktuell kommen die meisten SBOMs auf Anfrage bei uns an. Die Integrität der Dokumente wird aktuell nicht berücksichtigt. 

C: Da gibt es ja bewährte Methoden, wie z.B. Signaturen oder Checksums die man auch an anderer Stelle benutzt.

A: Ja, hier muss man aktuell noch alles händisch signieren und auch so anfordern, da es nicht standardisiert ist.

C: Aber wenn wir die SBOMs von allen Applikationen, in jeder Version bei uns dann haben...ist das ein vollständiges Inventar in dem ich nach log4j und anderen Supply Chain Attacken suchen kann.

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

C: Nein, nein, auf keinen Fall!

A: Das bedeutet wir brauchen ein Tool, das die SBOMs verwalten kann um diese durchsuchbar zu machen und in einem zweitern Schritt Schwachstellen anzeigen kann.

C: Ja, dann haben wir das ja zusammen. Noch ein Tool einkaufen kriegen wir auch noch hin. Dann wissen wir direkt welche Schwachstellen die ganzen Produkte besitzen und die Supply Chain Angriffe beheben. Großartig!

A: Hier sollten wir kurz einige Missverständnisse rund um Supply Chain Angriffe und Vulnerabilities aus dem Weg räumen.

C: Wie das? 
>>>>>>> f9d0146c (docs: supply chain attack explained)

A: Fangen wir mit den Supply Chain Angriffen an: Ein Supply Chain Angriff ist ein Cyberangriff, bei dem ein Angreifer die Software Supply Chain einer dritten Partei angreift um dadurch an das eigentliche Opfer zu gelangen.

C: War das bei log4j nicht der Fall?

A: Nein, log4j war eine kritische Zero-Day Schwachstelle, kein Supply Chain Angriff.

C: Aber Supply Chain Angriffe nehmen doch zu...

A: Ja, das stimmt. Ein sehr bekanntes Beispiel für eine Supply Chain Attacke war Solarwinds in 2020: dabei wurde Schadcode in eine Orion Software von SolarWinds eingeschleust, die legitime Anwendung wurde dann von Kunden weltweit installiert. Durch den Schadcode, haben sich die Angreifer Zugriff auf die Zielsysteme verschafft.

C: Verstanden, aber ich möchte dann trotzdem alle Schwachstellen in meinen Produkten kennen.

A: Das ist ein berechtigter Wunsch, leider wird das zunehmend komplexer.

C:[ungläubig]..noch mehr?

A: Machen wir einen kurzen Schritt zurück, was haben Schwachstellen mit SBOMs zu tun und wie funktioniert die Zuordnung?

C: Stimmt eigentlich, die SBOM ist ja nur eine Liste an Komponenten mit einigen Details...

A: Durch dieses Inventar bekommt das Team in erster Linie einen Überblick über deren Abhängigkeiten. Durch die Informationen wie Hersteller, Name und Version der Komponenten wird ein eindeutiger String generiert, der die Komponente eindeutig identifiziert, der CPE-String (Common Platform Enumeration).

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

C: Und damit matchen die Hersteller die CPEs in den SBOMs mit denen der Schwachstellen...

A: Genau so, das führt uns auch schon zur nächsten Herausforderung. Nur weil eine verwendete Bibliothek eine Schwachstelle enthält, bedeutet es nicht zwangsläufig dass diese ausgenutzt werden kann.

C: Wie geht das denn? Schwachstelle ist Schwachstelle

A: Nicht wirklich, wenn die Entwickler:innen den Teil nicht benutzen der von der Schwachstelle betroffen ist, dann haben Angreifende auch nicht die Möglichkeit diese zu misbrauchen. Das ist das Konzept der Exploitability.

C: Das muss man doch feststellen können, oder?

A: Ja, die Entwickler:innen der jeweiligen Komponenten und Bibliotheken müssen das bewerden und damit umgehen. Mit den SBOMs erhalten wir erstmal nur eine Liste mit allen Schwachstellen die zu einer gewissen Version einer Komponente gemappt werden.

C: hm, schwierig... ha! dann sollten doch einfach die anbieter am besten selber testen und die ergebnisse in die SBOM mit einfügen!  

A: Ja, das gibt es auch schon. Das ist das sogenannte VEX "Vulnerability Exploitability eXchange"

C: Wieder ein nur maschinell lesbares Dokument? -.- 

A: Ja, das kann die SBOM erweitern um die Ausnutzbarkeit von Schwachstellen zu klären in den aufgelisteten Komponenten.

C: Klingt doch vielversprechend?

A: Naja, nicht wirklich. Die VEX ist ein statisches Dokument, Schwachstellen sind ein bisschen dynamischer. Der VEX gibt mir nur einen Snapshot zu einem gewissen Zeitpunkt. Wenn neue Schwachstellen entdeckt werden muss der Hersteller diese neu bewerten und uns eine neue VEX Datei für das Produkt schicken.

C: Ja, dann ertrinken wir ja diesen Unterlagen!

A: Genau und zum Thema Schwachstellen Management kommt noch hinzu dass die größte Datenbank an CVEs von MITRE betrieben... 

C: Die waren letztens doch in der Presse wegen der auslaufenden Finanzierung

A: Ja, das CVE-Programm wird weltweit von Unternehmen genutzt um Schwachstellen zu veröffentlichen und von Security-Tool Herstellern um ihre Tools damit zu füttern. Das Programm ist ein Eckpfeiler der globalen Sicherheit, man hat aber gemerkt wie politische Einflüsse sich darauf auswirken können.

C: Ich habe doch letztens von einer neuen Datenbank in Europa gelesen, das sollte damit ja abgedeckt sein.

A: Ja, die ENISA hat gerade die Beta-Version ihrer Platform im Einsatz. Damit bewegen wir uns weg von einer fast "signle source of truth", das die MITRE DB war, zu mehreren Datenbanken und das ganze wird fragmentiert.

C: Na jetzt haben sie es aber geschafft mir die SBOMs komplett kaputt zu machen! Das ist ja nur noch sinnloser Aufwand der gar keinen Mehrwert bringt!


## Akt 3

A: Ich kann die Frustration gut nachvollziehen. SBOMs können aber auch einen sinnvollen Einsatz haben. Nur sind sie nicht die silver bullet die man sich oft erhofft.

C: Und das wäre?

A: Auf der einen Seite, werden SBOMs in neuen Regularien genannt und bilden die Grundlage für sichere Produkte wie z.B. der CRA. Da wir das somit eh machen müssen, sollten wir auch was sinnvolles damit anstellen und nicht nur wie eine Checkbox betrachten.

C: Wie soll dass jetzt funktionieren? All meine Ideen haben sie zerrissen...

A: In der Software Entwicklung ist ein thema von vitaler Wichtigkeit: Abhängigkeiten tracken. Das macht man in Bezug auf Open Source Packages mit einer Software Composition Analyse.

C: Was bringt mir das?

A: Naja mit der SCA wird die Applikation nach OSS durchsucht und überprüft ob die Komponenten aktuell sind, schwachstellen enthalten und ob diese problematische Lizenzen beinhalten.

C: Das klingt aber nach nichts neuem...

A: Ist es auch nicht, durch die Einführung von SBOMs ist dieses Thema wieder in den Vordergrund getreten. Die Notwendigkeit einer ordentlichen Inventarisierung von Software gibt es schon seit einiger Zeit.

C: Aber was soll das dann konkret bringen?

A: Naja, eine sinnvolle Inventarisierung gekoppelt mit entsprechender Governance rund um das Monitoring, Schwachstellen Management wie es schon auf Infrastruktur erfolgt auf die Software anwenden -> dies gibt einem Unternehmen eine sehr gute visibility in die Software und kann dann auch darauf besser reagieren. Und ja, mit einem ordentlichen Inventar, kann man sich bei einer kritischen zero-day lücke wie log4j das Leben leichter machen und schneller identifizieren wo diese zu finden ist, allerdings nur unter der Annahme dass die SBOMs gepflegt, richtig, zentral durchsuchbar und up to date sind.

C: *nachdenklich*

A: Wenn man dann die Hausaufgaben gemacht hat, kann man auch anfangen mit SBOMs zu Arbeiten. Z.B. indem man die Infromationen der SBOM wie vulnerabilities mit in ein DAST tool fließen lässt um z.B. die Exploitability zu überprüfen und das Produkt zu verbessen.

C: 

Q&A

5 Minuten

**SBOMs sind per Definition auch flach abgebildet...bedeutet die Teams brauchen ein tiefes Verständnis der verwendeten Bibliotheken.**