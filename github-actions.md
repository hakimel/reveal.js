# Action Hero Tale
### Pipl's CI/CD workflow
#### Matan Keidar
<img src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" width="200" height="200" />

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
- Current: Staff Engineer at Pipl  <!-- .element: class="fragment" -->
- Scala enthusiast  <!-- .element: class="fragment" -->
- Likes to fully automate all things  <!-- .element: class="fragment" -->
- (Really!) likes to have a clean code  <!-- .element: class="fragment" -->
- Married, father of 2  <!-- .element: class="fragment" -->


## Who is Pipl? <!-- .slide: data-auto-animate -->
<img src="./images/pipl-overview.png" />



## Who is Pipl? <!-- .slide: data-auto-animate -->
Providing data and tools in order to understand who is a trustworthy person
<img src="./images/pipl-identities.png" />

notes:
Pipl's target is to provide data and tooling for helping its clients to better understand
who is a real person in the real world and moreover, who is a trustworthy person.

Why is it  Critical?
Most of the identitify verifications are in the internet.
We do not provide our ID card when performing online purchase or creating new account.
Because most of our interactions are happening in the virtual world, it is very hackable and
causes lots of mess due to huge number of digital identities. 
And this is the place where Pipl steps into.


## Who is Pipl? <!-- .slide: data-auto-animate -->
### Quality and Quantity of public Data
<img src="./images/pipl-data.png" />

notes: 
Besides the products we build, what makes us successful: 
- Our ability to collect and process huge amounts of data, consistenly
- Be able to correctly cluster profiles
- Be able to show relations between data entities.

Use cases
- Identity verification
  - eCommerce, Insurance, Banking
- Investigation
  - Authorities, law enforcement

---

## Background: Data Systems Group <!-- .slide: data-visibility="hidden" -->
- Pipl owns many records of people <!-- .element: class="fragment" -->
- Creating profiles from various sources <!-- .element: class="fragment" -->
- Billions of records <!-- .element: class="fragment" -->
  - Multiple processes, running for several days
  - Creating new data records
  - Data cleaning and parsing
  - Merging: new records with existing records
- Build index (input to search engine) <!-- .element: class="fragment" -->
- Lean and fast microservices in production <!-- .element: class="fragment" -->

---

## Preface
- This talk is about a concept 
- Telling our GitHub action story
- Relevant for you if: <!-- .element: class="fragment" -->
  - You work with Scala and sbt stack
  - You work with other tech stack 😎 <!-- .element: class="fragment" -->

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
    - Login to Docker registry (`docker login`)
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
- The Jenkins way: wrap everything in DSL
- Need to directly setup Jenkins machine
  - Install all dependencies
  - Management:  secrets, users
- Great visualization (especially *Blue Ocean*)  

<img data-id="jenkins"  src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />


<!-- .slide: data-auto-animate -->
## Jenkins: Pros <!-- .element data-id="title" -->
- Steep learning curve: <!-- .element style="list-style-type: '✅ ' ;" -->
  - Developer is productive after a very short time <!-- .element style="list-style-type: '✅ ' ;" -->
- Very popular back then <!-- .element class="fragment"  style="list-style-type: '✅ ' ;" -->
- Lots of plugins <!-- .element class="fragment"  style="list-style-type: '✅ ' ;" -->

<img data-id="jenkins"  src="https://www.jenkins.io/images/logos/jenkins/jenkins.svg" />



## Jenkins: Cons <!-- .element data-id="title" -->
<!-- .slide: data-auto-animate -->
- Developer needs to learn a proprietary DSL <!-- .element style="list-style-type: '❌ ' ;" -->
- Jenkins is installed on-prem <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
  - Cannot use a webhook on change
  - Only polling for repo changes... ⏳

<img data-id="jenkins" data-auto-animate-duration="3.0" width="22%" src="https://www.jenkins.io/images/logos/fire/fire.svg" />


## Jenkins: Cons <!-- .element data-id="title" -->
<!-- .slide: data-auto-animate -->
- Management is hard: <!-- .element class="fragment"  style="list-style-type: '❌ ' ;" -->
  - R&D team does not have full permissions <!-- .element style="list-style-type: '❌ ' ;" -->
  - Build process is not containered (or virtualized) <!-- .element style="list-style-type: '❌ ' ;" -->
- Flow was running on the host directly <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
- Not so clear what is actually installed <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->

<img data-id="jenkins" data-auto-animate-duration="3.0" width="22%" src="https://www.jenkins.io/images/logos/fire/fire.svg" />


<!-- .slide: data-background="https://media.giphy.com/media/11tTNkNy1SdXGg/giphy.gif" -->

---

## Second step
<!-- .slide: data-auto-animate -->
## GitHub Actions <!-- .element data-id="title" -->
<img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" alt="Mountains" style="width:20%"/>


## GitHub Actions vs. Jenkins
- Every step runs within a Docker container <!-- .element class="fragment" style="list-style-type: '🐳 ' ;" -->
  - Build environment is set up by containers
  - Build errors can be reproduced on a local machine
- Simple DSL <!-- .element class="fragment" style="list-style-type: '👌 ' ;"-->
  - Use existing action or run shell script
  - And still, every action is a Docker image
- No need to define a build project <!-- .element class="fragment" style="list-style-type: '🚀 ' ;" -->
  - GitHub actions work out of the box 
- Developers are much more independent <!-- .element class="fragment" style="list-style-type: '💪 ' ;" -->


## Simple build management
<img src="./images/GitHub-actions-single-repo-2.png" alt="Mountains" />


## Lack of Support
- Does not have support out of the box: <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
  - No SBT support
  - No Scala installation
- Need to support: <!-- .element class="fragment" style="list-style-type: '❌ ' ;" -->
  - Login to private cloud environment 
  - Docker login to org private registry
  - Install required dependencies on build machine


## Propietary GitHub Action
<!-- .slide: data-auto-animate -->
- Created a tailor-made GitHub action <!-- .element class="fragment" -->
  - Slim and fast, based on OpenJDK Alpine
  - https://github.com/matankdr/github-docker-sbt
  - External PRs were contributed to the project! 💪
- Responsible for: <!-- .element class="fragment" -->
  - Installing `sbt` 
  - Installing other required dependencies (e.g., git)
  - Injecting GitHub secrets as environment variables
  - docker-login to our private docker registry
  - Running given `sbt` command 


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
  - Cross compilation is complicated
  - Publish image for each dependency combination
- Build innaccuracy <!-- .element class="fragment" -->
  - Build tool and CI might run on different settings
  - For example: different Java/Scala versions


<!-- .slide: data-background="https://media.giphy.com/media/TPdoPTIMMBzDqPVKg3/giphy.gif" data-background-size="70%" data-background-opacity="0.7" -->
## Not Exactly what we need...

---

## Third Step
## Code Generation
<!-- .slide: data-auto-animate -->
<img src="https://media.giphy.com/media/l0JMrPWRQkTeg3jjO/giphy.gif"/>


## Code Generation
<!-- .slide: data-auto-animate -->
- Daniel Spiewak creates `sbt-github-actions` 
- https://github.com/djspiewak/sbt-github-actions
- Enables code generation GitHub Actions workflows 
  - Directly from the `sbt` build definition!
- Big improvement: `sbt` is now the *"source of truth"*!
<img src="./images/Github-actions-step2.png" />


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Set Environment Variables

```scala
// build.sbt
githubWorkflowEnv := Map(
  "GITHUB_TOKEN"      -> "${{ secrets.BOT_TOKEN }}",
  "GITHUB_USERNAME"   -> "pipl-bot",
  "GITHUB_USER_EMAIL" -> "bot@pipl.com"
)
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Set Environment Variables
```yml
# generated ci.yml
env:
  GITHUB_TOKEN: ${{ secrets.BOT_TOKEN }}
  GITHUB_USERNAME: pipl-bot
  GITHUB_USER_EMAIL: bot@pipl.com
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Set Java versions
```scala
// build.sbt
githubWorkflowJavaVersions := Seq("openjdk@1.11", "openjdk@1.8")
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Set Java versions
```yml[1,9|]
# generated ci.yml
jobs:
  build:
    name: Build and Test
    strategy:
      matrix:
        os: [ubuntu-latest]
        scala: [2.13.6]
        java: [openjdk@1.11, openjdk@1.8]
    runs-on: ${{ matrix.os }}
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Execute shell commands
```scala
// build.sbt
WorkflowStep.Run(
  name = Some("Set Git Credentials"),
  id   = Some("git-credentials"),
  commands = List(
    "git config --global user.email ${GITHUB_USER_EMAIL}",
    "git config --global user.name ${GITHUB_USERNAME}",
    "git config --global user.password ${GITHUB_TOKEN}"
  )
)
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Execute shell commands
```yml
# generated ci.yml
- name: Set Git Credentials
    id: git-credentials
    run: |
      git config --global user.email ${GITHUB_USER_EMAIL}
      git config --global user.name ${GITHUB_USERNAME}
      git config --global user.password ${GITHUB_TOKEN}
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Using existing Github Actions
```scala
// build.sbt
WorkflowStep.Use(
  ref = UseRef.Public(
    owner = "elgohr",
    repo  = "gcloud-login-action",
    ref   = "master"
  ),
  id     = Some("gcloud"),
  name   = Some("Login to gcloud registry"),
  params = Map( "account_key" -> "${{ secrets.GCLOUD_KEY }}" )
)
```


### Ease of use
<!-- .slide: data-auto-animate --> 
#### Using existing Github Actions
```yml
# generated ci.yml
  - name: Login to gcloud registry
    id: gcloud
    uses: elgohr/gcloud-login-action@master
    with:
      account_key: ${{ secrets.GCLOUD_KEY }}
```

---

## Result
- Workflow is generated directly from the project's build definition!
- Specifically tailor made for each project
- On build definition update, the workflow is updated


## The build tool is
<!-- .slide: data-background="https://media.giphy.com/media/kiCXF8mL3j6Oe0vAm9/giphy.gif" data-background-opacity="0.9" -->
# Single source of truth!



<!-- .slide: data-background="https://media.giphy.com/media/10tIjpzIu8fe0/giphy.gif" data-background-opacity="0.7" -->
## Had to kill the open-sourced Action...


## Result
<!-- .slide: data-auto-animate -->
- Development cycle is significantly improved! 
- Yet, some of the problems still remain: 🤦‍♂️ <!-- .element class="fragment"  -->
  - No auto-update build definition for all projects
  - When creating a new repo, build definitions need to be copied <!-- .element class="fragment"  -->
    - Cannot use GitHub template (multiple project types)


## Result
<!-- .slide: data-auto-animate -->
<img src="./images/github-actions-multi-repos-extended.png" />


## And then we found it...
<!-- .slide: data-background="https://media.giphy.com/media/XF3lU8cWrv4JcUeEmM/giphy.gif" -->

---

## Fourth Step
## Double Code Generation
<img src="https://media.giphy.com/media/jP5p77MqB3mJGLRt5b/giphy.gif"/>


## DAP sbt-plugin
<!-- .slide: data-auto-animate -->
- Create `sbt` plugin for generating common settings
- Settings are read by `sbt-github-actions` plugin
- On update, only need to upgrade the plugin version

<img src="./images/GitHub-actions-step4.png" />


## DAP sbt-plugin
<!-- .slide: data-auto-animate -->
<img src="./images/github-actions-with-dap.png" style="width:150%" />


<!-- .slide: data-background="https://media.giphy.com/media/WNwErIxqX18xmm92UX/giphy.gif" data-background-opacity="0.7" -->
## One plugin to rule them all!


## Features
- Generate Scala Steward GitHub workflow
  - (like `Dependabot` but for Scala)
  - Set auto merging commits created by our bot 
- Generate Authentication steps:
  - GCP, Docker, `sbt` credentials, `git` credentials
- Generate common workflow steps:
  - PR, publish and deployment


## Results
- So far, we are still experimenting 
- The plugin reduces the release cycle time
- Not easily debuggable:
  - Logic is encapsulated within the plugin  

---

## Conclusion
<!-- .slide: data-auto-animate -->
- Working with GitHub actions improved productivity <!-- .element: class="fragment" -->
  - Ease of use and evolving actions community
  - Build virtualization is a first class citizen
- GitHub actions enables flexible CI/CD <!-- .element: class="fragment" -->
  - Build definition can be easily updated
  - Within a few lines of code  


## Conclusion
<!-- .slide: data-auto-animate -->
- One source of truth is pure gold <!-- .element: class="fragment" -->
  - Enable the developers to avoid silly mistakes
- If no 3rd party solution available, use your own <!-- .element: class="fragment" -->
- Do not be afraid to kill your own projects 😩 <!-- .element: class="fragment" -->


<div>
    <img src="https://f.hubspotusercontent10.net/hubfs/6381214/pipl_logo_blue-1.svg"  style="width:20%; padding-right:40px;"/>  
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/A_perfect_SVG_heart.svg" style="width:10%"/>  
    <img src="https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg" alt="Mountains" style="width:20%"/>

</div>



# Questions <!-- .element: style="color: white; border: 10px; border-color: black;" -->
<!-- .slide: data-background="https://thehomebasedmom.com/wp-content/uploads/2019/05/Frequently-Asked-Questions.jpg"  data-background-opacity="0.7" -->

---

<!-- .slide: data-background="https://media.giphy.com/media/Pnh0Lou03fv92J4puZ/giphy.gif" data-background-size="50%" -->
