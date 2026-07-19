type PromiseItem = { func: (...args: any[]) => Promise<any>, args: any[], resolve: any, reject: any }

export default class API {
	static current: Array<PromiseItem> = [];
	static activeCount = 0;
	static readonly MAX_CONCURRENT = 5;

	static async queue(func: (...args: any[]) => Promise<any>, ...args: any[]) {
		return new Promise((resolve, reject) => {
			API.current.push({ func, args: [args], resolve, reject });
			API.dequeue();
		})
	}

	static dequeue() {
		while (API.activeCount < API.MAX_CONCURRENT) {
			const item = API.current.shift();
			if (!item) break;

			try {
				API.activeCount++;
				item.func(...item.args)
					.then((result) => {
						API.handlePromise(item, true, result);
					}).catch((error) => {
						API.handlePromise(item, false, error);
					});
			} catch (error) {
				API.handlePromise(item, false, error);
			}
		}
	}

	static handlePromise(item: PromiseItem, resolve: boolean = false, value: any) {
		API.activeCount--;
		if (resolve) {
			item.resolve(value);
		} else {
			item.reject(value);
		}

		API.dequeue();
	}
}
