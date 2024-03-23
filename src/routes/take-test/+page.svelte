<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import DescriptionCard from '../../components/DescriptionCard.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import QuestionCard from '../../components/QuestionCard.svelte';
	import ResultCard from '../../components/ResultCard.svelte';
	const testName = $page.url.searchParams.get('testName');
	const goodJsonPath = `src/sets/${testName}/good.json`;
	const badJsonPath = `src/sets/${testName}/bad.json`;
	const picturePath = `src/sets/${testName}/pictures.json`;
	const testInfoPath = `src/sets/${testName}/testinfo.json`;

	let inQuestionPause:boolean = false;
	let wrongAnswer:boolean = false;

	let lastTimestamp: number;

	class testEntry {
		time: number; //How long the user took to answer the question
		correct: boolean; //Was the answer correct
		aGood: boolean; //If set a was asosiatet with the good words -> true
		constructor(pCorrect: boolean, pAGood: boolean, pTime?: number) {
			let now = Date.now();
			if(pTime){this.time = pTime}
			else{this.time = now - lastTimestamp;}
			this.correct = pCorrect;
			this.aGood = pAGood;
		}
	}

	let testProgress: Array<testEntry> = [];

	let testInfo: any;

	let userAge: number = -1;
	let userResult: string;

	let goodJson: Array<string>;
	let badJson: Array<string>;
	let mixedWords: Array<string>;

	let pics1: Array<string>;
	let pics2: Array<string>;
	let mixedPics: Array<string>;

	let curAnswer: string;

	let testResultString: string;

	let curLeftWords: Array<string>;
	let curRightWords: Array<string>;
	let curMiddleWord: string | null;
	let curPicture: string | null;
	let curRound: number = 0;
	let curStep: number = 0;

	// l: true if good words left, false if good words right, t: Tries, m: Mode [w: words, p: pictures, m: mixed], f: Function [p: Practice, t: Test]
	let rounds: Array<{ l: boolean; t: number; m: string; f: string }> = [
		{ l: true, t: 20, m: 'w', f: 'p' },
		{ l: true, t: 20, m: 'p', f: 'p' },
		{ l: true, t: 20, m: 'm', f: 'p' },
		{ l: true, t: 40, m: 'm', f: 't' },
		{ l: false, t: 20, m: 'w', f: 'p' },
		{ l: false, t: 20, m: 'm', f: 'p' },
		{ l: false, t: 40, m: 'm', f: 't' }
	];

	let curState: string = 'pretest';

	async function nextState() {
		switch (curState) {
			case 'pretest':
				curState = 'test';
				break;
			case 'test':
				curState = 'posttest';
				break;
			case 'possttest':
				curState = 'return';
				break;
			default:
				console.log('Error while loading main page');
				break;
		}
	}

	async function pause() {
		if (rounds.length <= curRound) {
			curState = 'end';
			showResults(testProgress);
		} else {
			curState = 'pause';
		}
	}

	async function showResults(testResults:testEntry[]) {
		const dScore:number = calculateDScore(testResults);
		if(dScore === -1000){testResultString = 'Leider hast du zu viele Fehleingaben gemacht, weswegen der Test nicht ausgewertet werden kann.'; return;}
		if(dScore === -1010){testResultString = 'Du bist leider zu schnell gewesen. Schonmal über eine E-Sports Karriere nachgedacht?'; return;}
		fetch('/save', {
			method: 'PUT',
			body: JSON.stringify({
				testName: testName,
				result: dScore,
				age: userAge,
				testType: 'prod'
			})
		})
		if(dScore <= -1){testResultString = testInfo['b-full']}
		else if (dScore > -1 && dScore <= -0.25){testResultString = testInfo['b-half']}
		else if (dScore > -0.25 && dScore < 0.25){testResultString = testInfo['a-b']}
		else if (dScore >= 0.25 && dScore < 1){testResultString = testInfo['a-half']}
		else if (dScore >= 1){testResultString = testInfo['a-full']}
	}

	//Berechne die Standardabweichung
	function calculateStandardDeviation(values: number[]): number {
		const mean: number = values.reduce((sum, value) => sum + value, 0) / values.length;
		const squareDiffs = values.map((value) => (value - mean) ** 2);
		const avgSquareDiff = squareDiffs.reduce((sum, value) => sum + value, 0) / values.length;
		return Math.sqrt(avgSquareDiff);
	}

	function calculateDScore(entries: testEntry[]): number {
		//TODO: Zählen wie viele falsche oder ungültige Antworten
		let allTimes:number[] = []
		// Filtere ungewöhnliche Antwortzeiten und falsche Antworten heraus
		let validEntries = entries.filter((e) => e.correct && e.time <= 10000);
		if(validEntries.length/entries.length < 0.75){return -1000} //Error code for to many wrong tries
		let entriesLessThenMin = entries.filter((e) => e.time < 300)
		if(entriesLessThenMin.length/entries.length > 0.1){return -1010} //Error code for to fast answers
		validEntries.forEach((e) => {
			if(e.time < 300){e.time = 300}
			if(e.time > 3000){e.time = 3000}
			allTimes.push(e.time)
		})

		let standardDeviation = calculateStandardDeviation(allTimes)

		// Teile Einträge in "verknüpft mit A" und "nicht verknüpft mit A"
		let linkedToAEntries = validEntries.filter((e) => e.aGood);
		let notLinkedToAEntries = validEntries.filter((e) => !e.aGood);

		// Berechne mittlere Antwortzeiten
		let meanTimeLinkedToA =
			linkedToAEntries.reduce((acc, curr) => acc + curr.time, 0) / linkedToAEntries.length;
		let meanTimeNotLinkedToA =
			notLinkedToAEntries.reduce((acc, curr) => acc + curr.time, 0) / notLinkedToAEntries.length;

		// Berechne D-Score als Differenz der mittleren Antwortzeiten
		// Normalisierung des D-Scores durch Teilen durch Standardabweichung
		// Für die Standardabweichungsberechnung benötigst du weitere Schritte
		console.log(meanTimeNotLinkedToA, meanTimeLinkedToA, standardDeviation)
		const dScore = (meanTimeNotLinkedToA- meanTimeLinkedToA) / standardDeviation;
		//let dScore = meanTimeNotLinkedToA - meanTimeLinkedToA;


		return dScore;
	}

	async function fetchJson() {
		try {
			const response = await fetch(goodJsonPath);
			goodJson = await response.json();
			const response2 = await fetch(badJsonPath);
			badJson = await response2.json();
			mixedWords = [...goodJson, ...badJson];

			const response3 = await fetch(picturePath);
			const allPics = await response3.json();
			pics1 = allPics.a;
			pics2 = allPics.b;
			mixedPics = [...pics1, ...pics2];
		} catch (error) {
			console.error(error);
		}
	}

	function newRound() {
		if (curState == 'pause') {
			curState = 'test';
			lastTimestamp = Date.now();
		}
		if (curRound >= rounds.length) {
			nextState();
			return;
		}
		if (rounds[curRound].m == 'w') {
			if (rounds[curRound].l) {
				curLeftWords = ['Gut'];
				curRightWords = ['Schlecht'];
			} else {
				curLeftWords = ['Schlecht'];
				curRightWords = ['Gut'];
			}
		} else if (rounds[curRound].m == 'p') {
			curLeftWords = ['Dunkel']; //TODO Programatisch ermitteln
			curRightWords = ['Hell']; //TODO Programatisch ermitteln
		} else {
			if (rounds[curRound].l) {
				curLeftWords = ['Gut', 'Dunkel']; //TODO Programatisch ermitteln
				curRightWords = ['Schlecht', 'Hell']; //TODO Programatisch ermitteln
			} else {
				curLeftWords = ['Schlecht', 'Dunkel']; //TODO Programatisch ermitteln
				curRightWords = ['Gut', 'Hell']; //TODO Programatisch ermitteln
			}
		}
		curRound++;
		curStep = 0;
		newStep();
	}

	function newStep() {
		if (curStep >= rounds[curRound - 1].t) {
			pause();
			return;
		}
		if (rounds[curRound - 1].m === 'w') {
			curPicture = null;
			curMiddleWord = mixedWords[Math.floor(Math.random() * mixedWords.length)];
			const isGoodWord = goodJson.includes(curMiddleWord);
			const isBadWord = badJson.includes(curMiddleWord);
			if(rounds[curRound - 1].l) {
				curAnswer = isGoodWord ? 'left' : isBadWord ? 'right' : '';
			} else {
				curAnswer = isGoodWord ? 'right' : isBadWord ? 'left' : '';
			}
		} else if (rounds[curRound - 1].m == 'p') {
			curMiddleWord = null;
			curPicture = mixedPics[Math.floor(Math.random() * mixedPics.length)];
			const isPic1 = pics1.includes(curPicture);
			const isPic2 = pics2.includes(curPicture);
			curAnswer = isPic1 ? 'left' : isPic2 ? 'right' : '';

		} else {
			curMiddleWord = null;
			curPicture = null;
			const curType = Math.random() < 0.5 ? 'w' : 'p';
			if (curType == 'w') {
				curMiddleWord = mixedWords[Math.floor(Math.random() * mixedWords.length)];
				const isGoodWord = goodJson.includes(curMiddleWord);
				const isBadWord = badJson.includes(curMiddleWord);
				if(rounds[curRound - 1].l) {
					curAnswer = isGoodWord ? 'left' : isBadWord ? 'right' : '';
				} else {
					curAnswer = isGoodWord ? 'right' : isBadWord ? 'left' : '';
				}
			} else {
				curPicture = mixedPics[Math.floor(Math.random() * mixedPics.length)];
				const isPic1 = pics1.includes(curPicture);
				const isPic2 = pics2.includes(curPicture);
				curAnswer = isPic1 ? 'left' : isPic2 ? 'right' : '';
			}
		}
		curStep++;
	}

	function betweenQuestions() {
		inQuestionPause = true;
		curMiddleWord = null;
		curPicture = null;
		setTimeout(function(){
			newStep();
			inQuestionPause = false
		}, 250)
	}


	onMount(async () => {
		const testInfoResponse = await fetch(testInfoPath);
		testInfo = await testInfoResponse.json();
		window.addEventListener('keydown', handleKeyPress);
		await fetchJson();
		newRound();
	});

	function handleKeyPress(event: KeyboardEvent) {
		if(curState === 'test') {
			if (event.key === 'e') {
				goLeft();
			}
			if (event.key === 'i') {
				goRight();
			}
		}
	}

	function userAction(isLeft: boolean) {
		if (curState == 'pause' || inQuestionPause) {
			return;
		}
		if ((isLeft && curAnswer == 'left') || (!isLeft && curAnswer == 'right')) {
			if (rounds[curRound - 1].f === 't' && curState === 'test') {
				testProgress.push(new testEntry(true, rounds[curRound - 1].l));
				lastTimestamp = Date.now();
			}
			wrongAnswer = false
			betweenQuestions();
		} else {
			if (rounds[curRound - 1].f === 't' && curState === 'test') {
				testProgress.push(new testEntry(false, rounds[curRound - 1].l));
			}
			wrongAnswer = true
			//TODO: Show some kind of error
		}
	}

	function goLeft() {
		userAction(true);
	}

	function goRight() {
		userAction(false);
	}
</script>

<main>
	{#if curState == 'test'}
	<button on:click={goLeft} class="absolute w-1/2 h-screen">

	</button>
	<button on:click={goRight} class="absolute right-0 w-1/2 h-screen">

	</button>
	{/if}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<div class="flex h-5/6 lg:h-3/5 w-8/12 flex-col items-center">
			{#if curState == 'pretest'}
				<DescriptionCard curTestInfo={testInfo} bind:curState bind:curUserAge={userAge} />
			{:else if curState == 'pause'}
				<h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					<p>{testInfo.pausen[curRound - 1]}</p>
					<Button on:click={newRound}>Test fortführen</Button>
				</h1>
			{:else if curState == 'test'}
				<QuestionCard
					leftWords={curLeftWords}
					rightWords={curRightWords}
					middleWord={curMiddleWord}
					picture={curPicture}
					error={wrongAnswer}
				/>
			{:else if curState == 'end'}
				<ResultCard result={testResultString} />
			{/if}
		</div>
	</div>
</main>

<!-- src/routes/+layout.svelte -->
