// Scheduled function untuk menjalankan RSS processor 2x sehari
// Function ini akan dipanggil oleh Netlify Scheduled Functions setiap 12 jam

exports.handler = async (event, context) => {
  try {
    console.log('RSS Scheduler triggered at:', new Date().toISOString());
    
    // Panggil RSS processor function
    const response = await fetch(`${process.env.URL}/.netlify/functions/rss-processor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('RSS processing completed successfully:', result);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'RSS scheduler executed successfully',
          result: result,
          timestamp: new Date().toISOString()
        })
      };
    } else {
      console.error('RSS processing failed:', result);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'RSS scheduler execution failed',
          error: result,
          timestamp: new Date().toISOString()
        })
      };
    }
  } catch (error) {
    console.error('RSS scheduler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'RSS scheduler execution failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
