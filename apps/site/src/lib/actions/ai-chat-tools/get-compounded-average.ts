import { getDbClient, riksbankSwestrCompoundedAverage } from "../../../../../../packages/db";
import { desc } from "drizzle-orm";

const getCompoundedAverage = async () => {
    const db = getDbClient();

    const data = await db
        .select({
            rate: riksbankSwestrCompoundedAverage.rate,
            date: riksbankSwestrCompoundedAverage.date,
            startDate: riksbankSwestrCompoundedAverage.startDate,
            publicationTime: riksbankSwestrCompoundedAverage.publicationTime,
            republication: riksbankSwestrCompoundedAverage.republication,
        })
        .from(riksbankSwestrCompoundedAverage)
        .orderBy(desc(riksbankSwestrCompoundedAverage.date))
        .limit(50);

    return data;
};

export default getCompoundedAverage;