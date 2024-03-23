class TestResult {
    testName: string;
    result: number;
    age: number;
    testType: string;
    testData: string;
    constructor(pTestName:string, pResult:number, pAge:number, pTestType:string, pTestData:string) {
        this.testName = pTestName;
        this.result = pResult;
        this.age = pAge;
        this.testType = pTestType;
        this.testData = pTestData;
    }
}

export default TestResult;