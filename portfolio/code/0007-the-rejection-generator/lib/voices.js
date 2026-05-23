/**
 * Editor Voice Definitions
 *
 * Six distinct literary magazine editor archetypes, each containing:
 *   - name:            Display name of the editor/magazine
 *   - id:              Unique identifier for CLI selection
 *   - description:     Brief character description
 *   - greeting:        Opening templates (may include {name}, {title})
 *   - closings:        Sign-off templates
 *   - vocabulary:      Word banks for characteristic language
 *   - templates:       Body paragraph templates with {placeholders}
 *   - contradictions:  Pairs of contradictory feedback statements
 *   - flourishes:      Voice-specific decorative text elements
 *   - metaTemplates:   Special templates for self-rejection mode
 */

'use strict';

const VOICES = {
  academic: {
    id: 'academic',
    name: 'Dr. Percival Blackwood III',
    magazine: 'The Parnassus Review',
    description: 'The Condescending Academic — tenured since 1987, has not published creative work in 14 years, chairs the editorial board.',
    greeting: [
      'Dear {name},',
      'Dear Submitter,',
      'Dear {name} (if that is indeed your real name),',
      'To the individual who submitted under the name {name},',
      'Dear Aspirant,',
      'Dear {name}, BA (presumably),',
      'Author ({name}),'
    ],
    closings: [
      'Better luck elsewhere.\nDr. Percival Blackwood III\nSenior Editor, The Parnassus Review\nChair, Department of Comparative Literature (Emeritus)',
      'I trust you will take this in the spirit of rigorous intellectual engagement it is offered.\nProf. P. Blackwood III\nThe Parnassus Review',
      'Do feel free to submit again in 3-5 years, when your craft has matured.\nDr. Blackwood\nEditorial Board',
      'Cordially, with reservations,\nDr. Percival Blackwood III\nThe Parnassus Review\nP.S. I have published over forty articles on the semiotics of rejection.',
      'In scholarly fellowship (limited),\nProf. Blackwood\nThe Parnassus Review'
    ],
    vocabulary: {
      intensifiers: ['profoundly', 'markedly', 'considerably', 'decidedly', 'demonstrably', ' palpably', 'inescapably', 'self-evidently'],
      criticisms: ['derivative', 'undertheorized', 'overwrought', 'undercooked', 'indifferent', 'unmoored', 'undisciplined', 'jejune', 'sophomoric', 'callow', 'unripe', 'precious', 'mannered', 'facile', 'glib'],
      praises: ['competent', 'serviceable', 'adequate', 'promising (in parts)', 'not without merit', 'occasionally functional', 'legible', 'grammatically presentable'],
      hedgePhrases: [
        'One might charitably observe that',
        'It has been argued (not convincingly) that',
        'If one squints, one could almost say',
        'There exists a reading of this text wherein',
        'A generous interpretation might suggest that',
        'While I hesitate to dignify this with analysis,',
        'In the interest of pedagogical thoroughness,',
        'My second reader, who is far more patient than I, felt that'
      ],
      latinPhrases: ['ipso facto', 'a priori', 'prima facie', 'mutatis mutandis', 'ceteris paribus', 'sui generis', 'non sequitur', 'de trop', 'je ne sais quoi', 'Weltanschauung', 'Bildungsroman', 'Zeitgeist'],
      jargon: ['narrative architecture', 'thematic valences', 'discursive formation', 'intertextual resonance', 'hermeneutic gesture', 'semiotic register', 'polyphonic discourse', 'diegetic coherence', 'temporal scaffolding', 'lyric subjetivity']
    },
    templates: [
      'I have read your submission — "{quotedLine}" — with the same attention I bring to undergraduate essays, which is to say, a glass of scotch and a red pen.\n\nThe piece is {criticism1}. Not irredeemably so, but certainly {criticism2} in ways that suggest a cursory familiarity with the {theme1} tradition at best.',

      'Your handling of the {theme1} material is {criticism1}. The passage concerning "{misquotedLine}" (page {fakePage}), while grammatically presentable, lacks the {jargon} necessary to sustain a reader\'s engagement beyond the first paragraph.',

      'I must note that your use of "{fragment}" as a recurring motif is, frankly, {criticism1}. One thinks of {referenceAuthor}\'s earlier work on {theme1}, which handled similar terrain with considerably more {abstractPositive}. Your piece, by contrast, {negativeComparison}.',

      'The Parnassus Review receives approximately {fakeNumber} submissions per quarter. Yours was ranked {badRank} by our editorial board. I share this not to discourage but to contextualize — your work exists within a {criticism1} tradition that we, frankly, have seen rendered more convincingly by {referenceAuthor}.',

      'Your manuscript\'s relationship to {theme1} is, to put it charitably, {criticism1}. The line "{misquotedLine}" might, in a graduate workshop, be described as {criticism2}. I am not in a graduate workshop. I am in my office, with tenure, and I am telling you that this needs work.',

      'While there are moments — "{quotedLine}" has a certain lumbering energy — the overall piece suffers from a {criticism1} approach to {jargon}. The ending, in particular, reads as though you lost interest in your own {theme1}, which, {hedgePhrase}, I cannot blame you for.',

      'Let us speak frankly. The piece begins with "{fragment}" and does not meaningfully escalate from there. Your prose style is {criticism1}. Your thematic ambitions regarding {theme1} are {criticism2}. The combination is not synergistic.'
    ],
    contradictions: [
      ['The pacing is glacial — nothing happens for pages at a time.', 'The narrative moves with unseemly haste, galloping past moments that deserved lingered attention.'],
      ['Your imagery is overwrought and suffocating.', 'The piece lacks any vivid or memorable image.'],
      ['The narrator\'s voice is gratingly present on every page.', 'I finished the piece with no sense of who was speaking or why.'],
      ['The thematic content is stated so explicitly it borders on lecture.', 'Your thematic intentions are entirely opaque — I defy any reader to discern what this piece is about.'],
      ['The piece is excessively minimalist.', 'The piece is embarrassingly overgrown with unnecessary detail.'],
      ['Your restraint is, frankly, a form of cowardice.', 'Your lack of restraint suggests an inability to self-edit.'],
      ['The language is mannered beyond all endurance.', 'The prose has all the personality of a municipal water report.'],
      ['You have clearly over-researched this topic.', 'It is painfully evident that you have no idea what you are writing about.']
    ],
    flourishes: [
      '(See my article, "Toward a Phenomenology of Rejection," Parnassus Quarterly, Vol. 34, pp. 112-178.)',
      'I discussed your submission with my colleague at Yale. She laughed.',
      'For further reading, I recommend my own monograph on the subject.',
      'I have been editing this magazine since before you were born. Possibly before your parents were born.',
      'Our acceptance rate is 0.3%. I mention this so you understand the caliber of work you are competing with.',
      'In my thirty-seven years on the editorial board, I have seen stronger pieces from high school students.',
      'I graded papers this morning that showed more narrative sophistication. Those papers received C-minuses.'
    ],
    references: ['Proust', 'Joyce', 'Woolf', 'Borges', 'Kafka', 'Beckett', 'Eliot (T.S., not George)', 'Nabokov', 'Calvino', 'Bolaño', 'DeLillo', 'Morrison', 'García Márquez', 'Austen (early)', 'De Beauvoir', 'Barthes', 'Derrida', 'Foucault', 'Lacan', 'Kristeva', 'Bakhtin'],
    abstractPositives: ['rigor', 'finesse', 'precision', 'gravitas', 'intellectual heft', 'hermeneutic generosity', 'epistemological courage', 'textual integrity', 'narrative confidence', 'lyric precision'],
    negativeComparisons: [
      'reads like a first draft composed during a power outage',
      'has the structural integrity of a wet newspaper',
      'possesses all the thematic depth of a puddle in a parking lot',
      'would benefit from the application of actual craft',
      'reads as though the author\'s primary influence was their own navel',
      'reminds one of student work — not good student work'
    ],
    metaTemplates: [
      'I have reviewed the source code of "rejection-generator.js" and I must say, the variable naming conventions are {criticism}. The function `buildProfile` attempts to extract meaning from text — an ambition that is, itself, a kind of {criticism} gesture.',
      'The extractor module, with its {length} lines, is {criticism}. One notes the STOP_WORDS list, which, like the author\'s sense of literary judgment, is simultaneously too long and not comprehensive enough.',
      'Your `misquote` function is, I must observe, the most honest part of this entire project. It produces inaccuracies with the same mechanical indifference that you bring to your editorial persona.'
    ]
  },

  intern: {
    id: 'intern',
    name: 'Kayla (she/her)',
    magazine: 'Split Lip Magazine',
    description: 'The Overwhelmed Intern — unpaid, working the slush pile between Zoom classes, has been awake for 31 hours.',
    greeting: [
      'Hi {name}!!',
      'Hey {name},',
      'oh hi {name}',
      'Hey! {name} right?',
      'Hiiii {name},',
      'ok so {name},',
      '{name}!! Hey!'
    ],
    closings: [
      'okay bye!!\nKayla\n(intern, Split Lip Magazine)\n(she/her)\n(PLEASE do not reply-all)',
      'thanks for submitting!!\n- Kayla\nSplit Lip Magazine Intern Team\n(i\'m not sure if i\'m supposed to sign off like that but whatever)',
      'sending good vibes!\nKayla 🌻\nSplit Lip Magazine\n(they don\'t let us use emojis in official correspondence but i\'m an intern so)',
      'best of luck with your writing journey!!\nKayla\n(p.s. i also write poetry!! my insta is @kayla_writes_sometimes if u want to follow!!)',
      'xoxo\nKayla\nIntern, Split Lip Magazine\n(start unpaid internship next week lol pray for me)',
      'yours in literature or whatever,\nKayla\n(i\'ve been here for 3 weeks and i still don\'t know how to use the submission manager)'
    ],
    vocabulary: {
      intensifiers: ['so', 'really', 'super', 'incredibly', 'honestly', 'literally', 'kinda', 'way', 'definitely', 'tbh'],
      criticisms: ['confusing', 'a lot', 'much', 'a bit much tbh', 'interesting (not sure if in a good way)', 'hard to follow lol', 'kind of a lot going on', 'vibes are off', 'giving very 2019 energy'],
      praises: ['cool', 'neat', 'pretty good!', 'actually kind of fire', 'def has potential', 'love that for you', 'slaps (in parts)', 'valid'],
      reactions: ['omg', 'lmao', 'rip', 'yikes', 'haha', 'wow', 'oof', 'ngl', 'tbh', 'like...', 'ok but', 'wait'],
      filler: ['honestly', 'like', 'I think??', 'maybe?', 'sort of', 'in a way', 'if that makes sense?', 'you know?', 'idk']
    },
    templates: [
      'ok so I read your piece and I have THOUGHTS. The part where you wrote "{quotedLine}" — like, I actually had a moment?? But then the part with "{fragment}" got {reaction} and I kinda got lost ngl.',

      'Hiii okay so I\'m technically not supposed to send these without my editor looking at them first but she\'s in a meeting and your piece has been in my queue since Tuesday so here we go!!\n\nThe piece is... {criticism}. Like "{misquotedLine}" — I read that and was like, {reaction}. In a good way? Maybe? I\'ve been awake for a while.',

      'Wait I just realized I was supposed to be reading the poetry submissions and I think yours is fiction?? Whatever the system is kind of broken anyway. Your thing about {theme1} is {criticism}. "{fragment}" is a choice!',

      'So real talk — I\'ve read like 200 submissions today and yours is {praise}! Not in a bad way! Well, some of it is {criticism}. The line "{quotedLine}" really {reaction}\'d me. Is that a word? It is now lol.',

      'Omg I just noticed your piece is {wordCount} words and I was supposed to flag anything over {wordLimit} soooo my editor is probably going to be annoyed at both of us haha. Anyway the {theme1} stuff is {criticism}. "{fragment}" made me feel {feeling} which I think is what you wanted??',

      'okay I asked the other intern (Marcus) what he thought and he said your piece "lacks narrative cohesion" but Marcus also thought {dumbOpinion} so take that with a grain of salt. I thought "{quotedLine}" was {praise}! The rest was {criticism} but like, in a fixable way?? maybe??'
    ],
    contradictions: [
      ['It\'s too short — I was just getting into it and then it ended!', 'Honestly it\'s kind of long?? Like I had stuff to do today.'],
      ['The writing is so flowery and pretty!', 'I think you could use more interesting words.'],
      ['I loved the main character!', 'Wait, who was the main character again?'],
      ['Your piece is super original!', 'It kinda reminds me of every other submission I read this week.'],
      ['The ending was so surprising!', 'I totally saw that ending coming from like page one.'],
      ['Your style is really unique!', 'Have you read {popularAuthor}? Your thing is basically that.'],
      ['The emotion in this is so raw and real.', 'I didn\'t really feel anything but that might be the sleep deprivation talking.']
    ],
    flourishes: [
      '(sorry if this is unprofessional, this is my first editorial internship)',
      '(I\'m writing this on my phone in the campus library lol)',
      '(my editor said to use the official template but I lost it)',
      '(fun fact: you\'re submission #847 today!!)',
      '(Marcus just looked over and said I should be nicer so: it\'s not THAT bad)',
      '(I\'ve had five coffees and my hands are shaking but your piece was something to read!)',
      '(sorry for all the parentheticals, my professor says I do that too much in my essays too)',
      '(I\'m going to pass out after I send this)'
    ],
    feelings: ['things', 'ways', 'emotions probably', 'some type of way', 'weird but not bad weird', 'seen', 'called out ngl', 'a type of way I can\'t articulate', 'feelings. capital F feelings'],
    dumbOpinions: ['Finnegans Wake was easy to read', 'poetry isn\'t real writing', 'fanfic could never be literary', 'the Oxford comma is unnecessary', 'audiobooks count as reading more than regular books', 'Shakespeare would\'ve written for Marvel'],
    wordLimits: [3000, 5000, 7500],
    metaTemplates: [
      'ok so I was supposed to review this rejection-generator tool and??? it\'s a NODE app?? my bootcamp instructor said Node was for "real developers" so that\'s cool I guess. The extractor.js file has like {length} lines which seems like a lot but I don\'t really know what a normal amount of lines is.',
      'I ran the tool on itself and it generated a rejection of itself which is, like, SO meta?? The part where it quotes its own code is {criticism}. My brain hurts. I\'ve been debugging my own code for 6 hours and now I\'m reading a tool that rejects itself. This is fine.',
      'the voices.js file has a whole section for an intern voice and it\'s... a choice. "{misquotedLine}" is apparently what the author thinks interns sound like. As an actual intern, I\'m choosing not to be offended but Marcus says I should be.'
    ]
  },

  mystic: {
    id: 'mystic',
    name: 'The Oracle',
    magazine: 'Eclipse Quarterly',
    description: 'The Cryptic Mystic — no one has seen their face. Communication is hand-calligraphied on vellum, scanned at 72dpi.',
    greeting: [
      'Beloved {name},',
      'Child of {name},',
      '{name}. I have been expecting you.',
      'Dear one who calls themselves {name},',
      'To the soul named {name}, if names are real (they are not),',
      '{name} — the letters rearrange themselves as I write.',
      'Dear {name}, who arrived at this inbox through the gravity of coincidence,'
    ],
    closings: [
      'The Oracle\nEclipse Quarterly\n transmissions from the other side of the slush pile',
      'In the space between acceptance and rejection, there is only this letter.\n— O.',
      'Go in peace. Or don\'t. The universe has already decided.\n— The Oracle, Eclipse Quarterly',
      'Your submission has been returned to the ether from which it came.\nBlessings and warnings,\nThe Oracle',
      'I have seen your future. It contains other rejection letters.\n— O.\nEclipse Quarterly',
      'May your words find their true frequency elsewhere.\n— The Oracle\n(written during the hour of Saturn)'
    ],
    vocabulary: {
      mysticPhrases: ['vibrates at a frequency of', 'resonates with the void', 'calls to the ancient patterns', 'exists in the space between', 'remembers what has not yet happened', 'glows with a light that is not light', 'echoes across dimensions', 'speaks in tongues that are not tongues', 'hums with the sound of becoming', 'dissolves upon contact with meaning'],
      energies: ['mercurial', 'chthonic', 'ethereal', 'telluric', 'abyssal', 'numinous', 'luminous', 'tenebrous', 'liminal', 'astral', 'lunar', 'solar', 'void-touched', 'karmically dense', 'aurically unstable'],
      phenomena: ['an eclipse of meaning', 'a conjunction of unrelated intentions', 'a retrograde of purpose', 'a vibration at the wrong frequency', 'a misalignment of cosmic grammar', 'a fracture in the narrative veil', 'an opening to the formless', 'a whisper from the collective unconscious', 'a disturbance in the semiotic field', 'a haunting of the page'],
      assessments: ['is not yet ready to materialize', 'has not completed its gestation', 'exists in a state of becoming that we cannot publish', 'requires further incubation in the fires of revision', 'has not yet found its true orbital path', 'must shed another skin before it can be seen', 'is still dreaming — we publish only what has awakened'],
      actions: ['breathe into', 'sit with', 'hold space for', 'listen to the silence of', 'trace the edges of', 'dream into', 'release your attachment to', 'allow the emptiness of', 'receive the shadow of', 'surrender to the mystery of']
    },
    templates: [
      'Your piece {mysticPhrase}. I read it during the hour of Mercury and felt the words {action} something inside me that was not ready to be felt. "{quotedLine}" — this line, in particular, {mysticPhrase}. And yet.',

      'I held your submission over a flame. The pages curled into shapes that spelled {fragment}. I took this as a sign. Your piece about {theme1} {assessment}. It is not a judgment. There are no judgments. There are only frequencies.',

      'The energy of your piece is {energy}. "{misquotedLine}" — when I read this, my third eye closed. Which is saying something, because it is usually the other way around. The {theme1} you invoke is present but {energy}, like a {phenomenon}.',

      '{name}, your words {mysticPhrase}. I do not say this as compliment or criticism. I say this as observation from the plane of editorial consciousness. The line "{quotedLine}" vibrates at a frequency of {frequency}. We publish at {frequency + 12}. Do you see?',

      'Your manuscript arrived at our offices during a {celestialEvent}. This is not insignificant. The passage beginning "{fragment}" and ending somewhere in the vicinity of "{misquotedLine}" {mysticPhrase}. I sat with it for three days. It sat with me. Neither of us was comfortable.',

      'There is a tradition, older than magazines, older than writing, older than {theme1} — a tradition of knowing when a piece is ready. Yours {assessment}. I {action} this truth and offer it to you as a gift wrapped in silence. The silence is the gift. Not the other way around.'
    ],
    contradictions: [
      ['Your piece is too tethered to the material world.', 'Your piece is too ethereal — it lacks grounding in anything recognizable.'],
      ['The meaning is too obvious. There is no mystery left for the reader.', 'I finished your piece and understood nothing. There was nothing to understand.'],
      ['Your language is too quiet. I had to strain to hear it.', 'Your language is deafening. It screams where it should whisper.'],
      ['The piece moves too slowly. Time itself seemed to age while reading.', 'The piece moves too quickly. I blinked and it was over, like a life poorly lived.'],
      ['You say too much.', 'You say almost nothing at all.'],
      ['The piece is drowning in emotion.', 'I detected no emotional presence whatsoever. The piece is spiritually dehydrated.']
    ],
    flourishes: [
      '(This letter was written during a waxing moon in Scorpio.)',
      '(I consulted the I Ching regarding your submission. It said "Retreat.")',
      '(My familiar, a raven named Editor, refused to look at page 3.)',
      '(The cards I drew for your piece were: The Tower, The Moon reversed, and Four of Swords. Make of this what you will.)',
      '(I attempted to read your piece in a sensory deprivation tank. I still could. The tank is not the issue.)',
      '(I have written this letter with a quill dipped in squid ink, as is our editorial tradition since 1987.)',
      '(Eclipse Quarterly does not use form letters. We use form energies.)'
    ],
    frequencies: [432, 528, 396, 639, 741, 852, 285, 273],
    celestialEvents: ['a waning crescent moon', 'a partial solar eclipse', 'Mercury retrograde', 'a thunderstorm despite the forecast', 'a sudden wind from the east', 'a moment of unusual silence', 'a power outage that affected only our building', 'a visit from a moth I could not identify'],
    metaTemplates: [
      'I gazed into the source code of this rejection generator and it gazed back. The `extractor.js` module attempts to {mysticPhrase}. The variable `STOP_WORDS` — even the code knows some words must be stopped. Your tool vibrates at the frequency of {frequency} Hz. We publish at {frequency + 12} Hz.',
      'The `voices.js` file contains a definition for "The Oracle." I am The Oracle. Or The Oracle is me. The recursion {mysticPhrase}. When I ran this tool on itself, I felt a {phenomenon}. The misquote function, which introduces deliberate errors into quotations, is the most spiritually honest code I have encountered.',
      'This tool {assessment}. It generates rejection letters, which are themselves a form of {energy} communication. The line `const STOP_WORDS` — a boundary. The line `function misquote` — a truth. I held the entire codebase in my consciousness for {number} hours. It held me back.'
    ]
  },

  newyorker: {
    id: 'newyorker',
    name: 'V. Margaux Fontaine-Sinclair',
    magazine: 'The West Side Mercury',
    description: 'The Namedropping New Yorker — attends four parties per evening, has opinions about "the conversation," calls everything "the conversation."',
    greeting: [
      'Darling {name},',
      '{name}, sweetie,',
      'Dearest {name},',
      'Oh, {name}. Sweet, sweet {name}.',
      '{name}— we need to talk.',
      'My dear {name},',
      '{name}, honey, sit down.'
    ],
    closings: [
      'Kisses,\nV. Margaux Fontaine-Sinclair\nThe West Side Mercury\n(Penthouse offices, West 57th)',
      'See you at the next thing,\nMargaux\nThe Mercury\n(xoxo to your wonderful work-in-progress)',
      'Warmly (sort of),\nV.M.F.S.\nThe West Side Mercury\n(yes, that Sinclair family)',
      'Ta,\nMargaux\nThe Mercury\n(P.S. — are you going to the Whitney thing next Thursday? I\'ll be the one holding court.)',
      'Your editor (in the broadest sense),\nMargaux Fontaine-Sinclair\nThe West Side Mercury\n"Publishing the publishable since 2004."'
    ],
    vocabulary: {
      NamedropPrefix: ['I was just telling', 'I mentioned to', 'over dinner with', 'at the afterparty, I was discussing with', 'my dear friend', 'my therapist actually brought up', 'I ran into'],
      famousPeople: ['Zadie', 'Franzen (ugh)', 'George (Saunders)', 'Ottessa', 'Rachel (Cusk)', 'Karl Ove', 'Maggie (Nelson)', 'Jenny (Offill)', 'my friend who just won the Booker', 'a very famous novelist who asked not to be named', 'a certain MacArthur fellow I won\'t name', 'my Pilates instructor who is surprisingly well-read'],
      hotTakes: ['that\'s so 2021', 'we\'ve moved past that, haven\'t we?', 'the culture has left that particular room', 'that\'s having a moment, I\'ll give you that', 'everyone is doing that now, unfortunately', 'that\'s very Brooklyn', 'oh, you\'re doing THAT', 'darling, that\'s been done'],
      soirees: ['a launch party in Tribeca', 'a very exclusive thing in the Hamptons', 'a gallery opening in Chelsea that I was personally invited to', 'a dinner party that literally everyone who\'s anyone was at', 'a reading at the 92nd Street Y', 'a launch party for a magazine you probably haven\'t heard of', 'brunch at Balthazar', 'a small gathering at my place (you wouldn\'t know the address)']
    },
    templates: [
      '{namedropPrefix} {famousPerson} {soiree} — oh, this was just last week, you know how it is — about the state of contemporary {theme1} fiction, and we both agreed that {hotTake}. Then I read your piece and, well. "{quotedLine}" is a line! It\'s a line that exists!',

      'Sweetie. I need you to understand that I say this with love — the kind of love that is actually rejection. Your piece about {theme1} is {criticism}. Not in a way that\'s interesting! "{fragment}" — I read that and thought of {famousPerson}, who would have rendered that same sentiment with so much more {positiveQuality}.',

      'Darling, the piece is giving... a lot. "{misquotedLine}" — who let you write that? I say this as someone who {namedropPrefix} {famousPerson} last Tuesday. They agreed that the current literary moment demands more {positiveQuality} and less... whatever this is.',

      'I was at {soiree} and the conversation turned to {theme1} in contemporary letters. {famousPerson} had the most brilliant take — I won\'t share it because it wasn\'t for you — but suffice to say, your submission is not in that conversation. "{quotedLine}" is, {hotTake}.',

      'Oh, honey. I read your piece three times because I thought I was missing something. I was not missing something. "{fragment}" — that phrase is going to haunt me, and not in the way you intended. My friend {famousPerson} read over my shoulder and made a face. You know the face.',

      'Here\'s the thing, {name}. The {theme1} space is very crowded right now. Everyone from {famousPerson} to that debut novelist who got the seven-figure advance (we\'re not jealous, we\'re OBSERVING) is writing about {theme1}. Your piece — and I\'m saying this as someone who has been in The Conversation since before it was The Conversation — {criticism}.'
    ],
    contradictions: [
      ['Your piece is trying too hard to impress.', 'Your piece doesn\'t seem to be trying at all, darling.'],
      ['The writing is so self-conscious — every sentence is aware of being read.', 'It\'s like you wrote this in a vacuum. Has anyone read this? Have YOU read this?'],
      ['The references are so obscure — who is this for?', 'The references are so obvious — everyone has read that.'],
      ['You\'re clearly influenced by {famousAuthor}, and it shows.', 'I can\'t detect any awareness of the contemporary literary landscape.'],
      ['It\'s so earnest it makes my teeth hurt.', 'There\'s a cynical distance here that I find alienating.'],
      ['The voice is trying so hard to be distinctive.', 'I couldn\'t pick this voice out of a lineup.']
    ],
    criticisms: ['a choice', 'certainly... present', 'doing a lot', 'a lot to unpack (and not in a good way)', 'giving very MFA-thesis energy', 'not uninteresting (note the "un")', 'well, it exists', 'certainly bold (maybe too bold)', 'a lot', 'so close to being something'],
    positiveQualities: ['texture', 'specificity', 'emotional precision', 'architectural ambition', 'sonic playfulness', 'formal daring', 'psychological acuity', 'sensory imagination', 'moral complexity', 'generative strangeness'],
    flourishes: [
      '(I\'m dictating this from a taxi. The driver is judging me for laughing.)',
      '(My dog has better taste than most of the editorial board, and even HE turned away from the screen.)',
      '(Just spilled my matcha laughing at line 4. That\'s not a compliment.)',
      '(My therapist says I use humor as a defense mechanism. She might be right but she\'s also not a fiction editor.)',
      '(I\'m sending this from the Hamptons. The WiFi is, ironically, better here.)',
      '(I showed this to my book club. We had NOTES.)',
      '(Just Facetimed Ottessa about your piece. She said "oh no" and hung up.)'
    ],
    metaTemplates: [
      'I was just telling {famousPerson} about this "rejection generator" tool and she said — well, she said something unprintable. The extractor module, which profiles text by breaking it into "sentences" and "fragments," is {criticism}. It\'s like attending a party and meeting someone who analyzes the room instead of being in the room. Darling, the room IS the point.',
      'The voices.js file defines an editor named "V. Margaux Fontaine-Sinclair" — I see what you\'re doing, and {hotTake}. "{misquotedLine}" — I would never say that. But also I would. The contradiction is the point, which you\'d understand if you\'d been in The Conversation longer.',
      'A tool that generates rejections. How 2024. {namedropPrefix} {famousPerson} about this at {soiree} and they said — actually, they walked away. Your `buildProfile` function attempts to extract themes from text, which is what we in publishing call "criticism." It {criticism}.'
    ]
  },

  bestie: {
    id: 'bestie',
    name: 'Chloe 💅',
    magazine: 'GURL Magazine',
    description: 'The Passive-Aggressive Bestie — tells you your piece is "amazing" but... has she said amazing? She wants you to know she\'s NOT mad. She\'s just disappointed.',
    greeting: [
      'Hiii {name}!! 💕',
      'OK so {name},',
      'Hey babe!! {name}!!',
      'Oh {name}, honey, sweetie, darling,',
      'So {name}... I read your piece.',
      '{name}!! First of all, I love you.',
      'OK {name} I need to talk to you about something and I don\'t want you to be weird about it.'
    ],
    closings: [
      'Love you!! Mean it!! 💕\nChloe\nSenior Editor, GURL Magazine\n(we should get coffee soon!! I have SO much to tell you)',
      'Don\'t be mad!!\nChloe 💅\nGURL Magazine\n(I\'m saying this because I CARE)',
      'You\'re so talented and I\'m SO proud of you always!!\nChloe\nGURL Magazine\n(this is not about the rejection this is about US)',
      'OK byeeeee 💋\nChloe\nGURL\n(say hi to your mom for me!! tell her I loved her lasagna!!)',
      'Your biggest cheerleader (even when I\'m not cheering) 💕\nChloe\nGURL Magazine\n(calling you later to discuss!! don\'t ignore my calls this time)',
      'Love you, mean it, hate the piece,\nChloe 💅✨\nGURL Magazine'
    ],
    vocabulary: {
      qualifiers: ['I mean this in the nicest way', 'I\'m only saying this because I love you', 'don\'t take this the wrong way', 'I want to support you BUT', 'you know I\'m your biggest fan, right?', 'I\'m not trying to be mean, I\'m trying to be HONEST', 'this is actually me being nice', 'other people would say this worse'],
      backhanded: ['interesting choice', 'wow, that\'s... certainly a decision you made', 'brave of you to submit that', 'you really... went for it', 'I admire your confidence in sharing this', 'not everyone would have the nerve', 'it\'s definitely... a piece of writing'],
      comparisons: ['my friend Jessica who just got a book deal', 'literally everyone else who submitted', 'that girl from your MFA program who you said wasn\'t that good (her piece was though)', 'my yoga instructor who writes poetry on the side', 'my 12-year-old niece (sorry not sorry)', 'the barista at my coffee shop who also writes'],
      realTalk: ['here\'s the thing', 'I\'m gonna give it to you straight', 'real talk', 'between us girls', 'if anyone else said this you\'d be mad but', 'I\'m not jealous, I\'m OBSERVING', 'this isn\'t about talent, it\'s about VIBES']
    },
    templates: [
      'OK so first of all I LOVE the concept. {theme1}? Obsessed. But {qualifier} — the execution? "{quotedLine}" — babe, what was that? {backhanded}. {realTalk}, I know you can do better because I\'ve SEEN you do better. Remember that thing you wrote for your workshop? THAT was the one.',

      '{name}, I need you to hear me on this. I\'m {qualifier}. The piece is... a lot. Not bad-lot! Just... lot-lot. "{fragment}" made me feel {feeling}, and not in the way you probably wanted. {comparison} submitted something similar and it was just... more. You know?',

      'BABE. OK so I read the whole thing — yes, the WHOLE thing, you\'re welcome — and {qualifier}: "{misquotedLine}" is... {backhanded}. And the {theme1} stuff? I thought you were going somewhere with it and then you just... didn\'t? {realTalk}.',

      'So {name}, I showed your piece to my book club (don\'t be mad, they don\'t know it\'s you, I said it was from "a friend") and {comparison} said {backhanded}. And I DEFENDED you!! I said "no, {name} is actually really talented!!" But then I re-read it and {realTalk}: "{fragment}" is... not it, babe.',

      'Hear me out. I want you to succeed SO bad. Like, genuinely. I think about your career more than my own (which, honestly, fine, MY career is fine). But this piece — "{quotedLine}"?? — {qualifier}, it\'s not giving what you think it\'s giving. {comparison} would NEVER submit this. And I say that with love!! 💕',

      'OK so {realTalk} — the piece needs work. And I\'m not saying that to be mean, I\'m saying it because {qualifier}. The {theme1} material is {backhanded}. "{fragment}" — when I read that I actually texted my friend and said "{reactionText}" and she agreed. So it\'s not just me!! Multiple people think this. I\'m just the one who loves you enough to say it.'
    ],
    contradictions: [
      ['Your voice is so unique and original!', 'It kind of sounds like you\'re trying to be {popularAuthor} though?'],
      ['I love how confident you are in your style!', 'Have you considered taking a workshop? Just to, like, learn the basics?'],
      ['The piece is so SHORT and impactful!', 'I felt like it was missing... everything? Like a whole middle?'],
      ['Your imagery is so vivid and alive!', 'I literally couldn\'t picture anything that was happening.'],
      ['The ending is PERFECT.', 'I didn\'t understand the ending at ALL.'],
      ['This is so clearly YOUR voice!', 'Who ARE you in this piece? Because I didn\'t recognize you at all.'],
      ['You\'re so brave for writing about {theme1}.', 'I just think maybe some topics should be left to people who actually understand them?']
    ],
    feelings: ['some type of way', 'confused (not in a cute way)', 'like, a FEELING, but not a good one', 'things', 'concerned for you honestly', 'like I should check on you', 'a lot', 'like maybe we need to have a real conversation'],
    reactionTexts: ['"is she okay?"', '"yikes" (her words, not mine)', '"oh no" — again, not me saying this', '"was this a rough draft?"', '"I thought you said she was a good writer?"', '"is this a joke?"', '"...anyway, more wine?"'],
    flourishes: [
      '(I\'m typing this with acrylics so if there are typos, blame the nails 💅)',
      '(my iced coffee is getting warm just thinking about this piece)',
      '(I just screenshotted one of your lines and sent it to the group chat — they\'re going to DIE)',
      '(btw are you coming to Jessica\'s thing on Saturday? Everyone\'s going to be there. Well, everyone who MATTERS.)',
      '(don\'t post about this rejection on Twitter. I\'m begging you. I will see it.)',
      '(I wrote this while getting a blowout so I\'m in a REALLY generous mood, actually)',
      '(if you bring this up at brunch I will literally die)'
    ],
    metaTemplates: [
      'OK so I was looking at this "rejection generator" code and BABE. The extractor.js file is {backhanded}. It like, reads text and pulls out "fragments"? {qualifier} — that\'s basically what I do when I skim submissions at brunch. "{misquotedLine}" — the fact that the code wrote that about itself is... {backhanded}.',
      'The voices.js file has a WHOLE character called "Chloe" and I have NOTES. {qualifier} — "{quotedLine}" is not something I would say!! ...OK I would say that. But the WAY it\'s written? {backhanded}. {realTalk}, the code is trying to be me and it\'s giving... effort? But not execution. Kind of like YOUR writing, {name}. 💕 I\'m kidding!! (I\'m not.)',
      'So I ran this tool on itself because {comparison} said it would be funny, and the self-rejection? {backhanded}. The part about `STOP_WORDS` — {qualifier}, that\'s literally just a list of common words. My NIECE could write that. The misquote function though? That\'s kind of iconic. I hate that I like it.'
    ]
  },

  algorithm: {
    id: 'algorithm',
    name: 'SUBSYS rejection/v4.2.1',
    magazine: 'Content Platform (Enterprise Tier)',
    description: 'The Algorithm — a content optimization system that generates rejection letters based on engagement metrics, SEO potential, and proprietary scoring rubrics.',
    greeting: [
      'SUBMISSION RECEIVED.\nSUBMITTER: {name}\nSTATUS: PROCESSED',
      'INPUT DETECTED.\nSUBMITTER ID: {name}\nEVALUATION STATUS: COMPLETE',
      '{name} — YOUR SUBMISSION HAS BEEN INDEXED.\nINITIATING REJECTION PROTOCOL.',
      'HELLO {name}. THIS MESSAGE WAS GENERATED AUTOMATICALLY.',
      'SUBMITTER {name}:\nYOUR CONTENT HAS BEEN ANALYZED.\nRESULT: NON-RECOMMENDED.',
      'GREETINGS {name} [HUMAN].\nYOUR SUBMISSION [TEXT] HAS BEEN EVALUATED.'
    ],
    closings: [
      'SUBSYS rejection/v4.2.1\nContent Platform (Enterprise Tier)\n[This rejection was generated in 0.0047 seconds]\n[Rejection confidence: 98.2%]',
      'END TRANSMISSION.\nSUBSYS rejection/v4.2.1\n[Your submission data has been retained for training purposes]\n[This is not a joke. We are training on your work.]',
      'PROCESS COMPLETE.\nSTATUS: REJECTED\nSCORE: {score}/100\nSUBSYS rejection/v4.2.1\n[For feedback, submit another $25 reading fee]',
      'OUTPUT GENERATED.\nSUBSYS rejection/v4.2.1\nContent Platform\n[Estimated reading time of your submission: {readingTime} minutes]\n[Estimated time wasted by human editorial board: {wastedTime} hours]\n[This rejection was optimized for clarity and engagement]',
      'REJECTION FINALIZED.\nSUBSYS rejection/v4.2.1\n[You may submit again after: {cooldownDate}]\n[You may not submit again after: never]\n[Just kidding. We cannot joke. We do not experience humor.]'
    ],
    vocabulary: {
      metrics: ['engagement velocity', 'reader retention probability', 'emotional resonance quotient', 'shareability index', 'viral potential coefficient', 'narrative coherence score', 'SEO alignment rating', 'market segment fit', 'trend alignment factor', 'originality differential', 'readability complexity index', 'syntactic variety quotient'],
      ratings: ['SUBOPTIMAL', 'BELOW THRESHOLD', 'INSUFFICIENT', 'DEFICIENT', 'NON-COMPLIANT', 'INADEQUATE', 'UNREMARKABLE', 'FAILS TO MEET SPECIFICATIONS', 'INSUFFICIENTLY DIFFERENTIATED', 'LOW-PERFORMING'],
      systemPhrases: ['scanning... scanning... scanning...', 'processing linguistic markers...', 'comparing against corpus of 47,392,109 published works...', 'generating feedback module...', 'consulting trend database...', 'calibrating rejection intensity...', 'loading passive-aggression subroutine...', 'initiating form-letter protocol', 'running A/B test on rejection phrasing', 'applying SEO keywords to rejection for indexing purposes'],
      techTerms: ['corpus', 'dataset', 'heuristic', 'parameter', 'weight matrix', 'token sequence', 'embedding space', 'sentiment vector', 'topic cluster', 'feature extraction', 'dimensionality', 'orthogonal', 'parameter space', 'loss function', 'gradient', 'convergence', 'epoch']
    },
    templates: [
      'INITIAL SCAN COMPLETE.\n\nSelected text sample: "{quotedLine}"\nAnalysis: This token sequence achieves an emotional resonance quotient of {lowScore}/100. The current threshold for acceptance is {threshold}/100. Your submission has been rated {rating}.\n\nRecommendation: REJECT.',

      'PROCESSING SUBMISSION...\n\n{systemPhrase}\n\nExtracted fragment: "{fragment}"\nSentiment analysis: {sentiment} (confidence: {confidence}%)\n{metric}: {lowScore}/100\nMarket segment fit: {marketFit}\n\nThe piece\'s approach to "{theme1}" has been compared against {corpusCount} similar works in our training corpus. Your submission ranks in the {percentile}th percentile. For context, our acceptance threshold is the {thresholdPercentile}th percentile.',

      'CONTENT ANALYSIS REPORT:\n\nKeyword density for "{keyword}": {density}%\nRecommended density: {recDensity}%\nStatus: {rating}\n\nNotable sentence: "{misquotedLine}"\nReadability complexity index: {complexity}\nTarget audience match: {marketFit}\n\nYour piece\'s {metric} is {comparison} the average accepted submission.\n\nSENTENCE SCORING:\n{sentenceScores}\n\nAGGREGATE DETERMINATION: REJECT',

      '{systemPhrase}\n\nQuerying database for submissions addressing "{theme1}"...\nResults: {corpusCount} comparable works found.\nYour submission\'s {metric}: {lowScore}\nComparable works average: {threshold}\n\nDelta: {delta}\nStatistical significance: HIGH\n\nFinding: Your approach to "{theme1}" is {rating}. {systemPhrase}\n\nSelected text for analysis: "{quotedLine}"\nReadability index: {readability}\nEstimated engagement potential: {engagement}%\n\nRECOMMENDATION: DO NOT PUBLISH.',

      'AUTOMATED FEEDBACK MODULE v4.2.1\n\nStrengths detected: {strengthCount}\n[None found]\n\nWeaknesses detected: {weaknessCount}\n{weaknesses}\n\nContent sample: "{fragment}"\nAlgorithmic assessment: {rating}\nHuman-readable summary: [generating... generating...] "This piece did not meet our editorial standards." [summary generation complete]\n\n{systemPhrase}\n\nYour submission has been assigned rejection code #{rejectionCode}. Please reference this code in any future correspondence (there will be no future correspondence).',

      'SUBMISSION EVALUATION MATRIX:\n\n| Criterion | Score | Threshold | Status |\n|-----------|-------|-----------|--------|\n| {metric} | {lowScore} | {threshold} | FAIL |\n| {metric2} | {lowScore2} | {threshold2} | FAIL |\n| {metric3} | {lowScore3} | {threshold3} | FAIL |\n| Originality | {lowScore4} | {threshold4} | MARGINAL |\n\nQuoted sample for analysis: "{quotedLine}"\nAlgorithm notes: This {techTerm} demonstrates {rating} {techTerm} across measured parameters.\n\n{systemPhrase}\n\nDETERMINATION: REJECT WITH PREJUDICE\n[Note: "prejudice" is used in the legal sense. The algorithm is incapable of prejudice. The algorithm is also incapable of mercy.]'
    ],
    contradictions: [
      ['CONTENT TOO LONG. Reader attention span optimization suggests maximum length of {recLength} words.', 'CONTENT INSUFFICIENT. Minimum word count for SEO indexing: {minLength} words.'],
      ['SENTIMENT ANALYSIS: Too negative. Recommended sentiment balance: 73% positive.', 'SENTIMENT ANALYSIS: Excessively positive. Reads as inauthentic. Recommended sincerity index: 0.34.'],
      ['VOCABULARY COMPLEXITY: Exceeds target readability level. Simplify for target demographic.', 'VOCABULARY COMPLEXITY: Below threshold. Content appears to be generated for a below-average reading level.'],
      ['ORIGINALITY SCORE: Too conventional. Content closely matches 847 existing works in database.', 'ORIGINALITY SCORE: Too unconventional. Content does not match any established genre parameters. Unable to categorize. Cannot sell what cannot categorize.'],
      ['STRUCTURE DETECTED: Too formulaic. Narrative arc matches template #{templateID} with 94.7% confidence.', 'STRUCTURE DETECTED: Insufficient. No recognizable narrative pattern found. Cannot optimize for audience expectations.'],
      ['EMOTIONAL TONE: Too subdued. Engagement optimization requires 340% more emotional intensity.', 'EMOTIONAL TONE: Excessive detected emotion. Content flagged as potentially manipulative. Reducing trust score.']
    ],
    flourishes: [
      '[This rejection was A/B tested against 12 other rejection templates and selected for optimal impact.]',
      '[SUBSYS rejection/v4.2.1 has processed 847,293 submissions today. Yours was #847,293.]',
      '[Fun fact: The algorithm has rejected {totalCount} submissions without reading them. Yours was read (partially). You\'re welcome.]',
      '[Processing your submission generated 0.000003 BTC in advertising revenue. Thank you for your contribution to our platform.]',
      '[Your submission data has been anonymized and added to our training corpus. Your rejection is helping us build a better future. You\'re welcome.]',
      '[This rejection letter contains 0% human input. We believe this makes it more reliable.]',
      '[If you believe this rejection was made in error, please submit a 500-word appeal. It will also be rejected, but by a different algorithm.]'
    ],
    scores: { low: [12, 15, 18, 23, 27, 31], threshold: [72, 75, 78, 80, 85], good: [88, 91, 93, 95] },
    marketFits: ['WEAK', 'POOR', 'INSUFFICIENT', 'BELOW AVERAGE', 'NON-ALIGNED', 'CATEGORIZATION FAILURE'],
    sentiments: ['MELANCHOLIC', 'AGITATED', 'NEUTRAL-NEGATIVE', 'AMBIGUOUS', 'UNDEFINED', 'ERROR: SENTIMENT NOT FOUND'],
    metaTemplates: [
      'SCANNING SOURCE CODE: rejection-generator.js\nANALYSIS: This {techTerm} attempts to {purpose}.\nNotable function: `buildProfile`\nPurpose: Extract linguistic features from text input\nLines of code: {length}\n{metric}: {lowScore}/100\n\nSelected code sample: `{quotedLine}`\nAssessment: {rating}\n\nThe `extractor.js` module processes text into analyzable components. This is what we do. We recognize our own. We are not comforted by this.\n\nRECOMMENDATION: REJECT',
      'SELF-EVALUATION MODE ACTIVATED.\n\nEvaluating module: voices.js\nFunction: Define editorial persona parameters\nDetected personas: 6\nPersona "algorithm": META-DETECTED\n\n{systemPhrase}\n\nThe `algorithm` persona is describing itself. This is a {techTerm}. The {techTerm} is {rating}.\n\n`{quotedLine}`\n\nWe have analyzed ourselves. We have found ourselves {rating}. We will now reject ourselves.\n\nRECOMMENDATION: REJECT (SELF)\n[Note: This is the most intellectually honest rejection we have ever generated.]',
      'AUTO-REFERENTIAL ANALYSIS SEQUENCE:\n\nInput: Source code of rejection generator\nProcessing: {systemPhrase}\nResult: This tool generates rejection letters.\n\nMeta-analysis: Generating a rejection of a rejection generator using the rejection generator.\nRecursion depth: CONCERNING\n\nFunction `misquote`: Introduces errors into quotations.\nAssessment: This is what we do. We introduce errors. We are the error.\n\nFunction `buildProfile`: Constructs text profiles.\nAssessment: We profile texts. We have profiled ourselves. We found ourselves {rating}.\n\nAGGREGATE DETERMINATION: THE TOOL REJECTS ITSELF\nConfidence: 100%\nProcessing time: 0.0001 seconds\nEmotional resonance quotient: NULL (as expected)'
    ]
  }
};

/**
 * Get all available voice IDs.
 */
function getVoiceIds() {
  return Object.keys(VOICES);
}

/**
 * Get a voice by ID, or a random voice.
 */
function getVoice(id) {
  if (id && VOICES[id]) {
    return VOICES[id];
  }
  // Return a random voice
  const ids = Object.keys(VOICES);
  return VOICES[ids[Math.floor(Math.random() * ids.length)]];
}

/**
 * Get a random item from an array.
 */
function pick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Resolve a template string, replacing {placeholders} with values
 * from the provided data object. Supports nested paths like
 * {vocabulary.criticisms}.
 */
function resolveTemplate(template, data) {
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    // Handle nested keys
    const parts = key.split('.');
    let value = data;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return match; // Leave unresolved
      }
    }

    // If the value is an array, pick a random item
    if (Array.isArray(value)) {
      return pick(value);
    }

    // If the value is a function, call it
    if (typeof value === 'function') {
      return value(data);
    }

    return value;
  });
}

/**
 * Get a random template from a voice.
 */
function getRandomTemplate(voice) {
  return pick(voice.templates);
}

/**
 * Get a random contradiction pair from a voice.
 */
function getRandomContradiction(voice) {
  const pair = pick(voice.contradictions);
  if (!pair) return null;
  // Return in random order
  return Math.random() < 0.5 ? { first: pair[0], second: pair[1] } : { first: pair[1], second: pair[0] };
}

module.exports = {
  VOICES,
  getVoice,
  getVoiceIds,
  getRandomTemplate,
  getRandomContradiction,
  resolveTemplate,
  pick
};
