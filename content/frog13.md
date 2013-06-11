# Frog 13
## Celebrating Outstanding Education
### FrogOS Advanced

Adam Hepton | Head of Development | [@adamhepton](http://twitter.com/adamhepton)
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

We wrote a new version of the PHP brick to run it in a more sandboxed environment, to stop any potential nefariousness.  Unfortunately, it didn't scale too well, and meant that it crashed a lot of boxes, and we had to roll back to the original PHP .  Oops.
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
As much as Frog 3's editor hasn't been for everyone, if it wasn't for us making the move towards enabling personalised content based more on the user than the school, we likely would never have made the shift to FrogOS that we have now.  Part of that was realising that there was a fundamental gap between part of what was offered in the Frog 3 editor, and what was actually possible to be used within.  We had decided that everything should be based around widgets, and created some as examples of what you could create, but it became really apparent that 
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
Here are some notes oh yes here are some notes
_______________
# Fin
