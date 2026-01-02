<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

    <title>4B4KU5 - Genesis Ritual</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">

    <style>

        body, html {

            margin: 0;

            padding: 0;

            width: 100%;

            height: 100%;

            overflow: hidden;

            background-color: #080808;

            user-select: none;

            -webkit-user-select: none;

            color: white;

            font-family: 'Inter', sans-serif;

            touch-action: none;

            -webkit-touch-callout: none;

        }

        #ritual-header {

            position: absolute;

            top: 0;

            left: 0;

            width: 100%;

            padding: 16px;

            background: linear-gradient(180deg, rgba(8,8,8,0.9) 0%, transparent 100%);

            z-index: 100;

            display: flex;

            justify-content: space-between;

            align-items: center;

            box-sizing: border-box;

        }

        .helix-indicator {

            position: absolute;

            top: 8px;

            left: 8px;

            width: 30px;

            height: 30px;

            display: flex;

            justify-content: center;

            align-items: center;

            z-index: 101;

        }

        .helix-arm {

            position: absolute;

            width: 24px;

            height: 24px;

            border-radius: 50%;

            opacity: 0.4;

            animation: rotate 20s linear infinite;

        }

        .helix-arm:nth-child(1) { background: rgba(0,255,255,0.6); animation-delay: 0s; }

        .helix-arm:nth-child(2) { background: rgba(255,0,255,0.6); animation-delay: -6.66s; }

        .helix-arm:nth-child(3) { background: rgba(255,215,0,0.6); animation-delay: -13.33s; }

        @keyframes rotate {

            0% { transform: rotate(0deg) scale(1); }

            100% { transform: rotate(360deg) scale(1); }

        }

        .user-ritual-info {

            position: absolute;

            width: 1px;

            height: 1px;

            padding: 0;

            margin: 0;

            border: 0;

            overflow: hidden;

            clip: rect(0 0 0 0);

            clip-path: inset(50%);

            white-space: nowrap;

        }

        #timer {

            padding: 8px 16px;

            background: rgba(0, 0, 0, 0.7);

            border-radius: 20px;

            color: white;

            font-weight: bold;

            font-size: 18px;

            border: 1px solid rgba(0,255,255,0.3);

            z-index: 20;

        }

        #prompt-screen {

            position: absolute;

            top: 0;

            left: 0;

            width: 100%;

            height: 100%;

            display: flex;

            flex-direction: column;

            justify-content: center;

            align-items: center;

            z-index: 10;

            padding: 20px;

            box-sizing: border-box;

            text-align: center;

            background: radial-gradient(circle at center, #0f1115, #050507);

        }

        #ritual-title {

            font-size: 32px;

            font-weight: 800;

            background: linear-gradient(90deg, #4ade80, #f87171, #fb923c, #60a5fa, #c084fc, #fde047);

            -webkit-background-clip: text;

            -webkit-text-fill-color: transparent;

            background-clip: text;

            margin-bottom: 20px;

            font-family: 'Orbitron', sans-serif;

            animation: pulse 4s infinite;

        }

        @keyframes pulse {

            0%, 100% { opacity: 0.9; }

            50% { opacity: 1; filter: brightness(1.3); }

        }

        .ritual-instruction {

            max-width: 500px;

            line-height: 1.6;

            margin-bottom: 16px;

            color: #ccc;

            font-size: 16px;

        }

        .context-note {

            font-size: 14px;

            color: #aaa;

            margin: 16px 0;

            max-width: 400px;

            padding: 16px;

            background: rgba(122, 220, 128, 0.05);

            border-radius: 12px;

            border-left: 3px solid #4ade80;

        }

        .upload-zone {

            margin: 20px 0;

            padding: 24px;

            border: 2px dashed rgba(74, 220, 128, 0.3);

            border-radius: 16px;

            background: rgba(0,0,0,0.3);

            width: 80%;

            max-width: 400px;

        }

        #upload-btn {

            padding: 14px 28px;

            background: linear-gradient(90deg, #4ade80, #f87171);

            border: none;

            color: black;

            font-weight: 800;

            cursor: pointer;

            margin: 10px 0;

            border-radius: 12px;

            font-size: 16px;

            transition: all 0.3s;

        }

        #upload-btn:hover {

            transform: scale(1.03);

            box-shadow: 0 0 20px rgba(74, 220, 128, 0.4);

        }

        .artist-toggle {

            display: block;

            margin-top: 16px;

            color: #ccc;

            font-size: 14px;

        }

        .artist-toggle input {

            margin-right: 8px;

        }

        #main-canvas {

            display: none;

            width: 100%;

            height: 100%;

        }

        #bottom-bar {

            position: absolute;

            bottom: 0;

            left: 0;

            right: 0;

            padding: 16px 30px;

            display: none;

            justify-content: space-between;

            align-items: center;

            z-index: 50;

            background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);

        }

        #library-btn-ritual {

            padding: 10px 20px;

            background: rgba(74, 220, 128, 0.2);

            border: 1px solid #4ade80;

            color: #4ade80;

            border-radius: 10px;

            cursor: pointer;

            font-weight: 600;

            font-size: 14px;

        }

        #completion-btn {

            padding: 14px 28px;

            background: linear-gradient(90deg, #4ade80, #f87171);

            border: none;

            color: black;

            font-weight: 800;

            cursor: pointer;

            border-radius: 12px;

            font-size: 16px;

            transition: all 0.3s;

            box-shadow: 0 10px 30px rgba(74, 220, 128, 0.4);

        }

        #completion-btn:hover {

            transform: scale(1.05);

            box-shadow: 0 15px 40px rgba(74, 220, 128, 0.6);

        }

        #progress-indicator {

            color: #ccc;

            font-size: 14px;

            background: rgba(0,0,0,0.7);

            padding: 8px 16px;

            border-radius: 12px;

            border: 1px solid rgba(74, 220, 128, 0.3);

            display: none;

        }

        .guidance-hint {

            position: absolute;

            top: 50%;

            left: 50%;

            transform: translate(-50%, -50%);

            color: rgba(74, 220, 128, 0.9);

            font-size: 18px;

            font-weight: 600;

            text-align: center;

            max-width: 80%;

            padding: 20px;

            background: rgba(74, 220, 128, 0.1);

            border-radius: 20px;

            border: 1px solid rgba(74, 220, 128, 0.2);

            opacity: 0;

            transition: opacity 1s;

            z-index: 1000;

            pointer-events: none;

        }

        /* ======================= REVEAL SCREEN - FIXED LAYOUT ======================= */

        #reveal-screen {

            position: absolute;

            top: 0; left: 0; width: 100%; height: 100%;

            display: none;

            flex-direction: column;

            align-items: center;

            justify-content: flex-start;

            padding-top: 40px;

            background: #000;

            overflow-y: auto;

            z-index: 200;

            text-align: center;

        }

        #crystallized-title {

            font-size: 32px;

            font-weight: 800;

            font-family: 'Orbitron', sans-serif;

            background: linear-gradient(90deg, #4ade80, #f87171, #fb923c, #60a5fa, #c084fc, #fde047);

            -webkit-background-clip: text;

            -webkit-text-fill-color: transparent;

            background-clip: text;

            margin: 0 0 30px 0;

            animation: pulse 4s infinite;

        }

        #print-container {

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 30px;

            width: 100%;

            max-width: 900px;

        }

        #visual-print {

            max-width: 90%;

            max-height: 50vh;

            border: 1px solid rgba(74, 220, 128, 0.3);

            border-radius: 16px;

            box-shadow: 0 0 40px rgba(74, 220, 128, 0.25);

        }

        #player-container {

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 20px;

            width: 100%;

            max-width: 560px;

        }

        .audio-player {

            width: 100%;

            max-width: 560px;

        }

        .control-buttons {

            display: flex;

            flex-wrap: wrap;

            justify-content: center;

            gap: 14px;

            width: 100%;

        }

        .control-buttons button {

            flex: 1;

            min-width: 130px;

            padding: 12px 20px;

            border-radius: 12px;

            font-weight: 600;

            font-size: 15px;

            cursor: pointer;

            transition: all 0.3s;

        }

        .control-buttons .reward-btn {

            background: rgba(74, 220, 128, 0.2);

            border: 1px solid #4ade80;

            color: #4ade80;

        }

        .control-buttons .download-btn {

            background: rgba(96, 165, 250, 0.2);

            border: 1px solid #60a5fa;

            color: #60a5fa;

        }

        .control-buttons button:hover {

            transform: scale(1.06);

            box-shadow: 0 0 25px rgba(74, 220, 128, 0.5);

        }

        /* Landscape - side by side + buttons in one row */

        @media (orientation: landscape) {

            #print-container {

                flex-direction: row;

                justify-content: center;

                align-items: flex-start;

                gap: 50px;

            }

            #visual-print {

                max-width: 50%;

                max-height: 75vh;

            }

            .control-buttons {

                flex-wrap: nowrap;

            }

        }

        /* ======================= LIBRARY ======================= */

        #library-modal {

            position: absolute;

            top: 0; left: 0; width: 100%; height: 100%;

            background: #050508;

            display: none;

            flex-direction: column;

            z-index: 300;

            padding: 20px;

            box-sizing: border-box;

        }

        .library-header {

            display: flex;

            justify-content: space-between;

            align-items: center;

            margin-bottom: 16px;

        }

        .library-close {

            padding: 8px 16px;

            background: rgba(248, 113, 113, 0.2);

            border: 1px solid #f87171;

            color: #f87171;

            border-radius: 6px;

            cursor: pointer;

        }

        .library-tabs {

            display: flex;

            margin-bottom: 20px;

            flex-wrap: wrap;

            gap: 8px;

        }

        .library-tab {

            padding: 10px 20px;

            background: rgba(255,255,255,0.1);

            border-radius: 6px;

            cursor: pointer;

            color: #ccc;

            position: relative;

        }

        .library-tab.active {

            background: rgba(74, 220, 128, 0.3);

            color: white;

        }

        .library-tab .count {

            font-size: 11px;

            opacity: 0.7;

        }

        .print-grid {

            display: grid;

            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));

            gap: 16px;

            overflow-y: auto;

            flex: 1;

        }

        .print-card {

            border-radius: 8px;

            overflow: hidden;

            cursor: pointer;

            position: relative;

            background: #111;

            transition: transform 0.2s;

        }

        .print-card:hover {

            transform: scale(1.03);

        }

        .print-card img {

            width: 100%;

            display: block;

            height: 120px;

            object-fit: cover;

        }

        .print-card .meta {

            padding: 6px 8px;

            font-size: 12px;

            color: #ddd;

        }

        .print-card .meta .name {

            font-weight: 600;

            color: #4ade80;

        }

        .print-card .privacy-badge {

            position: absolute;

            top: 4px;

            right: 4px;

            font-size: 12px;

            background: rgba(0,0,0,0.6);

            padding: 2px 6px;

            border-radius: 4px;

        }

        .print-card .actions {

            position: absolute;

            bottom: 0;

            left: 0;

            right: 0;

            background: rgba(0,0,0,0.9);

            display: flex;

            padding: 4px;

            gap: 4px;

            opacity: 0;

            transition: opacity 0.3s;

        }

        .print-card:hover .actions {

            opacity: 1;

        }

        .print-card .actions button {

            flex: 1;

            background: rgba(74, 220, 128, 0.2);

            border: 1px solid #4ade80;

            color: #4ade80;

            font-size: 12px;

            cursor: pointer;

            border-radius: 4px;

            padding: 4px;

        }

        .empty-state {

            grid-column: 1 / -1;

            text-align: center;

            padding: 40px;

            color: #666;

        }

        /* ======================= PRINT DETAIL MODAL - FIXED LAYOUT ======================= */

        #print-detail-modal {

            position: absolute;

            top: 0; left: 0; width: 100%; height: 100%;

            background: #000;

            display: none;

            flex-direction: column;

            align-items: center;

            justify-content: flex-start;

            overflow-y: auto;

            z-index: 400;

            text-align: center;

            padding: 20px;

            box-sizing: border-box;

        }

        .detail-header {

            width: 100%;

            max-width: 900px;

            display: flex;

            justify-content: space-between;

            align-items: center;

            margin-bottom: 20px;

            flex-shrink: 0;

        }

        .detail-close {

            padding: 8px 16px;

            background: rgba(248, 113, 113, 0.2);

            border: 1px solid #f87171;

            color: #f87171;

            border-radius: 6px;

            cursor: pointer;

            flex-shrink: 0;

        }

        #print-container-detail {

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 30px;

            width: 100%;

            max-width: 900px;

            flex: 1;

            min-height: 0;

        }

        #visual-print-detail {

            max-width: 90%;

            max-height: 40vh;

            border: 1px solid rgba(74, 220, 128, 0.3);

            border-radius: 16px;

            box-shadow: 0 0 40px rgba(74, 220, 128, 0.25);

            object-fit: contain;

        }

        #player-container-detail {

            display: flex;

            flex-direction: column;

            align-items: center;

            gap: 20px;

            width: 100%;

            max-width: 560px;

            flex-shrink: 0;

        }

    </style>

</head>

<body>

    <div id="ritual-header">

        <div class="helix-indicator">

            <div class="helix-arm"></div>

            <div class="helix-arm"></div>

            <div class="helix-arm"></div>

        </div>

        <div class="user-ritual-info">

            <div class="ritual-name" id="display-name">F0UND3R</div>

            <div class="ritual-title" id="display-title">Architect</div>

            <div class="ritual-tribe" id="display-tribe">The Two Tribes</div>

        </div>

        <div id="timer">0:00</div>

    </div>


    <div id="prompt-screen">

        <div id="ritual-title">GENESIS RITUAL</div>

        <p class="ritual-instruction">Upload an MP3 to begin your ritual of gestural sovereignty.</p>

        <p class="context-note">

            Your performance will be recorded in full. At completion, a <strong>Sound Print</strong>—

            visual and audio—will be crystallized as governance evidence.

        </p>

        <div class="upload-zone" id="upload-zone">

            <p>Drag an MP3 here or click below</p>

            <input type="file" id="audio-upload" accept=".mp3,audio/*" style="display:none">

            <button id="upload-btn">Select MP3</button>

            <label class="artist-toggle">

                <input type="checkbox" id="flat-mode"> Start with all bands muted (-18dB)

            </label>

        </div>

    </div>


    <canvas id="main-canvas"></canvas>


    <div id="bottom-bar">

        <button id="library-btn-ritual" onclick="openLibrary()">Library</button>

        <div id="progress-indicator">Loading ritual space...</div>

        <button id="completion-btn" onclick="endSession()">COMPLETE RITUAL</button>

    </div>


    <div id="guidance-hint" class="guidance-hint">

        Tap anywhere to activate — finger rolls create rhythmic patterns

    </div>


    <!-- FIXED REVEAL SCREEN -->

    <div id="reveal-screen">

        <h2 id="crystallized-title">SOUND PRINT CRYSTALLIZED</h2>

        <div id="print-container">

            <img id="visual-print" src="" alt="Sound Print Visual">

            <div id="player-container">

                <p style="color:#ccc;max-width:400px;">Your performance has been recorded and crystallized as a unique Sound Print.</p>

                <audio class="audio-player" id="audio-player" controls></audio>

                <div class="control-buttons">

                    <button class="download-btn" onclick="downloadRecording()">Download Recording</button>

                    <button class="reward-btn" onclick="alterThisRecording()">Alter this Sound Print</button>

                    <button class="reward-btn" onclick="returnToRitual()">Return to 4B4KU5</button>

                    <button class="reward-btn" onclick="openLibrary()">View in Library</button>

                </div>

            </div>

        </div>

    </div>


    <!-- LIBRARY MODAL -->

    <div id="library-modal">

        <div class="library-header">

            <h3 style="margin:0;color:#4ade80;">Sound Print Library</h3>

            <button class="library-close" onclick="closeLibrary()">✕ Close</button>

        </div>

        <div class="library-tabs">

            <div class="library-tab active" data-tab="public" onclick="switchLibraryTab('public')">Public</div>

            <div class="library-tab" data-tab="private" onclick="switchLibraryTab('private')">Private <span class="count" id="private-count">(0/6)</span></div>

            <div class="library-tab" data-tab="trash" onclick="switchLibraryTab('trash')">Trash <span class="count" id="trash-count">(0/3)</span></div>

        </div>

        <div class="print-grid" id="print-grid"></div>

    </div>


    <!-- PRINT DETAIL MODAL - FIXED LAYOUT -->

    <div id="print-detail-modal">

        <div class="detail-header">

            <h2 id="detail-title" style="margin:0;color:#4ade80;font-family:'Orbitron';">Sound Print</h2>

            <button class="detail-close" onclick="closePrintDetail()">✕ Close</button>

        </div>

        <div id="print-container-detail">

            <img id="visual-print-detail" src="" alt="Sound Print Visual">

            <div id="player-container-detail">

                <p id="detail-meta" style="color:#ccc;max-width:400px;"></p>

                <audio class="audio-player" id="audio-player-detail" controls></audio>

                <div class="control-buttons">

                    <button class="download-btn" onclick="downloadPrintFromDetail()">Download</button>

                    <button class="reward-btn" onclick="alterPrintFromDetail()">Alter</button>

                    <button class="reward-btn" onclick="togglePrivacyFromDetail()">Toggle Privacy</button>

                    <button class="reward-btn" onclick="deletePrintFromDetail()">Delete</button>

                </div>

            </div>

        </div>

    </div>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>

        let RITUAL_DURATION = 360;

        let sessionTimer;

        let countdownInterval;

        let userData = {};

        let ritualActive = false;

        let audioInitialized = false;

        let audioBuffer = null;

        let sourceNode = null;

        let audioCtx;

        let mediaRecorder = null;

        let recordedChunks = [];

        let lastRecordedBlob = null;

        let crystallizing = false;

        let currentDetailPrint = null;

        let finalEQState = [];

        let ribbonLine = null;


        const CIRCLE_OF_SIX = [0x4ade80, 0xf87171, 0xfb923c, 0x60a5fa, 0xc084fc, 0xfde047];


        const guidanceMessages = [

            "Tap anywhere to activate — finger rolls create rhythmic patterns",

            "Your gestures create harmonic resonance across the grid",

            "Higher positions increase frequency, left to right increases pitch range",

            "The Triune Helix guides your path through the ritual space",

            "Your unique pattern begins to form — this will become your Sound Print",

            "The ribbon emerges in the final 36 seconds"

        ];

        let currentGuidanceIndex = 0;


        const PRIVATE_MAX = 6;

        const TRASH_MAX = 3;

        let currentLibraryTab = 'public';


        function getQueryParams() {

            const params = new URLSearchParams(window.location.search);

            userData = {

                id: params.get('id') || 'temp_' + Date.now(),

                name: params.get('name') || 'F0UND3R',

                tribe: params.get('tribe') || 'The Two Tribes',

                title: params.get('title') || 'Architect',

                tribeKey: params.get('tribeKey') || 'founder'

            };

            document.getElementById('display-name').textContent = userData.name;

            document.getElementById('display-title').textContent = userData.title;

            document.getElementById('display-tribe').textContent = userData.tribe;

        }

        getQueryParams();


        /* ==================== LIBRARY SYSTEM ==================== */

        function getLibrary(type) { return JSON.parse(localStorage.getItem(`4b4ku5_${type}`) || '[]'); }

        function setLibrary(type, data) { localStorage.setItem(`4b4ku5_${type}`, JSON.stringify(data)); }

        

        function saveToLibrary(print, privacy = 'public') {

            print.privacy = privacy;

            if (privacy === 'private') {

                let privateLib = getLibrary('private');

                if (privateLib.length >= PRIVATE_MAX) {

                    const oldest = privateLib.pop();

                    moveToTrash(oldest);

                }

                privateLib.unshift(print);

                setLibrary('private', privateLib);

            } else {

                let publicLib = getLibrary('public');

                publicLib.unshift(print);

                setLibrary('public', publicLib);

            }

            updateLibraryCounts();

        }

        

        function moveToTrash(print) {

            let trash = getLibrary('trash');

            if (trash.length >= TRASH_MAX) trash.pop();

            print.deletedAt = new Date().toISOString();

            trash.unshift(print);

            setLibrary('trash', trash);

            updateLibraryCounts();

        }

        

        function togglePrivacy(printId) {

            const publicLib = getLibrary('public');

            const privateLib = getLibrary('private');

            let pubIndex = publicLib.findIndex(p => p.id === printId);

            if (pubIndex !== -1) {

                const print = publicLib.splice(pubIndex, 1)[0];

                setLibrary('public', publicLib);

                saveToLibrary(print, 'private');

                renderPrintGrid(currentLibraryTab);

                return;

            }

            let privIndex = privateLib.findIndex(p => p.id === printId);

            if (privIndex !== -1) {

                const print = privateLib.splice(privIndex, 1)[0];

                setLibrary('private', privateLib);

                saveToLibrary(print, 'public');

                renderPrintGrid(currentLibraryTab);

            }

        }

        

        function deletePrint(printId, fromTab) {

            let lib = getLibrary(fromTab);

            const index = lib.findIndex(p => p.id === printId);

            if (index !== -1) {

                const print = lib.splice(index, 1)[0];

                setLibrary(fromTab, lib);

                if (fromTab !== 'trash') moveToTrash(print);

            }

            renderPrintGrid(currentLibraryTab);

            updateLibraryCounts();

        }

        

        function restoreFromTrash(printId) {

            let trash = getLibrary('trash');

            const index = trash.findIndex(p => p.id === printId);

            if (index !== -1) {

                const print = trash.splice(index, 1)[0];

                setLibrary('trash', trash);

                saveToLibrary(print, 'public');

            }

            renderPrintGrid(currentLibraryTab);

            updateLibraryCounts();

        }

        

        function updateLibraryCounts() {

            document.getElementById('private-count').textContent = `(${getLibrary('private').length}/${PRIVATE_MAX})`;

            document.getElementById('trash-count').textContent = `(${getLibrary('trash').length}/${TRASH_MAX})`;

        }


        function initAudio() {

            if (audioInitialized) return;

            try {

                audioCtx = new (window.AudioContext || window.webkitAudioContext)();

                audioInitialized = true;

            } catch (e) {

                console.error('Audio init failed:', e);

            }

        }


        /* ==================== THREE.JS SETUP ==================== */

        const scene = new THREE.Scene();

        scene.add(new THREE.AmbientLight(0x404040, 1.2));

        const pointLight = new THREE.PointLight(0xffffff, 1);

        pointLight.position.set(0, 0, 20);

        scene.add(pointLight);


        const canvas = document.getElementById('main-canvas');

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);

        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: true });

        renderer.setClearColor(0x000000, 1);

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


        const MAX_BANDS = 36;

        const MAX_ROWS = 36;

        const spheres = new Array(MAX_BANDS).fill(null).map(() => null);

        let activeRows = new Array(MAX_BANDS).fill(-1);

        let ribbonParticles = [];

        let gridParticles = [];


        const eqFilters = [];

        const bandFrequencies = Array.from({length: MAX_BANDS}, (_, i) => 20 * Math.pow(2, i / 3));


        function initEQChain() {

            for (let i = 0; i < MAX_BANDS; i++) {

                const filter = audioCtx.createBiquadFilter();

                filter.type = 'peaking';

                filter.frequency.value = bandFrequencies[i];

                filter.Q.value = 1.4;

                filter.gain.value = 0;

                if (i > 0) eqFilters[i-1].connect(filter);

                eqFilters.push(filter);

            }

        }


        function getColorForBand(bandIndex) {

            const segment = Math.floor(bandIndex / 6);

            const colorHex = CIRCLE_OF_SIX[Math.min(segment, 5)];

            return new THREE.Color(`#${colorHex.toString(16).padStart(6, '0')}`);

        }


        function createColumnSpheres(x) {

            if (!spheres[x]) spheres[x] = new Array(MAX_ROWS).fill(null);

            for (let y = 0; y < MAX_ROWS; y++) {

                if (spheres[x][y]) {

                    scene.remove(spheres[x][y]);

                    spheres[x][y].geometry.dispose();

                    spheres[x][y].material.dispose();

                }

                const material = new THREE.MeshStandardMaterial({

                    color: getColorForBand(x),

                    transparent: true,

                    opacity: 0.001 + (y / (MAX_ROWS - 1)) * 0.999,

                    roughness: 0.2,

                    metalness: 0.3,

                    emissive: getColorForBand(x),

                    emissiveIntensity: 0

                });

                const geometry = new THREE.SphereGeometry(0.02, 16, 16);

                const sphere = new THREE.Mesh(geometry, material);

                sphere.position.set((x / (MAX_BANDS - 1)) * 2 - 1, (y / (MAX_ROWS - 1)) * 2 - 1, 0);

                scene.add(sphere);

                spheres[x][y] = sphere;

            }

        }


        /* RIBBON LINE - TRACES FINAL EQ STATE */

        function createRibbonLine() {

            if (ribbonLine) {

                scene.remove(ribbonLine);

                ribbonLine.geometry.dispose();

                ribbonLine.material.dispose();

            }


            if (finalEQState.length === 0) return;


            const points = [];

            for (let i = 0; i < MAX_BANDS; i++) {

                const row = finalEQState[i] !== undefined ? finalEQState[i] : 0;

                const x = (i / (MAX_BANDS - 1)) * 2 - 1;

                const y = (row / (MAX_ROWS - 1)) * 2 - 1;

                points.push(new THREE.Vector3(x, y, 0.05));

            }


            const curve = new THREE.CatmullRomCurve3(points);

            const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.01, 8, false);

            const material = new THREE.MeshBasicMaterial({ 

                color: 0xffffff, 

                transparent: true, 

                opacity: 0.8,

                wireframe: false

            });

            ribbonLine = new THREE.Mesh(tubeGeometry, material);

            scene.add(ribbonLine);


            // RGB pulse animation

            let pulsePhase = 0;

            const animateRibbon = () => {

                if (!ritualActive && ribbonLine) {

                    pulsePhase += 0.05;

                    const r = Math.sin(pulsePhase) * 0.5 + 0.5;

                    const g = Math.sin(pulsePhase + 2) * 0.5 + 0.5;

                    const b = Math.sin(pulsePhase + 4) * 0.5 + 0.5;

                    ribbonLine.material.color.setRGB(r, g, b);

                    requestAnimationFrame(animateRibbon);

                }

            };

            animateRibbon();

        }


        function createGridParticleAt(x, y) {

            if (gridParticles.length > 200) return;

            const geometry = new THREE.SphereGeometry(0.008, 8, 8);

            const material = new THREE.MeshBasicMaterial({ color: getColorForBand(Math.floor(x * MAX_BANDS)), transparent: true, opacity: 0.6 });

            const particle = new THREE.Mesh(geometry, material);

            particle.position.set((x / (MAX_BANDS - 1)) * 2 - 1, (y / (MAX_ROWS - 1)) * 2 - 1, 0);

            particle.userData = { life: 1.0, velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0) };

            scene.add(particle);

            gridParticles.push(particle);

        }


        function updateGridParticles() {

            for (let i = gridParticles.length - 1; i >= 0; i--) {

                const p = gridParticles[i];

                p.userData.life -= 0.016;

                p.position.add(p.userData.velocity);

                p.material.opacity = p.userData.life * 0.6;

                if (p.userData.life <= 0) {

                    scene.remove(p);

                    gridParticles.splice(i, 1);

                }

            }

        }


        function handleInteraction(clientX, clientY) {

            const rect = canvas.getBoundingClientRect();

            const pointer = new THREE.Vector2();

            pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;

            pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;


            if (pointer.x < -1 || pointer.x > 1 || pointer.y < -1 || pointer.y > 1) return;


            const bandIndex = Math.floor((pointer.x + 1) / 2 * MAX_BANDS);

            const rowIndex = Math.floor((pointer.y + 1) / 2 * MAX_ROWS);


            if (bandIndex < 0 || bandIndex >= MAX_BANDS || rowIndex < 0 || rowIndex >= MAX_ROWS) return;


            if (!spheres[bandIndex]) createColumnSpheres(bandIndex);


            // deactivate previous

            const oldRow = activeRows[bandIndex];

            if (oldRow !== -1 && spheres[bandIndex][oldRow]) {

                spheres[bandIndex][oldRow].material.emissiveIntensity = 0;

            }


            activeRows[bandIndex] = rowIndex;

            if (spheres[bandIndex][rowIndex]) {

                const material = spheres[bandIndex][rowIndex].material;

                material.emissive = material.color.clone();

                material.emissiveIntensity = 2.0;

            }


            if (audioInitialized && eqFilters[bandIndex]) {

                const gainDB = (rowIndex / (MAX_ROWS - 1) * 36) - 18;

                eqFilters[bandIndex].gain.value = gainDB;

            }


            if (Math.random() < 0.3) createGridParticleAt(bandIndex, rowIndex);


            // Capture final state in last 36 seconds

            const timeText = document.getElementById('timer').textContent;

            const minutes = parseInt(timeText.split(':')[0]);

            const seconds = parseInt(timeText.split(':')[1]);

            const timeRemaining = minutes * 60 + seconds;

            if (timeRemaining <= 36) {

                finalEQState[bandIndex] = rowIndex;

            }

        }


        function onTouchStart(event) {

            if (!ritualActive || !audioInitialized) return;

            event.preventDefault();

            document.getElementById('guidance-hint').style.opacity = '0';

            for (let i = 0; i < event.touches.length; i++) {

                const touch = event.touches[i];

                handleInteraction(touch.clientX, touch.clientY);

            }

        }


        function onTouchMove(event) {

            if (!ritualActive || !audioInitialized) return;

            event.preventDefault();

            for (let i = 0; i < event.touches.length; i++) {

                const touch = event.touches[i];

                handleInteraction(touch.clientX, touch.clientY);

            }

        }


        function onMouseDown(event) {

            if (!ritualActive || !audioInitialized) return;

            document.getElementById('guidance-hint').style.opacity = '0';

            const rect = canvas.getBoundingClientRect();

            handleInteraction(event.clientX - rect.left, event.clientY - rect.top);

        }


        function onMouseMove(event) {

            if (!ritualActive || !audioInitialized) return;

            if (event.buttons !== 1) return;

            const rect = canvas.getBoundingClientRect();

            handleInteraction(event.clientX - rect.left, event.clientY - rect.top);

        }


        function showGuidanceMessage() {

            if (currentGuidanceIndex >= guidanceMessages.length || !ritualActive) return;

            const hint = document.getElementById('guidance-hint');

            hint.textContent = guidanceMessages[currentGuidanceIndex];

            hint.style.opacity = '1';

            setTimeout(() => {

                hint.style.opacity = '0';

                currentGuidanceIndex++;

                if (currentGuidanceIndex < guidanceMessages.length && ritualActive) {

                    setTimeout(showGuidanceMessage, currentGuidanceIndex === 5 ? 30000 : 15000);

                }

            }, 5000);

        }


        function onResize() {

            renderer.setSize(window.innerWidth, window.innerHeight);

            camera.updateProjectionMatrix();

        }


        function startCountdown() {

            let timeRemaining = RITUAL_DURATION;

            const timerEl = document.getElementById('timer');

            const update = () => {

                const minutes = Math.floor(timeRemaining / 60);

                const seconds = timeRemaining % 60;

                timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (timeRemaining === 180) timerEl.style.color = '#fb923c';

                if (timeRemaining === 60) {

                    timerEl.style.color = '#f87171';

                    timerEl.style.animation = 'pulse 1s infinite';

                }

            };

            update();

            

            countdownInterval = setInterval(() => {

                timeRemaining--;

                update();

                if (timeRemaining <= 0) {

                    clearInterval(countdownInterval);

                    endSession();

                }

            }, 1000);

        }


        /* FIXED: CRYSTALLIZATION NOW ALWAYS RESOLVES */

        function endSession() {

            if (!ritualActive || crystallizing) return;

            ritualActive = false;

            clearInterval(countdownInterval);


            crystallizing = true;

            

            if (sourceNode) {

                try { sourceNode.stop(); } catch(e) {}

                sourceNode = null;

            }


            const progressIndicator = document.getElementById('progress-indicator');

            progressIndicator.style.display = 'block';

            progressIndicator.textContent = 'Crystallizing Sound Print...';


            // Create ribbon from final state

            createRibbonLine();


            // Stop recording and force completion

            if (mediaRecorder && mediaRecorder.state !== 'inactive') {

                try { 

                    mediaRecorder.requestData(); 

                    mediaRecorder.stop();

                } catch(e) {

                    console.error('MediaRecorder stop failed:', e);

                }

            }


            // Aggressive fallback - always trigger

            setTimeout(() => {

                if (crystallizing) {

                    console.warn('Forcing crystallization');

                    completeSoundPrintCreation();

                }

            }, 500);

        }


        function completeSoundPrintCreation() {

            if (!crystallizing) return;

            crystallizing = false;

            

            const visualPrint = renderer.domElement.toDataURL('image/png');

            document.getElementById('visual-print').src = visualPrint;


            if (recordedChunks.length > 0) {

                lastRecordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });

                document.getElementById('audio-player').src = URL.createObjectURL(lastRecordedBlob);

            }


            const endedAt = new Date();

            const soundPrint = {

                id: `${userData.id}_${endedAt.getTime()}`,

                name: userData.name,

                tribe: userData.tribe,

                title: userData.title,

                image: visualPrint,

                timestamp: endedAt.toISOString().split('T')[0],

                duration: RITUAL_DURATION,

                privacy: 'public'

            };

            saveToLibrary(soundPrint, 'public');


            document.getElementById('main-canvas').style.display = 'none';

            document.getElementById('bottom-bar').style.display = 'none';

            document.getElementById('reveal-screen').style.display = 'flex';

            document.getElementById('progress-indicator').style.display = 'none';

        }


        function alterThisRecording() {

            if (!lastRecordedBlob) return alert('No recording to alter');

            document.getElementById('reveal-screen').style.display = 'none';

            document.getElementById('prompt-screen').style.display = 'flex';

            const file = new File([lastRecordedBlob], 'altered.webm', { type: 'audio/webm' });

            handleAudioUpload({ target: { files: [file] } });

        }


        function returnToRitual() { location.reload(); }


        function downloadRecording() {

            if (!lastRecordedBlob) return alert('No recording available');

            const url = URL.createObjectURL(lastRecordedBlob);

            const a = document.createElement('a');

            a.href = url;

            a.download = `4b4ku5_${Date.now()}.webm`;

            a.click();

            URL.revokeObjectURL(url);

        }


        function openLibrary() {

            document.getElementById('reveal-screen').style.display = 'none';

            document.getElementById('library-modal').style.display = 'flex';

            updateLibraryCounts();

            renderPrintGrid('public');

        }


        function closeLibrary() {

            document.getElementById('library-modal').style.display = 'none';

            if (lastRecordedBlob) {

                document.getElementById('reveal-screen').style.display = 'flex';

            } else {

                document.getElementById('prompt-screen').style.display = 'flex';

            }

        }


        function switchLibraryTab(tab) {

            currentLibraryTab = tab;

            document.querySelectorAll('.library-tab').forEach(el => {

                el.classList.remove('active');

                if (el.dataset.tab === tab) el.classList.add('active');

            });

            renderPrintGrid(tab);

        }


        function openPrintDetail(printId) {

            const allPrints = [...getLibrary('public'), ...getLibrary('private')];

            const print = allPrints.find(p => p.id === printId);

            if (!print) return;

            

            currentDetailPrint = print;

            document.getElementById('visual-print-detail').src = print.image;

            document.getElementById('detail-meta').textContent = `${print.name} • ${print.tribe} • ${print.duration}s • ${print.privacy}`;

            document.getElementById('detail-title').textContent = 'SOUND PRINT';

            

            if (recordedChunks.length > 0) {

                const blob = new Blob(recordedChunks, { type: 'audio/webm' });

                document.getElementById('audio-player-detail').src = URL.createObjectURL(blob);

            } else {

                document.getElementById('audio-player-detail').removeAttribute('src');

            }

            

            document.getElementById('library-modal').style.display = 'none';

            document.getElementById('print-detail-modal').style.display = 'flex';

        }


        function closePrintDetail() {

            document.getElementById('print-detail-modal').style.display = 'none';

            document.getElementById('library-modal').style.display = 'flex';

        }


        function downloadPrintFromDetail() {

            if (!lastRecordedBlob) return alert('No audio available for download');

            const url = URL.createObjectURL(lastRecordedBlob);

            const a = document.createElement('a');

            a.href = url;

            a.download = `4b4ku5_${currentDetailPrint.id}.webm`;

            a.click();

            URL.revokeObjectURL(url);

        }


        function alterPrintFromDetail() {

            if (!lastRecordedBlob) return alert('No recording to alter');

            document.getElementById('print-detail-modal').style.display = 'none';

            document.getElementById('prompt-screen').style.display = 'flex';

            const file = new File([lastRecordedBlob], 'altered.webm', { type: 'audio/webm' });

            handleAudioUpload({ target: { files: [file] } });

        }


        function togglePrivacyFromDetail() {

            if (!currentDetailPrint) return;

            togglePrivacy(currentDetailPrint.id);

            document.getElementById('detail-meta').textContent = `${currentDetailPrint.name} • ${currentDetailPrint.tribe} • ${currentDetailPrint.duration}s • ${currentDetailPrint.privacy}`;

            renderPrintGrid(currentLibraryTab);

        }


        function deletePrintFromDetail() {

            if (!currentDetailPrint) return;

            if (confirm('Delete this Sound Print?')) {

                deletePrint(currentDetailPrint.id, currentDetailPrint.privacy);

                closePrintDetail();

            }

        }


        function renderPrintGrid(tab) {

            const grid = document.getElementById('print-grid');

            const prints = getLibrary(tab);

            if (prints.length === 0) {

                grid.innerHTML = `<div class="empty-state">

                    ${tab === 'trash' ? 'Trash is empty' : tab === 'private' ? 'No private prints yet' : 'No public prints yet. Complete a ritual to create your first!'}

                </div>`;

                return;

            }

            grid.innerHTML = prints.map(print => `

                <div class="print-card" onclick="openPrintDetail('${print.id}')">

                    <img src="${print.image}" alt="Sound Print">

                    <span class="privacy-badge">${print.privacy === 'private' ? 'Private' : 'Public'}</span>

                    <div class="meta">

                        <div class="name">${print.name || 'Unknown'}</div>

                        <div class="tribe">${print.tribe} • ${print.duration}s</div>

                    </div>

                    <div class="actions" onclick="event.stopPropagation()">

                        <button onclick="openPrintDetail('${print.id}')" title="Play">▶</button>

                        <button onclick="togglePrivacy('${print.id}');event.stopPropagation();" title="Toggle Privacy">👁</button>

                        <button onclick="deletePrint('${print.id}', '${tab}');event.stopPropagation();" title="Delete">🗑</button>

                    </div>

                </div>

            `).join('');

        }


        async function startRitualWithAudio(buffer) {

            audioBuffer = buffer;

            RITUAL_DURATION = Math.max(120, Math.min(600, Math.floor(buffer.duration)));


            if (!audioInitialized) return alert('Audio system failed');


            initEQChain();


            const flatMode = document.getElementById('flat-mode').checked;

            activeRows.fill(flatMode ? 0 : MAX_ROWS - 1);

            eqFilters.forEach(f => f.gain.value = flatMode ? -18 : 0);


            sourceNode = audioCtx.createBufferSource();

            sourceNode.buffer = audioBuffer;

            sourceNode.connect(eqFilters[0]);

            eqFilters[eqFilters.length - 1].connect(audioCtx.destination);


            try {

                const dest = audioCtx.createMediaStreamDestination();

                eqFilters[eqFilters.length - 1].connect(dest);

                mediaRecorder = new MediaRecorder(dest.stream, {

                    mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'

                });

                recordedChunks = [];

                mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };

                mediaRecorder.onstop = completeSoundPrintCreation;

                mediaRecorder.start(100);

            } catch (e) {

                console.warn('Recording not supported', e);

            }


            sourceNode.start(0);

            sourceNode.onended = () => { if (ritualActive) endSession(); };


            document.getElementById('prompt-screen').style.display = 'none';

            canvas.style.display = 'block';

            document.getElementById('bottom-bar').style.display = 'flex';

            ritualActive = true;

            startCountdown();

            setTimeout(showGuidanceMessage, 2000);

            document.getElementById('progress-indicator').style.display = 'none';

        }


        function handleAudioUpload(e) {

            const file = e.target.files[0];

            if (!file) return;

            if (!audioInitialized) return alert('Audio not ready');


            document.getElementById('progress-indicator').style.display = 'block';

            document.getElementById('progress-indicator').textContent = 'Loading audio...';


            const reader = new FileReader();

            reader.onload = async () => {

                try {

                    const buffer = await audioCtx.decodeAudioData(reader.result);

                    startRitualWithAudio(buffer);

                } catch (err) {

                    alert('Invalid audio file');

                    document.getElementById('progress-indicator').style.display = 'none';

                }

            };

            reader.readAsArrayBuffer(file);

        }


        /* ==================== INIT ==================== */

        document.getElementById('upload-btn').onclick = () => {

            initAudio();

            if (!audioInitialized) return alert('Audio not supported');

            document.getElementById('audio-upload').click();

        };

        document.getElementById('audio-upload').onchange = handleAudioUpload;


        canvas.addEventListener('touchstart', onTouchStart, { passive: false });

        canvas.addEventListener('touchmove', onTouchMove, { passive: false });

        canvas.addEventListener('mousedown', onMouseDown);

        canvas.addEventListener('mousemove', onMouseMove);


        function animate() {

            requestAnimationFrame(animate);

            updateGridParticles();

            renderer.render(scene, camera);

        }


        window.addEventListener('resize', onResize);

        onResize();

        animate();

        updateLibraryCounts();

    </script>

</body>

</html>