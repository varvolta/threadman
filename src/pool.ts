import { Thread } from './thread.js'
import { Background } from './background.js'

class Pool extends Background {
	threads: Thread[] = []
	count = 0
	args: any[] = []

	constructor(threads: Thread[] = []) {
		super()
		this.threads = threads
	}

	add(thread: Thread) {
		this.threads.push(thread)
	}

	done() {
		this.count -= 1
		if (this.count === 0) {
			this.args.sort
			this.fire('done', this.args.sort((a, b) => a - b).map(item => item.result))
		}
	}

	run(callback: Function) {
		this.count = this.threads.length
		for (let i = 0; i < this.threads.length; i++) {
			const thread = this.threads[i]
			thread.run((result: unknown[]) => {
				this.args.push({id: thread.id, result})
				this.done()
			})
		}
	}
}

export { Pool }
