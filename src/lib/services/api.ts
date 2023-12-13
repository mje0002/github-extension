type PromiseItem = { func: (...args: any[]) => Promise<any>, args: any[], resolve: any, reject: any }

export default class API {
	static current: Array<PromiseItem> = [];
	static pending = false;

	static async queue(func: (...args: any[]) => Promise<any>, ...args: any[]) {
		return new Promise((resolve, reject) => {
			API.current.push({ func, args: [args], resolve, reject });
			API.dequeue();
		})
	}

	static dequeue() {
		if (API.pending) {
			return false;
		}

		const item = API.current.shift();

		if (!item) {
			return false;
		}
		try {
			API.pending = true;
			item.func(...item.args)
				.then((result) => {
					API.handlePromise(item, true, result);
				}).catch((error) => {
					API.handlePromise(item, false, error);
				});
		} catch (error) {
			API.handlePromise(item, false, error);
		}


		return true;
	}

	static handlePromise(item: PromiseItem, resolve: boolean = false, value: any) {
		API.pending = false;
		if (resolve) {
			item.resolve(value);
		} else {
			item.reject(value);
		}

		API.dequeue();
	}
}
