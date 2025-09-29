const { getAdmin, ok, bad, err } = require("./_common");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return ok({ ok: true });
  if (event.httpMethod !== "POST")    return bad({ error: "POST only" });

  try {
    const { pollId, choices, anonId } = JSON.parse(event.body || "{}");
    if (!pollId || !Array.isArray(choices)) return bad({ error: "Missing pollId or choices[]" });
    if (!anonId || typeof anonId !== "string") return bad({ error: "Missing anonId" });

    const admin = getAdmin();
    const db = admin.database();

    // Load active version + metadata
    const rootRef = db.ref(`polls/${pollId}`);
    const activeVersion = (await rootRef.child("activeVersion").get()).val();
    if (!activeVersion) return bad({ error: "No active version" });

    const vRef = rootRef.child(`versions/${activeVersion}`);
    const metaSnap = await vRef.get();
    const meta = metaSnap.val();
    if (!meta || meta.state !== "open") return bad({ error: "Poll not open" });

    const options = meta.options || [];
    const multiMax = Math.max(1, meta.multiMax || 1);

    if (choices.length === 0) return bad({ error: "Empty choices" });
    if (choices.length > multiMax) return bad({ error: "Too many choices" });
    for (const i of choices) {
      if (!Number.isInteger(i) || i < 0 || i >= options.length) return bad({ error: "Invalid option index" });
    }

    // Overwrite vote: compute delta vs previous
    const voteRef = vRef.child(`votes/${anonId}`);
    const countsRef = vRef.child("counts");
    const prev = (await voteRef.get()).val();
    const prevChoices = Array.isArray(prev?.choices) ? prev.choices : [];

    const delta = new Array(options.length).fill(0);
    for (const i of prevChoices) delta[i] -= 1;
    for (const i of choices)     delta[i] += 1;

    // Atomic counts update
    await countsRef.transaction((counts) => {
      counts = Array.isArray(counts) ? counts.slice() : new Array(options.length).fill(0);
      if (counts.length !== options.length) counts = new Array(options.length).fill(0);
      delta.forEach((d, i) => { counts[i] = Math.max(0, (counts[i] || 0) + d); });
      return counts;
    });

    await voteRef.set({ choices, ts: Date.now() });

    return ok({ ok: true, version: activeVersion });
  } catch (e) {
    return err(e);
  }
};

