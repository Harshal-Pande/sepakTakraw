import { createClient } from "@/lib/supabase";
import {
	createResponse,
	createErrorResponse,
	getPaginationParams,
	queryWithPagination,
} from "@/lib/api-helpers";
import { validateResults } from "@/lib/validations";

export async function GET(request) {
	try {
		if (process.env.USE_MOCK_DATA === "true") {
			const mock = {
				items: [
					{
						id: "r1",
						title: "Super Cup Final",
						description: "Team A 2 - 1 Team B",
						created_at: new Date().toISOString(),
						year: new Date().getFullYear(),
					},
					{
						id: "r2",
						title: "League Matchday 10",
						description: "Team C 0 - 0 Team D",
						created_at: new Date().toISOString(),
						year: new Date().getFullYear(),
					},
				],
				pagination: { page: 1, limit: 12, total: 2 },
			};
			return Response.json(
				createResponse(
					mock.items,
					"Results fetched successfully (mock)",
					mock.pagination
				)
			);
		}

		const { searchParams } = new URL(request.url);
		const { page, limit } = getPaginationParams(searchParams);
		const search = searchParams.get("search");
		const year = searchParams.get("year");

		const supabase = createClient();

		let query = supabase
			.from("results")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false });

		// Add search functionality
		if (search) {
			query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
		}

		// Filter by year
		if (year) {
			const startDate = `${year}-01-01`;
			const endDate = `${year}-12-31`;
			query = query.gte("created_at", startDate).lte("created_at", endDate);
		}

		const result = await queryWithPagination(query, page, limit);

		return Response.json(
			createResponse(
				result.data,
				"Results fetched successfully",
				result.pagination
			)
		);
	} catch (error) {
		console.error("Error fetching results:", error);
		return Response.json(createErrorResponse(error, "RESULTS_FETCH_ERROR"), {
			status: 500,
		});
	}
}

export async function POST(request) {
	try {
		console.log("=== RESULTS CREATE API CALLED ===");
		const body = await request.json();
		console.log("Request body:", JSON.stringify(body, null, 2));

		// Validate the input
		console.log("Validating data...");
		const validatedData = validateResults.parse(body);
		console.log("Validation passed. Validated data:", JSON.stringify(validatedData, null, 2));

		const supabase = createClient();

		const { data, error } = await supabase
			.from("results")
			.insert([validatedData])
			.select();

		if (error) throw error;

		return Response.json(
			createResponse(data[0], "Result created successfully"),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating result:", error);
		console.error("Error details:", {
			name: error.name,
			message: error.message,
			errors: error.errors || 'No errors array'
		});

		if (error.name === "ZodError") {
			console.log("Zod validation errors:", error.errors);
			return Response.json(
				createErrorResponse(
					"Validation error: " + error.errors.map((e) => e.message).join(", "),
					"VALIDATION_ERROR"
				),
				{ status: 400 }
			);
		}

		return Response.json(createErrorResponse(error, "RESULT_CREATE_ERROR"), {
			status: 500,
		});
	}
}
