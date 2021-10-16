# Action Hero Tale

### Pipl's CI/CD workflow
						
#### Matan Keidar

---

## Outline
- Who is...?
- The problem 
- Step #1: Jenkins
- Step #2: Propietary GitHub action
- Step #3: Code generation
- Step #4: Double code generation
- Conclusion

---

# Who is...?

---

## Who is Matan?
- Current: Big data tech lead at Pipl  <!-- .element: class="fragment" -->
- Scala enthusiast  <!-- .element: class="fragment" -->
- Likes to fully automate all things  <!-- .element: class="fragment" -->
- (Really!) likes to have a clean code  <!-- .element: class="fragment" -->
- Married, father of 2  <!-- .element: class="fragment" -->


## Who is Pipl?

---

## Background

---

## Use Case
- Multiple kind of projects:
  - Microservices and Big-Data processes
  - All written in Scala/Java
- Multiple repositories must be constantly maintained <!-- .element: class="fragment" -->
- Multiple kind of build outputs: <!-- .element: class="fragment" -->
  - Publishing packaged libraries
  - Publishing Docker images
  - Publishing files to GCP buckets


## The Problem
<!-- .slide: data-auto-animate -->
## maintenance, maintenance and... maintenance! <!-- .element: class="fragment fade-in" style="color: yellow;"  -->


## maintenance, maintenance and... maintenance!  <!-- .slide: data-auto-animate  --> 
- Large number of project repositories           <!-- .element: class="fragment" style="list-style-type: '😱 ';" data-fragment-index="1" -->
- Different types of projects                    <!-- .element: class="fragment" style="list-style-type: '😱 ';" data-fragment-index="2" -->
- Builds have different complexity requirements     <!-- .element: class="fragment" data-fragment-index="3" style="list-style-type: '😱 ';" -->
  - Publishing docker image requires:           <!-- .element: class="fragment" data-fragment-index="4" -->
    - Login to GCP (`gcloud auth login`)
    - Login to private Docker registry (`docker login`)
  - Some builds should be run on a private node <!-- .element: class="fragment" data-fragment-index="5" -->
- All the above should be managed by CI/CD       <!-- .element: class="fragment" style="list-style-type: '😱 ';" -->
- Less developer fricition as possible           <!-- .element: class="fragment" style="list-style-type: '😱 ';" -->

---

<!-- .slide: data-auto-animate -->
## First Step: 
## Jenkins <!-- .element data-id="title" -->
<img data-id="jenkins"  src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />


<!-- .slide: data-auto-animate -->
## Jenkins <!-- .element data-id="title" -->
- Pros <!-- .element style="list-style-type: '✅ ' ;" -->
  - Steep learning curve:
    - Developer is productive after a very short time
  - Very popular back then
  - Lots of plugins

<img data-id="jenkins"  src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />



## Jenkins <!-- .element data-id="title" -->
<!-- .slide: data-auto-animate -->
- Cons <!-- .element style="list-style-type: '❌ ' ;" -->
  - Developer needs to learn a proprietary DSL
  - Flow was running on the host directly
  - Management is hard:
    - R&D team does not have full permissions
    - Build process is not containered (or vitualized) 

<img data-id="jenkins" data-auto-animate-duration="3.0" width="22%" src="https://www.jenkins.io/images/logos/fire/fire.svg" />


<!-- .slide: data-background="https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif" -->

---

## Second step
<!-- .slide: data-auto-animate -->
## GitHub Actions <!-- .element data-id="title" -->
<img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" alt="Mountains" style="width:20%"/>


## Lack of Support
- Does not have support out of the box: <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
  - No SBT support
  - No Scala installation
- Need to support: <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
  - Login to private cloud environment 
  - Docker login to org private registry
  - Setup required dependencies on build machine


## Propietary GitHub Action
<!-- .slide: data-auto-animate -->
- Created a tailor-made GitHub action <!-- .element class="fragment" -->
  - Slim and fast, based on OpenJDK Alpine
  - https://github.com/matankdr/github-docker-sbt
- Responsible for: <!-- .element class="fragment" -->
  - Installing sbt 
  - Installing other required dependencies (e.g., git)
  - Injecting GitHub secrets as environment variables
  - docker-login to our private docker registry
  - Running given sbt command 


<!-- .slide: data-background="https://media.giphy.com/media/x8TrYlgGVCAytbcBgC/giphy.gif" -->
## Exactly what we need!


## Propietary GitHub Action: The good <!-- .element data-id="title" -->
<!-- .slide: data-auto-animate -->  
- Tailor-made action that exactly fits
- Flexible run: either on GitHub or on-premise node
- Each build step is containered


## Propietary GitHub Action: The bad <!-- .element data-id="title" -->
<!-- .slide: data-auto-animate -->  
- Configuration is not flexible <!-- .element class="fragment" -->
  - Manually updating build definition for each project
  - Cross compiliation is complicated
  - Publish image for each dependency combination
- Build innaccuracy <!-- .element class="fragment" -->
  - Build tool and CI might run on different settings
  - For example: different Java/Scala versions


<!-- .slide: data-background="https://media.giphy.com/media/TPdoPTIMMBzDqPVKg3/giphy.gif" data-background-size="90%" data-background-opacity="0.7" -->
## Not Exactly what we need...

---

## Third Step
## Code Generation


## Third Step: Code Generation
- Daniel Spiewak creates sbt-github-actions plugin https://github.com/djspiewak/sbt-github-actions
- Enables code generation GitHub Actions workflows 
  - Directly from the sbt build definition!
- Big improvement: sbt is now the *"source of truth"*!


## Ease of use

```scala [|1|3-7]
githubWorkflowJavaVersions := Seq("adopt@1.11", "adopt@1.8")

githubWorkflowEnv := Map(
  "GITHUB_TOKEN"      -> "${{ secrets.BOT_TOKEN }}",
  "GITHUB_USERNAME"   -> "pipl-bot",
  "GITHUB_USER_EMAIL" -> "bot@pipl.com"
)
```


```scala
githubWorkflowBuildPreamble := Seq(
  WorkflowStep.Run(
    name = Some("Inject SBT Credentials"),
    id   = Some("sbt-credentials"),
    commands = List(
      "mkdir -p $HOME/.sbt/1.0/",
      "touch $HOME/.sbt/1.0/github-credentials.sbt",
      """echo '
      val usr      = sys.env.get("GITHUB_USERNAME")
      val pass    = sys.env.get("GITHUB_TOKEN")
      credentials += Credentials("maven.pkg.github.com",usr,pass)
       ' > $HOME/.sbt/1.0/github-credentials.sbt
       """,
    )
  ),
  WorkflowStep.Run(
    name = Some("Set Git Credentials"),
    id   = Some("git-credentials"),
    commands = List(
      "git config --global user.email ${GITHUB_USER_EMAIL}",
      "git config --global user.name ${GITHUB_USERNAME}",
      "git config --global user.password ${GITHUB_TOKEN}"
    )
  ),
  WorkflowStep.Use(
    ref = UseRef.Public(
      owner = "elgohr",
      repo  = "gcloud-login-action",
      ref   = "master"
    ),
    id     = Some("gcloud"),
    name   = Some("Login to gcloud registry"),
    params = Map( "account_key" -> "${{ secrets.GCLOUD_KEY }}" )
  ),
)
```


## Result
- The workflow of each project is generated directly from its build definition!
- Tailor made for each project level (????)
- When build definition is updated, the workflow is updated
- 

---

## Fourth Step: Double Code Generation



- Self hosted in a click
- Bad: copying secrets
-  


<div>
    <img src="https://f.hubspotusercontent10.net/hubfs/6381214/pipl_logo_blue-1.svg"  style="width:20%; padding-right:40px;"/>  
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/A_perfect_SVG_heart.svg" style="width:10%"/>  
    <img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" alt="Mountains" style="width:20%"/>

</div>

---

# We ❤️  GitHub

GitHub Actions was released for public usage.

We gave it a shot and loved it.

<img src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" width="200" height="200" />

