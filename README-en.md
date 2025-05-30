<!-- .slide: data-visibility="hidden" -->
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/something-appsec/sbom-talk/badge)](https://scorecard.dev/viewer/?uri=github.com/something-appsec/sbom-talk)

> [!NOTE]
> This is the [reveal.js](https://revealjs.com/) Slide Deck for the Talk **"SBOMs - Eine Tragikomödie in 3 Akten"** by Jasmin Mair and Lukas Mika.
> 
> The rendered presentation is available **[here](https://something-appsec.github.io/sbom-talk/)**.

---

# SBOMs
## A Tragicomedy in Three Acts

_by *Jasmin Mair* and *Lukas Mika*_

<div style="font-size: 0.6em; margin-top: 2em">
Presentation Slides and Script available at<br/>
<a href="https://github.com/something-appsec/sbom-talk">https://github.com/something-appsec/sbom-talk</a><br/>
<img src="images/qr-code.gif" width="100" height="auto"><br/>
</div>

---

# Disclaimer

All characters appearing in this work  
are purely fictitious.

Any resemblance to real persons, living or dead,  
is purely coincidental.

---

<img src="images/no-cisos-harmed.png" alt="No CISOs were harmed Logo" width="1000" height="auto">

<div style="font-family: serif; font-size: 0.8em">
No CISOs were harmed <br/>
in the Making of this Presentation
</div>

Dialog:

A [on the phone]: ...I’m telling you, if one more person comes at me with SBOMs, I’m quitting. Oh, I’ll call you back later, the manager is coming right now.

---

# 1st Act

## _Introductio_

Dialog:

C [entering the room]: Wonderful good morning, Mrs. Mair! Einen wunderschönen guten Morgen, Frau Mair! So, how are WE doing today?

A [rolls eyes]: Good morning Mr. Mika. Guten Morgen, Chef. I can only speak for myself, but we're under a lot of stress at the...

C: I'm doing wonderfully, thanks for asking!

A [sighs]: What can I do for you?

---

<figure>
    <img src="images/supply-chain-attacks.png" width="800" height="auto">
    <figcaption><a href="https://www.sonatype.com/hubfs/1-2023%20New%20Site%20Assets/SSCR/8th-Annual-SSCR-digital-0206%20update.pdf">Sonatype: 2022 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

C: Have you heard about all the supply chain attacks? They happen everywhere! We need to protect ourselves against them _as soon as possible_!

A: Well, I mean...

C: I even found the solution for it: S-B-O-M-S

---

<img src="images/sboms-rainbow.jpg" alt="SBOM Meme with Spongebob holding a rainbow" width="800" height="auto">

Dialog:

A: Excuse me?

C: S-B-O-M-S

A: Come again?

C: Software... Billy...

A: You mean Software Bill of Materials? SBOMs?

C: Exactly what I said! Everyone needs to create them these days to improve the overall security posture!

A: Did you attend a compliance conference once again?

---

<img src="images/distracted-by-sbom.jpg" alt="Distracted by SBOM" width="1000" height="auto"> 

Dialog:

C: How do you... [collects himself] The number of supply chain attacks like log4j has been on the rise in the last years and we need to protect ourselves against them. There is a really great solution here with SBOMs!

---

<img src="images/sbom-big.jpg" alt="SBOM Big!" width="700" height="auto">

Dialog:

A: Ähm... SBOMs as solution for supply chain attacks? Do you even know, what an SBOM is?

C: Absolutely yes! An SBOM is a kind of a list of ingredients that tells me what's in food, but for software. For example: 30 lines of HTML, 50 lines of Java, that sort of things.

---

<figure>
    <img src="images/dependency-tree.png" alt="Example Dependency Tree" width="600" height="auto">
    <figcaption><a href="https://blog.droidchef.dev/mastering-the-gradle-dependency-tree/">Ishan Khanna: Mastering the Gradle Dependency Tree</a></figcaption>
</figure>
<br/>

Dialog:

A: Not bad at all. But let's start a little smaller: In modern software development, developers don't write every line of code themselves, they rely on ready-made parts. Let's take the date-picker function in any application: on the one hand, this is quite complex, but on the other hand, it is needed again and again. It is therefore more efficient to download such code from the Internet in the form of libraries or frameworks instead of reinventing the wheel every time.

C: Our software developers take ready-made code from the internet? So why are we spending huge amounts of money on the development teams?

A: Would you rather spend money to have each team write their own data-picker tool? Or should they generate business value?

C: Definitely business value...

---

<figure>
    <img src="images/oss-percentage.png" alt="70-90% of all Software is Open Source" width="1000" height="auto">
    <figcaption><a href="https://www.intel.com/content/www/us/en/developer/articles/guide/the-careful-consumption-of-open-source-software.html">Intel: The Careful Consumption of Open Source Software</a></figcaption>
</figure>
<br/>

Dialog:

A: That would be near to impossible without such external components nowadays. Different studies found that 70-90% of any given software code base is made up of open source components.

C: That many!?! I doubt we have that many date-pickers in our software?!

A: Well, it's not only about date-pickers, but very different and basic functionalities that are loaded in as libraries or frameworks from various external sources. These in turn depend on other components, the so-called 'transitive dependencies' - such as log4j

---

<img src="images/squid-game-log4j.jpg" alt="Next Task: Find log4j in your Org" width="1000" height="auto">

Dialog:

C: log4j, right! Nobody knew where it was nested!

A: Exactly. And these components in turn have their own dependencies on which they rely.

---

<img src="images/yo-dawg.jpg" alt="Dependencies over Dependencies" width="1000" height="auto">

Dialog:

C: ...and these in turn have other dependencies, which on their part rely on other dependencies, which....

---

<figure>
    <img src="images/transitive-dependencies.png" alt="Transitive Dependencies" width="800" height="auto">
    <figcaption><a href="https://blog.phylum.io/hidden-dependencies-lurking-in-the-software-dependency-network/">Phylum: Hidden Dependencies lurking in the Software Dependency Network</a></figcaption>
</figure>
<br/>

Dialog:

A: Exactly! So even a few _direct_ dependencies can load a lot of further dependencies.

C: This gets more and more complex! How do you keep track of it all?

---

<img src="images/dependency-graph.png" alt="Dependency Graph" width="500" height="auto">

Dialog:

A [grins] ...and that's where SBOMs come into play!

C: Yeah right, the list of ingredients! I knew it, I just wanted to test you! 

Ja klar, die Zutatenliste, wusste ich doch! Ich wollt Sie nur testen [winks]

---

# SBOM

- Supplier Name
- Component Name
- Version of the Component
- Other Unique Identifiers
- Dependency Relationship
- Author of SBOM Data
- Timestamp
- Licenses

Dialog:

A: Very good! SBOMs are therefore standardized structures in which the most important data points for all these dependencies are listed. What kind of component is it, where does it come from, what version does it have, what license is associated...? Would you like to see an SBOM like this?

C: Oh, yes! I'd love to!

---

<img src="images/sbom-example.png" alt="SPDX JSON Example" width="1000" height="auto">

Dialog:

C: Oh, nobody can read that!!

A: Correct, SBOMs are actually primarily intended for machines.

C: [slimy] ...and for top talents like you! Did you write that?

A: No, that would be near to impossible. We received this SBOM from one of our software suppliers.

C: Oh, it's not from our software?

A: No, not this one. It lists the components that are used in his software. But we can also create SBOMs for our own software, which in turn list our dependencies.

C: ...and we then pass these on to our customers?

A: Yes, exactly!

C: But then they know how our software was built! Can't they simply rebuild it?

A: No, the SBOM only states which external components are used. The business logic and how it uses these components is not listed.

C: Okay... but if we use so many components in our software, the SBOM would have to be recreated every time something changes...

A: Right.

C: Isn't that a lot of work? Is that the reason why developers are always so busy?

A: Fortunately not in modern software development, because the creation can be automated in the build process; the SBOM is generated automatically every time we build the corresponding program from the source code.

C: Oh, that's practical!

---

# About SBOM

- Machine-readable nested inventory list of ingredients making up software components
- High expectations from different stakeholders
- Differentiation between direct and transitive dependencies

---

# 2nd Act

## _Disputatio_

Dialog:

C: So with all these SBOMs we have the ingredient list of every software we develop and use?

A: Yes, partly. Our developers are working on creating SBOMs for our own products.

C: ...then we'll be finished soon! Great!

---

<figure>
    <img src="images/sbom-publishing-isolated.png" alt="Evolution of SBOM publishing" width="1000" height="auto">
    <figcaption><a href="https://www.sonatype.com/state-of-the-software-supply-chain/2024/10-year-look">Sonatype: 2024 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

A: Not so fast! In order for us to finalize the SBOMs for our products, we need the SBOMs for all components that come from our suppliers.

C: Well Mrs. Mair, that's easy; we write it into the contracts and force everyone to do it. Everyone is doing SBOMs these days, so we have to keep up!

---

<figure>
    <img src="images/projects-vs-sboms.png" alt="Projects vs SBOMs" width="500" height="auto">
    <figcaption><a href="https://www.sonatype.com/state-of-the-software-supply-chain/2024/10-year-look">Sonatype: 2024 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

A: Well... it is true that more and more SBOMs are being created, but we're nowhere near where we should be. In 2024, there were 7 million published components on npm, of which just 61k had SBOMs.

---

<figure>
    <img src="images/sbom-publishing.png" alt="Evolution of SBOM publishing" width="1000" height="auto">
    <figcaption><a href="https://www.sonatype.com/state-of-the-software-supply-chain/2024/10-year-look">Sonatype: 2024 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

C: Only so few???

A: Yes, and the rate at which the provision of SBOMs is increasing doesn't give much more hope.

A: The large manufacturers are not even that problematic; the small suppliers in certain niches that are not specialized in software development have a more difficult time.

C: We really can't take that into consideration; SBOMs should still be included in the contracts for the next renewals!

A: As briefly mentioned earlier, our applications don't only contain components from our suppliers, but also...

C: Open source components?

A: Exactly, and open source projects do not necessarily have to deliver an SBOM. We don't have contracts in these cases either.

C: Well, that's easy to solve. We simply forbid our developers the usage of open source.

A: You have no idea how much open source is used in our company, do you?

C: It can't be that much...

---

<figure>
    <img src="images/oss-proliferation.png" alt="Open Source Software Proliferation" width="1000" height="auto">
    <figcaption><a href="https://www.blackduck.com/content/dam/black-duck/en-us/reports/rep-ossra.pdf">Black Duck: 2025 Open Source Security and Risk Analysis Report</a></figcaption>
</figure>
<br/>

Dialog:

A: Well, some studies estimate that open source is used in 97% of modern applications.

C: Then we just don't use Linux anymore... Have you seen the new MacBooks in the marketing team?

A: This is not just about operating systems, but about libraries that developers use to speed up work, database technologies, CI/CD tools, programming languages and container technology.

C: Then we should go to the source and somehow get the open source projects to provide SBOMs. Ultimately, this will also increase their market share.

---

<figure>
    <img src="images/package-maintainers.png" alt="Open Source Projects by number of maintainers" width="1000" height="auto">
    <figcaption><a href="https://www.intel.com/content/www/us/en/developer/articles/guide/the-careful-consumption-of-open-source-software.html">Intel: The Careful Consumption of Open Source Software</a></figcaption>
</figure>
<br/>

Dialog:

A: Market share? Market share does not really play a role in the open source context. In addition, most open source projects are maintained by individuals or a small number of people. They have little time, little support and are under a lot of pressure and don't really get to do it.

---

# Sponsor more<br/>open source<br/>projects!

Dialog:

A: Here we, as company, could provide both financial and technical support!

C: Whoooow, that wasn't budgeted for in this financial year and the financial planning has already been completed. But maybe next year?

---

<img src="images/sbom-devs.jpg" alt="SBOMs holding back Developers" width="450" height="auto">

Dialog:

A: Apart from these challenges, the complexity of creating an SBOM depends heavily on the programming language and the frameworks used.

C: Oh come on! Code is code, no matter what language!

A: The languages and how they work are quite different. In the modern web world, you get the direct dependencies of an application automatically most of the time.

C: But we don't just have web applications...

A: Exactly! With legacy applications or hardware-related development, third-party libraries are integrated differently and there is no nice list like in the web world. The development teams have to work on clearly documenting the dependencies. And spoiler alert...the older the technology, the more difficult it is to create an SBOM for it.

C: Well, there will probably be some technical solution to create these SBOMs easily. Just be forward thinking! It can't be that difficult.
  
A: Unfortunately, it is. The creation of SBOMs is not standardized.

C: There are guidelines and standards! Even from the German BSI!

A: Yes, the guidelines and standards relate to the structure and are primarily just minimum requirements.

C: That's what we need here!

A: That's important, but not enough. Granularity, depth, or the relationship between the components is something everyone does a bit differently.

C: Is that a real problem?

A: This makes very difficult to find out whether a supplied SBOM is correct and complete.

C: But there are thousands of tools on the market! Tell me which one we should use and I'll take it through the purchasing process for you.

A: As mentioned earlier, some of our teams already create SBOMs as part of the automated build pipelines. However, if we were to run two tools to automatically create SBOMs on the applications, they would most likely deliver different results.

C: Well, there must be something wrong!

A: Maybe neither SBOM is wrong, but both are incomplete.

C: Then we should simply harmonize all these SBOMs. That can certainly be done with AI!
---

<img src="images/nevermind.webp"  alt="Nevermind" width="1000" height="auto">

Dialog:

A: [Gasping] I don't want to be a spoilsport, but here comes the next problem...

C: What else could be missing now?

---

<figure>
    <img src="images/sbom-sharing.png" alt="SBOM Sharing" width="600" height="auto">
    <figcaption><a href="https://www.cisa.gov/sites/default/files/2024-05/SBOM%20Sharing%20Primer.pdf">CISA: SBOM Sharing Primer</a></figcaption>
</figure>
<br/>

Dialog:

A: The transmission of SBOMs is also not standardized. Some manufacturers make them available for download on their website, others as metadata of the product, others provide them via e-mail on request.

C: Don't think so complicated! It would certainly be easier with Sharepoint.

A: [Rolls eyes] At the moment, we usually request the SBOMs by e-mail and receive them in the same way. But we can't really check the integrity and authenticity of the documents; we can't even automatically ensure that they come from the right source and have not been manipulated on their way to us.

C: There are already proven methods with electronic signatures for this. Are you familiar with them?

---

<img src="images/trustworthy.jpg" alt="Trustworthy Racoon" width="1000" height="auto">

Dialog:

A: Ok, so we get a signed SBOM, but how do we know it's a legitimate signature and not from someone trying to frame us?

C: [slimy] I guess you really have zero trust, huh?

A: [sighs] ...

C: Well, let's take what we can get for now. This is my inventory where I can search for log4j and other supply chain attacks

---

<img src="images/sbom-everywhere.jpg" alt="SBOMs everywhere" width="1000" height="auto">

Dialog:

A: Erstmal haben Sie nur eine Menge einzelner Dokumente, die händisch durchsucht werden müssten. Und vergessen Sie nicht, dass die SBOMs in erster Linie maschinenlesbar sind - oder wollen SIE noch einmal einen Blick reinwerfen? [grinst]

C: Nein danke, nein danke, auf keinen Fall!

A: Das bedeutet also, wir brauchen ein Tool, das die SBOMs verwalten kann, um diese durchsuchbar zu machen.

C: Ja, dann haben wir das ja zusammen. Noch ein weiteres Tool einkaufen kriegen wir auch noch hin! Dann wissen wir endlich, welche Schwachstellen die ganzen Produkte besitzen und können die Supply Chain Angriffe beheben. Großartig!

A: Hier sollten wir kurz einige Missverständnisse rund um Supply Chain Angriffe und Vulnerabilities aus dem Weg räumen.

C: Was denn für Missverständnisse?

---

# Supply Chain Attack Vectors

- Typosquatting
- Malicious Code Injection
  - Social Engineering
  - Compromised Build Systems
  - Repo-/Project-jacking
- Malicious Maintainer (e.g. "Protestware")
- Dependency Confusion/Hallucination

Dialog:

A: Fangen wir mit den Supply Chain Angriffen an: Bei einem Supply Chain Angriff wird ein Opfer über seine Supply Chain angegriffen, anstatt direkt seine Systeme zu penetrieren. 

C: So wie der Name schon sagt...

A: Zum Beispiel über Schadcode in einem legitimen Code-Repository zu injizieren oder die Entwickler:innen zu täuschen, dass sie schadhafte Abhängigkeiten installieren.

C: War das bei log4j nicht der Fall?

A: Nein, log4j war eine Bibliothek die von einer kritischen Zero-Day Schwachstelle - log4shell - betroffen war.

C: Zurück zu den Supply Chain Angriffen...

A: Ein sehr bekanntes Beispiel für eine Supply Chain Attacke war, als der Software-Hersteller Solarwinds in 2020 gehackt wurde: dabei haben die Angreifer das Build System kompromittiert und es ihnen so ermöglicht, Schadcode in das entwickelte Produkt einzubauen. Die Kunden haben dann die Software installiert, weil diese von ihrem Lieferanten kam. Dadurch haben sich die Angreifer dann Zugriff auf die Zielsysteme verschafft.

C: Ja, aber das würden wir ja anhand der SBOM verstehen, dass da was drin ist, was nicht da sein sollte.

A: Aber woher erhalten wir die SBOM?

---

<img src="images/sbom-defense.jpg" alt="SBOM vs Supply Chain Attacks" width="1000" height="auto">

Dialog:

C: Ja... vom Anbieter!

A: ...der von einem Angreifer kompromittiert wurde, welcher dann wahrscheinlich auch die SBOM entsprechend anpasst, um seine Absichten zu verschleiern. ...und selbst wenn es eine Änderung an der SBOM geben sollte, haben wir als Konsumenten kaum Anhaltspunkte, um eine bösartige Änderung der Software von einer regulären Weiterentwicklung zu unterscheiden.

C: Verstanden... also helfen SBOMs gar nicht gegen Supply Chain Attacken?

A: Nein.

C: ...und was ist denn dann mit log4j?

---

<img src="images/log4j-vendors.jpg" alt="Vendors need to patch, too" width="400" height="auto">

Dialog:

A: Ja, da wären SBOMs schon eher hilfreich, weil es eine Dependency mit einer kritischen Schwachstelle war.

C: Das war ein Alptraum herauszufinden wo das im Einsatz war! Aber mit den SBOMs hätten wir ja jetzt die Schwachstellen alle zentral gelistet.

A: Mooooooment, machen wir einen kurzen Schritt zurück. Durch dieses Inventar bekommt ein Entwicklungsteam in erster Linie einen Überblick über die Abhängigkeiten ihrer Software. Durch die Informationen wie Hersteller, Name und Version der Komponenten werden diese zunächst einmal eindeutig identifiziert.

C: Und woher kriegen wir dann die Schwachstellen zu diesen Abhängigkeiten?

---

<figure>
    <img src="images/log4j-cve.png" alt="CVE-2021-44228" width="800" height="auto">
    <figcaption><a href="https://www.cve.org/CVERecord?id=CVE-2021-44228">CVE-2021-44228 on https://cve.mitre.org/</a></figcaption>
</figure>
<br/>

Dialog:

A: Indem wir öffentliche Schwachstellen-Datenbanken nach Informationen dazu durchsuchen.

C: Öffentliche Schwachstellen-Datenbanken? Kann man sich da einfach anschauen, in welcher Software Sicherheitslücken enthalten sind?

A: Ja, genau. In diesen Datenbanken werden alle möglichen Sicherheitslücken dokumentiert, die von Unternehmen und Sicherheitsforscher:innen veröffentlicht werden. Die größte Datenbank an Schwachstellen wird nebenbei vom US-amerikanischen MITRE betrieben. Das Programm ist ein Eckpfeiler der globalen Sicherheit, da es weltweit von Unternehmen genutzt wird, um Schwachstellen zu veröffentlichen und von Security-Tool-Herstellern, um ihre Services damit zu füttern.

C: Welch ein Glück, dass wir uns in Punkto Sicherheit mal wieder auf die USA verlassen können!

---

<figure>
    <img src="images/mitre-funding.png" alt="News Article: In last-minute reversal, US agency extends support for cyber vulnerability database" width="1000" height="auto">
    <figcaption><a href="https://www.reuters.com/world/us/us-agency-extends-support-last-minute-cyber-vulnerability-database-2025-04-16/">Reuters: In last-minute reversal, US agency extends support for cyber vulnerability database</a></figcaption>
</figure>
<br/>

Dialog:

A: Genau da liegt das nächste Problem: Durch die monetäre Abhängigkeit von der US-amerikanischen Regierung können sich politische Entscheidungen, z.B. von freidrehenden Präsidenten, recht schnell auf die Verfügbarkeit solcher zentralen Services auswirken.

C: Oh, ja, das könnte problematisch sein... Vielleicht sollten wir auch an dieser Stelle in Europa ein bisschen souveräner werden und unsere eigene Datenbank bauen.

---

<figure>
    <img src="images/enisa.png" alt="ENISA Website" width="1000" height="auto">
    <figcaption><a href="https://euvd.enisa.europa.eu/">https://euvd.enisa.europa.eu/</a></figcaption>
</figure>
<br/>

Dialog:

A: Ja, die ENISA arbeitet bereits daran und hat gerade die Beta-Version ihrer Platform im Einsatz. Damit bewegen wir uns weg von der aktuellen "single source of truth", welche die Datenbank von MITRE war, hin zu mehreren Datenbanken und das Ganze wird fragmentiert.

C: Na gut, dann haben wir halt mehrere Quellen die mir sagen wo ich angreifbar bin. Doppelt gemoppelt hält ja besser!

A: Naja, wir haben dann eine sehr lange, eventuell inkonsistente Liste an Schwachstellen. Aber nur weil eine verwendete Bibliothek eine Schwachstelle enthält, bedeutet es nicht zwangsläufig, dass diese ausgenutzt werden kann.

C: Wie geht das denn? Man kann ja nicht ein bisschen angreifbar sein. Genau wie man nicht nur ein bisschen schwanger sein kann.

A: Wenn die Entwickler:innen den verwundbaren Teil nicht benutzen der von der Schwachstelle betroffen ist, dann haben Angreifende häufig auch nicht die Möglichkeit, diese zu missbrauchen. Das ist das Konzept von "Exploitability".

C: Aber woher wissen wir denn dann, ob wir angreifbar sind oder nicht?

A: Das müssen wir entsprechend testen und das damit verbundene Risiko bewerten.

C: Das klingt nach ganz schön viel Aufwand... Hah, warum lassen wir das nicht die Anbieter selber testen und die Ergebnisse mit uns teilen?

---

<figure>
    <img src="images/anatomy_of_vex.webp" width="1000" height="auto">
    <figcaption><a href="https://blog.adolus.com/a-deeper-dive-into-vex-documents">Adolus: A Deeper Dive into VEX Documents</a></figcaption>
</figure>
<br/>

Dialog:

A: Ja, das gibt es auch schon. Das ist das sogenannte "Vulnerability Exploitability eXchange", kurz "VEX"

C: Lassen Sie mich raten: Wieder ein nur maschinell lesbares Dokument?

A: Ja, damit kann der Anbieter die SBOM erweitern, um die Ausnutzbarkeit von Schwachstellen in den aufgelisteten Komponenten zu klären.

C: Das klingt doch vielversprechend!

A: Naja, nicht wirklich. Die VEX ist ein statisches Dokument, Schwachstellen sind aber leider ein bisschen dynamischer. Der VEX gibt mir nur einen Snapshot zu einem gewissen Zeitpunkt. Wenn neue Schwachstellen entdeckt werden, müssen alle Hersteller, die diese Komponente einsetzen, ihre Produkte bewerten und neue VEX-Dateien für alle noch aktiv genutzten Versionen bereitstellen.

C: Ohje, dann ertrinken wir ja diesen Unterlagen!

A: Nicht nur das: Hersteller haben natürlich einen impliziten Anreiz zu zeigen, dass sie von möglichst wenigen Schwachstellen betroffen sind. Und wir können auch nicht bewerten, ob und wie der Hersteller die Anwendbarkeit getestet hat. 

C: ...weil es auch hier an einheitlichen Ansätzen fehlt?

A: Ja, sowohl bei SBOMs als auch VEX-Dokumente müssen wir darauf vertrauen, dass die Verfasser:innen ordentlich arbeiten und wissen was sie tun...

---

<!-- .slide: class="smaller-size" -->

# SBOM challenges

- Getting SBOMs from suppliers, open source components and other third parties is challenging
- Creation of complete and correct SBOMs can be hard for development teams
- Generation, transmission and update of SBOMs lacks standardization
- Managing vulnerabilities through SBOMs is unrealistic with current means (VEX)
- SBOMs are not helpful against supply chain attacks

---

# 3rd Act

## _Conclusio_

Dialog:

C: Bei all den Unzulänglichkeiten und dem Riesenaufwand... Lohnt es sich denn dann, in SBOMs zu investieren?

---

<img src="images/not-the-silver-bullet.jpg" alt="Not the Silver Bullet you're looking for" width="1000" height="auto">

Dialog:

A: SBOMs können einen Mehrwert bieten, sie sind bloß schlicht nicht die Silver Bullet, die viele sich erhoffen.

C: Aber wofür brauchen wir die denn dann?

---

| **Regulation**           | **Industry**                     |
|--------------------------|----------------------------------|
| NIS-2 Directive          | Critical Infrastructure          |
| EU Cyber Resilience Act  | "Products with digital Elements" |
| DORA                     | Financial Sector                 |
| US Executive Order 14028 | US Government Software Suppliers |
| FDA                      | Medical Devices                  |
| UNECE R 155 WP.29        | Automotive (self-driving cars)   |

Dialog:

A: Allein schon, weil sie direkt oder indirekt in einigen neuen Cybersecurity Regularien abgebildet werden.

C: Also müssen wir das in unserem Kontext sowieso machen

---

<img src="images/regulatory-requirements.jpg" alt="Regulatory Requirements" width="600" height="auto">

Dialog:

A: Ja, aber lassen Sie uns das nicht als Compliance-Checkbox betrachten, sondern was sinnvolles damit anstellen.

C: Wie soll dass jetzt funktionieren? All meine Ideen haben sie auseinandergenommen...

A: In der Software Entwicklung ist ein Thema von vitaler Wichtigkeit: Abhängigkeiten tracken! Das macht man in Bezug auf Open Source Packages mit einer sogenannten "Software Composition Analysis".

C: Und was bringt mir diese "Software Composition Analyse"? Versuchen Sie mal einen Elevator Pitch!

A: Naja mit der Software Composition Analysis wird die Applikation nach externen Abhängigkeiten durchsucht und überprüft, ob die Komponenten aktuell sind, Schwachstellen enthalten und gegebenenfalls problematische Lizenzen beinhalten. So sieht das beispielsweise mit dem 'OWASP Dependency Tracker' aus.

---

<img src="images/dependency-track.png" alt="Screenshot of Dependency Track" width="1000" height="auto">

Dialog:

C: Gekauft!

A: Open Source!

C: Das klingt jetzt aber so insgesamt mehr nach Zutatenliste, als etwas Neuem...

A: Neu ist es auch nicht, durch die Einführung von SBOMs ist dieses Thema wieder in den Vordergrund getreten und um kommerzielle Komponenten erweitert worden. Die Notwendigkeit einer ordentlichen Inventarisierung von Software gibt es aber schon seit einiger Zeit.

C: Aber was soll das dann konkret bringen?

---

<img src="images/no-need.jpg" alt="No need to spend efforts, if you don't look at your SBOM" width="1000" height="auto">

Dialog:

A: Die Inventarisierung schafft die Datengrundlage um die Qualität der Software und die damit verbundenen operativen Risiken bewerten zu können. Die Information/Metadaten einfach nur rumliegen zu haben bringt uns nichts, aber diese Transparenz ermöglicht uns folglich zu priorisieren wo die Entwicklungsteams patchen und nacharbeiten müssen.

C: Wer kontrolliert denn das das auch wirklich gemacht wird? Das bedarf ja auch einer neuen Governance Funktion

A: Ja wir sollten ein Auge darauf haben, dass zumindest die kritischen Punkte zeitnah behoben werden, wissen Sie wie häufig noch heute die veraltete und verwundabare log4j Version verwendet wird?

C: Nirgends hoffe ich mal!

---

<figure>
    <img src="images/log4j.png" alt="Downloaded versions of log4j" width="1000" height="auto">
    <figcaption><a href="https://www.sonatype.com/state-of-the-software-supply-chain/2024/risk">Sonatype: 2024 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

A: Weit gefehlt, diese wird noch regelmäßig heruntergeladen und in Software eingebunden. Daher müssen wir bei den Entwickler:innen das Bewusstsein für einen verantwortungsvollen Umgang mit Abhängigkeiten schärfen.

C: Z.B. mit einer Policy: nur Abhängigkeiten ohne jegliche Schwachstellen!

A: Ganz ohne Schwachstellen wird es sehr schwierig... Einmal sollten Entwickler:innen die Anzahl externer Abhängigkeiten wo möglich reduzieren. Die Auswahl sollte auch bestimmten Qualitätskriterien unterliegen z.B., dass sie aktiv gepflegt werden, ob sie von einem vertrauenswürdigen Publisher kommen, oder wie schnell Schwachstellen oder issues gelöst werden.

C: Woran können sie das denn erkennen? Gibt es da vielleicht etwas von Ratiopharm?

---

<figure>
    <img src="images/openssf.png" alt="Example OpenSSF Scorecard Report" width="800" height="auto">
    <figcaption>Example OpenSSF Scorecard Report; see <a href="https://scorecard.dev/">https://scorecard.dev/</a></figcaption>
</figure>
<br/>

Dialog:

A: Hier gibt es für Open Source z.B. die openssf scorecard zur Bewertung von Projekten die man auch direkt in den Pipelines einbinden kann um den Entwickler:innen direkt eine Einschätzung ihrer Abhängigkeiten zu geben.

C: Was hat den das alles mit SBOMs zu tun

---

# Meaningful use of SBOMs

- SBOMs can extend a proper Software Composition Analysis with proprietary components
- Raise awareness in development teams about third party dependencies
- Proper governance around the usage of third party dependencies

Dialog:

A: SBOMs stellen ein mögliches Artefakt dar um eine Zutaten der Software darzustellen. Schlussendlich ist das nur ein Format in dem bestimmte Informationen dargestellt und ausgetauscht werden. Gepaart mit einer ordentlichen Software Composition Analyse ermöglicht uns das Aussagen über Qualität und Risiken zu treffen.

C: Also würden Sie mir zustimmen, wenn ich sagen würde, SBOMs sind doch nicht gänzlich nutzlos?

A: Nicht gänzlich...

C: Großartig! Toll, dass ich Sie überzeugen konnte...

[C schaut auf's Handy]

C: Oh, entschuldigen Sie bitte, da muss ich rangehen. Arbeiten Sie mir dann bitte mal ein Konzept aus, wie wir die besprochenen Sachen alle im nächsten Quartal umsetzen können. Schaffen Sie das bis nächste Woche?

[C nimmt Handy ans Ohr und läuft von der Bühne]

C: Ja Tachchen Hermann! Ja, ja, Supply Chain Attacks kenn ich. Da nutzen wir jetzt S-B-O-M-S

[A schlägt die Hände vor's Gesicht]

---

<img src="images/the-end.jpg" alt="The End" width="1000" height="auto">

Dialog:

A: ...ich kündige.

---

# Q & A

Slides and Content available at<br/>https://github.com/something-appsec/sbom-talk

<img src="images/qr-code.gif" alt="QR Code">

SBOM available <!-- .element class="smaller-text" -->[here](https://github.com/something-appsec/sbom-talk/dependency-graph/sbom) 

---

<img src="images/cc.svg" style="width: 5em; height: auto; margin-left: .5em"><img src="images/by.svg" style="width: 5em; height: auto; margin-left: .5em"><img src="images/sa.svg" style="width: 5em; height: auto; margin-left: .5em;"><br/>
<div class="smaller-text"><a href="https://github.com/something-appsec/sbom-talk">SBOM - Eine Tragikomödie in 3 Akten</a><br/>© 2025 by Jasmin Mair, Lukas Mika<br/>is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></div>

<br/>
Dialog:

Dieser Vortrag ist in Gänze, einschließlich Script und Slides, unter Creative-Commons-Lizenz auf unserem Github Repository verfügbar. Einschließlich der SBOM.
