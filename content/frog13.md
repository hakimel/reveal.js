# Frog 13
## Celebrating Outstanding Education
### FrogOS Advanced

<p class=lozenge>Adam Hepton | Head of Development | [@adamhepton](http://twitter.com/adamhepton)</p>
]]]
Hi, I'm Adam Hepton, Head of Development at Frog.  The purpose of my part of
this session is really two-fold; the first function I'm here to do is to speak
with you about part of the roadmap for Frog as a whole, and how you can use
skills you already have, or ones you want to pick up, to extend your platform
your way.  I'm going to let you in on the kind of things that we've been
cooking up at Frog in the Development department to put the ownership firmly in
your hands, so that you can extend, augment or supplement your core platform,
by giving you tools and a support network to allow your ideas become realities
as part of your FrogOS installation.

The second reason for being here is to make the other speakers look far better
just by direct comparison so please, be kind.
_______________
## A History of Frog's Code
<div class="history">
    <div class="app" data-name="frogclassic">
        <span>Frog Teacher</span>
    </div>
</div>
]]]
So, I kind of liked the irony in a session talking about the future of a
brand-new (to most of you) platform by talking about how and why we've got
here, and why we've made the decisions we've made, and I figured that the best
way of doing that would be to talk about where we've come from, and how the
decisions of our past have shaped how we have designed FrogOS today.

14 or maybe nearly 15 years ago now, the first version of Frog was created, and
it wasn't created with schools in mind: it was for textile companies to make
web sites.  As much as Gareth Davies might argue the contrary, I don't think
that even he had any idea of how successful and different the version that was
sold back then compared to the version our first school received would become.

Resultantly, the code was built as a whole single clump, if you like.  It had a
single job to do, even when that job became lots and lots of bricks and modules
combining to become one big job.  Resultantly, the code started out small,
compact and for one job in particular, and turned into some kind of Isle of the
Deep, tendrils attached here there and everywhere, with no real structure and
everything mushed together in some horrible oxtail and parsnip hybrid soup.

Writing new parts for the software was painful, bordering on impossible in
cases, based on the need to get the product out of the door as soon as
possible, and making lots of shortcuts along the way.  Rightly or wrongly, that
was the route we took, and it meant that everything we were making was that
much longer to develop, and that much more fragile to maintain.

Even back then, though, we wanted our customers to be able to make changes for
their own benefits, and at this point in time, we had a HTML brick, that
allowed you to run Javascript, and a PHP brick to run server-side code, to
allow individual schools to create things more personal to them, or to link
into their own systems.  These were great, because they had complete freedom!
Unfortunately, because they had complete freedom, there was definitely a bit of
a security risk there.
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
At this point, the Development Team had grown to the point where it could
actually, justifiably, be termed a team.  We all agreed that as great a product
as Frog Teacher was, unfortunately, if we wanted to be able to continue to
improve it, we were simply going to have to put in some serious refactoring.
Luckily, as every developer knows, there's no greater feeling in the world than
being given free reign to rip apart someone else's code, as, let's face it - we
all know better.

We made a second version of Frog that frankly didn't last very long
commercially, and wasn't really a new version at all, but it did have a blue
"edit-in-place" editor and a reskin to look a bit like Windows Vista because,
as we all know, Windows Vista was a success in every way that we should try and
infer association ourselves with.

Under the hood, we finally separated out some of the code and made it so that
we could actually reuse the code a little bit enough so that we could go on and
create more sections for the Frog 2 product.  A decision was then made that the
product was so fully-featured now that it had got to the point where the users
now found creating content, and particular, content personal to them, really
difficult in the classic toolkit, and thus the stripped-down Frog 3 editor,
entirely built around the concept of reusing pages (that we called widgets)
throughout the system, was implemented.

At this point, we managed to free up most of the core code of Frog 1-3 so that
we might be able to reuse and maintain it, and upgrade the versions of software
on the server to the most recent versions.  By now, we had managed to detach
most of the tendrils that the Frog product had created, although some of the
product was still very much like a house of cards - you didn't want to look at
it much less breathe near it, or risk it falling down around your ears.

We wrote a new version of the PHP brick to run it in a more sandboxed
environment, to stop any potential nefariousness.  Unfortunately, it didn't
scale too well, and meant that it crashed a lot of boxes, and we had to roll
back to the original PHP brick.  Oops.
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
As much as Frog 3's editor hasn't been for everyone, if it wasn't for us making
the move towards enabling personalised content based more on the user than the
school, we likely would never have made the shift to FrogOS that we have now.

Part of that was realising that there was a fundamental gap between part of
what was offered in the Frog 3 editor, and what was actually possible to be
used within.  We had decided that everything should be based around widgets,
and created some as examples of what you could create, but it became really
apparent that all of you had such great ideas about what you wanted to make,
both specific to your school and for others, that we absolutely had to give you
some kind of freedom to do that, and so, at this point, we separated out our
core code to include an API layer for interacting with using the Frog 3
Development Platform.  We also implemented a universal standard so that there
were millions of widgets available from the word, "go".

So at this point, we had gone from having a code base that we ourselves were
struggling to extend the product it was built on, to having a fairly
maintainable codebase that allowed others to create content for it, and drop in
using our new easy-edit functionality.  We were never going to rest on our
laurels, and we were determined to make things even better in the next step.
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
And here's where we get to where we are today.  We now have the FrogOS
ecosystem in addition to that of our Frog 3 suite, and that system has been
built, from day one, to be extensible and written by people outside of our
development team.

There are two prongs to this, with allowing you to build subsidiary
applications, widgets and themes, that we've heard about so well today, being
one side of that coin.  We want to bring down the barriers of entry that stop a
lot of people being able to extend their platforms: we want it so that
enthusiastic teachers can blaze a trail and let their imaginations come to
life, augmenting their platforms at every step, and doing it with tools that
are helpful to the point of complete transparency rather than something that
stands in your way, unloved, undocumented and unsupported and, yes, Frog 3 FDP,
I am looking square in your direction here.

We have so far created one main application with the new development suite, and
that is FrogOS.  With the APIs we have made, anyone could have made a FrogOS.
Other examples of minor applications we have written using our APIs are the
iPad applications you've seen today, and the Windows 8 application.

Whether it be third-parties, writing their own integration pieces, or you, the
schools, writing your own bespoke widgets and applications, or someone wanting
to make a completely new whole application that uses the things that hold
FrogOS together, like users, groups, assignments and notifications, to name a
few, written in Scala, Haskell, BASIC, whatever, then we've built our new
platform for this reason.  We write our app, FrogOS, in the way that we think
will appeal to most customers, but we are mindful that the people in this room
have the creativity, the knowledge, and the experience of the tools that will
work best for them; and we don't want to leave anyone out in the cold.

To reiterate, when we started on FrogOS, we made the conscious decision on day
one to centre our developments around a central platform.  We have made the
decision and investment to listen closely to the customers in providing to them a
series of tools and technologies that will genuinely be useful to them, and I
stand here today pleading with you for your feedback.

We have learnt from our mistakes.  We want our application to be the hub of
your sparks, your ideas, and whether you choose to share your developments or
not, whether you build things to sell or not, we want it to be easy for you,
and we want to help you.
_______________
# Extending FrogOS
]]]
In FrogOS itself, there are three main entities that bind the product as a
whole together: Themes, Widgets, and Apps.  So let's talk about those a little
one at a time, and talk about what we're going to be doing in the near future
to help you to create these things.
_______________
## Themes
<ul>
  <li class="fragment lozenge roll-in">HTML/CSS</li>
  <li class="fragment lozenge roll-in">Design Guide Documentation: Available
  now</li>
  <li class="fragment lozenge roll-in">Community Support: In Progress</li>
  <li class="fragment lozenge roll-in">Theme Boilerplate: Available now</li>
  <li class="fragment lozenge roll-in">Theme Builder Offline: Available now
    <ul>
      <li>Containing: Theme Validation, Basic Previewing</li>
    </ul>
  </li>
  <li class="fragment lozenge roll-in">Theme Builder Online: Next on the
  Roadmap
    <ul>
      <li>Containing: Theme submission, Advanced Previewing</li>
    </ul>
  </li>
</ul>
]]]
We've started with themes because we believe it's the lowest barrier to entry:
you simply couldn't have the web without HTML and CSS, and they are everywhere.
You can get tutorials and tools to get you up and running in seconds, and the
bits you need to do specific to FrogOS are covered in our own comprehensive
tutorials and documentation.  Everyone in this room has an opinion on what looks
good and what doesn't - there will be lots of you in here that hate the new
look of iOS7, for example, and there will be some of you that see the massive
usability tweaks that have been made.  With the FrogOS themes development
piece, we hope to be able to give you your own style, your own take.  As themes
are selectable by the person looking at it from a list of however many you, or
they, have installed, you can create multiple ones and give people their own
choice about how they want to look at things.

The tools we've given you to start with are the Theme Builder, and the
Boilerplate theme template.  The boilerplate template is a great place to start
throwing some things together and just trying stuff out.  When you think you've
got it all together, that's what the Theme Builder is for - to validate the
code you've made to make sure that you're not missing any of the key elements
required to get your theme into FrogOS.  At the moment, the Theme Builder is
very much alpha software: it exists separately to FrogOS, and really requires
installation on a web server to be of any use - which is fine for some people,
but a massive no-no to others.  Once we've got some feedback from the people
who have trialled it about what does, and doesn't work, with the Theme Builder,
we will be providing a centrally hosted version that will allow you to preview
your theme with a variety of different site content, and upload your completed
theme directly to us for inclusion in the new FrogStore for download.

It is currently not a simple process to get your theme installed onto your own
FrogOS box - that will change in the coming weeks and months, with your
feedback.

As a present to you all, the theme that has been created by V for today's
conference, which is available for viewing on the demo boxes, will be gifted to
all of you when the Frog Store opens, and your schools will be the only ones in
the world who will ever be able to get it.  A true exclusive.
_______________
## Widgets
<ul>
  <li class="fragment lozenge roll-in">Javascript</li>
  <li class="fragment lozenge roll-in">Documentation: In Progress</li>
  <li class="fragment lozenge roll-in">Community Support: In Progress</li>
  <li class="fragment lozenge roll-in">Widget Boilerplate: In Progress</li>
  <li class="fragment lozenge roll-in">Compatible APIs: Next on the Roadmap</li>
  <li class="fragment lozenge roll-in">Widget Builder Online: Next on the
  Roadmap
    <ul>
      <li>Containing: Widget Validation, Widget Submission, Advanced Previewing</li>
    </ul>
  </li>
</ul>
]]]
If HTML and CSS are the building blocks of the web, Javascript is the
foundations that everything is built upon.  Where you used to switch a computer
on and be able to type BASIC into it, you can now open up any modern web
browser, or OS, and start writing Javascript straight away.  We made the choice
early on in FrogOS' development cycle to make applications that ran in the
browser rather than the server, and to stick to using the language that the
browser understands the best.

We have implemented a framework in FrogOS that makes plugging new products into
it an easy job.  Widgets are, at their heart, one single Javascript file.  You
can, of course, have as many as you like, but the most simple widget requires
nothing more than a file with about ten lines of code in it.  This widget can
then be dragged in multiple times, having different preferences assigned to each
one.

Widgets are the right choice for showing bits of information specific to a user,
or to a group that a user belongs to.  Alternatively, you might want to write
something that you can interact with that adds content into the page to become
part of the site it is embedded into.

We will be providing thorough documentation to help you through the opening
stages and beyond as your comfort with the concepts allow you to become more
adventurous and complicated, and follow that up with a robust community support
mechanism around that to ensure that your ideas really can be implemented into
reality.

Our widget development kit that we will be providing will integrate into your
existing code editor or IDE, to get you up and running as quickly as possible.

There are going to be lots of widgets you want to make that have nothing to do
with what is already in Frog, but equally, there are going to be loads of them
where you want to be able to select from a list of your groups, or the students
in your class, or the assignments that they've handed in to you, for instance.

Combined with the API, all these things and far more are possible, and again,
the choice of how you share, or not, these pieces of content that you create is
up to you.  If you want to be able to let other people use your widget, you
can.  If you want to be able to charge for your widgets, you will be able to.
_______________
## Apps
<ul>
  <li class="fragment lozenge roll-in">Javascript</li>
  <li class="fragment lozenge roll-in">Documentation: Later</li>
  <li class="fragment lozenge roll-in">Community Support: Later</li>
  <li class="fragment lozenge roll-in">App Boilerplate: Later</li>
  <li class="fragment lozenge roll-in">Compatible APIs: Later</li>
  <li class="fragment lozenge roll-in">App Builder Online: Later
    <ul>
      <li>Containing: App Validation, App Submission, Advanced Previewing</li>
    </ul>
  </li>
</ul>

]]]
Widgets have a bigger sibling, the app.  Widgets can be instantiated into a
page, which belongs to a site, and an app stands alone - although one app can
talk to another, by using the FrogOS Event framework that we expose to you.  If
you want to make your app do something when other areas of FrogOS are interacted
with, then an app is the right choice for you.  If you want to be able to
display a lot of data in one place depending on who is logged in and looking at
it, then an app is for you.  If you want to create something and then restrict
it to different users in your school, then an app is right.

The tools we will be providing for apps will be in line with the other offerings
outlined earlier, with the intention of providing you with an all-in-one
solution for reference, support, community and submission.  For previewing of
apps we hope to be able to offer different sets of users and groups, all with
different levels of platform activity, so that you can test your app in
different circumstances.  As with everything we will provide, it will be your
feedback that shapes the direction of what is offered.
_______________
## API
<ul>
  <li class="fragment lozenge roll-in">Whichever language you like</li>
  <li class="fragment lozenge roll-in">Starter APIs: In Progress</li>
  <li class="fragment lozenge roll-in">Further APIs: Continuing</li>
  <li class="fragment lozenge roll-in">Documentation: In Progress</li>
  <li class="fragment lozenge roll-in">Community Support: In Progress</li>
  <li class="fragment lozenge roll-in">SDKs: Later</li>
</ul>
]]]
The other side of extending FrogOS doesn't sit within the FrogOS platform: it
doesn't even necessarily have to sit within the web browser, and it is this side
of our plans to help you develop your Frog platform that has most freedom
attached to it.

We will provide to you a number of APIs that hook into the Frog ecosystem, so
that, for instance, you could allow people to use their login with Frog to log
in to other platforms, or pull out data on assignments that a subset of users
have taken for custom reports - providing that the user that is requesting that
data has the permission to see that data.  We handle the permissions for
endpoints that are live with the most current data, and allow you to update data
from external apps that will then be reflected within the whole FrogOS app
suite, regardless of how you chose to consume or manipulate that data in the
first place.

Our intention is to open up the APIs bit-by-bit, based on demand and potential
impact.  There's every chance that your feedback will influence us to write
brand new APIs that currently don't exist, if the demand is there.  We are
currently working on tidying up the first set of endpoints, and implementing a
secure system to handle and serve your requests.  As with other offerings, we
will be rigorously supporting and documenting the APIs we release, and further
to that, we will be producing software development kits for the most popular
languages and environments to give you a head start, including wrapper functions
to access the APIs as smoothly and easily as possible.  We don't want to make it
difficult: we want it to be easy for anyone used to developing software, even at
a hobbyist level, to have access to all the power and big data that FrogOS can
provide.

The development to the APIs can, and will, be done in parallel to that of the
FrogOS development platform.  Both are compatible with one another, both are
perfectly usable separate from one another.  Whether you choose to use one or
both of them, we'll be there every step of the way, supporting your queries and
responding to your feedback.
_______________
# Fin
<p class=lozenge>http://github.com/adamhepton/frog13</p>
