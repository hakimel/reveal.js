<!-- .slide: data-visibility="hidden" -->
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/something-appsec/sbom-talk/badge)](https://scorecard.dev/viewer/?uri=github.com/something-appsec/sbom-talk)

> [!NOTE]
> This is the [reveal.js](https://revealjs.com/) Slide Deck for the Talk **"SBOMs - A Tragicomedy in Three Acts"** by Jasmin Mair and Lukas Mika.
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

C [entering the room]: Wonderful good morning, Ms. Mair! So, how are WE doing today?

A [rolls eyes]: Good morning Mr. Mika. I can only speak for myself, but we're under a lot of stress at the...

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

C: Yeah right, the list of ingredients! I knew it, I just wanted to test you! [winks]

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

C: Well Ms. Mair, that's easy; we write it into the contracts and force everyone to do it. Everyone is doing SBOMs these days, so we have to keep up!

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

A: Well, first of all, we only have a lot of individual documents that would have to be searched manually. And don't forget that the SBOMs are primarily machine-readable - or do YOU want to take another look? [grins]

C: No, no thanks, absolutely not!

A: So that means we need a tool that can manage the SBOMs to make them searchable.

C: Yes, then we've got that together. We can also buy another tool! Then we'll finally know what vulnerabilities all the products have and can fix the supply chain attacks. That's great!

A: I think we need to clear up a few misunderstandings about supply chain attacks and vulnerabilities.

C: What misconceptions?

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

A: Let's start with supply chain attacks: In a supply chain attack, a victim is attacked through its supply chain instead of directly penetrating the victim's systems. 

C: As the name suggests...

A: For example, by injecting malicious code into a legitimate code repository or tricking developers into installing malicious dependencies.

C: Was that not the case with log4j?

A: No, log4j was a library affected by a critical zero-day vulnerability - log4shell.

C: Back to the supply chain attacks...

A: A very well-known example of a supply chain attack was when the software manufacturer Solarwinds was hacked in 2020: the attackers compromised the build system, allowing them to insert malware into the developed product. Customers then installed the software because it came from their trusted supplier. This allowed the attackers to gain access to the target systems.

C: Yes, but we would understand from the SBOM that there is something in there that shouldn't be there.

A: But where do we get the SBOM from?

---

<img src="images/sbom-defense.jpg" alt="SBOM vs Supply Chain Attacks" width="1000" height="auto">

Dialog:

C: Well...from the supplier!

A: ...which has been compromised by an attacker, who has the possibility to adapt the SBOM accordingly in order to conceal their intentions. ...and even if there is a change to the SBOM, we as consumers have little evidence to distinguish a regular product development, like new features from a malicious change to the software.

C: Got it... So SBOMs don't help against supply chain attacks?

A: No.

C: ...and then what about log4j?

---

<img src="images/log4j-vendors.jpg" alt="Vendors need to patch, too" width="400" height="auto">

Dialog:

A: Yes, SBOMs could be helpful there because it was a dependency with a critical vulnerability.

C: That was a nightmare to find out where it was in use! 

A: For you?!?

C: But with the SBOMs we would now have all the vulnerabilities listed centrally.

A: Not so fast! Let's take a quick step back. This inventory primarily gives development teams an overview of the dependencies or ingredients of their software. Information such as the manufacturer, name and version of the components means that they can be clearly identified.

C: And where do we get the vulnerabilities for these dependencies?

---

<figure>
    <img src="images/log4j-cve.png" alt="CVE-2021-44228" width="800" height="auto">
    <figcaption><a href="https://www.cve.org/CVERecord?id=CVE-2021-44228">CVE-2021-44228 on https://cve.mitre.org/</a></figcaption>
</figure>
<br/>

Dialog:

A: By searching public vulnerability databases for information.

C: Public vulnerability databases? Is it simply possible to see which software contains security vulnerabilities?

A: Yes, exactly. These databases document all possible vulnerabilities that are published by companies and security researchers worldwide. The largest database of vulnerabilities is operated by MITRE in the US. The program is a cornerstone of global security, as it is used worldwide by companies to publish vulnerabilities and by security tool vendors to feed their services.

C: Lucky us...we can once again rely on the USA when it comes to security!

---

<figure>
    <img src="images/mitre-funding.png" alt="News Article: In last-minute reversal, US agency extends support for cyber vulnerability database" width="1000" height="auto">
    <figcaption><a href="https://www.reuters.com/world/us/us-agency-extends-support-last-minute-cyber-vulnerability-database-2025-04-16/">Reuters: In last-minute reversal, US agency extends support for cyber vulnerability database</a></figcaption>
</figure>
<br/>

Dialog:

A: That's where the next problem lies: due to the monetary dependence on the US government, political decisions, can have a very rapid impact on the availability of such centralized services.

C: Oh, yes, that could be problematic... Perhaps we should also become a little more sovereign in Europe at this point and build our own database.

---

<figure>
    <img src="images/enisa.png" alt="ENISA Website" width="1000" height="auto">
    <figcaption><a href="https://euvd.enisa.europa.eu/">https://euvd.enisa.europa.eu/</a></figcaption>
</figure>
<br/>

Dialog:

A: Yes, ENISA is already working on it and has launched the beta version of its own platform. This means that we are moving away from the current "single source of truth", which was the MITRE database, towards multiple databases and the whole thing is becoming fragmented.

C: All right, then we'll have several sources that tell us where we're vulnerable. Better safe than sorry!

A: Well, we then have a very long, possibly inconsistent list of vulnerabilities. But just because a library used contains a vulnerability doesn't necessarily mean that it can be exploited.

C: How does that work? You can't be just a little bit vulnerable. Just like you can't be just a little bit pregnant.

A: If the developers don't use the vulnerable part that is affected by the vulnerability, then attackers often don't have the opportunity to abuse it. This is the concept of "exploitability".

C: But how do we know whether we are vulnerable or not?

A: We have to test the issues and and assess the associated risk.

C: That sounds like a lot of effort... Hah, why don't we let the software suppliers test it themselves and share the results with us?

---

<figure>
    <img src="images/anatomy_of_vex.webp" width="1000" height="auto">
    <figcaption><a href="https://blog.adolus.com/a-deeper-dive-into-vex-documents">Adolus: A Deeper Dive into VEX Documents</a></figcaption>
</figure>
<br/>

Dialog:

A: Yes, that already exists. This is the so-called “Vulnerability Exploitability eXchange”, “VEX” for short. 

C: Let me guess: another machine-read-only document?

A: Exactly, suppliers can use it to extend the SBOM to clarify the exploitability of vulnerabilities in the listed components.

C: That sounds promising!

A: Well, not really. The VEX is a static document, but vulnerabilities are unfortunately a bit more dynamic. The VEX only gives us a snapshot at a certain point in time. If new vulnerabilities are discovered, all manufacturers using the affected component must evaluate their products and provide new VEX files for all versions still in active use.

C: Oh dear, then we'll drown this documentation!

A: Not only that: manufacturers have an implicit incentive to show that they are affected by as few vulnerabilities as possible. And we can't assess whether and how the manufacturer tests the applicability.

C: ...because there is also a lack of standardized approaches here?

A: Yes, with both SBOMs and VEX documents, we have to trust that the authors work properly and that know what they are doing...

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

C: With all the shortcomings, the huge efforts and expenses associated... Is it even worth investing in SBOMs?

---

<img src="images/not-the-silver-bullet.jpg" alt="Not the Silver Bullet you're looking for" width="1000" height="auto">

Dialog:

A: SBOMs can offer an added value, they are just simply not the silver bullet that many are hoping for.

C: But why do we need them then?

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

A: Simply because they are directly or indirectly reflected in some new cybersecurity regulations.

C: So we have to create them anyway in our context.

---

<img src="images/regulatory-requirements.jpg" alt="Regulatory Requirements" width="600" height="auto">

Dialog:

A: Yes, but let's not think of it as a compliance checkbox, if we need to do them anyways let's do something useful with it.

C: How is that supposed to work now? You've ripped all my ideas apart...

A: In software development, one topic is of vital importance: tracking and managing dependencies! This is done in relation to open source packages with a so-called “software composition analysis”.

C: And what does this “software composition analysis” do for me? Try an elevator pitch!

A: Well, the software composition analysis searches the application for external dependencies and checks whether the components are up-to-date, contain vulnerabilities and even contain problematic licenses. This is what it looks like with the ‘OWASP Dependency Track’, for example.

---

<img src="images/dependency-track.png" alt="Screenshot of Dependency Track" width="1000" height="auto">

Dialog:

C: Let's buy it!

A: It's open source!!

C: But that sounds more like the already discussed list of ingredients rather than anything new...

A: It's not new either; the introduction of SBOMs has brought this topic back to the foreground and expanded it to include commercial components. However, the need for a proper inventory of software has been around for some time.

C: But what is this supposed to achieve in concrete terms?

---

<img src="images/no-need.jpg" alt="No need to spend efforts, if you don't look at your SBOM" width="1000" height="auto">

Dialog:

A: The inventory creates the data basis for assessing the quality of the software and the associated operational risks. Simply having the information/metadata lying around does us no good, but this transparency enables us to prioritize what the development teams need to patch and where they need to do some rework.

C: Who checks that this is actually being done? That also requires a new governance function

A: Yes, we should keep an eye on ensuring that at least the critical points are fixed promptly, do you know how often the outdated and vulnerable log4j version is still being used today?

C: Nowhere I hope!

---

<figure>
    <img src="images/log4j.png" alt="Downloaded versions of log4j" width="1000" height="auto">
    <figcaption><a href="https://www.sonatype.com/state-of-the-software-supply-chain/2024/risk">Sonatype: 2024 State of the Supply Chain</a></figcaption>
</figure>
<br/>

Dialog:

A: Far from it, it is still regularly downloaded and integrated into software. That's why we need to raise awareness among developers for the responsible and reasonable use of dependencies.

C: With a policy for example: only dependencies without any vulnerabilities!

A: It will be very difficult without any vulnerabilities... Developers should reduce the number of external dependencies wherever possible. The selection should also be subject to certain quality criteria, e.g. that they are actively maintained, whether they come from a trustworthy source and publisher, or how quickly vulnerabilities and other issues are resolved.

C: How can you recognize this? Is there anything we can use out of the box?

---

<figure>
    <img src="images/openssf.png" alt="Example OpenSSF Scorecard Report" width="800" height="auto">
    <figcaption>Example OpenSSF Scorecard Report; see <a href="https://scorecard.dev/">https://scorecard.dev/</a></figcaption>
</figure>
<br/>

Dialog:

A: For open source, for example, there is the openssf scorecard for evaluating projects, which can be integrated directly into the pipelines to give developers a direct assessment of their dependencies.

C: What does all this have to do with SBOMs?

---

# Meaningful use of SBOMs

- SBOMs can extend a proper Software Composition Analysis with proprietary components
- Raise awareness in development teams about third party dependencies
- Proper governance around the usage of third party dependencies

Dialog:

A: SBOMs are one possible artifact to represent the ingredients list of the software. Ultimately, it is just a format in which certain information is displayed and exchanged. Coupled with a proper software composition analysis, this allows us to make statements about quality and risks of a certain software.

C: So would you agree with me if I said that SBOMs are not completely useless?

A: Not completely...

C: Awesome! Great that I was able to convince you...

[C looks at cell phone]

C: Oh, excuse me, I have to take this. Could you work out a concept on how we can implement everything we've discussed in the next quarter. Can you do that by next week?

[C picks up his cell phone and walks off the stage]

C: Yes, hello Hermann! Yes, yes, I know Supply Chain Attacks. We are also using S-B-O-M-S now

[A puts his hands in front of his face]

---

<img src="images/the-end.jpg" alt="The End" width="1000" height="auto">

Dialog:

A: ...I quit

---

# Q & A

Slides and Content available at<br/>https://github.com/something-appsec/sbom-talk

<img src="images/qr-code.gif" alt="QR Code">

SBOM available <!-- .element class="smaller-text" -->[here](https://github.com/something-appsec/sbom-talk/dependency-graph/sbom) 

---

<img src="images/cc.svg" style="width: 5em; height: auto; margin-left: .5em"><img src="images/by.svg" style="width: 5em; height: auto; margin-left: .5em"><img src="images/sa.svg" style="width: 5em; height: auto; margin-left: .5em;"><br/>
<div class="smaller-text"><a href="https://github.com/something-appsec/sbom-talk">SBOMs - A Tragicomedy in Three Acts</a><br/>© 2025 by Jasmin Mair, Lukas Mika<br/>is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></div>

<br/>
Dialog:

This talk is available in its entirety, including script and slides, under Creative Commons license on our Github repository. Including the SBOM.
