import { handleFetchResponse } from "@/lib/helper";
import { API_URL } from "@/lib/utils";

export async function fetchCustomers() {
	try {
		const response = await fetch(`${API_URL}/admin/customers`, {
			method: "GET",
			credentials: "include",
		});

		return handleFetchResponse(response);
	} catch (error: any) {
		throw new Error(error.message || "Failed to fetch customers");
	}
}
