# **Real threads made easy.**

<br />

Create and execute tasks in real cpu threads other than main one.

<br />

# Installation
```
npm i threadman
```

<br />

# Usage

```
import { Thread } from 'threadman'

let number = 10

new Thread(number => {
    return number + 20
}, [number]).then(result => {
    number = result
})
```
After you get the result you can access main scope again and reassign variables.

<br />

# **Documentation to be filled soon**