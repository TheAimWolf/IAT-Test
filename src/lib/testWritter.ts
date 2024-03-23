import type TestResult from "./TestResult";
import fs from 'fs';
import path from 'path';
const jsonPath = path.resolve('data/testResults.json');

async function saveTestResult(testResult:TestResult) {
    console.log('A User took the test and the result will be saved to the file system.');

    if (!fs.existsSync(jsonPath)) {
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
        fs.writeFileSync(jsonPath, '[]');
    }
    const existingData = fs.readFileSync(jsonPath, 'utf-8');
    const existingTestResult = JSON.parse(existingData);
    existingTestResult.push(testResult);
    fs.writeFileSync(jsonPath, JSON.stringify(existingTestResult));
}

export default saveTestResult;
