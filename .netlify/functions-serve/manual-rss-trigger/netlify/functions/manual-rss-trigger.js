// netlify/functions/manual-rss-trigger.js
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    console.log("Manual RSS trigger activated at:", (/* @__PURE__ */ new Date()).toISOString());
    const response = await fetch(`${process.env.URL}/.netlify/functions/rss-processor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Manual RSS processing completed successfully:", result);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Manual RSS trigger executed successfully",
          result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    } else {
      console.error("Manual RSS processing failed:", result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Manual RSS trigger execution failed",
          error: result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    }
  } catch (error) {
    console.error("Manual RSS trigger error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Manual RSS trigger execution failed",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    };
  }
};
//# sourceMappingURL=manual-rss-trigger.js.map
