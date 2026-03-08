export function logServerEvent(event: string, payload: Record<string, unknown>) {
  const body = JSON.stringify({
    level: "info",
    event,
    timestamp: new Date().toISOString(),
    ...payload
  });

  console.info(body);

  const webhookUrl = process.env.OBSERVABILITY_WEBHOOK_URL;
  if (webhookUrl) {
    void fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    }).catch(() => undefined);
  }
}
