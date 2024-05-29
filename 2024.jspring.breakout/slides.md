## Agenda

* Keynote recap
* Bottlenecks
  * CPU - Optimal, bottlenecked by hardware. CPU is running instructions
    * When the CPU needs data, it gets "stalled"
    * Stalled: Waiting for data to be loaded into the register
  * Cache - Data is close to the execution unit
    * L1, L2 - Inside CPU core
    * L3 - Shared inside CPU
  * RAM - Data is in RAM. Can be ~100ns on modern systems
  * Disk - HDD / SSD. Can be ~100us
  * Network - TCP over LAN/WAN. Can be 1-100ms

---

## Recap on keynote case study

--

### Recap on keynote case study

<!-- .slide: class="fragmented-lists" -->
* Case study of acute bottleneck in production
* Demonstration of bottleneck chain and potential  
  for peformance improvement of 19,066%
* Do's and dont's of performance optimization
* Hierarchy of bottlenecks 

--

![](./Bottleneck%20pyramid.png) <!-- .element: height="500" -->

---

## Hierarchy of bottlenecks

--

### CPU

![](./CPU_CYCLE.png)

--

### CPU Stall

![](./CPU_CYCLE2.png)

--

### Cache / RAM

<!-- .slide: class="fragmented-lists" -->
* Data is fetched from cache or DRAM
* Can be <1ns for L1 cache or >100ns for DRAM
* Insignificant compared to (network) IO
* Mainly targetted by hardware and compilers

--

### Disk / Network IO

<!-- .slide: class="fragmented-lists" -->
* Data is fetched from another system
* Can be ~1ms up to 100ms
* Many orders of magnitude slower
* Optimization targetted by applicaiton programmer

---

### Database indexes

<!-- .slide: class="fragmented-lists" -->
* Prevent full table scans on large tables
* Use compound indexes for efficient filtering
* Use modifiers/functions in indexes
    e.g. `create index user_email_idx on account( lower(email) )`
* Don't overdo indexes and check if they're really used

--

### Efficient query design

<!-- .slide: class="fragmented-lists" -->
* Avoid excessive round-trips
    * Bulk select queries: `SELECT FROM table WHERE id IN(?, ?, ?)`
    * Bulk inserts using batch insert mode
    * Use joins correctly. for one-to-one and one-to-few
* Limit use of wildcard filtering: `WHERE name LIKE '%Jan%'`
* Don't be afraid to change your data model

--

### Changing your data model

<!-- .slide: class="fragmented-lists" -->
* Finding customers with recent orders
    * `SELECT c.name FROM customers c WHERE EXISTS(SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.creation_date > now() - interval '30 days')`
* With a `last_order_date` column
    * `SELECT c.name FROM customers c WHERE last_order_date > now() - interval '30 days'`

--

### Diagnose before treatment

* Check your quety and other IO metrics and monitoring
    * e.g. spring data repositories auto timings
    * e.g. feign client metrics
* Use `EXPLAIN ANALYZE` to analyze your queries
* Run automated load tests to find **your** bottlenecks