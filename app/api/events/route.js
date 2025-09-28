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
		const useMock = process.env.USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		
		if (useMock) {
			const mockEvents = [
				{
					id: "1",
					title: "State Level Championship",
					description: "Annual state level Sepaktakraw championship for all age groups",
					event_date: "2024-03-15",
					location: "Mumbai Sports Complex",
					photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"],
					created_at: "2024-01-15T10:00:00Z"
				},
				{
					id: "2",
					title: "Training Workshop",
					description: "Technical training workshop for coaches and referees",
					event_date: "2024-04-10",
					location: "Delhi Sports Academy",
					photos: ["https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop"],
					created_at: "2024-01-10T10:00:00Z"
				},
				{
					id: "3",
					title: "Youth Development Program",
					description: "Special program for young players aged 12-18",
					event_date: "2024-05-20",
					location: "Bangalore Sports Center",
					photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"],
					created_at: "2024-01-05T10:00:00Z"
				}
			];

			const { searchParams } = new URL(request.url);
			const page = parseInt(searchParams.get("page")) || 1;
			const limit = parseInt(searchParams.get("limit")) || 12;
			const search = searchParams.get("search");
			const upcoming = searchParams.get("upcoming");

			let filteredEvents = mockEvents;

			// Apply search filter
			if (search) {
				filteredEvents = mockEvents.filter(event => 
					event.title.toLowerCase().includes(search.toLowerCase()) ||
					event.description.toLowerCase().includes(search.toLowerCase()) ||
					event.location.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply upcoming filter
			if (upcoming === "true") {
				const today = new Date().toISOString().split("T")[0];
				filteredEvents = filteredEvents.filter(event => event.event_date >= today);
			}

			// Apply pagination
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

			const pagination = {
				page,
				limit,
				total: filteredEvents.length,
				totalPages: Math.ceil(filteredEvents.length / limit)
			};

			return Response.json(
				createResponse(
					paginatedEvents,
					"Events fetched successfully (mock)",
					pagination
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
