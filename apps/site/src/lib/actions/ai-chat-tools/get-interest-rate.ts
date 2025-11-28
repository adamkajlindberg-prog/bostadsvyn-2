import { getDbClient, riksbankSwestrInterestRate } from "../../../../../../packages/db";
import { desc } from "drizzle-orm";

const getInterestRate = async () => {
    const db = getDbClient();

    const data = await db
        .select({
            rate: riksbankSwestrInterestRate.rate,
            date: riksbankSwestrInterestRate.date,
            pctl125: riksbankSwestrInterestRate.pctl125,
            pctl875: riksbankSwestrInterestRate.pctl875,
            volume: riksbankSwestrInterestRate.volume,
            alternativeCalculation: riksbankSwestrInterestRate.alternativeCalculation,
            alternativeCalculationReason: riksbankSwestrInterestRate.alternativeCalculationReason,
            publicationTime: riksbankSwestrInterestRate.publicationTime,
            republication: riksbankSwestrInterestRate.republication,
            numberOfTransactions: riksbankSwestrInterestRate.numberOfTransactions,
            numberOfAgents: riksbankSwestrInterestRate.numberOfAgents,
        })
        .from(riksbankSwestrInterestRate)
        .orderBy(desc(riksbankSwestrInterestRate.date))
        .limit(50);

    return data;
};

export default getInterestRate;