const { getAdmin, ok, bad, deny, err, requireHost } = require("./_common");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return ok({ ok: true });
  if (event.httpMethod !== "POST")    return bad({ error: "POST only" });
  if (!requireHost(event))            return deny({ error: "Forbidden" });

  try {
    const { pollId } = JSON.parse(event.body || "{}");
    if (!pollId) return bad({ error: "pollId required" });

    const admin = getAdmin();
    const db = admin.database();
    const rootRef = db.ref(`polls/${pollId}`);
    const activeVersion = (await rootRef.child("activeVersion").get()).val();
    if (!activeVersion) return bad({ error: "No active version" });

    const vRef = rootRef.child(`versions/${activeVersion}`);
    const meta = (await vRef.get()).val();
    if (!meta) return bad({ error: "Version missing" });

    await vRef.child("counts").set(new Array((meta.options || []).length).fill(0));
    await vRef.child("votes").remove();

    return ok({ ok: true, version: activeVersion, reset: true });
  } catch (e) {
    return err(e);
  }
};
