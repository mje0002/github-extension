import { useEffect, useState } from "react"

export default function useFetch<T>(action: RequestInfo | URL | ((...args: any) => Promise<any>), opts: RequestInit | undefined, ...actionArgs: any) {
	const [response, setResponse] = useState<T | null>(null)
	const [loading, setLoading] = useState(false)
	const [hasError, setHasError] = useState<{ message: string } | null>(null)
	useEffect(() => {
		setLoading(true)
		if (typeof action === 'function') {
			action(...actionArgs)
				.then((res: T) => {
					if (res) {
						const response = res;
						setResponse(response);
					}
					setLoading(false);
				})
				.catch((e) => {
					console.log(e);
					if (e instanceof Error) {
						setHasError({ message: e.message });
					}
					setLoading(false);
				})
		} else {
			fetch(action, opts)
				.then((res: Response) => {
					if (res.ok) {
						const response = res.json() as T;
						setResponse(response);
					} else {
						setHasError({ message: res.statusText });
					}
					setLoading(false);
				})
				.catch((e) => {
					console.log(e);
					if (e instanceof Error) {
						setHasError({ message: e.message });
					}
					setLoading(false);
				})
		}
	}, [action]);

	return [response, loading, hasError] as const
}