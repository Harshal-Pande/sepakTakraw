import { createClient } from "@/lib/supabase";
import {
	createResponse,
	createErrorResponse,
	getPaginationParams,
	queryWithPagination,
} from "@/lib/api-helpers";
import { validateEvents } from "@/lib/validations";

export async function GET(request) {
	try {
		if (process.env.USE_MOCK_DATA === "true") {
			const mock = {
				items: [
					{
						id: "e1",
						title: "National Championship",
						description: "Delhi Indoor Stadium",
						location: "New Delhi",
						event_date: new Date(Date.now() + 86400000)
							.toISOString()
							.split("T")[0],
					},
					{
						id: "e2",
						title: "Intercontinental Cup",
						description: "Opening ceremony & fixtures",
						location: "Mumbai",
						event_date: new Date().toISOString().split("T")[0],
					},
				],
				pagination: { page: 1, limit: 6, total: 2 },
			};
			return Response.json(
				createResponse(
					mock.items,
					"Events fetched successfully (mock)",
					mock.pagination
				)
			);
		}

		const { searchParams } = new URL(request.url);
		const { page, limit } = getPaginationParams(searchParams);
		const search = searchParams.get("search");
		const upcoming = searchParams.get("upcoming");

		const supabase = createClient();

		let query = supabase
			.from("events")
			.select("*", { count: "exact" })
			.order("event_date", { ascending: false });

		// Add search functionality
		if (search) {
			query = query.or(
				`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
			);
		}

		// Filter for upcoming events
		if (upcoming === "true") {
			const today = new Date().toISOString().split("T")[0];
			query = query.gte("event_date", today);
		}

		const result = await queryWithPagination(query, page, limit);

		return Response.json(
			createResponse(
				result.data,
				"Events fetched successfully",
				result.pagination
			)
		);
	} catch (error) {
		console.error("Error fetching events:", error);
		return Response.json(createErrorResponse(error, "EVENTS_FETCH_ERROR"), {
			status: 500,
		});
	}
}

export async function POST(request) {
	try {
		const body = await request.json();

		// Validate the input
		const validatedData = validateEvents.parse(body);

		const supabase = createClient();

		const { data, error } = await supabase
			.from("events")
			.insert([validatedData])
			.select();

		if (error) throw error;

		return Response.json(
			createResponse(data[0], "Event created successfully"),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating event:", error);

		if (error.name === "ZodError") {
			return Response.json(
				createErrorResponse(
					"Validation error: " + error.errors.map((e) => e.message).join(", "),
					"VALIDATION_ERROR"
				),
				{ status: 400 }
			);
		}

		return Response.json(createErrorResponse(error, "EVENT_CREATE_ERROR"), {
			status: 500,
		});
	}
}
