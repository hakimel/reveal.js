# Frog 13
## Celebrating Outstanding Education
### FrogOS Advanced

<p class=lozenge>Adam Hepton | Head of Development | [@adamhepton](http://twitter.com/adamhepton)</p>
]]]
Hi, I'm Adam Hepton, Head of Development at Frog.  The purpose of my part of this session is really two-fold; the first function I'm here to do is to speak with you about the kind of things that we've been cooking up at Frog in the Development department to put the ownership in your hands, so that you can extend your platform by giving you tools and a support network to allow your ideas become realities as part of your FrogOS installation.

The second reason for being here is to make the other speakers look far better just by direct comparison so please, be kind.
_______________
## A History of Frog's Code
<div class="history">
    <div class="app" data-name="frogclassic">
        <span>Frog Teacher</span>
    </div>
</div>
]]]
So, I kind of liked the irony in a session talking about the future of a brand-new (to most of you) platform by talking about how and why we've got here, and I figured that the best way of doing that would be to talk about where we've come from, and how the decisions of our past have shaped how we have designed FrogOS today.

14 or maybe nearly 15 years ago now, the first version of Frog was created.  As much as Gareth Davies might argue the contrary, I don't think that even he had any idea of how successful and different the version that was sold to our first school
would become.  Resultantly, the code was built as a whole single clump, if you like.  It had a single job to do, even when that became lots and lots of bricks and modules combining to become one big job.  Resultantly, the code started out small, compact and for one job in particular, and turned into some kind of Isle of the Deep, tendrils attached here there and everywhere, with no real structure and everything mushed together in some horrible oxtail and parsnip hybrid soup.

Writing new parts for the software was painful, bordering on impossible in cases, based on the need to get the product out of the door as soon as possible, and making lots of shortcuts along the way.  We hold our hands up - we could have done it better.

At this point in time, we had a HTML brick, that allowed you to run Javascript, and a PHP brick to run server-side code, to allow individual schools to create things more personal to them, or to link into their own systems.  These were great, because they had complete freedom!  Unfortunately, because they had complete freedom, there was definitely a bit of a security risk there.
_______________
## A History of Frog's Code
<div class="history phase2">
    <div class="app" data-name="frogclassic">
        <span>Frog 3</span>
    </div>
    <div class="app" data-name="core">
        <span>Lib</span>
    </div>
</div>
]]]
Gareth wised up and hired some real developers at this point, and also me.  We realised that we had got to the point where, if we wanted to improve Frog Teacher as a product, we would have to do some serious refactoring.  Luckily, as every developer knows, there's no greater feeling in the world than being given free reign to rip apart someone else's code, as, let's face it - we all know better.

We made a second version of Frog that frankly didn't last very long commercially, and wasn't really a new version at all, but it did have a blue "edit-in-place" editor and a reskin to look a bit like Windows Vista because, as we all know, Windows Vista was definitely a success we should try and associate ourselves with.

Under the hood, we finally separated out some of the code and made it so that we could actually reuse the code a little bit enough so that we could go on and create more sections for the Frog 2 product.  A decision was then made that the product was so fully-featured now that it had got to the point where the users now found creating content, and particular, content personal to them, really difficult in the classic toolkit, and thus the stripped-down Frog 3 editor, entirely built around the concept of reusing pages (that we called widgets) throughout the system, was implemented.

At this point, we managed to free up most of the core code of Frog 1-3 so that we might be able to reuse and maintain it, and upgrade the versions of software on the server to the most recent versions.  By now, we had managed to detach most of the tendrils that the Frog product had created, although some of the product was still very much like a house of cards - you didn't want to look at it much less breathe near it, or risk it falling down around your ears.

We wrote a new version of the PHP brick to run it in a more sandboxed environment, to stop any potential nefariousness.  Unfortunately, it didn't scale too well, and meant that it crashed a lot of boxes, and we had to roll back to the original PHP brick.  Oops.
_______________
## A History of Frog's Code
<div class="history phase3">
    <div class="app" data-name="frogclassic">
        <span>Frog 3</span>
        <div data-name="widgets">
            <span>FDP Widgets</span>
        </div>
    </div>
    <div class="app" data-name="core">
        <span>Core</span>
        <div data-name="lib">
            <span>Lib</span>
        </div>
        <div data-name="api">
            <span>API</span>
        </div>
    </div>
</div>
]]]
As much as Frog 3's editor hasn't been for everyone, if it wasn't for us making the move towards enabling personalised content based more on the user than the school, we likely would never have made the shift to FrogOS that we have now.  Part of that was realising that there was a fundamental gap between part of what was offered in the Frog 3 editor, and what was actually possible to be used within.  We had decided that everything should be based around widgets, and created some as examples of what you could create, but it became really apparent that all of you had such great ideas about what you wanted to make, both specific to your school and for others, that we absolutely had to give you some kind of freedom to do that, and so, at this point, we separated out our core code to include an API layer for interacting with using the Frog 3 Development Platform.  We also implemented a universal standard so that there were millions of widgets available from the word, "go".

So at this point, we had gone from having a code base that we ourselves were struggling to extend the product it was built on, to having a fairly maintainable codebase that allowed others to create content for it, and drop in using our new easy-edit functionality.  We were never going to rest on our laurels, and we were determined to make things even better in the next step.
_______________
## A History of Frog's Code
<div class="history phase4">
    <div class="horizontal">
        <div class="app" data-name="frogos">
            <span>FrogOS</span>
            <div data-name="apps">
                <span>Apps</span>
            </div>
            <div data-name="widgets">
                <span>Widgets</span>
            </div>
            <div data-name="themes">
                <span>Themes</span>
            </div>
        </div>
        <div class="app" data-name="frogclassic">
            <span>Frog 3</span>
            <div data-name="widgets">
                <span>FDP Widgets</span>
            </div>
        </div>
    </div>
    <div class="app" data-name="core">
        <span>Core</span>
        <div data-name="lib">
            <span>Lib</span>
        </div>
        <div data-name="api">
            <span>API</span>
        </div>
    </div>
</div>
]]]
And here's where we get to where we are today.  We now have the FrogOS ecosystem in addition to that of our Frog 3 suite, and that system has been built, from day one, to be extensible and written by people outside of our development team.  We're concentrating initially on getting things built to go into FrogOS, and Themes, that we've heard about so well today, are the first step on that journey.  We want to bring down the barriers of entry that stop a lot of people being able to extend their platforms: we want it so that enthusiastic teachers can blaze a trail and let their imaginations come to life, augmenting their platforms at every step, and doing it with tools that are helpful to the point of complete transparency rather than something that stands in your way, unloved, undocumented and unsupported and, yes, Frog 3 FDP, I am looking square in your direction here.  We have learnt from our mistakes.  We want our application to be the hub of your sparks, your ideas, and whether you choose to share your developments or not, whether you build things to sell or not, we want it to be easy for you, and we want to help you.

To reiterate, when we started on FrogOS, we made the conscious decision on day one to centre our developments around a central platform.  We have so far created one main application with the new development suite, and that is FrogOS.  With the APIs we have made, anyone could have made a FrogOS.

Whether it be third-parties, writing their own integration pieces, or you, the schools, writing your own bespoke widgets and applications, or someone wanting to make a completely new whole application that uses the things that hold FrogOS together, like users, groups, assignments and notifications, to name a few, written in Scala, Haskell, BASIC, whatever, then we've built our new platform for this reason.  We write our app, FrogOS, in the way that we think will appeal to most customers, but we are mindful that the people in this room have the creativity, the knowledge, and the experience of the tools that will work best for them; and we don't want to leave anyone out in the cold.
_______________
## Extending FrogOS
 * Tools
 * Documentation
 * Communication
 * Support
]]]
In FrogOS itself, there are three main entities that bind the product as a whole together: Themes, Widgets, and Apps.  So let's talk about those a little one at a time, and talk about what we're going to be doing in the near future to get you able to create these things.
_______________
## Themes
]]]
We've started with themes because we believe it's the lowest barrier to entry: you simply couldn't have the web without HTML and CSS, and they are everywhere.  You can get tutorials and tools to get you up and running in seconds, and the bits you need to do specific to FrogOS are covered in our own comprehensive tutorials and documentation.  Everyone in here has an opinion on what looks good and what doesn't - there will be lots of you in here that hate the new look of iOS7, for example, and there will be some of you that see the massive usability tweaks that have been made.  With the FrogOS themes development piece, we hope to be able to give you your own style, your own take.  As themes are selectable by the person looking at it from a list of however many you, or they, have installed, you can create multiple ones and give people their own choice about how they want to look at things.

The tools we've given you to start with are the Theme Builder, and the Boilerplate theme template.  The boilerplate template is a great place to start throwing some things together and just trying stuff out.  When you think you've got it all together, that's what the Theme Builder is for - to validate the code you've made to make sure that you're not missing any of the key elements required to get your theme into FrogOS.  At the moment, the Theme Builder is very much alpha software: it exists separately to FrogOS, and really requires installation on a web server to be of any use - which is fine for some people, but a massive no-no to others.  Once we've got some feedback from the people who have trialled it about what does, and doesn't work, with the Theme Builder, we will be providing a centrally hosted version that will allow you to preview your theme with a variety of different site content, and upload your completed theme directly to us for inclusion in the new FrogStore for download.

It is currently not a simple process to get your theme installed onto your own FrogOS box - that will change in the coming weeks and months, with your feedback.

As a present to you all, the theme that has been created by V for today's conference, which is available for viewing on the demo boxes, will be gifted to all of you when the Frog Store opens, and your schools will be the only ones in the world who will ever be able to get it.  A true exclusive.
_______________
## Widgets
]]]
If HTML and CSS are the building blocks of the web, Javascript is the foundations that everything is built upon.  Where you used to switch a computer on and be able to type BASIC into it, you can now open up any modern web browser, or OS, and start writing Javascript straight away.  We made the choice early on in FrogOS' development cycle to make applications that ran in the browser rather than the server, and to stick to using the language that the browser understands the best.

We have implemented a framework in FrogOS that makes plugging new products into it an easy job.  Widgets are, at their heart, one single Javascript file.  You can, of course, have as many as you like, but the most simple widget requires nothing more than a file with about ten lines of code in it.  This widget can then be dragged in multiple times, having different preferences assigned to each one.

There are going to be lots of widgets you want to make that have nothing to do with what is already in Frog, but equally, there are going to be loads of them where you want to be able to select from a list of your groups, or the students in your class, or the assignments that they've handed in to you, for instance.  The API makes all these things possible, exposed through method names that make sense and are similar to one another, where you don't have to guess, and it's not one way for groups and another for users, say.

Our widget development kit that we will be providing will integrate into your existing code editor or IDE, to get you up and running as quickly as possible.
_______________
# Fin
<p class=lozenge>http://github.com/adamhepton/reveal.js</p>