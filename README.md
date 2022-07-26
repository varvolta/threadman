```
 _   _                        _
| | | |                      | |
| |_| |__  _ __ ___  __ _  __| |_ __ ___   __ _ _ __
| __| '_ \| '__/ _ \/ _` |/ _` | '_ ` _ \ / _` | '_ \
| |_| | | | | |  __/ (_| | (_| | | | | | | (_| | | | |
 \__|_| |_|_|  \___|\__,_|\__,_|_| |_| |_|\__,_|_| |_|
 ```

<br />

### **Still in early stages of development. Email me any suggestions you have on varvolta@gmail.com**

<br />

# **Worker threads made easy.**

<br />

Create and execute tasks in real cpu threads in NodeJS. (ES6 imports for now)

Threadman doesn't use any dependencies. It's based on workers.

<br />

# Installation
```
npm i threadman
```


<br />

# Syntax

```js
new Thread(fn, args, options?, priority?).run(callback)
```

<br />

# Basic usage

```js
import { Thread } from 'threadman'

let number = 10

const fn = (number) => number + 20
const args = [number]
const callback = (result) => number = result

new Thread(fn, args).run(callback)
```

'fn' runs in a sandbox and returns the result in callback. After you get the result you can access the main scope again and reassign variables. 'fn' can be async.


<br />

# Using modules

```js
import { Thread } from 'threadman'
import md5 from 'md5'

let string

const fn = (md5, string) => md5(string)
const args = [md5, string]
const callback = (result) => string = result

new Thread(fn, args).run(callback)
```
<br />

# Using pools

```js
import { Thread, Pool } from 'threadman'
import md5 from 'md5'

let data

const fn = (md5, string) => md5(string)
const args = [md5, string]
const callback = (results) => data = results

const pool = new Pool()

const thread1 = new Thread(fn, args)
const thread2 = new Thread(fn, args)

pool.queue(thread1)
pool.queue(thread2)

pool.run(callback)
```
Callback returns all the results from thread runs in an array


<br />

# Catching errors

```js
new Thread(fn, args).run(runCallback).catch(catchCallback)
```


<br />

# Config

```js
import { Dispatcher } from 'threadman'

// Sets maximum parallel threads count.
// Defaults to system with 'os.cpus().length'
Dispatcher.config.threads.maxParallel = os.cpus().length

// Automatically stops the thread after returning the result.
// Defaults to 'true'.
Dispatcher.config.autoStop = true

// Enables thread logs.
// Defaults to 'false'.
Dispatcher.config.logs.enabled = false

// Sets the logger.
// Defaults to 'console'
Dispatcher.config.logs.logger = console
```

<br/>

# **Events**

<br/>

### **Subscribing to events**

<br/>

```js
const thread = new Thread(fn, args)

thread.on('start', onStartFn)
thread.on('stop', onStopFn)
thread.on('done', onDoneFn)
thread.on('error', onErrorFn)

thread.run(callback)
```

<br/>

### **Unsubscribe with**

<br/>

```js
thread.off('start', onStartFn)
thread.off('stop', onStopFn)
thread.off('done', onDoneFn)
thread.off('error', onErrorFn)
```

<br/>

### **Unsubscribe from all events**

<br/>

```js
thread.offAll()
```

<br/>

### **Documentation to be filled more soon**