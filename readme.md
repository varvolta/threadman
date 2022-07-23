```
 _   _                        _
| | | |                      | |
| |_| |__  _ __ ___  __ _  __| |_ __ ___   __ _ _ __
| __| '_ \| '__/ _ \/ _` |/ _` | '_ ` _ \ / _` | '_ \
| |_| | | | | |  __/ (_| | (_| | | | | | | (_| | | | |
 \__|_| |_|_|  \___|\__,_|\__,_|_| |_| |_|\__,_|_| |_|
 ```

<br />
<br />

# **Worker threads made easy.**

<br />

Create and execute tasks in real cpu threads other than the main one. (ES5 imports for now)
Threadman doesn't use any dependencies. It's based on workers.

<br />

# Installation
```
npm i threadman
```


<br />

# Syntax

```js
new Thread(fn, args, options).run().then(callback)

// Or

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
// Or a callback function can be passed as third argument like below
new Thread(fn, args).run().then(callback)

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
```

# **Events**

Subscribing to events

```js
const thread = new Thread(fn, args)

thread.on('start', onStartFn)
thread.on('stop', onStopFn)
thread.on('done', onDoneFn)
thread.on('error', onErrorFn)

thread.run().then(callback)
// Or
thread.run(callback)
```

Unsubscribe with

```js
thread.off('start', onStartFn)
thread.off('stop', onStopFn)
thread.off('done', onDoneFn)
thread.off('error', onErrorFn)
```

Unsubscribe from all events

```js
thread.offAll()
```

# **Documentation to be filled more soon**