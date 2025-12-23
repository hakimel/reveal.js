const { getAdmin, ok, bad, deny, err, requireHost } = require("./_common");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return ok({ ok: true });
  if (event.httpMethod !== "POST")    return bad({ error: "POST only" });
  if (!requireHost(event))            return deny({ error: "Forbidden" });

  try {
    const { pollId, question, options, multiMax = 1, state = "open" } = JSON.parse(event.body || "{}");
    if (!pollId || !question || !Array.isArray(options) || options.length < 2) {
      return bad({ error: "pollId, question, options[>=2] required" });
    }
    const mm = Math.max(1, Math.min(multiMax, options.length));

    const admin = getAdmin();
    const db = admin.database();
    const rootRef = db.ref(`polls/${pollId}`);
    const snap = await rootRef.get();

    let newVersion = 1;
    if (snap.exists()) {
      const versions = Object.keys(snap.child("versions").val() || {}).map(Number);
      newVersion = versions.length ? Math.max(...versions) + 1 : 1;
    }

    const vRef = rootRef.child(`versions/${newVersion}`);
    await vRef.set({
      question,
      options,
      multiMax: mm,
      state, // usually "open" at publish
      createdAt: Date.now(),
      publishedAt: Date.now(),
      counts: new Array(options.length).fill(0),
    });

    await rootRef.child("activeVersion").set(newVersion);

    return ok({ ok: true, version: newVersion });
  } catch (e) {
    return err(e);
  }
};

