import TestResult from '$lib/TestResult.js';
import testWriter from '$lib/testWritter.js';

async function saveTestResult(testResult:TestResult){
    testWriter(testResult);
}

export async function PUT(event) {
  
    const body = await event.request.json();
    const testResult = new TestResult(body.testName, body.result, body.age, body.testType, Date());
    saveTestResult(testResult)

    const options: ResponseInit = {
      status: 200,
    }

    return new Response('Saved', options);
  }