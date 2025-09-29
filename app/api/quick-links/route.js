import { createResponse, createErrorResponse } from "@/lib/api-helpers";
import { createClient } from "@/lib/supabase";

// Hardcoded quick links data since quick_links table doesn't exist in the schema
const QUICK_LINKS_DATA = [
	{
		id: "1",
		title: "Latest News",
		description: "Stay updated with the latest news and announcements",
		href: "/news",
		icon: "Newspaper",
		color: "text-blue-600",
		bg_color: "bg-blue-100",
		order_index: 1,
		is_active: true,
	},
	{
		id: "2",
		title: "Upcoming Events",
		description: "Check out upcoming tournaments and events",
		href: "/events",
		icon: "Calendar",
		color: "text-green-600",
		bg_color: "bg-green-100",
		order_index: 2,
		is_active: true,
	},
	{
		id: "3",
		title: "Results",
		description: "View competition results and standings",
		href: "/results",
		icon: "Trophy",
		color: "text-yellow-600",
		bg_color: "bg-yellow-100",
		order_index: 3,
		is_active: true,
	},
	{
		id: "4",
		title: "General Body",
		description: "Meet our leadership and management team",
		href: "/general-body",
		icon: "Users",
		color: "text-purple-600",
		bg_color: "bg-purple-100",
		order_index: 4,
		is_active: true,
	},
	{
		id: "5",
		title: "History",
		description: "Learn about our federation's journey",
		href: "/history",
		icon: "BookOpen",
		color: "text-indigo-600",
		bg_color: "bg-indigo-100",
		order_index: 5,
		is_active: true,
	},
	{
		id: "6",
		title: "Contact Us",
		description: "Get in touch with our team",
		href: "/contact",
		icon: "Phone",
		color: "text-red-600",
		bg_color: "bg-red-100",
		order_index: 6,
		is_active: true,
	},
];

export async function GET(request) {
	try {
		const useMock =
			process.env.USE_MOCK_DATA === "true" ||
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (useMock) {
			const links = [...QUICK_LINKS_DATA].sort(
				(a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
			);
			return Response.json(
				createResponse(links, "Quick links retrieved successfully (mock)")
			);
		}

		const supabase = createClient();

		// Prefer system_settings JSON configuration if present
		const { data: settingsRow, error: settingsError } = await supabase
			.from("system_settings")
			.select("value")
			.eq("key", "quick_links")
			.single();

		if (settingsError && settingsError.code !== "PGRST116") {
			// Ignore row-not-found; otherwise throw
			throw settingsError;
		}

		let links = Array.isArray(settingsRow?.value) ? settingsRow.value : null;

		// Fallback to previous in-memory defaults when not configured
		if (!links) {
			links = QUICK_LINKS_DATA;
		}

		// Sort by order_index when present
		links.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

		return Response.json(
			createResponse(links, "Quick links retrieved successfully")
		);
	} catch (error) {
		console.error("Quick links fetch error:", error);
		return Response.json(
			createErrorResponse(error, "QUICK_LINKS_FETCH_ERROR"),
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const body = await request.json();

		// Validate required fields
		const requiredFields = [
			"title",
			"description",
			"href",
			"icon",
			"color",
			"bg_color",
		];
		for (const field of requiredFields) {
			if (!body[field]) {
				return Response.json(
					createErrorResponse(
						`Missing required field: ${field}`,
						"VALIDATION_ERROR"
					),
					{ status: 400 }
				);
			}
		}

		const supabase = createClient();

		const { data, error } = await supabase
			.from("quick_links")
			.insert([
				{
					title: body.title,
					description: body.description,
					href: body.href,
					icon: body.icon,
					color: body.color,
					bg_color: body.bg_color,
					order_index: body.order_index || 0,
					is_active: body.is_active !== undefined ? body.is_active : true,
				},
			])
			.select()
			.single();

		if (error) {
			throw error;
		}

		return Response.json(
			createResponse(data, "Quick link created successfully"),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Quick links creation error:", error);
		return Response.json(
			createErrorResponse(error, "QUICK_LINKS_CREATE_ERROR"),
			{ status: 500 }
		);
	}
}
