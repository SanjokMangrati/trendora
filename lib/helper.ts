export async function handleFetchResponse(response: Response) {
	try {
		if (!response.ok) {
			let errorMessage = "An error occurred";
			try {
				const errorData = await response.json();
				errorMessage = errorData?.error || errorData?.message || errorMessage;
			} catch (jsonError) {
				errorMessage = response.statusText || errorMessage;
			}
			throw new Error(errorMessage);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Fetch error: ${error.message}`);
			throw error;
		} else {
			throw new Error("An unknown error occurred");
		}
	}
}
