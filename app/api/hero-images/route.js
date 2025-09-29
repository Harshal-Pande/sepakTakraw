import { createClient } from "@/lib/supabase";
import { createResponse, createErrorResponse } from "@/lib/api-helpers";

export async function GET() {
	try {
		const useMock =
			process.env.USE_MOCK_DATA === "true" ||
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (useMock) {
			const data = [
				{
					id: "1",
					image_url:
						"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
					alt_text: "Sepaktakraw players in action",
					is_active: true,
				},
				{
					id: "2",
					image_url:
						"https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=600&fit=crop",
					alt_text: "Sepaktakraw tournament",
					is_active: true,
				},
				{
					id: "3",
					image_url:
						"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
					alt_text: "Sepaktakraw championship",
					is_active: true,
				},
			];
			return Response.json(createResponse(data, "Hero images fetched (mock)"));
		}

		const supabase = createClient();

		const { data, error } = await supabase
			.from("hero_images")
			.select("*")
			.eq("is_active", true)
			.order("created_at", { ascending: false });

		if (error) throw error;

		return Response.json(createResponse(data));
	} catch (error) {
		console.error("Error fetching hero images:", error);
		return Response.json(
			createErrorResponse(error, "HERO_IMAGES_FETCH_ERROR"),
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const body = await request.json();
		const { image_url, alt_text, is_active = true } = body;

		if (!image_url || !alt_text) {
			return Response.json(
				createErrorResponse(
					"Image URL and alt text are required",
					"VALIDATION_ERROR"
				),
				{ status: 400 }
			);
		}

		const supabase = createClient();

		const { data, error } = await supabase
			.from("hero_images")
			.insert([
				{
					image_url,
					alt_text,
					is_active,
				},
			])
			.select();

		if (error) throw error;

		return Response.json(
			createResponse(data[0], "Hero image created successfully"),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating hero image:", error);
		return Response.json(
			createErrorResponse(error, "HERO_IMAGE_CREATE_ERROR"),
			{ status: 500 }
		);
	}
}
