import { createClient } from "@/lib/supabase";
import {
	createResponse,
	createErrorResponse,
	getPaginationParams,
	queryWithPagination,
} from "@/lib/api-helpers";
import { validateNews } from "@/lib/validations";

export async function GET(request) {
	try {
		const useMock = process.env.USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		
		if (useMock) {
			const mockNews = [
				{
					id: "1",
					title: "National Sepaktakraw Championship 2024",
					description: "The annual national championship will be held in Mumbai from March 15-20, 2024. Teams from all states are invited to participate.",
					featured_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
					created_at: "2024-01-15T10:00:00Z"
				},
				{
					id: "2",
					title: "New Training Program Launched",
					description: "We are excited to announce a new training program for young Sepaktakraw players. The program will focus on developing fundamental skills and techniques.",
					featured_image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=400&fit=crop",
					created_at: "2024-01-10T10:00:00Z"
				},
				{
					id: "3",
					title: "International Tournament Results",
					description: "Our national team has secured second place in the Asian Sepaktakraw Championship held in Thailand. Congratulations to all players!",
					featured_image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
					created_at: "2024-01-05T10:00:00Z"
				}
			];

			const { searchParams } = new URL(request.url);
			const page = parseInt(searchParams.get("page")) || 1;
			const limit = parseInt(searchParams.get("limit")) || 12;
			const search = searchParams.get("search");

			let filteredNews = mockNews;

			// Apply search filter
			if (search) {
				filteredNews = mockNews.filter(news => 
					news.title.toLowerCase().includes(search.toLowerCase()) ||
					news.description.toLowerCase().includes(search.toLowerCase())
				);
			}

			// Apply pagination
			const startIndex = (page - 1) * limit;
			const endIndex = startIndex + limit;
			const paginatedNews = filteredNews.slice(startIndex, endIndex);

			const pagination = {
				page,
				limit,
				total: filteredNews.length,
				totalPages: Math.ceil(filteredNews.length / limit)
			};

			return Response.json(
				createResponse(
					paginatedNews,
					"News fetched successfully (mock)",
					pagination
				)
			);
		}

		const { searchParams } = new URL(request.url);
		const { page, limit } = getPaginationParams(searchParams);
		const search = searchParams.get("search");

		const supabase = createClient();

		let query = supabase
			.from("news")
			.select("*", { count: "exact" })
			.order("created_at", { ascending: false });

		// Add search functionality
		if (search) {
			query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
		}

		const result = await queryWithPagination(query, page, limit);

		return Response.json(
			createResponse(
				result.data,
				"News fetched successfully",
				result.pagination
			)
		);
	} catch (error) {
		console.error("Error fetching news:", error);
		return Response.json(createErrorResponse(error, "NEWS_FETCH_ERROR"), {
			status: 500,
		});
	}
}

export async function POST(request) {
	try {
		console.log("=== NEWS CREATE API CALLED ===");
		const contentType = request.headers.get("content-type");
		console.log("Content-Type:", contentType);

		if (contentType?.includes("multipart/form-data")) {
			// Handle file upload with form data
			const formData = await request.formData();

			const title = formData.get("title");
			const description = formData.get("description");
			const documentFile = formData.get("document");
			const imageFile = formData.get("image");

			if (!title || !description) {
				return Response.json(
					createErrorResponse(
						"Title and description are required",
						"VALIDATION_ERROR"
					),
					{ status: 400 }
				);
			}

			let documentUrl = null;
			let featuredImage = null;

			// Upload document if provided
			if (documentFile && documentFile.size > 0) {
				const docFormData = new FormData();
				docFormData.append("file", documentFile);
				docFormData.append("folder", "documents");

				const docResponse = await fetch(
					`${request.nextUrl.origin}/api/upload/documents`,
					{
						method: "POST",
						body: docFormData,
					}
				);

				const docResult = await docResponse.json();
				if (docResult.success) {
					documentUrl = docResult.data.url;
				}
			}

			// Upload image if provided
			if (imageFile && imageFile.size > 0) {
				const imgFormData = new FormData();
				imgFormData.append("file", imageFile);
				imgFormData.append("folder", "images");

				const imgResponse = await fetch(
					`${request.nextUrl.origin}/api/upload/images`,
					{
						method: "POST",
						body: imgFormData,
					}
				);

				const imgResult = await imgResponse.json();
				if (imgResult.success) {
					featuredImage = imgResult.data.url;
				}
			}

			const supabase = createClient();

			const { data, error } = await supabase
				.from("news")
				.insert([
					{
						title,
						description,
						document_url: documentUrl,
						featured_image: featuredImage,
					},
				])
				.select();

			if (error) throw error;

			return Response.json(
				createResponse(data[0], "News created successfully"),
				{ status: 201 }
			);
		} else {
			// Handle JSON data (existing functionality)
			const body = await request.json();
			console.log("Request body:", JSON.stringify(body, null, 2));

			// Validate the input
			console.log("Validating data...");
			const validatedData = validateNews.parse(body);
			console.log("Validation passed. Validated data:", JSON.stringify(validatedData, null, 2));

			const supabase = createClient();

			const { data, error } = await supabase
				.from("news")
				.insert([validatedData])
				.select();

			if (error) throw error;

			return Response.json(
				createResponse(data[0], "News created successfully"),
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error("Error creating news:", error);
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

		return Response.json(createErrorResponse(error, "NEWS_CREATE_ERROR"), {
			status: 500,
		});
	}
}
