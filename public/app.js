(function(){
'use strict';

/* ---------- storage ---------- */
var LS_KEY='wakekey.v1';
var store={notes:{},read:{}};
try{
  var raw=localStorage.getItem(LS_KEY);
  if(raw){var p=JSON.parse(raw); if(p&&typeof p==='object'){store.notes=p.notes||{};store.read=p.read||{};}}
}catch(e){}
function persist(){try{localStorage.setItem(LS_KEY,JSON.stringify(store));}catch(e){}}

/* ---------- data ---------- */
var LV={solid:'Solid',likely:'Likely',debated:'Debated'};

var BOOKS=[
 {id:'I',title:'Parents and origins',age:'The divine age',pp:'pp 3-216',n:8,ch:['I.1','I.2','I.3','I.4','I.5','I.6','I.7','I.8'],
  text:'In Vico\'s scheme the first age belongs to the gods, when thunder frightens people into religion and law. Here the thunder falls, the hero falls, and the rumor about HCE gets going. This book has the most story: a wake, a scandal, a trial, a letter and a river.'},
 {id:'II',title:'The children',age:'The heroic age',pp:'pp 219-399',n:4,ch:['II.1','II.2','II.3','II.4'],
  text:'The heroic age is about youth, play, rivalry and love. The children play and study, the pub fills and empties, and the Tristan and Isolde triangle sails in.'},
 {id:'III',title:'The postman and the people',age:'The human age',pp:'pp 403-590',n:4,ch:['III.1','III.2','III.3','III.4'],
  text:'In the age of ordinary people the crowd takes over. Shaun delivers the mail, preaches, and is cross-examined, and the book comes to rest in the parents\' bed.'},
 {id:'IV',title:'The return',age:'The ricorso',pp:'pp 593-628',n:1,ch:['IV'],
  text:'Vico\'s return. Dawn comes, ALP speaks for the last time, the river reaches the sea, and the final sentence runs back into the opening one.'}
];

var NOTES={
 riverrun:{t:'The first word',l:'solid',b:'There is no capital and no sentence before it. The opening is the tail of the book\'s last line, so reading the Wake means stepping into a river that is already flowing.'},
 fall:{t:'One fall, many costumes',l:'solid',b:'Adam, Humpty Dumpty, Satan, Napoleon and a builder on a ladder are all versions of the same event. A fall nearly always sets up a rising, which is why the book keeps looping.'},
 finnegan:{t:'Tim Finnegan',l:'solid',b:'The seed is an Irish-American comic ballad about a hod carrier who falls from a ladder, dies, and revives at his own wake when whiskey is splashed on him. The legendary giant Finn MacCool is folded into him.'},
 wake:{t:'Two meanings of wake',l:'solid',b:'A wake is a vigil for the dead, and also the act of rising. The title has no apostrophe, so "Finnegans" can be read as plural: all the Finnegans wake, or Finn, again.'},
 museyroom:{t:'The Museyroom',l:'likely',b:'A guide leads visitors through a museum that retells a battle between Wellington and Napoleon as a squabble. Wellington was born in Dublin, and his monument stands in Phoenix Park, so the tour is also a tour of the local landscape.'},
 muttjute:{t:'Mutt and Jute',l:'likely',b:'Two figures meet and cannot quite understand each other. Often read as a native meeting an invader, Gaelic against Norse. Listen for the gap in understanding rather than a message.'},
 thunder1:{t:'The first thunderclap',l:'solid',b:'A 100-letter word on page 3. There are ten in the book: nine of 100 letters and a last one of 101. Many seem to hide the word for thunder from several languages, and each tends to mark a fall or a turn in the cycle.'},
 chapelizod:{t:'Chapelizod',l:'solid',b:'A real village on the Liffey, just west of Dublin. By tradition its name means Isolde\'s chapel, which quietly links HCE\'s household to the Tristan and Isolde story.'},
 names:{t:'Shifting initials',l:'solid',b:'HCE gets new expansions as he goes: Here Comes Everybody, Haveth Childers Everywhere, Howth Castle and Environs. Whenever three capitals appear in a row, check whether they could be H, C and E.'},
 phoenixpark:{t:'The offense',l:'debated',b:'The central misdeed is never defined. It seems to involve an indecent moment in the park, perhaps with two girls and three soldiers, but the book gives many versions and confirms none. Treat it as the secret the book circles.'},
 cad:{t:'The Cad with a pipe',l:'likely',b:'A stranger asks HCE the time. HCE answers with a nervous, over-explained defense that sounds like a confession, and the cad carries the story onward. The answer does more damage than the question.'},
 prankquean:{t:'The Prankquean',l:'likely',b:'A comic retelling of the legend of Grace O\'Malley, the sea queen who kidnapped a lord\'s heir. She asks a riddle, steals a child, and the tale repeats three times with variations, like a small model of the book\'s cycles.'},
 persse:{t:'Persse O\'Reilly',l:'solid',b:'It echoes the French perce-oreille, "earwig", which puns on the surname Earwicker. The ballad is sung by a street balladeer, Hosty, so this is rumor turning into popular song.'},
 fourold:{t:'The Four Old Men',l:'solid',b:'Matthew, Mark, Luke and John as aged judges, historians and gossips. They also stand for the four provinces of Ireland and the four winds. Wherever the book needs witnesses, they turn up as a group of four, usually muddled.'},
 festyking:{t:'Festy King',l:'debated',b:'The accused in the trial. Many readings treat him as a mask for Shem, the slanderer of the father. Every verdict in the scene depends on testimony that cannot be checked.'},
 alpmanifesto:{t:'ALP\'s manifesto',l:'likely',b:'A document credited to ALP that offers her side of events. The book loves inventing new titles for the same object, so watch how many names this one gets.'},
 shaun:{t:'Shem and Shaun',l:'solid',b:'Shaun is the public man: postman, preacher, politician. Shem is the private man: scribe, exile, artist. The two define each other and sometimes swap traits mid-scene.'},
 joycepaint:{t:'A self-portrait?',l:'debated',b:'Many readers see Joyce roasting himself as an exile and forger. It is a hypothesis, and Joyce\'s own comments on his characters were slippery.'},
 cainabel:{t:'Cain and Abel',l:'solid',b:'The brothers\' conflict is the book\'s basic engine. Cain and Abel, Jacob and Esau, Romulus and Remus: Joyce likes opposites that cannot exist without each other.'},
 alp:{t:'ALP as the river',l:'solid',b:'Anna Livia Plurabelle is also the Liffey. The washerwomen\'s language turns to water-sounds, so the chapter wants to be read aloud.'},
 glugg:{t:'Glugg and Chuff',l:'likely',b:'The brothers\' names in the children\'s game, a ritual contest in which one must guess and the other is favored. The game is play rehearsing the book\'s deeper quarrel.'},
 triangle:{t:'The triangle',l:'likely',b:'A geometry lesson that doubles as a map of family and sexual triangles. The page layout, with margin notes on both sides and footnotes below, feels like three voices talking at once.'},
 tailor:{t:'The Captain and the Tailor',l:'likely',b:'A comic tale of a Norwegian sea captain and an Irish tailor over a suit that never works out. The captain is read as another mask for HCE.'},
 buckley:{t:'Buckley and the General',l:'debated',b:'An Irish soldier in the Crimean War has a Russian general in his sights and hesitates, then fires. Many readers see the Park incident retold with new costumes: the same secret, a different battlefield.'},
 quark:{t:'Three quarks',l:'solid',b:'The old men heckle King Mark with a seabird-like cry. The physicist Murray Gell-Mann took the word "quark" from this line for the particle.'},
 ondt:{t:'The Ondt and the Gracehoper',l:'likely',b:'A fable in which the Ondt (Shaun) hoards and the Gracehoper (Shem) plays. Unlike the ant and the grasshopper in the old fable, the book gives the artist-grasshopper at least part of its sympathy.'},
 hcevoice:{t:'HCE speaks',l:'likely',b:'After the testimonies of others, the father finally defends himself, boasting of his city-building and denying wrongdoing. It is the closest the book comes to a trial\'s closing statement.'},
 patrick:{t:'Patrick and the Archdruid',l:'likely',b:'St Patrick, standing for Christian truth, debates the Archdruid, usually read as the idealist philosopher Berkeley, about colors and what is real. Old and new world views trade places, like everything else here.'}
};

var MOTIFS=[
 {id:'fall',t:'The fall',b:'Humpty Dumpty, Adam, Satan, Napoleon and a builder on a ladder are the same event in different clothes. A fall nearly always sets up a rising.'},
 {id:'rumor',t:'The rumor',b:'A vague scandal about HCE in Phoenix Park travels through retellings, trials and ballads. Its content never fixes. Its spread is the point.'},
 {id:'letter',t:'The letter',b:'A mysterious letter is written, lost, found, studied and delivered. It stands for the book itself: an unclear message from one family to the world.'},
 {id:'river',t:'River and hill',b:'ALP is the Liffey and HCE is the hill of Howth. Water flows, hills stay, and together they make the landscape of the dream.'},
 {id:'brothers',t:'Rival brothers',b:'Shem and Shaun appear as Cain and Abel, Glugg and Chuff, the Gracehoper and the Ondt. They swap traits and cannot do without each other.'},
 {id:'triangle',t:'The triangle',b:'Two men and a woman, over and over: Tristan, Isolde and Mark; Issy and her brothers; HCE, the cad and ALP. The geometry lesson makes the shape explicit.'},
 {id:'fourold',t:'The Four',b:'Four old men as witnesses, judges, and finally bedposts. They never get it right, and they always arrive together.'},
 {id:'thunder',t:'Thunder',b:'Ten hundred-letter words mark falls and turning points. Each is packed with words for thunder from many languages, and the tenth has 101 letters.'},
 {id:'cycle',t:'The cycle',b:'Vico\'s four ages give the book a rotation. The ending feeds the beginning, so there is no last page, only a return.'}
];

var CH=[
 {id:'I.1',b:'I',t:'Finnegan\'s fall and wake',pp:'3-29',g:'A builder falls, his wake begins, and a tour guide retells a battle.',
  tags:['fall','thunder','cycle','river'],
  body:'The book starts mid-sentence on the word [[riverrun|riverrun]] and drops you into a [[comic fall|fall]]: a builder, [[Finnegan|finnegan]], tumbles from a ladder and is laid out at his [[wake|wake]]. Mourners drink and gossip, he stirs, and he is told to lie still because the story has only begun. A guided tour of the [[Willingdone Museyroom|museyroom]] retells a famous battle as a squabble between two soldiers. Then [[Mutt and Jute|muttjute]] meet and fail to understand each other. The first [[thunderclap|thunder1]] sounds on page 3, at the moment of the fall.',
  tip:'Read the first page aloud. Do not stop on unknown words; let the rhythm carry you.'},
 {id:'I.2',b:'I',t:'Earwicker\'s name and the Prankquean',pp:'30-47',g:'HCE gets a name, a scandal and a ballad.',
  tags:['fall','rumor','thunder'],
  body:'HCE is introduced as a tavern keeper in [[Chapelizod|chapelizod]], near Dublin, and his name keeps changing, a habit that makes for [[shifting initials|names]]. A scandal sticks to him: something happened in [[Phoenix Park|phoenixpark]], and the book never says exactly what. A stranger, [[the Cad|cad]], asks him the time and gets a speech that sounds like a confession. A comic tale of the [[Prankquean|prankquean]] shows a pirate queen and a lord\'s stolen children, told three times with variations. The chapter ends with a street ballad, [[the Ballad of Persse O\'Reilly|persse]], where rumor becomes popular song.',
  tip:'Count the spellings of Earwicker\'s name. Each one is a new mask.'},
 {id:'I.3',b:'I',t:'The rumor travels',pp:'48-74',g:'The story is retold, distorted, and finally fades.',
  tags:['rumor','fourold'],
  body:'The rumor passes from mouth to mouth and mutates at each stop. Each teller adds a detail, drops another and swears this is the true version. The [[four old men|fourold]] hover as chroniclers, and in the end the scandal fades the way news does, without ever being settled. Read it as a study of how a story decays into legend.',
  tip:'Notice which detail changes in each retelling. That is the chapter\'s method.'},
 {id:'I.4',b:'I',t:'Arrival, trial and burial',pp:'75-103',g:'A grand retelling, a trial that proves nothing, and a burial that does not stick.',
  tags:['rumor','fourold','thunder','brothers'],
  body:'HCE\'s arrival and fall are retold on a grand scale, like an invasion and a founding. Then comes a trial: [[Festy King|festyking]] is accused of slandering HCE, but the court never establishes what the original offense was. The witnesses contradict each other, and the four old men weigh in on all of it. The chapter closes with HCE gone to ground, but not gone.',
  tip:'Follow the courtroom voices. The case never settles what happened.'},
 {id:'I.5',b:'I',t:'The letter',pp:'104-125',g:'A battered letter is studied like a rare manuscript.',
  tags:['letter','thunder'],
  body:'A battered letter, scratched from a rubbish heap by a hen, is examined like a rare manuscript. First comes ALP\'s own [[manifesto|alpmanifesto]]; then scholars-in-miniature study the letter\'s stains, folds and handwriting. The joke is on the reader, since the chapter models how people read the Wake itself, squinting at a mess for a message. The letter comes back in III.1 and IV.',
  tip:'Treat this chapter as the book describing how to read the book.'},
 {id:'I.6',b:'I',t:'Twelve questions',pp:'126-168',g:'A quiz show whose answers wander.',
  tags:['brothers'],
  body:'A quiz show in twelve questions, with answers that wander. The [[voice that answers|shaun]] is usually read as Shaun, with Shem as the unnamed other. Topics run from the hero Finn MacCool to the Four, the Twelve and the family. The last questions put the brothers head to head and ask which one will carry on.',
  tip:'Listen to the question-and-answer rhythm. The answers rarely answer.'},
 {id:'I.7',b:'I',t:'Shem the Penman',pp:'169-195',g:'A savage portrait of the artist as exile and forger.',
  tags:['brothers','letter'],
  body:'A savage, funny portrait of Shem as an exile and forger who writes in a squalid room with ink made from his own body. Many readers see [[Joyce\'s self-portrait|joycepaint]], drawn with merciless self-mockery. Shaun, as Justius, condemns him; Shem, as Mercius, answers with a plea for compassion. This is the clearest statement of the [[brothers\' conflict|cainabel]].',
  tip:'Spot the places where insult turns into affection.'},
 {id:'I.8',b:'I',t:'Anna Livia Plurabelle',pp:'196-216',g:'Two washerwomen gossip while the river runs.',
  tags:['river','rumor'],
  body:'Two washerwomen on opposite banks of the Liffey wring out clothes and gossip about [[ALP|alp]], who is also the river. Their talk thickens into water-sounds, and at dusk the women turn into a tree and a stone. The river runs on. Joyce recorded a passage from this chapter in 1929, and it is the best place to start reading. The gossip is rumor again, now told from below.',
  tip:'Read it aloud. If you read only one chapter, read this one. The Say it tab has a read-aloud of its key lines.'},
 {id:'II.1',b:'II',t:'Children\'s hour',pp:'219-259',g:'A street game that replays the brothers\' rivalry.',
  tags:['brothers','thunder'],
  body:'Evening in the pub\'s street. Children play a guessing game in which [[Glugg|glugg]] must name the colors Issy and her girlfriends have chosen, and he fails. The game is the brothers\' rivalry in play form, with Issy as the prize. Rhyme and chant carry the chapter, and the parents call everyone in at the end.',
  tip:'Listen for chant and rhyme. The sound carries the plot.'},
 {id:'II.2',b:'II',t:'Night lessons',pp:'260-308',g:'Homework laid out like a schoolbook, with margins that swap sides.',
  tags:['triangle','brothers'],
  body:'The children do homework in the nursery. The page is laid out like a schoolbook, with side notes in both margins and footnotes below, and the margins swap sides midway. A geometry problem built from intersecting circles is often read as a figure for the mother, and the [[triangle|triangle]] is one more family shape. The brothers fight over the lesson.',
  tip:'Look at the page layout first, then the words.'},
 {id:'II.3',b:'II',t:'The tavern at closing time',pp:'309-382',g:'Tall tales, broadcast noise, and HCE drunk on the dregs.',
  tags:['fall','rumor','thunder'],
  body:'HCE\'s pub at closing time, full of broadcast noise and customers swapping tall tales. The best known is [[the Norwegian Captain and the Tailor|tailor]], a comic tale of a suit that never fits. Then [[Buckley and the General|buckley]], a soldier\'s story that reads like the Park incident in costume. At closing, HCE drains the dregs and collapses drunk. It is the longest chapter of Book II.',
  tip:'Pick out the crowd noise and ignore the rest on a first pass.'},
 {id:'II.4',b:'II',t:'Tristan and Isolde on the ship',pp:'383-399',g:'Four old men spy on lovers at sea.',
  tags:['triangle','fourold'],
  body:'A short lyric chapter. Four old men spy on two lovers on a ship and heckle King Mark with the cry [[Three quarks for Muster Mark|quark]]. It is the closest the book comes to a clean love poem, and it is full of sea-sound.',
  tip:'Short and lyrical. Read it like a poem.'},
 {id:'III.1',b:'III',t:'Shaun the Post',pp:'403-428',g:'The postman is quizzed about the letter and tells a fable.',
  tags:['brothers','letter','thunder'],
  body:'Shaun appears as a postman, pompous and weary, and is quizzed about the letter he is supposed to deliver. He tells a fable, [[the Ondt and the Gracehoper|ondt]], in which a thrifty ant faces a playful grasshopper. The chapter is mostly Shaun\'s voice, and the book keeps undermining him.',
  tip:'Follow the fable first, then the framing around it.'},
 {id:'III.2',b:'III',t:'Jaun\'s sermon',pp:'429-473',g:'A sermon on morals that slides into flirtation.',
  tags:['brothers'],
  body:'Shaun returns as Jaun and lectures Issy and her twenty-eight schoolmates on morals before he leaves. The sermon is pompous, then flirtatious, then sentimental. Listen for Issy\'s side notes and for the way his rules contradict themselves.',
  tip:'Notice the slide from sermon to flirtation.'},
 {id:'III.3',b:'III',t:'Yawn interrogated',pp:'474-554',g:'Voices of the past pour through a nearly silent son.',
  tags:['fourold','rumor','brothers'],
  body:'Yawn lies on a hill, nearly speechless, while the four old men question him. Voices from the family and the past pour through him. At the end, [[HCE\'s own voice|hcevoice]] steps forward to defend his life, his city and his name.',
  tip:'List the voices as they turn up. Deciding who is speaking is half the puzzle.'},
 {id:'III.4',b:'III',t:'The parents\' bed',pp:'555-590',g:'A night scene watched from four angles.',
  tags:['fourold','cycle'],
  body:'The Porter family bedroom at night. A child\'s cry brings the parents to the room, and they make love under the eyes of the four bedposts. The chapter is built from overlapping watchers, almost a film shot from four angles. A cock crows near the end.',
  tip:'Treat the four bedposts as cameras.'},
 {id:'IV',b:'IV',t:'The return',pp:'593-628',g:'Dawn, ALP\'s last words, and a sentence that loops to the start.',
  tags:['letter','river','cycle'],
  body:'Dawn. Short sections of review and renewal come first, including a debate between [[St Patrick and the Archdruid|patrick]] about colors and truth. The letter arrives. Then ALP speaks for the last time, a river nearing the sea. The last sentence breaks off before it ends, so the book is built to run straight back into its first line.',
  tip:'Read the last page aloud, slowly, then turn to the first.'}
];

var CAST=[
 {n:'HCE',full:'Humphrey Chimpden Earwicker',role:'Father and pub keeper at Chapelizod, accused of an unnamed offense.',q:'HCE',
  m:['Here Comes Everybody','Haveth Childers Everywhere','Finn MacCool','Tim Finnegan','Adam','Noah','Persse O\'Reilly','the hill of Howth'],
  l:'Three capitals in a row, a stammer, and any sleeping giant or hill.'},
 {n:'ALP',full:'Anna Livia Plurabelle',role:'Mother and wife; also the River Liffey; keeper of the letter.',q:'ALP',
  m:['Eve','Isolde','the hen','the delta sign Δ','the washerwomen\'s subject'],
  l:'Water-sounds, the verb wash, and anything delivered or forgiven.'},
 {n:'Shem',full:'Shem the Penman',role:'Twin son; scribe, exile and forger, the private artist.',q:'Shem',
  m:['Cain','Jerry','Glugg','Dolph','the Gracehoper','Mercius','Festy King'],
  l:'Ink, pens, small rooms, mockery, and wounded pride.'},
 {n:'Shaun',full:'Shaun the Post',role:'Twin son; postman, preacher, the public man.',q:'Shaun',
  m:['Abel','Kevin','Chuff','Kev','Jaun','Yawn','Justius','the Ondt'],
  l:'Speeches, mail, sermons, and complete confidence that he is right.'},
 {n:'Issy',full:'Isabel',role:'Daughter; flirt, mirror-self and cloud-girl.',q:'Issy',
  m:['Isolde','the twenty-eight girls','her reflection','Nuvoletta'],
  l:'Footnotes and asides, mirror talk, and teasing.'},
 {n:'The Four',full:'The Four Old Men',role:'Judges, chroniclers, bedposts.',q:'four old men',
  m:['Mamalujo','Matthew, Mark, Luke and John','the four provinces of Ireland','the four winds'],
  l:'Groups of four, and testimony that nobody can check.'}
];
var MINOR='Also watch for: the Twelve (jurors, pub customers, apostles), Kate (museum guide and cleaner), Hosty (the balladeer), the Cad, Festy King, Mutt and Jute, the Prankquean, and St Patrick with the Archdruid.';

var WORDS=[
 {id:'riverrun',w:'riverrun',where:'I.1, page 3',l:'solid',
  parts:[['river','English'],['run','English']],
  g:'The first word has no capital and no sentence before it. It is the tail end of the last line, so the book begins in the middle of a flow. The river is also ALP.'},
 {id:'howth',w:'Howth Castle and Environs',where:'I.1, page 3',l:'solid',
  parts:[['Howth','Place name, north of Dublin Bay'],['Castle','English'],['Environs','English, from French']],
  g:'The initials give HCE in plain sight. Howth Head is a real hill by Dublin Bay, and the book treats it as a sleeping giant, which is HCE and also Finn MacCool.'},
 {id:'vicus',w:'commodius vicus of recirculation',where:'I.1, page 3',l:'solid',
  parts:[['commodius','Roomy, with a nod to the emperor Commodus'],['vicus','Latin: street, district; echoes Vico'],['recirculation','English: the cycle again']],
  g:'A joke about Vico\'s cycles that also names a real place, Vico Road, on the coast south of Dublin. The phrase tells you the route is a loop.'},
 {id:'finnegans',w:'Finnegans Wake',where:'The title',l:'solid',
  parts:[['Finn','Irish hero Fionn MacCool'],['again','English'],['Finnegan','The ballad\'s hod carrier'],['wake','Vigil for the dead, or to rise']],
  g:'The missing apostrophe lets the title be read as a plural (all the Finnegans), as a command (Finn, again!), and as a description (Finnegan\'s vigil), all at once.'},
 {id:'persse',w:'Persse O\'Reilly',where:'I.2, the ballad',l:'solid',
  parts:[['perce','French: pierce'],['oreille','French: ear'],['Earwicker','The surname it puns on']],
  g:'The ballad nickname turns HCE\'s surname into the French word for earwig. Rumor gives people new names, and the book records every one.'},
 {id:'mamalujo',w:'Mamalujo',where:'II.4 and elsewhere',l:'solid',
  parts:[['Ma','Matthew'],['Ma','Mark'],['Lu','Luke'],['Jo','John']],
  g:'The four evangelists squeezed into one name for the four old men. Scholars use it as shorthand for the group, and the text uses it too.'},
 {id:'quark',w:'Three quarks for Muster Mark',where:'II.4, page 383',l:'solid',
  parts:[['quark','A bird-like cry in the line'],['Quark','German: curd cheese, also rubbish'],['Mark','King Mark of Tristan and Isolde']],
  g:'The cry mocks an old king whose bride sails off with a younger man. The physicist Murray Gell-Mann borrowed the word for the particle, and the name stuck.'},
 {id:'alpname',w:'Anna Livia Plurabelle',where:'I.8 and throughout',l:'likely',
  parts:[['Anna Livia','From Liffey, the Dublin river'],['plura','Latin: many'],['belle','French: beautiful']],
  g:'Many beauties, many faces. The river is a mother, a wife and a gossip, and the name carries all of them.'},
 {id:'shemshaun',w:'Shem and Shaun',where:'Throughout',l:'solid',
  parts:[['Shem','Hebrew name; also close to Irish Seamus (James)'],['Shaun','Anglicized Irish Sean (John)']],
  g:'The brothers\' names look like Hebrew and Irish forms of common names. Their traits are opposites that keep swapping.'},
 {id:'museyroom',w:'museyroom',where:'I.1',l:'likely',
  parts:[['muse','Greek: inspiration'],['museum','Latin, from the house of the muses'],['room','English']],
  g:'A museum and a room of muses in one word. The tour mixes history, myth and a battle retold as a quarrel.'},
 {id:'thunderword',w:'The hundred-letter thunderwords',where:'Ten of them, from page 3 to page 424',l:'likely',
  parts:[['kaminari','Japanese: thunder'],['bronte','Greek: thunder'],['tonnerre','French: thunder'],['tuono','Italian: thunder'],['trovão','Portuguese: thunder'],['åska','Swedish: thunder']],
  g:'Not reproduced here; read page 3 for the first. Scholars have traced words for thunder from many languages inside these compounds. Nine have 100 letters and the last has 101, and each marks a fall or a turning point.'}
];

/* ---------- helpers ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function lvl(l){return '<span class="lvl lvl-'+l+'">'+LV[l]+'</span>';}
function fmt(body){return body.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,function(m,txt,key){return '<button type="button" class="a" data-note="'+key+'" aria-expanded="false">'+txt+'</button>';});}
function domId(id){return 'ch-'+id.replace(/\./g,'-');}
function chOf(id){for(var i=0;i<CH.length;i++){if(CH[i].id===id)return CH[i];}return null;}
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var NOTE_HOME={};
CH.forEach(function(c){var re=/\|([a-z0-9]+)\]\]/g,m;while((m=re.exec(c.body))){if(!NOTE_HOME[m[1]])NOTE_HOME[m[1]]=c.id;}});

var state={book:'all',motif:'',q:'',tab:'map'};

/* ---------- tabs ---------- */
var TABS=['map','cast','chapters','words','say','motifs','notes'];
function showTab(name){
  if(TABS.indexOf(name)<0)name='map';
  state.tab=name;
  TABS.forEach(function(t){
    var on=t===name;
    $('#tab-'+t).setAttribute('aria-selected',on?'true':'false');
    $('#panel-'+t).classList.toggle('on',on);
  });
  if(name==='notes')renderNotes();
  if(name!=='say'&&typeof stopSay==='function'){resetQueue();stopSay();}
}
$('#tablist').addEventListener('click',function(e){
  var b=e.target.closest('.tab'); if(!b)return;
  var name=b.id.replace('tab-','');
  showTab(name);
  try{location.hash=name;}catch(err){}
});
window.addEventListener('hashchange',function(){var h=(location.hash||'').slice(1); if(TABS.indexOf(h)>=0)showTab(h);});

/* ---------- map ---------- */
function arc(a0,a1,r0,r1){
  var C=180,rad=Math.PI/180;
  function pt(a,r){return [C+r*Math.cos(a*rad),C+r*Math.sin(a*rad)];}
  var p0=pt(a0,r1),p1=pt(a1,r1),p2=pt(a1,r0),p3=pt(a0,r0);
  return 'M'+p0[0]+' '+p0[1]+' A'+r1+' '+r1+' 0 0 1 '+p1[0]+' '+p1[1]+' L'+p2[0]+' '+p2[1]+' A'+r0+' '+r0+' 0 0 0 '+p3[0]+' '+p3[1]+' Z';
}
function renderRing(){
  var R0=82,R1=150,C=180,h='';
  BOOKS.forEach(function(b,i){
    var a0=-90+i*90+2,a1=-90+(i+1)*90-2,mid=(a0+a1)/2*Math.PI/180,rm=(R0+R1)/2;
    var tx=C+rm*Math.cos(mid),ty=C+rm*Math.sin(mid);
    h+='<g class="seg" data-book="'+b.id+'" role="button" tabindex="0" aria-label="Book '+b.id+', '+esc(b.title)+'">'+
       '<path d="'+arc(a0,a1,R0,R1)+'" style="fill:var(--b'+(i+1)+')"/>'+
       '<text x="'+tx+'" y="'+ty+'" text-anchor="middle" dominant-baseline="central">'+b.id+'</text></g>';
  });
  h+='<path class="arrowhead" d="M168 2 L190 12 L168 22 Z"/>';
  h+='<text class="ringc" x="180" y="172" font-size="20">Vico\'s cycle</text>';
  h+='<text class="ringm" x="180" y="194">IV runs back into I</text>';
  $('#ring').innerHTML=h;
}
function selectBook(id){
  var b=null,idx=0;
  BOOKS.forEach(function(x,i){if(x.id===id){b=x;idx=i;}});
  if(!b)return;
  $$('#ring .seg').forEach(function(g){g.classList.toggle('on',g.getAttribute('data-book')===id);});
  var chips=b.ch.map(function(cid){var c=chOf(cid);return '<button type="button" class="chip" data-go="ch:'+cid+'">'+cid+' '+esc(c.t)+'</button>';}).join('');
  $('#bookinfo').innerHTML='<h2>Book '+b.id+': '+esc(b.title)+'</h2><p class="meta">'+esc(b.age)+' · '+b.pp+' · '+b.n+(b.n===1?' chapter':' chapters')+'</p><p style="margin-bottom:14px">'+esc(b.text)+'</p><div class="row">'+chips+'</div>';
}
$('#ring').addEventListener('click',function(e){var g=e.target.closest('.seg'); if(g)selectBook(g.getAttribute('data-book'));});
$('#ring').addEventListener('keydown',function(e){
  if(e.key==='Enter'||e.key===' '){var g=e.target.closest('.seg'); if(g){e.preventDefault();selectBook(g.getAttribute('data-book'));}}
});

/* ---------- cast ---------- */
function renderCast(){
  var h=CAST.map(function(c){
    var txt=(c.n+' '+c.full+' '+c.role+' '+c.m.join(' ')+' '+c.l).toLowerCase();
    return '<article class="card cast srch" data-text="'+esc(txt)+'"><h3>'+esc(c.n)+'</h3><p class="role"><b>'+esc(c.full)+'.</b> '+esc(c.role)+'</p>'+
      '<div class="masks">'+c.m.map(function(m){return '<span class="chip mask">'+esc(m)+'</span>';}).join('')+'</div>'+
      '<p class="listen"><b>Listen for.</b> '+esc(c.l)+'</p>'+
      '<button type="button" class="btn" data-find="'+esc(c.q)+'">Find in chapters</button></article>';
  }).join('');
  $('#castgrid').innerHTML=h;
  $('#minor').textContent=MINOR;
}

/* ---------- chapters ---------- */
function renderChapters(){
  var h=CH.map(function(c){
    var tags=c.tags.map(function(t){var m=MOTIFS.filter(function(x){return x.id===t;})[0];return '<button type="button" class="chip" data-motifset="'+t+'">'+esc(m.t)+'</button>';}).join('');
    var txt=(c.id+' '+c.t+' '+c.g+' '+c.body.replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g,'$1')+' '+c.tip+' '+c.tags.join(' ')).toLowerCase();
    var open=c.id==='I.1';
    return '<article class="ch srch" id="'+domId(c.id)+'" data-id="'+c.id+'" data-book="'+c.b+'" data-tags="'+c.tags.join(' ')+'" data-text="'+esc(txt)+'">'+
      '<h3><button type="button" class="chhead" aria-expanded="'+open+'" aria-controls="'+domId(c.id)+'-b">'+
      '<span class="num">'+c.id+'</span><span class="ttl">'+esc(c.t)+'<span class="rd" data-rd="'+c.id+'"></span></span><span class="pp">pp '+c.pp+'</span>'+
      '<span class="gist">'+esc(c.g)+'</span></button></h3>'+
      '<div class="chbody" id="'+domId(c.id)+'-b"'+(open?'':' hidden')+'>'+
      '<p class="txt">'+fmt(c.body)+'</p>'+
      '<p class="tip"><b>Listen for.</b> '+esc(c.tip)+'</p>'+
      '<div class="tags"><span class="t">Motifs</span>'+tags+'</div>'+
      '<div class="notebox" hidden></div>'+
      '<label class="field" for="m-'+domId(c.id)+'">My margin note on '+c.id+'</label>'+
      '<textarea id="m-'+domId(c.id)+'" data-key="ch:'+c.id+'" placeholder="What did you notice?"></textarea>'+
      '<div class="readrow"><input type="checkbox" id="r-'+domId(c.id)+'" data-read="'+c.id+'"><label for="r-'+domId(c.id)+'">Mark as read</label></div>'+
      '</div></article>';
  }).join('');
  $('#chlist').innerHTML=h;
  // filters
  var bf='<span class="flabel">Book</span><button type="button" class="chip" data-bookset="all" aria-pressed="true">All</button>'+
    BOOKS.map(function(b){return '<button type="button" class="chip" data-bookset="'+b.id+'" aria-pressed="false">'+b.id+'</button>';}).join('');
  $('#bookfilter').innerHTML=bf;
  var mf='<span class="flabel">Motif</span><button type="button" class="chip" data-motifset="" aria-pressed="true">Any</button>'+
    MOTIFS.map(function(m){return '<button type="button" class="chip" data-motifset="'+m.id+'" aria-pressed="false">'+esc(m.t)+'</button>';}).join('');
  $('#motiffilter').innerHTML=mf;
  syncFilterUI();
}
function syncFilterUI(){
  $$('#bookfilter [data-bookset]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-bookset')===state.book?'true':'false');});
  $$('#motiffilter [data-motifset]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-motifset')===state.motif?'true':'false');});
}
function setOpen(art,open){
  var btn=$('.chhead',art),body=$('.chbody',art);
  btn.setAttribute('aria-expanded',open?'true':'false');
  body.hidden=!open;
}
function showNote(art,key){
  var n=NOTES[key]; if(!n)return;
  var box=$('.notebox',art);
  var cur=box.getAttribute('data-key');
  $$('.a',art).forEach(function(a){a.setAttribute('aria-expanded',a.getAttribute('data-note')===key&&cur!==key?'true':'false');});
  if(cur===key){box.hidden=true;box.removeAttribute('data-key');return;}
  box.setAttribute('data-key',key);
  var tid='nc-'+domId(art.getAttribute('data-id'))+'-'+key;
  box.innerHTML='<div class="nb-head"><strong>'+esc(n.t)+'</strong>'+lvl(n.l)+'<button type="button" class="close" data-closenote="1">Close</button></div>'+
    '<p>'+esc(n.b)+'</p>'+
    '<label class="field" for="'+tid+'">My comment on this note</label>'+
    '<textarea id="'+tid+'" data-key="n:'+key+'" placeholder="Agree? Disagree? Add your reading."></textarea>';
  var ta=$('textarea',box); if(store.notes['n:'+key])ta.value=store.notes['n:'+key];
  box.hidden=false;
}
function applyFilters(){
  var q=state.q, shown=0;
  $$('#chlist .ch').forEach(function(a){
    var ok=(state.book==='all'||a.getAttribute('data-book')===state.book)&&
           (!state.motif||(' '+a.getAttribute('data-tags')+' ').indexOf(' '+state.motif+' ')>=0)&&
           (!q||a.getAttribute('data-text').indexOf(q)>=0);
    a.hidden=!ok; if(ok)shown++;
  });
  $('#chempty').hidden=shown>0;
  // cast
  var cs=0; $$('#castgrid .srch').forEach(function(a){var ok=!q||a.getAttribute('data-text').indexOf(q)>=0; a.hidden=!ok; if(ok)cs++;});
  $('#castempty').hidden=cs>0; $('#minor').hidden=!!q&&cs===0;
  // words
  var ws=0; $$('#wlist .wbtn').forEach(function(a){var ok=!q||a.getAttribute('data-text').indexOf(q)>=0; a.hidden=!ok; if(ok)ws++;});
  $('#wempty').hidden=ws>0;
  // pronunciation
  $$('#saylist .srch').forEach(function(a){a.hidden=!!q&&a.getAttribute('data-text').indexOf(q)<0;});
  // motifs
  var ms=0; $$('#motifgrid .srch').forEach(function(a){var ok=!q||a.getAttribute('data-text').indexOf(q)>=0; a.hidden=!ok; if(ok)ms++;});
  $('#motifempty').hidden=ms>0;
}
function resetFilters(){state.book='all';state.motif='';state.q='';$('#q').value='';syncFilterUI();applyFilters();}

function openChapter(id,noteKey){
  showTab('chapters');
  try{location.hash='chapters';}catch(e){}
  var art=document.getElementById(domId(id));
  if(art.hidden){resetFilters();}
  setOpen(art,true);
  if(noteKey){showNote(art,noteKey);}
  art.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}

/* ---------- words ---------- */
function renderWords(){
  $('#wlist').innerHTML=WORDS.map(function(w){
    var txt=(w.w+' '+w.g+' '+w.parts.map(function(p){return p[0]+' '+p[1];}).join(' ')).toLowerCase();
    return '<button type="button" class="wbtn" data-w="'+w.id+'" aria-pressed="false" data-text="'+esc(txt)+'">'+esc(w.w)+'</button>';
  }).join('');
  showWord(WORDS[0].id);
}
function showWord(id){
  var w=WORDS.filter(function(x){return x.id===id;})[0]; if(!w)return;
  $$('#wlist .wbtn').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-w')===id?'true':'false');});
  $('#wdetail').innerHTML='<h3 class="wword">'+esc(w.w)+'</h3><p class="where">'+esc(w.where)+' · '+lvl(w.l)+'</p>'+
    '<div class="parts">'+w.parts.map(function(p){return '<div class="part"><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span></div>';}).join('')+'</div>'+
    '<p style="max-width:62ch">'+esc(w.g)+'</p>'+
    '<label class="field" for="wn-'+w.id+'">My reading of this word</label>'+
    '<textarea id="wn-'+w.id+'" data-key="w:'+w.id+'" placeholder="What else do you hear in it?"></textarea>';
  var ta=$('textarea',$('#wdetail')); if(store.notes['w:'+id])ta.value=store.notes['w:'+id];
}

/* ---------- motifs ---------- */
function renderMotifs(){
  $('#motifgrid').innerHTML=MOTIFS.map(function(m){
    var where=CH.filter(function(c){return c.tags.indexOf(m.id)>=0;});
    var txt=(m.t+' '+m.b).toLowerCase();
    return '<article class="card motif srch" data-text="'+esc(txt)+'"><h3>'+esc(m.t)+'</h3><p>'+esc(m.b)+'</p>'+
      '<div class="row">'+where.map(function(c){return '<button type="button" class="chip" data-go="ch:'+c.id+'">'+c.id+'</button>';}).join('')+'</div>'+
      '<button type="button" class="btn" data-motifgo="'+m.id+'">Show only these chapters</button></article>';
  }).join('');
}

/* ---------- notes ---------- */
function labelFor(key){
  var i=key.indexOf(':'), t=key.slice(0,i), id=key.slice(i+1);
  if(t==='ch'){var c=chOf(id);return 'Chapter '+id+': '+(c?c.t:'');}
  if(t==='n'){return 'Note: '+(NOTES[id]?NOTES[id].t:id);}
  if(t==='w'){var w=WORDS.filter(function(x){return x.id===id;})[0];return 'Word: '+(w?w.w:id);}
  return key;
}
function orderedKeys(){
  var keys=[];
  CH.forEach(function(c){keys.push('ch:'+c.id);});
  Object.keys(NOTES).forEach(function(k){keys.push('n:'+k);});
  WORDS.forEach(function(w){keys.push('w:'+w.id);});
  return keys.filter(function(k){return store.notes[k]&&store.notes[k].trim();});
}
function updateCount(){
  var n=orderedKeys().length;
  $('#ncount').textContent=n?'('+n+')':'';
}
function renderNotes(){
  var keys=orderedKeys();
  $('#noteempty').hidden=keys.length>0;
  $('#exp').hidden=keys.length===0;
  $('#notelist').innerHTML=keys.map(function(k){
    return '<div class="nitem"><h3>'+esc(labelFor(k))+'</h3><pre>'+esc(store.notes[k])+'</pre><div class="row"><button type="button" class="btn" data-opennote="'+k+'">Open and edit</button><button type="button" class="btn" data-delnote="'+k+'">Delete</button></div></div>';
  }).join('');
  var md='# My notes on Finnegans Wake\n\n'+keys.map(function(k){return '## '+labelFor(k)+'\n\n'+store.notes[k].trim()+'\n';}).join('\n');
  $('#exptext').value=md;
}
function updateProgress(){
  var n=CH.filter(function(c){return store.read[c.id];}).length;
  $('#progtxt').textContent=n+' of '+CH.length+' chapters read';
  $('#progbar').style.width=(n/CH.length*100)+'%';
  $$('[data-rd]').forEach(function(s){s.textContent=store.read[s.getAttribute('data-rd')]?'Read':'';});
  $$('[data-read]').forEach(function(c){c.checked=!!store.read[c.getAttribute('data-read')];});
}

/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var t=e.target;
  var go=t.closest('[data-go]');
  if(go){
    var v=go.getAttribute('data-go');
    if(v.indexOf('ch:')===0){openChapter(v.slice(3));}
    else if(v==='loop'){showTab('say');try{location.hash='say';}catch(err){}var ls=document.getElementById('loopsec');if(ls)ls.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}
    else if(v.indexOf('tab:')===0){var n=v.slice(4);showTab(n);try{location.hash=n;}catch(err){}}
    return;
  }
  var head=t.closest('.chhead');
  if(head){var art=head.closest('.ch');setOpen(art,head.getAttribute('aria-expanded')!=='true');return;}
  var a=t.closest('.a');
  if(a){showNote(a.closest('.ch'),a.getAttribute('data-note'));return;}
  var cl=t.closest('[data-closenote]');
  if(cl){var art2=cl.closest('.ch');var box=$('.notebox',art2);box.hidden=true;box.removeAttribute('data-key');$$('.a',art2).forEach(function(x){x.setAttribute('aria-expanded','false');});return;}
  var bs=t.closest('[data-bookset]');
  if(bs){state.book=bs.getAttribute('data-bookset');syncFilterUI();applyFilters();return;}
  var ms=t.closest('#motiffilter [data-motifset], #chlist [data-motifset]');
  if(ms){var v2=ms.getAttribute('data-motifset');state.motif=(state.motif===v2?'':v2);syncFilterUI();applyFilters();return;}
  var mg=t.closest('[data-motifgo]');
  if(mg){state.motif=mg.getAttribute('data-motifgo');state.book='all';state.q='';$('#q').value='';syncFilterUI();applyFilters();showTab('chapters');try{location.hash='chapters';}catch(err){}window.scrollTo(0,0);return;}
  var fd=t.closest('[data-find]');
  if(fd){state.q=fd.getAttribute('data-find').toLowerCase();$('#q').value=fd.getAttribute('data-find');state.book='all';state.motif='';syncFilterUI();applyFilters();showTab('chapters');try{location.hash='chapters';}catch(err){}window.scrollTo(0,0);return;}
  var wb=t.closest('.wbtn');
  if(wb){showWord(wb.getAttribute('data-w'));return;}
  var on=t.closest('[data-opennote]');
  if(on){
    var k=on.getAttribute('data-opennote'),ci=k.indexOf(':'),ty=k.slice(0,ci),id=k.slice(ci+1);
    if(ty==='ch'){openChapter(id);setTimeout(function(){var ta=document.getElementById('m-'+domId(id));if(ta)ta.focus();},50);}
    else if(ty==='n'){openChapter(NOTE_HOME[id]||'I.1',id);}
    else if(ty==='w'){showTab('words');showWord(id);try{location.hash='words';}catch(err){}}
    return;
  }
  var dn=t.closest('[data-delnote]');
  if(dn){delete store.notes[dn.getAttribute('data-delnote')];persist();syncFields();updateCount();renderNotes();return;}
});
$('#expall').addEventListener('click',function(){$$('#chlist .ch').forEach(function(a){if(!a.hidden)setOpen(a,true);});});
$('#colall').addEventListener('click',function(){$$('#chlist .ch').forEach(function(a){setOpen(a,false);});});

document.addEventListener('input',function(e){
  var ta=e.target;
  if(ta.matches&&ta.matches('textarea[data-key]')){
    var k=ta.getAttribute('data-key'),v=ta.value;
    if(v.trim()){store.notes[k]=v;}else{delete store.notes[k];}
    persist();updateCount();
  }
});
document.addEventListener('change',function(e){
  var c=e.target;
  if(c.matches&&c.matches('input[data-read]')){
    var id=c.getAttribute('data-read');
    if(c.checked){store.read[id]=true;}else{delete store.read[id];}
    persist();updateProgress();
  }
});
$('#q').addEventListener('input',function(){state.q=this.value.trim().toLowerCase();applyFilters();});
$('#q').addEventListener('keydown',function(e){
  if(e.key==='Enter'&&state.q&&state.tab!=='chapters'&&state.tab!=='cast'&&state.tab!=='words'&&state.tab!=='motifs'){showTab('chapters');}
});

var statusTimer=null;
$('#copyall').addEventListener('click',function(){
  var ta=$('#exptext'),st=$('#expstatus'),ok=false;
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(ta.value).then(function(){st.textContent='Copied.';},function(){ta.focus();ta.select();st.textContent='Copy blocked here. The text is selected, so use your device\'s copy command.';});
      ok=true;
    }
  }catch(err){}
  if(!ok){ta.focus();ta.select();st.textContent='The text is selected. Use your device\'s copy command.';}
});
var clearArmed=false;
$('#clearall').addEventListener('click',function(){
  var b=this;
  if(!clearArmed){clearArmed=true;b.textContent='Click again to confirm';setTimeout(function(){clearArmed=false;b.textContent='Clear all notes';},3500);return;}
  clearArmed=false;b.textContent='Clear all notes';
  store.notes={};persist();syncFields();updateCount();renderNotes();
});

function syncFields(){
  $$('textarea[data-key]').forEach(function(ta){ta.value=store.notes[ta.getAttribute('data-key')]||'';});
}


/* ---------- pronunciation ---------- */
var SAY=[], READ=[], LOOP=[], READV={}, AUDIO={}, BLOBS={}, sayAudio=null, playQueue=null, queueBtn=null, irishVoice=null;
function itemById(id){return SAY.concat(READ,LOOP).filter(function(x){return x.id===id;})[0];}
var ICON_PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
var ICON_STOP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10H7z"/></svg>';
function pickVoice(){
  try{
    var vs=window.speechSynthesis?speechSynthesis.getVoices():[];
    irishVoice=vs.filter(function(v){return /en-IE/i.test(v.lang);})[0]||vs.filter(function(v){return /Moira/i.test(v.name);})[0]||vs.filter(function(v){return /en-GB/i.test(v.lang);})[0]||null;
  }catch(e){irishVoice=null;}
}
if(window.speechSynthesis){pickVoice();try{speechSynthesis.onvoiceschanged=pickVoice;}catch(e){}}
function renderSay(){
  $('#saylist').innerHTML=SAY.map(function(it){
    var txt=(it.text+' '+it.say+' '+(it.note||'')).toLowerCase();
    var src=AUDIO[it.id]?'Dublin voice':'Device voice';
    return '<div class="say srch" id="say-'+it.id+'" data-text="'+esc(txt)+'">'+
      '<button type="button" class="playbtn" data-say="'+it.id+'" aria-label="Play '+esc(it.text)+'">'+ICON_PLAY+'</button>'+
      '<div class="sayt">'+esc(it.text)+'<span class="src">'+src+'</span></div>'+
      '<div class="resp">'+esc(it.say)+'</div>'+
      (it.note?'<p class="saynote">'+esc(it.note)+'</p>':'')+'</div>';
  }).join('');
  applyFilters();
}
function renderRead(){
  $('#readlist').innerHTML=READ.map(function(it,i){
    var src=AUDIO[it.id]?'Irish voice':'Device voice';
    var sp=it.speaker||'a', who=(READV[sp]&&READV[sp].label)||'';
    return '<div class="say read sp-'+sp+'" id="say-'+it.id+'">'+
      '<button type="button" class="playbtn" data-say="'+it.id+'" aria-label="Play line '+(i+1)+'">'+ICON_PLAY+'</button>'+
      '<div class="sayt readt">'+esc(it.text)+'<span class="src">'+src+'</span></div>'+
      '<div class="readmeta"><span class="who">'+esc(who)+'</span>Line '+(i+1)+' of '+READ.length+' · '+lvl(it.l)+'</div>'+
      '<p class="saynote">'+esc(it.note)+'</p></div>';
  }).join('');
}
function renderLoop(){
  $('#looplist').innerHTML=LOOP.map(function(it){
    var src=AUDIO[it.id]?'Irish voice':'Device voice';
    return '<div class="say read" id="say-'+it.id+'">'+
      '<button type="button" class="playbtn" data-say="'+it.id+'" aria-label="Play: '+esc(it.where)+'">'+ICON_PLAY+'</button>'+
      '<div class="sayt readt">'+esc(it.text)+'<span class="src">'+src+'</span></div>'+
      '<div class="readmeta"><span class="who">'+esc(it.where)+'</span>'+lvl(it.l)+'</div>'+
      '<p class="saynote">'+esc(it.note)+'</p></div>';
  }).join('');
}
function runQueue(ids,btn,label,gap){
  playQueue=ids.slice();queueBtn=btn;btn.textContent='Stop';
  (function next(){
    if(!playQueue||!playQueue.length){playQueue=null;btn.textContent=label;queueBtn=null;return;}
    var id=playQueue.shift();
    var row=document.getElementById('say-'+id); if(row&&row.scrollIntoView)row.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'});
    playSay(id,function(){setTimeout(next,gap==null?700:gap);});
  })();
}
function resetQueue(){
  playQueue=null;
  $('#playall').textContent='Play all in order';
  $('#playread').textContent='Play the passage';
  $('#playloop').textContent='Play the loop';
  queueBtn=null;
}
/* One shared audio element. iOS only lets a page play sound from an element
   the person has tapped to start, so reusing a single element keeps the
   passage queue playing after the first line. */
var player=null, playerToken=0;
function getPlayer(){
  if(!player){
    player=document.createElement('audio');
    player.setAttribute('playsinline','');player.preload='auto';
    player.style.display='none';document.body.appendChild(player);
  }
  return player;
}
function sayStatus(msg){['#saystatus','#readstatus'].forEach(function(sel){var el=$(sel);if(el)el.textContent=msg||'';});}
/* Load every clip into memory once. Clips played from memory avoid iOS
   Safari's partial-download requests, which break playback in installed apps. */
function prefetchAudio(){
  Object.keys(AUDIO).forEach(function(id){
    var f=AUDIO[id]; if(!f||BLOBS[id])return;
    fetch('audio/'+f).then(function(r){if(!r.ok)throw new Error(r.status);return r.blob();})
      .then(function(b){BLOBS[id]=URL.createObjectURL(b);}).catch(function(){});
  });
}
function stopSay(){
  playerToken++;
  if(player){try{player.pause();}catch(e){}player.onended=null;player.onerror=null;}
  try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){}
  $$('.say.playing').forEach(function(r){r.classList.remove('playing');var b=$('.playbtn',r);if(b)b.innerHTML=ICON_PLAY;});
}
function playSay(id,done){
  var it=itemById(id); if(!it)return;
  stopSay();
  var token=playerToken;
  var row=document.getElementById('say-'+id),btn=$('.playbtn',row);
  row.classList.add('playing');btn.innerHTML=ICON_STOP;sayStatus('');
  var slow=$('#slow')&&$('#slow').checked;
  var finished=false;
  function end(){if(finished||token!==playerToken)return;finished=true;row.classList.remove('playing');btn.innerHTML=ICON_PLAY;if(done)done();}
  var src=BLOBS[id]||(AUDIO[id]?'audio/'+AUDIO[id]:null);
  if(src){
    var a=getPlayer();
    a.onended=end;
    a.onerror=function(){if(token!==playerToken)return;sayStatus('That clip could not load, so your device voice is reading it.');speak();};
    a.src=src;
    a.defaultPlaybackRate=a.playbackRate=slow?0.75:1;try{a.preservesPitch=true;}catch(e){}
    var pr=a.play();
    if(pr&&pr.catch)pr.catch(function(err){
      if(token!==playerToken)return;
      if(err&&err.name==='NotAllowedError'){finished=true;row.classList.remove('playing');btn.innerHTML=ICON_PLAY;playQueue=null;resetQueue();sayStatus('Your device blocked audio. Tap a play button to start.');}
      else{sayStatus('That clip could not play, so your device voice is reading it.');speak();}
    });
  }else{speak();}
  function speak(){
    if(!window.speechSynthesis){end();sayStatus('No voice is available on this device.');return;}
    var u=new SpeechSynthesisUtterance(it.speak||it.text);
    if(irishVoice){u.voice=irishVoice;u.lang=irishVoice.lang;}else{u.lang='en-IE';}
    u.rate=slow?0.7:0.9;u.onend=end;u.onerror=end;
    speechSynthesis.speak(u);
  }
}
function loadSay(){
  Promise.all([
    fetch('data/pronunciations.json').then(function(r){return r.json();}),
    fetch('audio/index.json').then(function(r){return r.ok?r.json():{};}).catch(function(){return {};}),
    fetch('data/readaloud.json').then(function(r){return r.json();}).catch(function(){return {items:[]};}),
    fetch('data/loop.json').then(function(r){return r.json();}).catch(function(){return {items:[]};})
  ]).then(function(res){SAY=res[0].items||[];AUDIO=res[1]||{};READ=res[2].items||[];READV=res[2].voices||{};LOOP=res[3].items||[];renderLoop();prefetchAudio();if(res[2].speakers_note)$('#speakernote').textContent=res[2].speakers_note;renderRead();renderSay();})
  .catch(function(){$('#saylist').innerHTML='<div class="empty">The pronunciation list could not load. Check your connection and reload.</div>';});
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-say]');
  if(b){resetQueue();var row=b.closest('.say');if(row.classList.contains('playing')){stopSay();}else{playSay(b.getAttribute('data-say'));}return;}
  var pa=e.target.closest('#playall'),pr=e.target.closest('#playread'),pl=e.target.closest('#playloop');
  if(pl){
    var was=(queueBtn===pl);resetQueue();stopSay();if(was)return;
    runQueue(LOOP.map(function(x){return x.id;}),pl,'Play the loop',120);return;
  }
  if(pa||pr){
    var btn=pa||pr,wasThis=(queueBtn===btn);
    resetQueue();stopSay();
    if(wasThis)return;
    var ids=pa?$$('#saylist .say').filter(function(r){return !r.hidden;}).map(function(r){return r.id.slice(4);}):READ.map(function(x){return x.id;});
    runQueue(ids,btn,pa?'Play all in order':'Play the passage');
  }
});

/* ---------- init ---------- */
renderRing();
selectBook('I');
renderCast();
renderChapters();
renderWords();
renderMotifs();
syncFields();
updateProgress();
updateCount();
applyFilters();
loadSay();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});}
var h0=(location.hash||'').slice(1);
if(TABS.indexOf(h0)>=0)showTab(h0);
})();
