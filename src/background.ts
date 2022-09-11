import { ThreadEvents } from './interfaces.js'

class Background {
	events: ThreadEvents = {
		start: [],
		stop: [],
		done: [],
		error: []
	}

	on(event: keyof ThreadEvents, fn: Function) {
		this.events[event].push(fn)
	}

	off(event: keyof ThreadEvents, fn: Function) {
		const index = this.events[event].indexOf(fn)
		if (index !== -1) this.events[event].splice(index, 1)
	}

	offAll() {
		this.events.start = []
		this.events.stop = []
		this.events.done = []
		this.events.error = []
	}

	fire(event?: string, ...args: unknown[]) {
		this.events[event as keyof ThreadEvents].forEach((fn) => fn(...args))
	}
}

export { Background }
