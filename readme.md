```
 _   _                        _
| | | |                      | |
| |_| |__  _ __ ___  __ _  __| |_ __ ___   __ _ _ __
| __| '_ \| '__/ _ \/ _` |/ _` | '_ ` _ \ / _` | '_ \
| |_| | | | | |  __/ (_| | (_| | | | | | | (_| | | | |
 \__|_| |_|_|  \___|\__,_|\__,_|_| |_| |_|\__,_|_| |_|
 ```

<br />

## **Still in early stages of development. Email me any suggestions you have on varvolta@gmail.com**

<br />

# **Worker threads made easy.**

<br />

Create and execute tasks in real cpu threads other than the main one. (ES6 imports for now)

Threadman doesn't use any dependencies. It's based on workers.

<br />

# Installation
```
npm i threadman
```


<br />

# Syntax

```js
new Thread(fn, args, options).run(callback)
```

<br />

# Basic usage

```js
import { Thread }     from 'threadman'

let number = 10

const fn = (number) => number + 20
const callback = (result) => number = result
const args = [number]

new Thread(fn, args).run(callback)
```

After you get the result you can access main scope again and reassign variables.

<br />

# Config

```js
import { Dispatcher } from 'threadman'

// Automatically stops the thread after returning the result.
// Defaults to 'true'.
Dispatcher.config.autoStop = true

// Enables thread logs.
// Defaults to 'false'.
Dispatcher.config.logs.enabled = false

// Sets the logger.
// Defaults to 'console'
Dispatcher.config.logs.logger = console

// Sets maximum parallel threads count.
// Defaults to system
Dispatcher.config.threads.maxParallel = os.cpus().length
```

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

```js
thread.offAll()
```

## **Documentation to be filled more soon**