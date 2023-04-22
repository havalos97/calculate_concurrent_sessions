import process from 'process'

interface Session {
  start: Date
  end: Date
}

interface Point {
  label: string
  x: Date
  y: Number
}

function quickSort(array: Point[], low: number, high: number): void {
  if (low < high) {
    const piv = pivot(array, low, high);
    quickSort(array, low, piv - 1);
    quickSort(array, piv + 1, high);
  }
}

function pivot(array: Point[], low: number, high: number): number {
  const { x: pivot } = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    const { x: curElem} = array[j]
    if (curElem < pivot) {
      i++;
      swap(array, i, j);
    }
  }

  swap(array, i + 1, high);
  return i + 1;
}

function swap(array: Point[], i: number, j: number): void {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function getConcurrentSessionsOptimized(sessions: Session[]): Point[] {
  const points: Point[] = []
  for (let i=0; i < sessions.length; i++) {
    const s1 = sessions[i]
    let sessionStartCounter = 1;
    let sessionEndCounter = 0;

    for (let j=0; j < sessions.length; j++) {
      const s2 = sessions[j]

      if ((s1 !== s2) && (s1.start >= s2.start && s1.start <= s2.end)) {
        sessionStartCounter++
      }
      if ((s1 !== s2) && (s1.end >= s2.start && s1.end <= s2.end)) {
        sessionEndCounter++
      }
    }
    points.push({ label: `ts${i}`, x: s1.start, y: sessionStartCounter })
    points.push({ label: `te${i}`, x: s1.end, y: sessionEndCounter })
  }
  quickSort(points, 0, points.length - 1)
  return points
}

function getConcurrentSessions(sessions: Session[]): Point[] {
  const points: Point[] = []
  
  for (let i=0; i < sessions.length; i++) {
    const s1 = sessions[i]
    let sessionCounter = 1

    for (let j=0; j < sessions.length; j++) {
      const s2 = sessions[j]

      if ((s1 !== s2) && (s1.start >= s2.start && s1.start <= s2.end)) {
        sessionCounter++
      }
    }
    points.push({ label: `ts${i}`, x: s1.start, y: sessionCounter })
    
    sessionCounter = 0
    for (let j=0; j < sessions.length; j++) {
      const s2 = sessions[j]

      if ((s1 !== s2) && (s1.end >= s2.start && s1.end <= s2.end)) {
        sessionCounter++
      }
    }
    points.push({ label: `te${i}`, x: s1.end, y: sessionCounter })
  }
  quickSort(points, 0, points.length - 1)
  return points
}

function randomDate(date1?: string, date2?: string){
  function randomValueBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  let dateStt = new Date(date1 || '01-01-1970').getTime()
  let dateEnd = new Date(date2 || new Date().toLocaleDateString()).getTime()
  if (dateStt > dateEnd){
    return new Date(randomValueBetween(dateEnd, dateStt))
  }
  return new Date(randomValueBetween(dateStt, dateEnd))
}

function generateRandomSessions(numberOfSessions: number): Session[] {
  const sessions: Session[] = []
  console.time('Random sessions generated')
  for (let i=0; i < numberOfSessions; i++) {
    sessions.push({
      start: randomDate('01-01-2023'),
      end: randomDate('01-01-2023'),
    })
  }
  console.timeEnd('Random sessions generated')
  return sessions
}

function mockSessions(): Session[] {
  /*
  *  SESSIONS REPRESENTED GRAPHICALLY
  *  ts1  ts0        te0  te1
  *        |----------|
  *   |--------------------|
  *             |---------------|
  *            ts2               te2
  * EXPECTED OUTPUT WITH MOCKED SESSIONS: Point[]
  * [(ts1,1), (ts0,2), (ts2,3), (te0,2), (te1,1), (te2,0)]
  */

  const ts0 = new Date('2023-04-20T22:00:00.000Z')
  const te0 = new Date('2023-04-20T22:10:00.000Z')

  const ts1 = new Date('2023-04-20T21:55:00.000Z')
  const te1 = new Date('2023-04-20T22:15:00.000Z')

  const ts2 = new Date('2023-04-20T22:05:00.000Z')
  const te2 = new Date('2023-04-20T22:20:00.000Z')
  
  const session0: Session = { start: ts0, end: te0 }
  const session1: Session = { start: ts1, end: te1 }
  const session2: Session = { start: ts2, end: te2 }

  return [session0, session1, session2]
}

function main(sessionsToGenerate: number, printOutputArr: number = 0): void {
  let sessions: Session[] = []
  if (sessionsToGenerate > 0 && !isNaN(sessionsToGenerate)) {
    console.log(`Generating ${sessionsToGenerate} sessions`)
    sessions = generateRandomSessions(sessionsToGenerate)
  } else {
    sessions = mockSessions()
    console.log(`Generating ${sessions.length} sessions`)
  }

  console.time('Concurrent sessions (optimized)')
  console.log(`\nGetting concurrent sessions (optimized)`)
  const pointsOp = getConcurrentSessionsOptimized(sessions)
  console.timeEnd('Concurrent sessions (optimized)')

  console.time('Concurrent sessions (NOT optimized)')
  console.log(`\nGetting concurrent sessions (not optimized)`)
  getConcurrentSessions(sessions)
  console.timeEnd('Concurrent sessions (NOT optimized)')

  if (!isNaN(printOutputArr) && printOutputArr) {
    const sortedPoints = pointsOp.sort((a: Point, b: Point) => a.x > b.x ? 1 : -1)
    console.log('OUTPUT:', {
      sortedPoints,
      stringified: sortedPoints.map((point: Point) => `(${point.label},${point.y})`)
    })
  }
}

let sessionsToGenerate: number = parseInt(process.argv[2])
let printOutputArr: number = parseInt(process.argv[3])
main(sessionsToGenerate, printOutputArr)
