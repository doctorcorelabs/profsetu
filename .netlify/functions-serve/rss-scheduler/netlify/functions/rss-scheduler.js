// netlify/functions/rss-scheduler.js
exports.handler = async (event, context) => {
  try {
    console.log("RSS Scheduler triggered at:", (/* @__PURE__ */ new Date()).toISOString());
    const response = await fetch(`${process.env.URL}/.netlify/functions/rss-processor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    if (response.ok) {
      console.log("RSS processing completed successfully:", result);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "RSS scheduler executed successfully",
          result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    } else {
      console.error("RSS processing failed:", result);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "RSS scheduler execution failed",
          error: result,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      };
    }
  } catch (error) {
    console.error("RSS scheduler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "RSS scheduler execution failed",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    };
  }
};
//# sourceMappingURL=rss-scheduler.js.map
