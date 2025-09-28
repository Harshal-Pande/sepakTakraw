import { createResponse, createErrorResponse } from "@/lib/api-helpers";
import { createClient } from "@/lib/supabase";

export async function GET(request) {
	try {
		const useMock =
			process.env.USE_MOCK_DATA === "true" ||
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (useMock) {
			const data = [
				{
					id: "events",
					icon: "Calendar",
					value: "12",
					label: "Events",
					color: "text-blue-600",
					bg_color: "bg-blue-100",
				},
				{
					id: "members",
					icon: "Users",
					value: "48",
					label: "Members",
					color: "text-emerald-600",
					bg_color: "bg-emerald-100",
				},
				{
					id: "news",
					icon: "Newspaper",
					value: "23",
					label: "News Articles",
					color: "text-violet-600",
					bg_color: "bg-violet-100",
				},
				{
					id: "results",
					icon: "Trophy",
					value: "9",
					label: "Results",
					color: "text-amber-600",
					bg_color: "bg-amber-100",
				},
			];
			return Response.json(
				createResponse(data, "Stats retrieved successfully (mock)")
			);
		}

		const supabase = createClient();

		// Helper to count rows efficiently
		const countRows = async (table) => {
			const { count, error } = await supabase
				.from(table)
				.select("*", { count: "exact", head: true });
			if (error) throw error;
			return count || 0;
		};

		// Run counts in parallel
		const [eventsCount, membersCount, newsCount, resultsCount] =
			await Promise.all([
				countRows("events"),
				countRows("general_body"),
				countRows("news"),
				countRows("results"),
			]);

		const data = [
			{
				id: "events",
				icon: "Calendar",
				value: String(eventsCount),
				label: "Events",
				color: "text-blue-600",
				bg_color: "bg-blue-100",
			},
			{
				id: "members",
				icon: "Users",
				value: String(membersCount),
				label: "Members",
				color: "text-emerald-600",
				bg_color: "bg-emerald-100",
			},
			{
				id: "news",
				icon: "Newspaper",
				value: String(newsCount),
				label: "News Articles",
				color: "text-violet-600",
				bg_color: "bg-violet-100",
			},
			{
				id: "results",
				icon: "Trophy",
				value: String(resultsCount),
				label: "Results",
				color: "text-amber-600",
				bg_color: "bg-amber-100",
			},
		];

		return Response.json(createResponse(data, "Stats retrieved successfully"));
	} catch (error) {
		console.error("Stats fetch error:", error);
		return Response.json(createErrorResponse(error, "STATS_FETCH_ERROR"), {
			status: 500,
		});
	}
}
