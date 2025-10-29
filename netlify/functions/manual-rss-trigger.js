// Manual trigger untuk RSS processor
// Akses: https://your-site.netlify.app/.netlify/functions/manual-rss-trigger

export const handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Manual RSS trigger activated at:', new Date().toISOString());
    
    // Panggil RSS processor function
    const response = await fetch(`${process.env.URL}/.netlify/functions/rss-processor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Manual RSS processing completed successfully:', result);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Manual RSS trigger executed successfully',
          result: result,
          timestamp: new Date().toISOString()
        })
      };
    } else {
      console.error('Manual RSS processing failed:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Manual RSS trigger execution failed',
          error: result,
          timestamp: new Date().toISOString()
        })
      };
    }
  } catch (error) {
    console.error('Manual RSS trigger error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Manual RSS trigger execution failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
