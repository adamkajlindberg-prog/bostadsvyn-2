import { getDbClient, type Property, properties, propertyEmbeddings } from "db";
import { generateEmbeddings } from "@/lib/ai/embedding";

const buildEmbeddingInput = (property: Property) => {
  return [
    property.title,
    property.description,
    property.propertyType,
    property.status,
    property.price && `Pris ${property.price} kr`,
    property.addressCity,
    property.livingArea && `${property.livingArea} kvm`,
    property.plotArea && `Tomtarea ${property.plotArea} kvm`,
    property.rooms && `${property.rooms} rum`,
    property.bedrooms && `${property.bedrooms} sovrum`,
    property.bathrooms && `${property.bathrooms} badrum`,
    property.features?.join(", "),
    property.energyClass && `Energiklass ${property.energyClass}`,
    property.monthlyFee && `Månadsavgift ${property.monthlyFee} kr`,
    property.yearBuilt && `Byggår ${property.yearBuilt}`,
  ]
    .filter(Boolean)
    .join(". ");
};

const generatePropertyEmbeddings = async () => {
  try {
    const db = getDbClient();

    const data = await db.select().from(properties);
    console.log(`Generating embeddings for ${data.length} properties...`);

    for (const property of data) {
      const input = buildEmbeddingInput(property);
      const embeddingQuery = await generateEmbeddings(input);

      await db
        .insert(propertyEmbeddings)
        .values({
          propertyId: property.id,
          embedding: embeddingQuery?.[0]?.embedding ?? [],
        })
        .onConflictDoUpdate({
          target: propertyEmbeddings.propertyId,
          set: {
            embedding: embeddingQuery?.[0]?.embedding ?? [],
            updatedAt: new Date(),
            deletedAt: null,
          },
        });

      console.log(`Embedded property ${property.title}`);
    }

    console.log("SUCCESS! Property embeddings generated.");
  } catch (error) {
    console.error("Fetching properties failed. Error:", error);
  }
};

generatePropertyEmbeddings();
