# **Real threads made easy.**

<br />

Create and execute tasks in real cpu threads other than the main one.

<br />

# Installation
```
npm i threadman
```


<br />

# Syntax

```js
new Thread(fn, [...passedVariables]).then(result)
```

<br />

# Basic usage

```js
import { Thread }     from 'threadman'

let number = 10

new Thread(number => {
    return number + 20
}, [number]).run().then(result => {
    number = result
})
```
After you get the result you can access main scope again and reassign variables. (ES5 imports for now)

<br />

# Config

```js
import { Dispatcher } from 'treadman'

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

# **Documentation to be filled more soon**