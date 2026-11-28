/*!
 * Simran Gunsi — Portfolio AI Assistant Widget
 * A self-contained, embeddable chat widget with pre-programmed,
 * keyword-matched responses. No backend, no API calls, no analytics.
 * Colors and type match simrangunsi.com (Cormorant Garamond + Inter, #2B2BFF accent).
 *
 * EMBED (one line, on every page you want it to appear):
 *   <script src="simran-assistant.js" defer></script>
 * Place it once, right before the closing </body> tag.
 *
 * CONFIG: tweak the SGA_CONFIG object just below to change the accent
 * color, which corner it docks to, and the little "nudge" bubble.
 */
(function () {
  "use strict";

  if (window.__sgaLoaded) return;
  window.__sgaLoaded = true;

  // ---------------------------------------------------------------------
  // CONFIG — safe to edit
  // ---------------------------------------------------------------------
  var SGA_CONFIG = {
    accent: "#1C1C1C",
    accentSoft: "#EFEDE8",
    ink: "#0A0A0A",
    inkSoft: "#888888",
    bg: "#F5F5F2",
    border: "rgba(10,10,10,0.08)",
    position: "right", // "right" or "left"
    showNudge: true,
    nudgeDelayMs: 2600,
    nudgeText: "Learn more about my work",
    launcherLabel: "Ask about Simran"
  };

  // ---------------------------------------------------------------------
  // CONTENT — the assistant's knowledge base
  // ---------------------------------------------------------------------
  var WELCOME_HTML =
    "Hi, thanks for stopping by. I'm an assistant trained on Simran's real work, so you can ask about her " +
    "projects, her process, the kind of designer she is, or what she's like outside of work. Start with a " +
    "suggestion below or ask your own question.";

  var STARTER_CHIPS = [
    { label: "What has Simran worked on?", intent: "impact" },
    { label: "What's she up to right now?", intent: "project-samsung" },
    { label: "What's her design process like?", intent: "process" },
    { label: "What does she do for fun?", intent: "personality" }
  ];

  var DEFAULT_FOLLOWUPS = [
    { label: "What has she worked on?", intent: "impact" },
    { label: "What's her process?", intent: "process" },
    { label: "How can I get in touch?", intent: "contact" }
  ];

  var INTENTS = [
    {
      id: "project-filters",
      triggers: ["report filters","filters","filter","filtering","mode analytics","mode","dashboards","dashboard","churn","satisfaction","date filters","cascading"],
      response: "At Mode (now ThoughtSpot) she drove the design for report filters, alongside a PM and an engineering manager. Analysts were stuck with basic filtering while sifting through huge datasets, so she designed new capabilities like relative date filters, cascading filters, and filters that only show values relevant to your other selections. When a design review came back with mixed feedback, she took both directions to six real users instead of guessing. The result: it prevented churn for a top customer, user satisfaction rose from 3.9 to 4.3 out of 5 after launch, and the pattern carried across future reports.",
      followups: [
        { label: "How does she handle mixed feedback?", intent: "collaboration" },
        { label: "Tell me about the freemium work", intent: "project-freemium" },
        { label: "What's her design process like?", intent: "process" }
      ]
    },
    {
      id: "project-freemium",
      triggers: ["freemium","upsell","paywall","monetization","paid feature","upgrade","conversion","pricing","free to paid","growth"],
      response: "Also at ThoughtSpot, she built an upsell framework for the freemium product: a system for where and how free-to-paid touchpoints live, so upgrade moments feel helpful instead of pushy. The case study for this one is coming soon on the site.",
      followups: [
        { label: "Tell me about report filters", intent: "project-filters" },
        { label: "What did she do at ThoughtSpot?", intent: "project-thoughtspot" },
        { label: "How can I get in touch?", intent: "contact" }
      ]
    },
    {
      id: "project-playground",
      triggers: ["playground","playground global","robot","robots","robotics","fleet","warehouse","autonomous","navigation","internship","intern"],
      response: "At Playground Global, a deep tech venture firm, she was a UX design intern on the internal software team, working with a portfolio company in warehouse automation. The core problem: robots don't follow fixed paths, so their behavior can feel unpredictable to warehouse managers. She designed how the fleet UI shows robot states and routes on a live map, and learned there's a sweet spot, enough signal that you notice a change, but not so much that a busy map becomes noise.",
      followups: [
        { label: "What about the human-robot interaction work?", intent: "project-hri" },
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "project-hri",
      triggers: ["hri","human robot","human-robot","human robot interaction","cart","semantic mapping"],
      response: "Her other Playground project explored warehouse robots through a human-robot interaction lens. The industry bar for collaborative robots is basically 'don't hit people,' and she looked at how robots could actually work with people instead. She researched it three ways, literature (including semantic mapping, where robots model space more like humans do), informal conversations with potential users, and industry research, then sketched concepts like a robot cart built around how workers actually move.",
      followups: [
        { label: "Tell me about the fleet UI", intent: "project-playground" },
        { label: "How does she do research?", intent: "research" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "project-gratitude",
      triggers: ["gratitude","tech4good","tech 4 good","thank you","thank you cards","cards","social connection"],
      response: "Gratitude came out of UC Santa Cruz's Tech4Good Research Lab during the pandemic: a platform for collective thank-you cards, so a community could show appreciation while staying apart. She worked on UX, research, and animation with a team of designers and researchers. The two priorities were zero friction for the people receiving cards, and making opening them feel like unwrapping a gift rather than reading a message.",
      followups: [
        { label: "What does she care about?", intent: "community" },
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "research",
      triggers: ["user research","research","interviews","usability","usability testing","testing","users","talk to users","synthesis"],
      response: "She treats research as something woven through the work, not a phase you finish first. A good example is Mode's report filters: when two design directions split a design review, she walked six existing users through both, asked where they'd expect to add a new filter, and let that settle it. At Playground she combined academic papers, informal user conversations, and industry research to make sense of a space nobody fully understood yet.",
      followups: [
        { label: "Tell me about report filters", intent: "project-filters" },
        { label: "What's her design process like?", intent: "process" },
        { label: "How does she work with PMs and engineers?", intent: "collaboration" }
      ]
    },
    {
      id: "collaboration",
      triggers: ["work with pms","work with pm","work with product","work with engineers","work with engineering","working with engineers","working with pms","work with developers","collaborate","collaboration","pm","pms","product manager","engineers","engineering","cross functional","cross-functional","stakeholders","feedback","disagree","disagreement","conflict","teamwork","team"],
      response: "She works closely with PMs and engineering, and she's comfortable in code herself, which makes those conversations easier. When there's disagreement she tries to take opinions out of it and get evidence: at Mode, when a design review gave mixed feedback on two directions, she ran quick sessions with real users and brought the answer back to the team. She also cares about leaving work others can build on, so documentation and rationale ship with the designs.",
      followups: [
        { label: "How does she do research?", intent: "research" },
        { label: "Is she technical?", intent: "technical" },
        { label: "What's her design process like?", intent: "process" }
      ]
    },
    {
      id: "technical",
      triggers: ["code","coding","technical","engineer","developer","front end","frontend","html","css","javascript","cursor","claude code","built this site","build this site","this website","this site","prototype","prototyping","vibe coding"],
      response: "Yes, she's comfortable in code: HTML, CSS, and JavaScript, and she builds with AI coding tools like Cursor and Claude Code regularly. She designed and built this site with them, including the scrapbook maker on the Play page and this assistant. Pantry was built the same way, which is why she understands how AI products actually get made, not just how they're mocked up.",
      followups: [
        { label: "Tell me about Pantry", intent: "project-pantry" },
        { label: "What tools does she use?", intent: "skills" },
        { label: "How does she design for AI?", intent: "ai-design" }
      ]
    },
    {
      id: "ai-design",
      triggers: ["designing for ai","design for ai","ai design","ai experiences","ai ux","llm","llms","generative","gen ai","genai","trust","uncertainty","consumer ai","ai products","machine learning"],
      response: "Her clearest AI work is Pantry, an AI nutrition app she took from 0 to 1. The interesting design problems there are less about chat and more about turning messy human input, like 'a handful of trail mix' or a photo of a plate, into structured information people can trust, and being honest when the AI is estimating. She also brings that thinking to how her team at Samsung uses AI in its own design workflow.",
      followups: [
        { label: "Tell me about Pantry", intent: "project-pantry" },
        { label: "Is she technical?", intent: "technical" },
        { label: "Why would she be a good fit?", intent: "fit-general" }
      ]
    },
    {
      id: "data-viz",
      triggers: ["data visualization","data viz","dataviz","visualization","charts","chart","graphs","data heavy","complex data","enterprise"],
      response: "Data-heavy products are her favorite kind of problem. At Samsung she designs how researchers monitor studies and see clinical health metrics across phone, watch, and desktop. At Mode she worked on tools for data analysts who write SQL, Python, and R, where good filtering decides whether an insight is findable at all. The thread is the same: make complex data feel clear without dumbing it down.",
      followups: [
        { label: "Tell me about report filters", intent: "project-filters" },
        { label: "What's she up to right now?", intent: "project-samsung" },
        { label: "What kind of designer is she?", intent: "about" }
      ]
    },
    {
      id: "community",
      triggers: ["review my portfolio","portfolio review","look at my portfolio","career advice","career chat","mentor","mentoring","mentorship","community","speaking","speaker","talk","portfolio review","portfolio reviews","chaos consulting","consulting","volunteer","pro bono","creative tech design","just design","grace hacks","grace-hacks","hackathon","leadership","leader","social impact","nonprofit","nonprofits","give back"],
      response: "Outside her day job she puts a lot of design energy into other people. She takes on occasional UX audits and pro bono projects for early-stage teams and nonprofits, and she's open to portfolio reviews, mentoring, and speaking. In college she founded Creative Tech Design, UC Santa Cruz's first UI/UX organization, led Just Design, a design-a-thon for social justice, and was lead designer for Grace-Hacks, the campus hackathon for underrepresented genders.",
      followups: [
        { label: "Can she review my portfolio?", intent: "contact" },
        { label: "What's her education?", intent: "education" },
        { label: "What does she do for fun?", intent: "personality" }
      ]
    },
    {
      id: "scrapbook",
      triggers: ["scrapbook","scrapbooking","junk journal","junk journaling","play page","make your own","maker","stickers","crafts","craft"],
      response: "Scrapbooking was her first design practice, figuring out how to tell a story with just visuals and a few constraints. That's still the question she asks every day as a product designer. You can flip through a page of hers on the Play page, and even make and download your own.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What inspires her work?", intent: "inspiration" },
        { label: "Is she technical?", intent: "technical" }
      ]
    },
    {
      id: "reading",
      triggers: ["books","book","reading","read","goodreads","favorite book","reader","novel","novels"],
      response: "She's a big reader, with a goal of 30 books a year, and she keeps her shelf on Goodreads (linked from the About page). Her favorite genres lean contemporary fiction, historical fiction, memoir, and a good thriller.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What's she building with Lego?", intent: "lego" },
        { label: "How can I get in touch?", intent: "contact" }
      ]
    },
    {
      id: "lego",
      triggers: ["lego","legos","mona lisa","building lego","miffy"],
      response: "Right now it's the LEGO Art Mona Lisa, a little over a thousand pieces in out of about 1,500. Hover the Lego sticker on the About page for her progress.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What is she reading?", intent: "reading" },
        { label: "Tell me about the scrapbook", intent: "scrapbook" }
      ]
    },
    {
      id: "location",
      triggers: ["where is she based","where does she live","based","location","located","san francisco","sf","bay area","california","canada","canadian","toronto","remote","relocate","relocation","hybrid","onsite","in office","time zone","timezone"],
      response: "She's based in San Francisco, Canadian at heart and Californian by zip code. For questions about remote, hybrid, or relocating for a specific role, it's best to ask her directly at skgunsi@gmail.com.",
      followups: [
        { label: "What roles is she looking for?", intent: "target-roles" },
        { label: "How can I get in touch?", intent: "contact" },
        { label: "What does she do for fun?", intent: "personality" }
      ]
    },
    {
      id: "logistics",
      triggers: ["salary","compensation","pay","rate","availability","available","start date","notice","notice period","open to work","visa","sponsorship","work authorization","interview","schedule a call","freelance","contract","contracting","hourly"],
      response: "That's one for a direct conversation rather than a chatbot. The best way is to email her at skgunsi@gmail.com, and she's happy to talk details there.",
      followups: [
        { label: "What roles is she looking for?", intent: "target-roles" },
        { label: "What has she worked on?", intent: "impact" },
        { label: "Why would she be a good fit?", intent: "fit-general" }
      ]
    },
    {
      id: "about",
      triggers: ["introduce","summary","tldr","tl dr","elevator pitch","in a sentence","overview","kind of designer","what kind of designer","who is simran","describe simran","type of designer","tell me about simran","about simran","who is she"],
      response: "She'd call herself a product designer who makes complex data feel clear and human, with a focus in digital health, design systems, and data visualization. She likes problems where the underlying system is genuinely complicated (clinical data, enterprise BI, internal platforms) and the job is translating that complexity into something a person can actually use without a manual. She cares as much about the craft side, documentation, systems thinking, as she does about the pixels.",
      followups: [
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" },
        { label: "What does she do for fun?", intent: "personality" }
      ]
    },
    {
      id: "target-roles",
      triggers: ["target role","what role","what roles","looking for","next role","kind of job","what job","position","career goal","what are you looking","type of role","role","roles","job","career","what areas has she worked in","areas has she worked in","what areas does she work in","areas does she work in","fields has she worked in"],
      response: "She's focused on senior product design roles at the intersection of AI infrastructure, developer tools, and health tech. That's not a random spread, it's actually where her last two roles already overlap: at Samsung she designs for a clinical health platform and owns the design system engineers build on top of, while staying closely involved in how the design org uses AI tools day to day. She's drawn to products where the stakes are real (health data, developer trust, infrastructure reliability) and where good design has to hold up under complexity, not just look nice in a deck.",
      followups: [
        { label: "Where does she want to continue designing?", intent: "continue-designing" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "continue-designing",
      triggers: ["where does she want to continue designing","what does she want to continue designing","continue designing","what does she want to design next","where does she want to work next","what's next for her design career","designing for impact","what does she want to keep designing"],
      response: "She loves designing for impact, work where the stakes are real and the problems are genuinely complex, whether that's clinical health data, enterprise-scale systems, or something new entirely. She's less tied to one specific industry label and more drawn to the kind of complexity where good design actually changes whether something gets used and trusted.",
      followups: [
        { label: "What areas has Simran worked in?", intent: "target-roles" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What's her design process like?", intent: "process" }
      ]
    },
    {
      id: "fit-general",
      triggers: ["good fit","why you","why hire","why should we","why should i hire","what makes you","why are you a good fit","convince me","would she be a good fit","why would she fit","good fit for","ai infrastructure","ai infra","infrastructure company","infra company","llm company","model company","foundation model","ai platform","health tech","healthtech","digital health","healthcare company","medical","clinical","health company","developer tools","dev tools","devtools"],
      response: "Simran is a curious, adaptable designer who loves exploring new spaces and growing her skills over the course of her career. She's designed for robotics management, data visualization, and clinical research, so she's more than up for a new challenge, wherever it leads.",
      followups: [
        { label: "What areas has Simran worked in?", intent: "target-roles" },
        { label: "Where does she want to continue designing?", intent: "continue-designing" },
        { label: "What's her favorite project?", intent: "favorite-project" }
      ]
    },
    {
      id: "project-samsung",
      triggers: ["research stack","samsung health","open source","open-source","wearable","wearables","watch","smartwatch","healthcare research","samsung","digital health platform","health platform","current role","current job","healthstack","clinical health","up to right now","what is she up to","what's she up to","currently working on","up to these days"],
      response: "At Samsung Research America she's the Platform Product Designer for a healthcare research platform, the tool researchers use to run clinical studies. She owns end-to-end design across mobile, watch, and desktop: study configuration, participant management, progress monitoring, and data visualization for clinical health metrics. She also co-owns the platform's design system, building on earlier versions rather than starting from scratch, spanning watch, phone, and laptop, with real rigor around components, tokens, accessibility patterns, and documentation.",
      followups: [
        { label: "What's her design system work like?", intent: "design-systems" },
        { label: "Tell me about her accessibility work", intent: "accessibility" },
        { label: "What does she do for fun?", intent: "personality" }
      ]
    },
    {
      id: "project-thoughtspot",
      triggers: ["thoughtspot","visualization tools","product-led growth","product led growth","plg","enterprise bi","bi platform"],
      response: "At ThoughtSpot she designed visualization tools and product-led growth surfaces for their enterprise BI platform. That included building an upsell framework defining where and how free-to-paid conversion touchpoints should live in the product, and leading design on highly requested features like CSV exports, report filters, and field labeling that ended up used across the entire enterprise customer base. It taught her a lot about designing for scale, a small decision can ripple across thousands of accounts, so she got very used to partnering closely with PM and engineering to ship things that hold up against OKRs and real usage.",
      followups: [
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What's her process?", intent: "process" },
        { label: "Tell me about Pantry", intent: "project-pantry" }
      ]
    },
    {
      id: "project-pantry",
      triggers: ["pantry","nutrition app","side project","llm app","ai product","usepantry"],
      response: "Pantry (usepantry.ai) is a side project she designed and shipped alongside one engineer, an LLM-powered nutrition app. She took it from 0 to 1: onboarding, conversational AI flows, tracking, and the whole visual system, then partnered with engineering to get it from a rapid prototype into a real live product. She built a lot of it hands-on using Claude Code and Cursor, which is part of why she can say she actually understands how AI products get built, not just how they get designed on paper.",
      followups: [
        { label: "What's her process?", intent: "process" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "design-systems",
      triggers: ["theming","themes","component kit","figma library","storybook","design system","design systems","components","tokens","design ops","component library","component api"],
      response: "Design systems are honestly some of her favorite work. At Samsung she co-owns the platform's design system with two or three other designers, building on earlier versions rather than starting from a blank slate, and it spans watch, phone, and laptop. It's specific to her own project rather than a shared org-wide library, but she still treats it like a real system: components, tokens, accessibility patterns, and documentation, not just a Figma file.",
      followups: [
        { label: "Tell me about her work at Samsung", intent: "project-samsung" },
        { label: "Tell me about her accessibility work", intent: "accessibility" },
        { label: "What's her process?", intent: "process" }
      ]
    },
    {
      id: "ai-workflows",
      triggers: ["ai task force","task force","ai agents","ai workflows","prompt libraries","prompt library","delegating","agentic","agent workflows"],
      response: "She also spends some time exploring how AI agents fit into design work, mostly lightweight experiments like using them for research synthesis or drafting copy in a consistent voice. It's a smaller, ongoing interest rather than a formal program, but it's shaped how she thinks about collaborating with AI tools day to day.",
      followups: [
        { label: "What's her process?", intent: "process" },
        { label: "Tell me about Pantry", intent: "project-pantry" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "process",
      triggers: ["design process","how do you work","your process","her process","workflow","how do you approach design","methodology","how do you collaborate","critique","design approach","how do you design","how does she work","how does she design"],
      response: "She gets into the system early, understanding the data model and constraints before pushing pixels, since the wrong information architecture can quietly undermine trust. From there she moves fast through ideation, generating a lot of directions early instead of getting attached to the first one, and stays user-first the whole way through, checking every decision against how someone will actually use it, not just how it looks. Documentation and rationale matter to her as much as the screens, her design system work includes usage guidelines, not just a Figma file, because none of it is useful if the next designer can't build on it. And research stays woven through the whole thing rather than sitting in a separate phase upfront, interviews and usability testing are how she sanity-checks direction as she goes.",
      followups: [
        { label: "Tell me about her design system work", intent: "design-systems" },
        { label: "Tell me about her accessibility work", intent: "accessibility" },
        { label: "What tools does she use?", intent: "skills" }
      ]
    },
    {
      id: "accessibility",
      triggers: ["accessibility","a11y","inclusive design","wcag"],
      response: "She follows standard accessibility practices as part of her day-to-day design system work, things like color contrast, focus states, and semantic patterns, rather than running a dedicated accessibility program. It's baked into how she builds components rather than a separate initiative, which matters given she designs for a clinical health product where usability issues have real consequences.",
      followups: [
        { label: "Tell me about her design system work", intent: "design-systems" },
        { label: "What's her process?", intent: "process" },
        { label: "What tools does she use?", intent: "skills" }
      ]
    },
    {
      id: "skills",
      triggers: ["tools","tool","figma","software","what tools","tech stack","stack","skills","experience","what can you do","background","expertise","strengths","years of experience","how long"],
      response: "Broad strokes: end-to-end product design, design systems, interaction design, prototyping, data visualization, illustration, motion design, mobile and responsive web, and UX writing. On the research side, interviews, usability testing, synthesis, and heuristic evaluation. She's also comfortable in code: HTML, CSS, JavaScript, and builds with Cursor and Claude Code regularly, including this chat assistant. Tools-wise it's mostly Figma, FigJam, Storybook, Adobe, Miro, and Jira.",
      followups: [
        { label: "What's her process?", intent: "process" },
        { label: "What's her education?", intent: "education" },
        { label: "Tell me about her design system work", intent: "design-systems" }
      ]
    },
    {
      id: "education",
      triggers: ["education","school","degree","waterloo","mdei","santa cruz","study","studied","university"],
      response: "She has a BS in Cognitive Science with a Human-Computer Interaction focus from UC Santa Cruz, and is starting a Master of Digital Experience Innovation at the University of Waterloo's Stratford School of Interaction Design and Business in September 2026, part-time alongside her current role. While at UC Santa Cruz she also founded Creative Tech Design, the school's first student-run human-centered design organization, and grew it to about 100 members mentoring students into UX and product design.",
      followups: [
        { label: "What has she worked on?", intent: "impact" },
        { label: "What's her design process like?", intent: "process" },
        { label: "What kind of designer is she?", intent: "about" }
      ]
    },
    {
      id: "personality",
      triggers: ["rollerblading","ceramics","pottery","soulcycle","travel","traveling","weekends","outside of work","hobbies","fun fact","personality","who are you","free time","for fun","hobby","yourself","what do you do for fun"],
      response: "Outside of design, she's usually rollerblading, doing ceramics, deep in a scrapbooking project, traveling, or at a SoulCycle class. She likes making things with her hands as a counterweight to staring at Figma all day.",
      followups: [
        { label: "What kind of designer is she?", intent: "about" },
        { label: "What inspires her work?", intent: "inspiration" },
        { label: "How can I get in touch with her?", intent: "contact" }
      ]
    },
    {
      id: "inspiration",
      triggers: ["inspiration","inspired by","inspire","take inspo","inspo","what inspires","creative influences","influences"],
      response: "A lot of it comes from outside of screens. Ceramics and scrapbooking especially, there's something about shaping things with your hands that changes how you think about form and structure. She pays attention to how physical, analog objects are designed just as much as digital ones.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "contact",
      triggers: ["contact","email","reach","linkedin","resume","cv","get in touch","hire","connect"],
      response: "Best way to reach her is email at skgunsi@gmail.com, or connect on LinkedIn at linkedin.com/in/simrangunsi. Full case studies and a downloadable resume are right here on this site if you want something to pass along.",
      followups: [
        { label: "What roles is she looking for?", intent: "target-roles" },
        { label: "What has she worked on?", intent: "impact" },
        { label: "Why would she be a good fit?", intent: "fit-general" }
      ]
    },
    {
      id: "impact",
      triggers: ["portfolio","case studies","case study","best work","accomplishments","achievements","numbers","impact","results","outcomes","metrics","projects","what have you built","what have you shipped","what has she worked on","worked on","what has she built","what has she shipped"],
      response: "She's led design for a healthcare research platform at Samsung, worked on product-led growth and visualization features at ThoughtSpot, and shipped her own AI product, Pantry. At Mode, her report filters work prevented churn for a top customer and lifted satisfaction from 3.9 to 4.3. Feel free to check out her full case studies and resume right here on the site, or I can tell you more about what she's up to these days.",
      followups: [
        { label: "What's she up to right now?", intent: "project-samsung" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "Tell me about Pantry", intent: "project-pantry" }
      ]
    },
    {
      id: "favorite-project",
      triggers: ["favorite project","favorite work","proudest project","most proud of","proud of","biggest project","favorite"],
      response: "If she had to pick one, it's the healthcare research platform she's building at Samsung. It's the project where the stakes feel most real, the data is clinical, the users are researchers and study participants, and getting the information architecture wrong isn't just an inconvenience. It's also where she's grown the most as a designer, owning end-to-end design across mobile, watch, and desktop and co-owning the design system with a couple other designers. It's the kind of complex, high-stakes problem she wants to keep working on.",
      followups: [
        { label: "Tell me about her work at Samsung", intent: "project-samsung" },
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "meta",
      triggers: ["are you real","are you human","who made you","who built you","are you ai","are you a bot","are you sentient","what are you","are you chatgpt","are you claude"],
      response: "Fair question. I'm not a live model, just a small script Simran built with Claude: a set of keyword-matched answers and no API calls behind the scenes. Consider me a very well-rehearsed FAQ.",
      followups: [
        { label: "What's her design process like?", intent: "process" },
        { label: "What has she worked on?", intent: "impact" },
        { label: "What does she do for fun?", intent: "personality" }
      ]
    },
    {
      id: "easter-egg-magic",
      triggers: ["magic","abracadabra"],
      response: "Abracadabra. You just found the app's little magic trick.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "easter-egg-sparkle",
      triggers: ["sparkle","sparkles","shazam","easter egg","secret"],
      response: "Found it. That's the app's other hidden trick, sparkles and all.",
      followups: [
        { label: "What does she do for fun?", intent: "personality" },
        { label: "What's her favorite project?", intent: "favorite-project" },
        { label: "What has she worked on?", intent: "impact" }
      ]
    },
    {
      id: "help",
      triggers: ["help","what can i ask","what should i ask","suggestions","not sure what to ask"],
      response: "Good places to start: what she's worked on, what she's up to right now, her design process, or what she does for fun. Or just ask whatever's actually on your mind.",
      followups: STARTER_CHIPS
    },
    {
      id: "greeting",
      triggers: ["hi","hello","hey","yo","sup","howdy"],
      response: WELCOME_HTML,
      followups: STARTER_CHIPS
    }
  ];

  var FALLBACK_RESPONSE =
    "Hmm, I don't have a good answer for that one. I know her projects, process, background, and life outside work, " +
    "or you can ask her directly at skgunsi@gmail.com. Here's where I'd start:";

  var NO_MORE_DEPTH_RESPONSE = "That's really the whole picture on that one, here's where else you can look:";

  var CONTINUATION_PHRASES_SUBSTR = [
    "more specific", "tell me more", "more info", "more detail", "can you elaborate",
    "elaborate", "go on", "say more", "more on that", "more please", "continue"
  ];
  var CONTINUATION_PHRASES_EXACT = ["yes", "yeah", "sure", "ok", "okay", "more", "yep", "yup"];

  function isContinuationPhrase(rawText) {
    var norm = normalize(rawText);
    if (CONTINUATION_PHRASES_EXACT.indexOf(norm) !== -1) return true;
    for (var i = 0; i < CONTINUATION_PHRASES_SUBSTR.length; i++) {
      if (norm.indexOf(CONTINUATION_PHRASES_SUBSTR[i]) !== -1) return true;
    }
    return false;
  }

  var INTENT_MAP = {};
  for (var i = 0; i < INTENTS.length; i++) INTENT_MAP[INTENTS[i].id] = INTENTS[i];

  // ---------------------------------------------------------------------
  // Matching engine
  // ---------------------------------------------------------------------
  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function matchIntent(rawText) {
    var text = " " + normalize(rawText) + " ";
    var tokens = text.trim().split(" ");
    var best = null;
    var bestScore = 0;

    for (var i = 0; i < INTENTS.length; i++) {
      var intent = INTENTS[i];
      var score = 0;
      for (var j = 0; j < intent.triggers.length; j++) {
        var trig = intent.triggers[j];
        if (trig.indexOf(" ") !== -1) {
          if (text.indexOf(" " + trig + " ") !== -1 || text.indexOf(trig) !== -1) {
            score += 3;
          }
        } else if (tokens.indexOf(trig) !== -1) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }
    return bestScore > 0 ? best : null;
  }

  // ---------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------
  function injectStyles() {
    var side = SGA_CONFIG.position === "left" ? "left" : "right";
    var css =
      "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,500&display=swap');" +
      ".sga-root, .sga-root *{box-sizing:border-box;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}" +
      ".sga-root{position:fixed;bottom:24px;" + side + ":24px;z-index:999999;color-scheme:light;}" +
      ".sga-launcher{width:56px;height:56px;border-radius:50%;background:" + SGA_CONFIG.accent + ";box-shadow:0 6px 18px rgba(0,0,0,0.18);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;animation:sga-pop .5s cubic-bezier(.34,1.56,.64,1);}" +
      ".sga-launcher:hover{transform:scale(1.06);box-shadow:0 8px 24px rgba(43,43,255,0.36);}" +
      ".sga-launcher svg{width:26px;height:26px;}" +
      ".sga-launcher .sga-close-icon{display:none;}" +
      ".sga-root.sga-open .sga-launcher .sga-chat-icon{display:none;}" +
      ".sga-root.sga-open .sga-launcher .sga-close-icon{display:block;}" +
      "@keyframes sga-pop{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}" +
      ".sga-nudge{position:absolute;bottom:70px;" + side + ":0;background:#fff;color:" + SGA_CONFIG.ink + ";padding:11px 16px;border-radius:4px;border:1px solid " + SGA_CONFIG.border + ";box-shadow:0 8px 20px rgba(10,10,10,0.08);font-size:13.5px;font-weight:500;white-space:nowrap;opacity:0;transform:translateY(6px) scale(.96);transition:opacity .25s ease,transform .25s ease;pointer-events:none;font-family:'Inter',sans-serif;}" +
      ".sga-nudge.sga-show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;cursor:pointer;}" +
      ".sga-nudge:after{content:'';position:absolute;bottom:-6px;" + side + ":22px;width:12px;height:12px;background:#fff;border-" + (side === "left" ? "top" : "bottom") + ":1px solid " + SGA_CONFIG.border + ";border-" + (side === "left" ? "left" : "right") + ":1px solid " + SGA_CONFIG.border + ";transform:rotate(45deg);}" +
      ".sga-panel{position:absolute;bottom:70px;" + side + ":0;width:372px;max-width:calc(100vw - 32px);height:560px;max-height:min(620px,calc(100vh - 120px));background:#fff;border-radius:4px;border:1px solid " + SGA_CONFIG.border + ";box-shadow:0 16px 40px rgba(10,10,10,0.10);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(14px) scale(.97);pointer-events:none;transition:opacity .24s cubic-bezier(.22,1,.36,1),transform .24s cubic-bezier(.22,1,.36,1);}" +
      ".sga-root.sga-open .sga-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}" +
      ".sga-header{background:#fff;border-bottom:1px solid " + SGA_CONFIG.border + ";color:" + SGA_CONFIG.ink + ";padding:15px 18px;display:flex;align-items:center;gap:11px;flex-shrink:0;}" +
      ".sga-avatar{width:32px;height:32px;border-radius:50%;background:" + SGA_CONFIG.accentSoft + ";color:" + SGA_CONFIG.accent + ";display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:600;font-size:15px;flex-shrink:0;}" +
      ".sga-header-text{flex:1;min-width:0;}" +
      ".sga-header-title{font-weight:500;font-size:14px;line-height:1.3;}" +
      ".sga-header-sub{font-size:11.5px;color:" + SGA_CONFIG.inkSoft + ";display:flex;align-items:center;gap:5px;margin-top:1px;}" +
      ".sga-dot{width:5px;height:5px;border-radius:50%;background:#3FB86F;display:inline-block;box-shadow:0 0 0 0 rgba(63,184,111,.6);animation:sga-live 2s infinite;}" +
      "@keyframes sga-live{0%{box-shadow:0 0 0 0 rgba(63,184,111,.55);}70%{box-shadow:0 0 0 6px rgba(63,184,111,0);}100%{box-shadow:0 0 0 0 rgba(63,184,111,0);}}" +
      ".sga-header-close{background:" + SGA_CONFIG.bg + ";border:none;color:" + SGA_CONFIG.ink + ";width:26px;height:26px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s ease;font-size:15px;line-height:1;}" +
      ".sga-header-close:hover{opacity:.6;}" +
      ".sga-body{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:11px;background:#fff;scroll-behavior:smooth;}" +
      ".sga-body::-webkit-scrollbar{width:6px;}.sga-body::-webkit-scrollbar-thumb{background:" + SGA_CONFIG.border + ";border-radius:3px;}" +
      ".sga-row{display:flex;animation:sga-in .28s cubic-bezier(.22,1,.36,1);}" +
      "@keyframes sga-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}" +
      ".sga-row.sga-user{justify-content:flex-end;}" +
      ".sga-bubble{max-width:82%;padding:11px 14px;border-radius:4px;font-size:14px;line-height:1.5;white-space:pre-wrap;}" +
      ".sga-row.sga-bot .sga-bubble{background:" + SGA_CONFIG.bg + ";color:" + SGA_CONFIG.ink + ";border:1px solid " + SGA_CONFIG.border + ";border-bottom-left-radius:4px;}" +
      ".sga-row.sga-user .sga-bubble{background:" + SGA_CONFIG.accent + ";color:#fff;border-bottom-right-radius:4px;}" +
      ".sga-bubble.sga-typing-cursor:after{content:'';display:inline-block;width:2px;height:12px;background:" + SGA_CONFIG.inkSoft + ";margin-left:2px;vertical-align:-1px;animation:sga-blink .8s steps(1) infinite;}" +
      "@keyframes sga-blink{50%{opacity:0;}}" +
      ".sga-typing{display:flex;gap:4px;padding:13px 15px;background:" + SGA_CONFIG.bg + ";border:1px solid " + SGA_CONFIG.border + ";border-radius:4px;border-bottom-left-radius:4px;width:fit-content;}" +
      ".sga-typing span{width:6px;height:6px;border-radius:50%;background:" + SGA_CONFIG.inkSoft + ";opacity:.5;animation:sga-bounce 1.2s infinite ease-in-out;}" +
      ".sga-typing span:nth-child(2){animation-delay:.15s;}.sga-typing span:nth-child(3){animation-delay:.3s;}" +
      "@keyframes sga-bounce{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-5px);opacity:.9;}}" +
      ".sga-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;}" +
      ".sga-chip{background:" + SGA_CONFIG.accentSoft + ";border:none;color:" + SGA_CONFIG.accent + ";font-size:12.5px;font-weight:500;padding:7px 13px;border-radius:6px;cursor:pointer;transition:all .15s ease;text-align:left;}" +
      ".sga-chip:hover{background:" + SGA_CONFIG.accent + ";color:#fff;transform:translateY(-1px);}" +
      ".sga-inputbar{display:flex;align-items:center;gap:8px;padding:13px 14px;border-top:1px solid " + SGA_CONFIG.border + ";background:#fff;flex-shrink:0;}" +
      ".sga-input{color-scheme:light;flex:1;border:1px solid " + SGA_CONFIG.border + ";border-radius:6px;padding:10px 16px;font-size:14px;outline:none;transition:border-color .15s ease;min-width:0;background:#fff;color:" + SGA_CONFIG.ink + ";}" +
      ".sga-input:focus{border-color:" + SGA_CONFIG.accent + ";}" +
      ".sga-input::placeholder{color:" + SGA_CONFIG.inkSoft + ";opacity:1;}" +
      ".sga-send{width:36px;height:36px;border-radius:50%;background:" + SGA_CONFIG.accent + ";border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s ease,filter .15s ease;}" +
      ".sga-send:hover{transform:scale(1.06);filter:brightness(.9);}" +
      ".sga-send:disabled{opacity:.4;cursor:default;transform:none;}" +
      ".sga-send svg{width:15px;height:15px;}" +
      ".sga-sparkle-particle{position:absolute;pointer-events:none;z-index:5;animation:sga-sparkleBurst .9s ease-out forwards;}" +
      "@keyframes sga-sparkleBurst{0%{transform:scale(0) translateY(0) rotate(0deg);opacity:0;}20%{opacity:1;}100%{transform:scale(1) translateY(-26px) rotate(25deg);opacity:0;}}" +
      ".sga-panel,.sga-header,.sga-body,.sga-bubble,.sga-inputbar,.sga-input,.sga-header-close{transition:background .35s ease,background-color .35s ease,color .35s ease,border-color .35s ease;}" +
      ".sga-panel.sga-dark-mode-flash{background:#1e1e24;}" +
      ".sga-panel.sga-dark-mode-flash .sga-header{background:#1e1e24;border-bottom-color:rgba(255,255,255,0.14);color:#F2F2F5;}" +
      ".sga-panel.sga-dark-mode-flash .sga-header-sub{color:#9A9AA5;}" +
      ".sga-panel.sga-dark-mode-flash .sga-header-close{background:#26262e;color:#F2F2F5;}" +
      ".sga-panel.sga-dark-mode-flash .sga-body{background:#1e1e24;}" +
      ".sga-panel.sga-dark-mode-flash .sga-row.sga-bot .sga-bubble{background:#26262e;color:#F2F2F5;border-color:rgba(255,255,255,0.14);}" +
      ".sga-panel.sga-dark-mode-flash .sga-inputbar{background:#1e1e24;border-top-color:rgba(255,255,255,0.14);}" +
      ".sga-panel.sga-dark-mode-flash .sga-input{background:#26262e;color:#F2F2F5;border-color:rgba(255,255,255,0.14);}" +
      "@media (max-width:480px){.sga-panel{position:fixed;inset:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0;border:none;bottom:0;" + side + ":0;}.sga-root{bottom:14px;" + side + ":14px;}.sga-launcher{width:46px;height:46px;}.sga-launcher svg{width:22px;height:22px;}.sga-nudge{bottom:58px;width:max-content;max-width:calc(100vw - 40px);white-space:nowrap;font-size:13px;padding:9px 13px;}}";

    var styleEl = document.createElement("style");
    styleEl.setAttribute("data-sga", "true");
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  // ---------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------
  var els = {};

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") e.className = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // Sparkle glyph (two stars: one larger, one smaller) built from a single
  // reusable path, matching the "AI assistant" sparkle motif.
  var SPARKLE_PATH =
    "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 " +
    ".963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 " +
    "6.135a.5.5 0 0 1-.963 0z";

  var CHAT_ICON =
    '<svg class="sga-chat-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="translate(-1,6) scale(0.62)"><path d="' + SPARKLE_PATH + '" fill="white"/></g>' +
    '<g transform="translate(11,1) scale(0.34)"><path d="' + SPARKLE_PATH + '" fill="white"/></g>' +
    '</svg>' +
    '<svg class="sga-close-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';

  var SEND_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L20 4L14 20L11 13L4 12Z" stroke="white" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>';

  function buildWidget() {
    var root = el("div", { class: "sga-root" });

    var nudge = el("div", { class: "sga-nudge" }, SGA_CONFIG.nudgeText);
    nudge.addEventListener("click", function () {
      openPanel();
      hideNudge();
    });

    var launcher = el("button", {
      class: "sga-launcher",
      type: "button",
      "aria-label": SGA_CONFIG.launcherLabel
    }, CHAT_ICON);
    launcher.addEventListener("click", togglePanel);

    var panel = el("div", { class: "sga-panel" });

    var header = el("div", { class: "sga-header" });
    header.appendChild(el("div", { class: "sga-avatar" }, "S"));
    var headerText = el("div", { class: "sga-header-text" });
    headerText.appendChild(el("div", { class: "sga-header-title" }, "Ask about Simran"));
    headerText.appendChild(el("div", { class: "sga-header-sub" }, '<span class="sga-dot"></span> AI assistant · trained on her real work'));
    header.appendChild(headerText);
    var closeBtn = el("button", { class: "sga-header-close", type: "button", "aria-label": "Close" }, "&times;");
    closeBtn.addEventListener("click", closePanel);
    header.appendChild(closeBtn);

    var body = el("div", { class: "sga-body" });

    var inputbar = el("div", { class: "sga-inputbar" });
    var input = el("input", {
      class: "sga-input",
      type: "text",
      placeholder: "Type a question…",
      autocomplete: "off"
    });
    var sendBtn = el("button", { class: "sga-send", type: "button", "aria-label": "Send" }, SEND_ICON);

    function trySend() {
      var val = input.value.trim();
      if (!val) return;
      input.value = "";
      handleUserMessage(val);
    }
    sendBtn.addEventListener("click", trySend);
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") trySend();
    });

    inputbar.appendChild(input);
    inputbar.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(inputbar);

    root.appendChild(nudge);
    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    els.root = root;
    els.nudge = nudge;
    els.panel = panel;
    els.body = body;
    els.input = input;

    // Seed the conversation
    appendMessage("bot", WELCOME_HTML);
    appendChips(STARTER_CHIPS);
  }

  function scheduleNudge() {
    setTimeout(function () {
      if (!els.root.classList.contains("sga-open")) {
        els.nudge.classList.add("sga-show");
      }
    }, SGA_CONFIG.nudgeDelayMs);
  }

  function hideNudge() {
    els.nudge.classList.remove("sga-show");
  }

  function togglePanel() {
    if (els.root.classList.contains("sga-open")) closePanel();
    else openPanel();
  }

  function openPanel() {
    els.root.classList.add("sga-open");
    hideNudge();
    setTimeout(function () {
      els.input.focus();
    }, 200);
  }

  function closePanel() {
    els.root.classList.remove("sga-open");
  }

  function scrollToBottom() {
    els.body.scrollTop = els.body.scrollHeight;
  }

  // Quick, lightweight typewriter reveal for bot replies. Duration is capped
  // so even long answers finish fast (not a slow character-by-character crawl).
  function typeText(target, text) {
    var duration = Math.min(650, 220 + text.length * 1.1);
    var start = null;
    target.classList.add("sga-typing-cursor");
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var chars = Math.max(1, Math.floor(progress * text.length));
      target.textContent = text.slice(0, chars);
      scrollToBottom();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        target.textContent = text;
        target.classList.remove("sga-typing-cursor");
        scrollToBottom();
      }
    }
    requestAnimationFrame(step);
  }

  // Hidden easter eggs: a small sparkle burst inside the panel, echoing the
  // launcher's sparkle icon, plus a scoped dark-mode flash for the "magic"
  // trigger. Both stay contained to the widget panel, never the host page.
  var DISCO_COLORS = ["#2B2BFF", "#FF2E9A", "#FFC72B", "#2BDBAA", "#8B2BFF"];

  function sparkleSvg(size, color) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' + SPARKLE_PATH + '" fill="' + (color || SGA_CONFIG.accent) + '"/></svg>';
  }

  function triggerSparkleBurst(count, disco) {
    if (!els.panel) return;
    count = count || 12;
    for (var i = 0; i < count; i++) {
      var p = el("div", { class: "sga-sparkle-particle" });
      var size = 8 + Math.random() * 12;
      var color = disco ? DISCO_COLORS[Math.floor(Math.random() * DISCO_COLORS.length)] : SGA_CONFIG.accent;
      p.style.left = (Math.random() * 88) + "%";
      p.style.top = (10 + Math.random() * 62) + "%";
      p.style.animationDelay = (Math.random() * 500) + "ms";
      p.innerHTML = sparkleSvg(size, color);
      els.panel.appendChild(p);
      (function (particle) {
        setTimeout(function () {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 1600);
      })(p);
    }
  }

  function triggerDarkModeFlash() {
    if (!els.panel) return;
    els.panel.classList.add("sga-dark-mode-flash");
    setTimeout(function () {
      els.panel.classList.remove("sga-dark-mode-flash");
    }, 4500);
  }

  function appendMessage(role, text) {
    var row = el("div", { class: "sga-row sga-" + role });
    var bubble = el("div", { class: "sga-bubble" });
    row.appendChild(bubble);
    els.body.appendChild(row);
    if (role === "bot") {
      typeText(bubble, text);
    } else {
      bubble.textContent = text;
    }
    scrollToBottom();
  }

  function appendChips(chipList) {
    var wrap = el("div", { class: "sga-chips" });
    chipList.forEach(function (chip) {
      var c = el("button", { class: "sga-chip", type: "button" }, chip.label);
      c.addEventListener("click", function () {
        handleChipClick(chip.intent, chip.label);
      });
      wrap.appendChild(c);
    });
    els.body.appendChild(wrap);
    scrollToBottom();
  }

  function showTyping() {
    var row = el("div", { class: "sga-row sga-bot", id: "sga-typing-row" });
    row.appendChild(el("div", { class: "sga-typing" }, "<span></span><span></span><span></span>"));
    els.body.appendChild(row);
    scrollToBottom();
  }

  function hideTyping() {
    var row = document.getElementById("sga-typing-row");
    if (row) row.parentNode.removeChild(row);
  }

  var lastIntent = null;

  function respond(intent) {
    showTyping();
    var delay = 550 + Math.random() * 450;
    setTimeout(function () {
      hideTyping();
      if (intent) {
        lastIntent = intent;
        appendMessage("bot", intent.response);
        appendChips(intent.followups || DEFAULT_FOLLOWUPS);
        if (intent.id === "easter-egg-magic") {
          triggerDarkModeFlash();
          triggerSparkleBurst(120, false);
        } else if (intent.id === "easter-egg-sparkle") {
          triggerSparkleBurst(120, true);
        }
      } else {
        appendMessage("bot", FALLBACK_RESPONSE);
        appendChips(STARTER_CHIPS);
      }
    }, delay);
  }

  function respondContinuation() {
    showTyping();
    var delay = 550 + Math.random() * 450;
    setTimeout(function () {
      hideTyping();
      appendMessage("bot", NO_MORE_DEPTH_RESPONSE);
      appendChips(STARTER_CHIPS);
    }, delay);
  }

  function handleUserMessage(text) {
    appendMessage("user", text);
    var intent = matchIntent(text);
    if (!intent && lastIntent && isContinuationPhrase(text)) {
      respondContinuation();
    } else {
      respond(intent);
    }
  }

  function handleChipClick(intentId, label) {
    appendMessage("user", label);
    respond(INTENT_MAP[intentId] || null);
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  function init() {
    injectStyles();
    buildWidget();
    if (SGA_CONFIG.showNudge) scheduleNudge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
