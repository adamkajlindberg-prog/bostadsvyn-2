import { getDbClient, riksbankSwestrPublishedIndex } from "../../../../../../packages/db";
import { desc } from "drizzle-orm";

const getCompoundedAverage = async () => {
    const db = getDbClient();

    const data = await db
        .select({
            value: riksbankSwestrPublishedIndex.value,
            date: riksbankSwestrPublishedIndex.date,
            publicationTime: riksbankSwestrPublishedIndex.publicationTime,
            republication: riksbankSwestrPublishedIndex.republication,
        })
        .from(riksbankSwestrPublishedIndex)
        .orderBy(desc(riksbankSwestrPublishedIndex.date))
        .limit(50);

    return data;
};

export default getCompoundedAverage;