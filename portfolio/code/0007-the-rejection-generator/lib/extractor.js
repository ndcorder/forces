/**
 * Text Extractor — parses submitted text into quotable fragments
 * for hallucinated reference in rejection letters.
 *
 Builds a "text profile" object containing:
 *   - sentences:      Array of clean, complete sentences
 *   - fragments:      Short phrases (2-6 words) extracted from the text
 *   - keywords:       Significant nouns and adjectives (pseudo-keyword extraction)
 *   - themes:         Inferred "themes" based on word frequency and patterns
 *   - stats:          Word count, sentence count, paragraph count, reading time
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Words too common to be thematic or useful as keywords
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','it','its','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'can','this','that','these','those','i','me','my','mine','we','us','our',
  'you','your','yours','he','him','his','she','her','hers','they','them',
  'their','theirs','what','which','who','whom','whose','where','when','why',
  'how','all','each','every','both','few','more','most','other','some','such',
  'no','not','only','own','same','so','than','too','very','just','because',
  'as','until','while','about','between','through','during','before','after',
  'above','below','up','down','out','off','over','under','again','further',
  'then','once','here','there','also','into','if','am','are','been','much',
  'many','still','even','back','way','around','long','great','little','right',
  'good','well','like','new','old','big','small','last','next','first','get',
  'got','go','went','come','came','make','made','know','knew','think','thought',
  'say','said','take','took','see','saw','give','gave','tell','told','find',
  'found','let','put','seem','seemed','feel','felt','keep','kept','leave',
  'left','begin','began','show','showed','hear','heard','play','run','move',
  'live','believe','bring','brought','happen','happened','write','written',
  'sit','sat','stand','stood','lose','lost','pay','meet','met','include',
  'continue','set','learn','change','lead','understand','understood','watch',
  'follow','stop','create','speak','spoke','read','allow','add','spend',
  'grow','open','walk','win','offer','remember','love','consider','appear',
  'buy','wait','serve','die','send','sent','expect','build','stay','fall',
  'fell','cut','reach','kill','remain','really','quite','rather','enough',
  'almost','already','always','another','anything','something','everything',
  'nothing','maybe','though','although','whether','since','yet','however',
  'thus','therefore','indeed','perhaps','never','often','sometimes','usually',
  'especially','particularly','certainly','simply','actually','obviously',
  'clearly','apparently','basically','essentially','literally','exactly',
  'probably','definitely','completely','entirely','extremely','fairly',
  'nearly','slightly','somewhat','hardly','merely','mostly','specifically'
]);

// Thematic categories with associated trigger words
const THEME_CATEGORIES = {
  'identity': ['self','identity','mirror','reflection','who','am','becoming','name','born','remember','memory','forget','past','childhood'],
  'loss': ['loss','gone','missing','empty','absence','grief','mourning','death','dying','dead','widow','orphan','departed','vanished'],
  'nature': ['river','mountain','ocean','forest','tree','flower','bird','sky','rain','wind','storm','sun','moon','star','earth','sea','lake','garden'],
  'urban': ['city','street','building','traffic','subway','apartment','neighborhood','downtown','sidewalk','neon','concrete','glass','steel','cab'],
  'love': ['love','heart','kiss','embrace','desire','passion','romance','lover','beloved','wedding','marriage','together','alone','jealousy'],
  'family': ['mother','father','sister','brother','daughter','son','parent','child','baby','grandmother','grandfather','uncle','aunt','cousin','home'],
  'time': ['time','clock','hour','minute','second','yesterday','tomorrow','morning','evening','dusk','dawn','midnight','century','decade','moment'],
  'technology': ['computer','phone','screen','digital','algorithm','data','internet','code','machine','robot','signal','network','virtual','electric'],
  'violence': ['war','blood','fight','kill','weapon','gun','knife','battle','soldier','army','enemy','attack','bomb','explode','wound','scar'],
  'body': ['body','hand','eye','skin','bone','blood','breath','mouth','tongue','finger','hair','face','chest','pulse','vein','muscle','flesh'],
  'memory': ['memory','remember','forget','recall','remind','nostalgia','photograph','letter','diary','journal','archive','preserve','vanish'],
  'faith': ['god','prayer','church','faith','belief','sacred','holy','divine','spirit','soul','angel','heaven','hell','sin','redemption','grace'],
  'silence': ['silence','quiet','hush','mute','whisper','still','frozen','pause','breath','empty','void','nothing','blank','noise'],
  'migration': ['journey','travel','road','path','border','crossing','exile','refugee','immigrant','depart','arrive','wander','drift','bridge'],
  'water': ['water','river','rain','ocean','sea','lake','stream','tear','flood','drown','wave','current','tide','depth','surface','liquid'],
  'animal': ['dog','cat','bird','fish','horse','wolf','snake','rabbit','deer','fox','crow','whale','butterfly','spider','bear','insect','fly'],
  'art': ['art','paint','canvas','museum','gallery','sculpture','dance','music','song','poem','story','novel','write','create','brush','color'],
  'food': ['bread','wine','cook','eat','hunger','taste','flavor','recipe','kitchen','dinner','meal','feast','starve','spice','fruit','sweet'],
  'power': ['king','queen','throne','crown','power','rule','command','empire','kingdom','rebellion','revolution','protest','law','judge','justice']
};

/**
 * Clean and normalize a line of text.
 */
function cleanLine(line) {
  return line.trim().replace(/\s+/g, ' ');
}

/**
 * Extract sentences from text, preserving some punctuation context.
 */
function extractSentences(text) {
  // Split on sentence-ending punctuation followed by space or end
  // Keep the punctuation with the sentence
  const raw = text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/);

  return raw
    .map(s => s.trim())
    .filter(s => s.length > 10) // discard very short fragments
    .filter(s => {
      // Must contain at least one letter
      return /[a-zA-Z]/.test(s);
    })
    .slice(0, 200); // reasonable upper bound
}

/**
 * Extract shorter fragments (2-6 words) from the text.
 * These are useful for partial "quotations" that sound plausible.
 */
function extractFragments(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const fragments = [];
  const lengths = [2, 3, 4, 5];

  for (const len of lengths) {
    for (let i = 0; i <= words.length - len; i += Math.max(1, Math.floor(len * 0.7))) {
      const chunk = words.slice(i, i + len).join(' ');
      // Clean up the fragment
      const clean = chunk
        .replace(/^\W+/, '')
        .replace(/\W+$/, '')
        .trim();
      if (clean.length > 6 && clean.length < 50 && /[a-zA-Z]{3,}/.test(clean)) {
        fragments.push(clean);
      }
    }
  }

  // Deduplicate and shuffle
  const unique = [...new Set(fragments)];
  return shuffle(unique).slice(0, 300);
}

/**
 * Extract keywords — significant words (mostly nouns and long words).
 */
function extractKeywords(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .filter(w => !STOP_WORDS.has(w))
    .filter(w => {
      // Skip words that are mostly punctuation
      const alphaCount = (w.match(/[a-z]/g) || []).length;
      return alphaCount / w.length > 0.7;
    });

  // Count frequencies
  const freq = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  // Sort by frequency, take top keywords
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([word, count]) => ({ word, count }));

  return sorted;
}

/**
 * Infer themes from the text based on keyword matching.
 */
function inferThemes(keywords, text) {
  const lowerText = text.toLowerCase();
  const themeScores = {};

  for (const [theme, triggers] of Object.entries(THEME_CATEGORIES)) {
    let score = 0;
    for (const trigger of triggers) {
      // Check if trigger appears in keywords or text
      const keywordMatch = keywords.find(k => k.word === trigger);
      if (keywordMatch) {
        score += keywordMatch.count * 2;
      }
      // Also count raw occurrences in text (with word boundaries)
      const regex = new RegExp(`\\b${trigger}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      themeScores[theme] = score;
    }
  }

  // Return themes sorted by score
  return Object.entries(themeScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme, score]) => ({ theme, score }));
}

/**
 * Compute basic text statistics.
 */
function computeStats(text) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = extractSentences(text);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 238)); // avg reading speed

  return {
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    readingTimeMinutes: readingTime,
    averageWordLength: wordCount > 0
      ? (words.reduce((sum, w) => sum + w.replace(/[^a-z]/gi, '').length, 0) / wordCount).toFixed(1)
      : 0,
    longestWord: words.reduce((longest, w) => {
      const clean = w.replace(/[^a-z]/gi, '');
      return clean.length > longest.length ? clean : longest;
    }, ''),
    characterCount: text.length
  };
}

/**
 * Fisher-Yates shuffle.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a text profile from raw text input.
 *
 * @param {string} text - The full submitted text
 * @returns {object} Text profile with sentences, fragments, keywords, themes, stats
 */
function buildProfile(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      sentences: [],
      fragments: [],
      keywords: [],
      themes: [],
      stats: {
        wordCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        readingTimeMinutes: 0,
        averageWordLength: '0',
        longestWord: '',
        characterCount: 0
      },
      title: null,
      raw: ''
    };
  }

  // Attempt to extract a title (first line or first short line)
  const lines = text.split('\n').map(cleanLine).filter(l => l.length > 0);
  const title = lines[0].length < 80 ? lines[0] : null;

  const sentences = extractSentences(text);
  const fragments = extractFragments(text);
  const keywords = extractKeywords(text);
  const themes = inferThemes(keywords, text);
  const stats = computeStats(text);

  // Categorize sentences by length for different uses
  const shortSentences = sentences.filter(s => s.length < 60);
  const mediumSentences = sentences.filter(s => s.length >= 60 && s.length < 120);
  const longSentences = sentences.filter(s => s.length >= 120);

  return {
    sentences,
    shortSentences,
    mediumSentences,
    longSentences,
    fragments,
    keywords,
    themes,
    stats,
    title,
    raw: text
  };
}

/**
 * Get a random sentence from the profile.
 */
function randomSentence(profile, preferLength) {
  const pool = preferLength === 'short' ? profile.shortSentences
             : preferLength === 'medium' ? profile.mediumSentences
             : preferLength === 'long' ? profile.longSentences
             : profile.sentences;

  if (!pool || pool.length === 0) {
    return profile.sentences[0] || 'the submission contains text';
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get a random fragment from the profile.
 */
function randomFragment(profile) {
  if (!profile.fragments || profile.fragments.length === 0) {
    return 'the text itself';
  }
  return profile.fragments[Math.floor(Math.random() * profile.fragments.length)];
}

/**
 * Get a random keyword from the profile.
 */
function randomKeyword(profile) {
  if (!profile.keywords || profile.keywords.length === 0) {
    return 'word';
  }
  return profile.keywords[Math.floor(Math.random() * profile.keywords.length)].word;
}

/**
 * Misquote a sentence — introduce small alterations to make it feel
 * like the editor misread or misremembered it.
 */
function misquote(sentence) {
  const strategies = [
    // Replace a word with a similar-sounding one
    (s) => {
      const words = s.split(' ');
      const idx = Math.floor(Math.random() * words.length);
      const word = words[idx].toLowerCase();
      const swaps = {
        'the': 'that', 'a': 'the', 'my': 'our', 'is': 'was',
        'was': 'is', 'had': 'has', 'his': 'this', 'her': 'their',
        'not': 'now', 'all': 'each', 'one': 'some', 'like': 'as',
        'into': 'in', 'through': 'throughout', 'never': 'ever',
        'always': 'never', 'here': 'there', 'now': 'then',
        'good': 'well', 'great': 'grand', 'long': 'vast',
        'night': 'dark', 'day': 'light', 'old': 'ancient',
        'young': 'new', 'dark': 'dim', 'light': 'bright',
        'come': 'go', 'went': 'came', 'said': 'wrote',
        'see': 'saw', 'love': 'desire', 'life': 'world',
        'heart': 'soul', 'hand': 'arm', 'face': 'head',
        'eyes': 'gaze', 'voice': 'sound', 'world': 'earth',
        'home': 'house', 'think': 'feel', 'know': 'believe',
        'time': 'age', 'place': 'space', 'man': 'boy',
        'woman': 'girl', 'child': 'children', 'water': 'rain',
        'fire': 'flame', 'air': 'wind', 'name': 'word'
      };
      const replacement = swaps[word] || swaps[words[idx].replace(/[^a-z]/gi, '').toLowerCase()];
      if (replacement) {
        words[idx] = words[idx].replace(new RegExp(word, 'i'), replacement);
      }
      return words.join(' ');
    },
    // Remove a word
    (s) => {
      const words = s.split(' ');
      if (words.length > 4) {
        const idx = Math.floor(Math.random() * (words.length - 2)) + 1;
        words.splice(idx, 1);
      }
      return words.join(' ');
    },
    // Add a hedge word
    (s) => {
      const hedges = ['perhaps', 'maybe', 'somehow', 'almost', 'rather'];
      const hedge = hedges[Math.floor(Math.random() * hedges.length)];
      const words = s.split(' ');
      const insertAt = Math.floor(Math.random() * Math.min(5, words.length));
      words.splice(insertAt, 0, hedge);
      return words.join(' ');
    },
    // Truncate mid-sentence
    (s) => {
      const words = s.split(' ');
      if (words.length > 6) {
        const cutAt = Math.floor(Math.random() * (words.length - 3)) + 4;
        return words.slice(0, cutAt).join(' ') + '—';
      }
      return s;
    }
  ];

  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  return strategy(sentence);
}

/**
 * Read text from a file path.
 */
function readFromFile(filePath) {
  const resolved = path.resolve(filePath);
  return fs.readFileSync(resolved, 'utf-8');
}

/**
 * Read text from stdin (returns a Promise).
 */
function readFromStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);

    // If stdin is a TTY (terminal, not piped), resolve with empty
    if (process.stdin.isTTY) {
      resolve('');
    }
  });
}

module.exports = {
  buildProfile,
  randomSentence,
  randomFragment,
  randomKeyword,
  misquote,
  readFromFile,
  readFromStdin,
  extractSentences,
  extractFragments,
  extractKeywords,
  inferThemes,
  computeStats,
  shuffle
};
