const SparkPromise = import("./Spark")
export let Spark: Awaited<typeof SparkPromise>["Spark"]

const RoguePromise = import("./Rogue");
export let Rogue: Awaited<typeof RoguePromise>["Rogue"]

const ClericPromise = import("./Cleric");
export let Cleric: Awaited<typeof ClericPromise>["Cleric"]

const KnightPromise = import("./Knight");
export let Knight: Awaited<typeof KnightPromise>["Knight"]

export async function initializeTypes() {
    Spark = (await SparkPromise).Spark;
    Rogue = (await RoguePromise).Rogue;
    Cleric = (await ClericPromise).Cleric;
    Knight = (await KnightPromise).Knight;
}
