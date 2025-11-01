export const onRequest: PagesFunction = async (ctx) => {
  const env = ctx.env as any; // CF 於 build/執行環境注入
  const body = {
    commit: env.CF_PAGES_COMMIT_SHA || "unknown",
    branch: env.CF_PAGES_BRANCH || "unknown",
    url: env.CF_PAGES_URL || "unknown",
    when: new Date().toISOString(),
    source: "cloudflare-pages"
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" }
  });
};
