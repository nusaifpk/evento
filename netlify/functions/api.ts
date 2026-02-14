import type { Handler } from '@netlify/functions';
import serverless from 'serverless-http';

// Import Express app - this will also initialize the database connection
let expressApp: any = null;
let serverlessApp: any = null;

// Lazy load the Express app to ensure DB connection is initialized
async function getApp() {
  if (!expressApp) {
    // Dynamic import to handle ES modules
    const appModule = await import('../../server/src/app.js');
    expressApp = appModule.default;
    
    // Wrap with serverless-http
    serverlessApp = serverless(expressApp, {
      binary: ['image/*', 'application/pdf'],
    });
  }
  return serverlessApp;
}

// Netlify Function handler
export const handler: Handler = async (event, context) => {
  try {
    const app = await getApp();
    
    // Convert Netlify event to API Gateway format (which serverless-http expects)
    const apiGatewayEvent = {
      ...event,
      requestContext: {
        ...event.requestContext,
        requestId: context.requestId || event.requestContext?.requestId || 'unknown',
        identity: {
          sourceIp: event.headers?.['x-forwarded-for']?.split(',')[0] || 
                    event.headers?.['X-Forwarded-For']?.split(',')[0] || '',
        },
      },
    };

    const result = await app(apiGatewayEvent as any, context as any);
    return result;
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
