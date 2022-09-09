import { Thread } from './thread.js'
import { Background } from './background.js'

class Pool extends Background {
	threads: Thread[] = []
	results = 0

	constructor(threads: Thread[] = []) {
		super()
		this.threads = threads
	}

	add(thread: Thread) {
		this.threads.push(thread)
	}

	done() {
		this.results -= 1
		if (this.results === 0) this.fire('done', [])
	}

	run(callback: Function) {
		this.results = this.threads.length
		for (let i = 0; i < this.threads.length; i++) {
			const thread = this.threads[i]
			thread.run((args: unknown[]) => {
				callback(args)
				this.done()
			})
		}
	}
}

export { Pool }
