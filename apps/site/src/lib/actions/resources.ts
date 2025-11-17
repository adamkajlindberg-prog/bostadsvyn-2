"use server";

import {
	embeddings,
	getDbClient,
	insertResourceSchema,
	type NewResourceParams,
	resources,
} from "../../../../../packages/db";
import { generateEmbeddings } from "@/lib/ai/embedding";

export const createResource = async (input: NewResourceParams) => {
	try {
		const db = getDbClient();

		const { content } = insertResourceSchema.parse(input);

		const [resource] = await db
			.insert(resources)
			.values({ content })
			.returning();

		const embeddingQuery = await generateEmbeddings(content);
		await db.insert(embeddings).values(
			embeddingQuery.map((embedding) => ({
				resourceId: resource?.id,
				...embedding,
			})),
		);

		return "Resource successfully created and embedded.";
	} catch (error) {
		return error instanceof Error && error.message.length > 0
			? error.message
			: "Error, please try again.";
	}
};
