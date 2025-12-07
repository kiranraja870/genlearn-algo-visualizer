'use client';
import { useState, useRef, useEffect } from 'react';

// --- Constants for Bar Sizing ---
const BAR_WIDTH = 45;
const BAR_MARGIN = 8;
const BAR_TOTAL_WIDTH = BAR_WIDTH + BAR_MARGIN;

export default function HomePage() {
  // ---------------- STATE & REFS ----------------
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const arrayContainer = useRef<HTMLDivElement>(null);
  const stepBox = useRef<HTMLDivElement>(null);

  // HISTORY STATES
  const [passHistory, setPassHistory] = useState<string[]>([]);
  const currentPassSteps = useRef<string[]>([]);

  // ANIMATION SPEED
  const sleepTime = 1000;
  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  // ---------------- LOGGER HELPER ----------------
  const logToDOM = (text: string, type: 'heading' | 'subheading' | 'step' | 'success' | 'normal' = 'normal') => {
    if (!stepBox.current) return;
    const div = document.createElement('div');
    
    // Formatting Bold text
    let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>');
    htmlText = htmlText.replace(/\n/g, '<br/>');

    div.innerHTML = htmlText;
    div.className = 'mb-3 text-sm font-mono tracking-wide animate-fade-in';

    // UI Styles based on log type
    if (type === 'heading') {
      div.className += ' text-purple-300 font-bold text-lg border-b border-purple-500/30 pb-2 mt-6';
    } else if (type === 'subheading') {
      div.className += ' text-blue-300 font-semibold text-md mt-4';
    } else if (type === 'step') {
      div.className += ' text-gray-300 pl-4 border-l-2 border-gray-600 ml-1';
    } else if (type === 'success') {
      div.className += ' text-green-400 font-bold bg-green-900/20 p-2 rounded border border-green-700/50 mt-4';
    } else {
      div.className += ' text-gray-400';
    }

    stepBox.current.appendChild(div);
    stepBox.current.scrollTop = stepBox.current.scrollHeight;
  };

  const formatAndLogStep = (log: string, type: 'heading' | 'subheading' | 'step' | 'success' | 'normal' = 'normal') => {
    logToDOM(log, type);
    currentPassSteps.current.push(log);
  };

  const finalizePass = () => {
    setPassHistory(prev => [...prev, ...currentPassSteps.current]);
    currentPassSteps.current = [];
  };

  // ---------------- RENDER BARS ----------------
  const renderArray = (arr: number[]) => {
    if (!arrayContainer.current) return;
    arrayContainer.current.innerHTML = '';
    const maxVal = Math.max(...arr, 10);

    // Calculate total width to center it
    const totalWidth = arr.length * BAR_TOTAL_WIDTH;
    const containerWidth = arrayContainer.current.clientWidth;
    const startOffset = Math.max(0, (containerWidth - totalWidth) / 2);

    arr.forEach((num, i) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${(num / maxVal) * 85}%`;
      bar.style.width = `${BAR_WIDTH}px`;
      bar.style.left = `${startOffset + i * BAR_TOTAL_WIDTH}px`;
      
      const valSpan = document.createElement('span');
      valSpan.innerText = String(num);
      valSpan.className = 'bar-value';
      bar.appendChild(valSpan);
      
      bar.setAttribute('data-value', String(num));
      bar.setAttribute('data-index', String(i));
      arrayContainer.current!.appendChild(bar);
    });
  };

  // ---------------- GENERATE ARRAY ----------------
  const generateArray = () => {
    if (isSorting) return;
    const input = (document.getElementById('userArray') as HTMLInputElement).value;
    const arr = input.split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n));

    if (arr.length === 0) {
      alert('Please enter valid numbers!');
      return;
    }

    setArray(arr);
    renderArray(arr);

    if (stepBox.current) stepBox.current.innerHTML = '';
    formatAndLogStep(`Array Loaded: [${arr.join(', ')}]`, 'heading');
    setPassHistory([]);
  };

  // ---------------- DOWNLOAD REPORT ----------------
  const handleDownloadTXT = () => {
    if (passHistory.length === 0) {
      alert("Please run a sort first to generate a report.");
      return;
    }
    let reportContent = `Algorithm Pass Details Report\n================================\nInitial List: [${array.join(', ')}]\n\n`;
    // Clean up HTML tags for text file
    const cleanHistory = passHistory.map(line => line.replace(/<br>/g, '\n').replace(/\*\*/g, ''));
    reportContent += cleanHistory.join('\n\n');
    reportContent += `\n\n================================\nFINAL ARRAY: [${array.join(', ')}]`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sorting_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---------------- SORTING ALGORITHMS ----------------

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array]; 
    setPassHistory([]); 
    
    // Intro Log
    formatAndLogStep(`✅ Bubble Sort – Detailed Pass-by-Pass Explanation`, 'heading');
    formatAndLogStep(`Bubble sort compares adjacent elements and swaps them if the left one is greater than the right one.\nLargest values "bubble" to the end after each pass.`);

    for (let i = 0; i < arr.length; i++) {
      let swapHappened = false;
      
      // Pass Header
      formatAndLogStep(`🔵 PASS ${i + 1}`, 'subheading');
      formatAndLogStep(`Starting Array: [${arr.join(', ')}]`, 'normal');
      
      let stepCounter = 1;

      for (let j = 0; j < arr.length - i - 1; j++) {
        const bars = Array.from(arrayContainer.current!.children) as HTMLElement[];
        const bar1 = bars[j];
        const bar2 = bars[j + 1];
        const val1 = arr[j];
        const val2 = arr[j + 1];

        // Highlight comparison
        bar1.classList.add('compare'); bar2.classList.add('compare');
        await sleep(sleepTime / 2);

        let logMsg = `**Step ${stepCounter}: Compare ${val1} and ${val2}**\n`;

        if (val1 > val2) {
          logMsg += `${val1} > ${val2} → **Swap**\nReason: Left value is greater than right.\n`;
          
          bar1.classList.remove('compare'); bar2.classList.remove('compare');
          bar1.classList.add('swap'); bar2.classList.add('swap');

          // Swap Visuals
          const tempLeft = bar1.style.left;
          bar1.style.left = bar2.style.left;
          bar2.style.left = tempLeft;
          await sleep(sleepTime);

          // Swap Data
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          arrayContainer.current!.insertBefore(bar2, bar1);

          bar1.classList.remove('swap'); bar2.classList.remove('swap');
          
          logMsg += `Array becomes → [${arr.join(', ')}]`;
          swapHappened = true;
        } else {
          logMsg += `${val1} < ${val2} → **No Swap**\nReason: Already in correct order.`;
          bar1.classList.remove('compare'); bar2.classList.remove('compare');
        }
        
        formatAndLogStep(logMsg, 'step');
        stepCounter++;
      }

      if (!swapHappened) {
        formatAndLogStep(`✔ Pass ${i + 1} had no swaps. Array is sorted!`, 'success');
        finalizePass();
        break;
      }
      formatAndLogStep(`✔ After Pass ${i + 1}, element ${arr[arr.length - 1 - i]} is placed correctly.`, 'normal');
      finalizePass();
    }
    formatAndLogStep(`🎉 FINAL SORTED ARRAY\n✅ [${arr.join(', ')}]`, 'success');
    setIsSorting(false);
  };

  const selectionSort = async () => {
    setIsSorting(true);
    let arr = [...array]; 
    setPassHistory([]); 
    
    formatAndLogStep(`✅ Selection Sort – Detailed Explanation`, 'heading');
    formatAndLogStep(`Finds the minimum element from the unsorted part and puts it at the beginning.`);

    const bars = Array.from(arrayContainer.current!.children) as HTMLElement[];
    
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      let minBar = bars[i];
      
      formatAndLogStep(`🔵 PASS ${i + 1}`, 'subheading');
      formatAndLogStep(`Starting Array: [${arr.join(', ')}]\nFinding minimum from index ${i} to end.`, 'normal');
      
      minBar.classList.add('swap'); // Temporarily highlight current min candidate
      await sleep(sleepTime / 2);

      let stepCounter = 1;

      for (let j = i + 1; j < arr.length; j++) {
        let currentBar = bars[j];
        const valJ = arr[j];
        const valMin = arr[minIdx];

        currentBar.classList.add('compare');
        let logMsg = `**Step ${stepCounter}: Compare current min (${valMin}) with ${valJ}**\n`;
        await sleep(sleepTime / 2);

        if (valJ < valMin) {
          logMsg += `${valJ} < ${valMin} → New Minimum Found: **${valJ}**`;
          minBar.classList.remove('swap'); 
          minIdx = j; 
          minBar = bars[minIdx]; 
          minBar.classList.add('swap');
        } else {
          logMsg += `${valJ} > ${valMin} → Current min (${valMin}) remains.`;
        }
        currentBar.classList.remove('compare');
        formatAndLogStep(logMsg, 'step');
        stepCounter++;
      }

      const barI = bars[i];
      const currentVal = arr[i];
      const minVal = arr[minIdx];

      if (minIdx !== i) {
        formatAndLogStep(`**End of Pass Swap:**\nSwapping ${currentVal} (idx ${i}) with min ${minVal} (idx ${minIdx}).`, 'step');
        barI.classList.add('swap'); minBar.classList.add('swap');
        
        const tempLeft = barI.style.left;
        barI.style.left = minBar.style.left;
        minBar.style.left = tempLeft;
        await sleep(sleepTime);
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        // Swap nodes in DOM array for reference
        // Note: In a real DOM swap we need to be careful, but just swapping values/heights is easier for visuals sometimes
        // But here we swap the actual nodes in the array list used for selection
        [bars[i], bars[minIdx]] = [bars[minIdx], bars[i]]; 
        
        barI.classList.remove('swap'); minBar.classList.remove('swap');
        formatAndLogStep(`Array becomes → [${arr.join(', ')}]`, 'normal');
      } else {
         formatAndLogStep(`Minimum ${minVal} is already at correct position. No swap needed.`, 'step');
         bars[i].classList.remove('swap');
      }
      
      finalizePass();
    }
    formatAndLogStep(`🎉 FINAL SORTED ARRAY\n✅ [${arr.join(', ')}]`, 'success');
    setIsSorting(false);
  };

  const insertionSort = async () => {
    setIsSorting(true);
    let arr = [...array]; 
    setPassHistory([]);
    const bars = Array.from(arrayContainer.current!.children) as HTMLElement[];

    formatAndLogStep(`✅ Insertion Sort – Detailed Explanation`, 'heading');
    formatAndLogStep(`Builds the sorted array one item at a time by shifting larger elements to the right.`);

    for (let i = 1; i < arr.length; i++) {
      let currentVal = arr[i];
      let currentBar = bars[i];
      let j = i - 1;

      formatAndLogStep(`🔵 PASS ${i}`, 'subheading');
      formatAndLogStep(`Current Array: [${arr.join(', ')}]\nKey Element: **${currentVal}** (Index ${i})`, 'normal');
      
      currentBar.classList.add('swap'); 
      await sleep(sleepTime / 2);

      let stepCounter = 1;
      let inserted = false;

      while (j >= 0 && arr[j] > currentVal) {
        let barJ = bars[j];
        barJ.classList.add('compare');
        
        let logMsg = `**Step ${stepCounter}: Compare ${arr[j]} vs Key (${currentVal})**\n`;
        logMsg += `${arr[j]} > ${currentVal} → Shift ${arr[j]} right.`;
        formatAndLogStep(logMsg, 'step');

        await sleep(sleepTime / 2);
        
        // Visual Shift
        barJ.style.left = `${(j + 1) * BAR_TOTAL_WIDTH + parseFloat(bars[0].style.left)}px`; 
        barJ.classList.remove('compare');
        
        // Data shift
        arr[j + 1] = arr[j];
        bars[j+1] = bars[j];
        
        await sleep(sleepTime / 2);
        j--;
        stepCounter++;
      }

      // Place Key
      arr[j + 1] = currentVal;
      // Visual placement
      // We need to calculate offset based on the start offset (first bar's left position - index*width)
      // A safer way in this specific absolute layout:
      const startOffset = parseFloat(bars[0].style.left) || 0; 
      currentBar.style.left = `${(j + 1) * BAR_TOTAL_WIDTH + startOffset}px`;
      
      currentBar.classList.remove('swap');
      bars[j + 1] = currentBar;

      formatAndLogStep(`✔ Inserted **${currentVal}** at index ${j + 1}.`, 'normal');
      formatAndLogStep(`Array becomes → [${arr.join(', ')}]`, 'normal');
      finalizePass();
    }
    formatAndLogStep(`🎉 FINAL SORTED ARRAY\n✅ [${arr.join(', ')}]`, 'success');
    setIsSorting(false);
  };

  // Helper for Merge Sort Visuals
  const mergeSort = async () => {
    setIsSorting(true);
    setPassHistory([]);
    formatAndLogStep('✅ Merge Sort (Recursive)', 'heading');
    
    let arr = [...array];
    
    // We need to re-fetch bars frequently as they might not move in DOM, but we re-render for merge sort often
    const merge = async (l: number, m: number, r: number) => {
       const n1 = m - l + 1;
       const n2 = r - m;
       const L = new Array(n1);
       const R = new Array(n2);

       for (let i = 0; i < n1; i++) L[i] = arr[l + i];
       for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

       formatAndLogStep(`🔵 Merge Step: Indices ${l}-${r}`, 'subheading');
       formatAndLogStep(`Merging [${L.join(', ')}] and [${R.join(', ')}]`, 'normal');

       let i = 0, j = 0, k = l;
       let logMsg = '';

       while (i < n1 && j < n2) {
           if (L[i] <= R[j]) {
               logMsg = `Comparing ${L[i]} (L) vs ${R[j]} (R) → Take ${L[i]}`;
               arr[k] = L[i]; i++;
           } else {
               logMsg = `Comparing ${L[i]} (L) vs ${R[j]} (R) → Take ${R[j]}`;
               arr[k] = R[j]; j++;
           }
           formatAndLogStep(logMsg, 'step');
           k++;
       }
       while (i < n1) { arr[k] = L[i]; i++; k++; }
       while (j < n2) { arr[k] = R[j]; j++; k++; }

       formatAndLogStep(`Resulting sub-array: [${arr.slice(l, r + 1).join(', ')}]`, 'success');
       
       // For Merge Sort, it's easier to re-render the whole state visually
       setArray([...arr]);
       renderArray(arr); 
       await sleep(sleepTime);
    };

    const sort = async (l: number, r: number) => {
        if (l >= r) return;
        const m = l + Math.floor((r - l) / 2);
        await sort(l, m);
        await sort(m + 1, r);
        await merge(l, m, r);
    };

    await sort(0, arr.length - 1);
    formatAndLogStep(`🎉 FINAL SORTED ARRAY\n✅ [${arr.join(', ')}]`, 'success');
    finalizePass();
    setIsSorting(false);
  };

  const startSort = () => {
    if (isSorting) return;
    const algo = (document.getElementById('algorithmSelect') as HTMLSelectElement).value;
    if (array.length === 0) { alert('Please Set Array first!'); return; }

    if (algo === 'bubble') bubbleSort();
    else if (algo === 'selection') selectionSort();
    else if (algo === 'insertion') insertionSort();
    else if (algo === 'merge') mergeSort();
  };

  // ---------------- GRAPH ALGORITHMS ----------------
  const stepBox2 = useRef<HTMLDivElement>(null);

  const logGraphStep = (text: string, type: 'heading' | 'step' | 'success' | 'normal' = 'normal') => {
    if (!stepBox2.current) return;
    const div = document.createElement('div');
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>').replace(/\n/g, '<br/>');
    div.className = 'mb-2 text-sm font-mono';

    if (type === 'heading') div.className += ' text-purple-300 font-bold text-md mt-4 border-b border-gray-700 pb-1';
    else if (type === 'success') div.className += ' text-green-400 font-bold';
    else if (type === 'step') div.className += ' text-blue-200 pl-3 border-l-2 border-blue-500';
    else div.className += ' text-gray-400';

    stepBox2.current.appendChild(div);
    stepBox2.current.scrollTop = stepBox2.current.scrollHeight;
  };

  const adjList: { [key: string]: string[] } = {
    A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'],
    D: ['B'], E: ['B', 'F'], F: ['C', 'E']
  };

  const resetNodes = () => {
    document.querySelectorAll('.node').forEach(n => {
      (n as HTMLElement).style.backgroundColor = '#1f2937';
      (n as HTMLElement).style.borderColor = '#8b5cf6';
      (n as HTMLElement).style.color = '#fff';
      (n as HTMLElement).style.boxShadow = 'none';
    });
  };

  const highlightNode = (id: string, color = '#7c3aed') => {
    const node = document.getElementById(id);
    if (node) {
      node.style.backgroundColor = color;
      node.style.borderColor = '#fff';
      node.style.boxShadow = `0 0 15px ${color}`;
      node.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 });
    }
  };

  const startBFS = async () => {
    if (stepBox2.current) stepBox2.current.innerHTML = '';
    resetNodes(); 
    let queue = ['A']; 
    let visited = new Set(['A']);
    
    logGraphStep('🌐 Starting BFS (Breadth-First Search)', 'heading'); 
    logGraphStep('Queue initialized with: [A]', 'step');
    highlightNode('A'); 
    await sleep(sleepTime);

    while (queue.length > 0) {
      let node = queue.shift()!; 
      logGraphStep(`🟦 Dequeue & Process: **${node}**`, 'heading');
      
      let neighbors = adjList[node];
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor); 
          queue.push(neighbor);
          highlightNode(neighbor, '#f59e0b'); 
          logGraphStep(`-> Found unvisited neighbor **${neighbor}**. Added to Queue.`, 'step'); 
          await sleep(sleepTime);
          highlightNode(neighbor, '#7c3aed');
        } else {
          logGraphStep(`-> Neighbor ${neighbor} already visited.`, 'normal');
        }
      }
    }
    logGraphStep('✅ BFS Traversal Complete!', 'success');
  };

  const startDFS = async () => {
    if (stepBox2.current) stepBox2.current.innerHTML = '';
    resetNodes(); 
    let visited = new Set();
    logGraphStep('🌐 Starting DFS (Depth-First Search)', 'heading'); 
    await dfsHelper('A', visited);
    logGraphStep('✅ DFS Traversal Complete!', 'success');
  };

  const dfsHelper = async (node: string, visited: Set<unknown>) => {
    visited.add(node);
    highlightNode(node); 
    logGraphStep(`🟦 Visiting Node **${node}**`, 'heading'); 
    await sleep(sleepTime);
    
    let neighbors = adjList[node];
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) { 
        logGraphStep(`-> Diving deeper into neighbor **${neighbor}**...`, 'step');
        await dfsHelper(neighbor, visited); 
        logGraphStep(`<- Backtracking to Node **${node}**`, 'step');
      }
    }
  };

  // ---------------- UI RENDER ----------------
  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-gray-100 selection:bg-purple-500 selection:text-white pb-20">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12 relative z-10"> 
        
        {/* HEADER */}
        <header className="text-center mb-16 space-y-2">
           <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
            <span className="text-white">ALGORITHAMS-VISUALIZATION</span>
           </h1>
           <p className="text-gray-400 font-mono">Interactive Sorting & Graph Visualizer</p>
        </header>

        {/* ---------------- SORTING SECTION ---------------- */}
        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden mb-12">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-700/50 flex flex-wrap gap-4 items-center justify-between bg-slate-900/80">
             <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input</span>
                    <input
                      type="text"
                      id="userArray"
                      defaultValue="25, 12, 45, 8, 30, 5"
                      className="w-48 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
                    />
                </div>
                <button 
                  onClick={generateArray}
                  disabled={isSorting}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded text-sm font-semibold transition disabled:opacity-50"
                >
                  Set Array
                </button>
             </div>

             <div className="flex gap-4 items-center flex-wrap">
                <select id="algorithmSelect" className="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500">
                  <option value="bubble">Bubble Sort</option>
                  <option value="selection">Selection Sort</option>
                  <option value="insertion">Insertion Sort</option>
                  <option value="merge">Merge Sort</option>
                </select>
                <button 
                  onClick={startSort} 
                  disabled={isSorting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-1.5 rounded shadow-lg shadow-purple-500/20 text-sm font-bold tracking-wide transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSorting ? 'Sorting...' : 'Start Sort ▶'}
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
            
            {/* VISUALIZER CANVAS */}
            <div className="lg:col-span-2 p-8 border-r border-slate-700/50 relative flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
               {array.length === 0 && <div className="text-gray-500 animate-pulse">Enter numbers and click 'Set Array' to begin</div>}
               <div 
                  ref={arrayContainer}
                  className="relative w-full h-80 flex items-end justify-center"
               >
                 {/* Bars injected here */}
               </div>
            </div>

            {/* LOGS PANEL */}
            <div className="lg:col-span-1 bg-slate-950 p-0 flex flex-col h-[500px]">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-bold text-gray-300 flex items-center gap-2">
                        <span>📜</span> Execution Log
                    </h3>
                    <button onClick={handleDownloadTXT} className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-green-400 border border-green-900 transition">
                        Download .txt
                    </button>
                </div>
                <div 
                  ref={stepBox}
                  className="flex-1 overflow-y-auto p-4 font-mono text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                >
                  <div className="text-gray-600 italic text-center mt-10">Steps will appear here...</div>
                </div>
            </div>

          </div>
        </section>


        {/* ---------------- GRAPH SECTION ---------------- */}
        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/80">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <span className="text-purple-400">🌐</span> Graph Traversal
             </h2>
             <div className="flex gap-3">
                <button onClick={startBFS} className="px-4 py-1.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/40 transition text-sm font-bold">BFS (Queue)</button>
                <button onClick={startDFS} className="px-4 py-1.5 rounded bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 transition text-sm font-bold">DFS (Recursion)</button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
             <div className="lg:col-span-2 relative h-96 bg-slate-950 flex items-center justify-center border-r border-slate-800">
                {/* Graph Container */}
                <div className="relative w-full max-w-lg h-full mx-auto">
                    {/* Edges (SVG Lines) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700" style={{zIndex: 0}}>
                        <line x1="50%" y1="50" x2="20%" y2="150" strokeWidth="2" /> {/* A-B */}
                        <line x1="50%" y1="50" x2="80%" y2="150" strokeWidth="2" /> {/* A-C */}
                        <line x1="20%" y1="150" x2="20%" y2="300" strokeWidth="2" /> {/* B-D */}
                        <line x1="20%" y1="150" x2="50%" y2="300" strokeWidth="2" /> {/* B-E */}
                        <line x1="50%" y1="300" x2="80%" y2="300" strokeWidth="2" /> {/* E-F */}
                        <line x1="80%" y1="150" x2="80%" y2="300" strokeWidth="2" /> {/* C-F */}
                    </svg>

                    {/* Nodes */}
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="A" style={{ top: '26px', left: '50%', transform: 'translateX(-50%)' }}>A</div>
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="B" style={{ top: '126px', left: '20%', transform: 'translateX(-50%)' }}>B</div>
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="C" style={{ top: '126px', left: '80%', transform: 'translateX(-50%)' }}>C</div>
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="D" style={{ top: '276px', left: '20%', transform: 'translateX(-50%)' }}>D</div>
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="E" style={{ top: '276px', left: '50%', transform: 'translateX(-50%)' }}>E</div>
                    <div className="node absolute w-12 h-12 rounded-full border-2 border-purple-500 bg-slate-800 flex items-center justify-center font-bold text-lg z-10 transition-all duration-300" id="F" style={{ top: '276px', left: '80%', transform: 'translateX(-50%)' }}>F</div>
                </div>
             </div>

             <div className="lg:col-span-1 bg-slate-950 border-t lg:border-t-0 p-4 h-96 flex flex-col">
                <h3 className="text-gray-400 font-bold mb-3 uppercase text-xs tracking-wider">Traversal Log</h3>
                <div ref={stepBox2} className="flex-1 overflow-y-auto font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
                    <span className="text-gray-600 italic">Select an algorithm...</span>
                </div>
             </div>
          </div>
        </section>

      </div>

      {/* Global & Dynamic Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #64748b; }

        /* Bar Visuals */
        .bar {
          position: absolute;
          bottom: 0;
          background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
          border-radius: 6px 6px 0 0;
          transition: height 0.3s ease, left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 5px;
          overflow: visible;
        }
        .bar-value {
           position: absolute;
           top: -25px;
           color: #93c5fd;
           font-size: 0.8rem;
           font-weight: bold;
        }

        .bar.compare {
          background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
          z-index: 10;
        }
        .bar.compare .bar-value { color: #fcd34d; }

        .bar.swap {
          background: linear-gradient(180deg, #f87171 0%, #dc2626 100%);
          box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
          z-index: 10;
        }
        .bar.swap .bar-value { color: #fca5a5; }
      `}</style>
    </div>
  );
}