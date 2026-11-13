/**
 * Job seeker + landing copy, [Filipino, English].
 * Filipino mode is the Taglish copy from the Figma "Language" variable collection
 * (copy/*, landing/*, resume/*). Strings marked "// demo" were added for states
 * the Figma frames don't show (empty/waiting states etc.).
 * Employer and admin screens are English only and don't use this file.
 */
export const strings = {
  // S01 / D01
  'signup.headline': ['Isang hakbang papunta sa trabaho.', 'One step closer to a real job.'],
  'signup.sub': ['Libreng training mula sa verified na kumpanya, at may trabahong naghihintay kapag pumasa ka.', 'Free training from verified companies, with a job waiting when you pass.'],
  'promise.free': ['Libre, walang bayad kahit kailan', 'Free, now and always'],
  'promise.verified': ['Verified ang bawat employer', 'Every employer is verified'],
  'promise.commitment': ['May nakasulat na hiring commitment', 'A written hiring commitment'],
  'signup.or': ['o kaya, gamitin ang', 'or continue with'],
  'signup.haveAccount': ['May account na?', 'Already have an account?'],
  'signup.login': ['Mag-log in', 'Log in'],
  'signup.email': ['Mag-sign up gamit ang email', 'Sign up with email'],
  'signup.create': ['Gumawa ng account', 'Create an account'],
  'signup.createSub': ['Ilang minuto lang, tapos makikita mo na ang mga track na swak sa’yo.', 'It takes a few minutes, then you’ll see the tracks that fit you.'],
  'signup.agree': ['Sa pag-sign up, sumasang-ayon ka sa Privacy Notice at Terms of Use.', 'By signing up, you agree to the Privacy Notice and Terms of Use.'],
  'signup.emailLabel': ['Email', 'Email'],
  'signup.passwordLabel': ['Password', 'Password'],
  'signup.providerNote': ['Demo lang: walang totoong sign-in.', 'Demo only: no real sign-in.'], // demo

  // S02
  'consent.top': ['Bago tayo magsimula', 'Before we start'],
  'consent.title': ['Ganito namin inaalagaan ang data mo', 'How we take care of your data'],
  'consent.sub': ['Basahin ito bago gumawa ng profile. Puwede mo itong balikan anytime sa Settings.', 'Read this before you build your profile. You can come back to it anytime in Settings.'],
  'consent.collect': ['Ano ang kinokolekta namin', 'What we collect'],
  'consent.collectD': ['Pangalan, school, course, location, skills, schedule, at resume.', 'Your name, school, course, location, skills, schedule, and resume.'],
  'consent.who': ['Sino ang makakakita', 'Who can see it'],
  'consent.whoD': ['Ang employer lang na ina-apply-an mo. Hindi namin ibinebenta ang data mo.', 'Only the employers you apply to. We never sell your data.'],
  'consent.schools': ['Partner schools at PESO', 'Partner schools and PESO'],
  'consent.schoolsD': ['Bilang lang ng na-hire ang nakikita nila, hindi ang profile mo.', 'They only see how many were hired, never your profile.'],
  'consent.control': ['Ikaw ang may kontrol', 'You’re in control'],
  'consent.controlD': ['I-edit o i-delete ang account mo kahit kailan.', 'Edit or delete your account anytime.'],
  'consent.full': ['Basahin ang buong Privacy Notice', 'Read the full Privacy Notice'],
  'consent.agree': ['Sumasang-ayon ako sa Privacy Notice at Terms of Use.', 'I agree to the Privacy Notice and Terms of Use.'],
  'consent.cta': ['Sige, tuloy', 'Continue'],

  // S03 / S04 / D02
  'build.top': ['Gumawa ng profile', 'Build your profile'],
  'build.step1': ['Hakbang 1 ng 3', 'Step 1 of 3'],
  'build.step2': ['Hakbang 2 ng 3', 'Step 2 of 3'],
  'upload.title': ['I-upload ang resume mo', 'Upload your resume'],
  'upload.sub': ['Babasahin ito ng AI para punan ang profile mo. Ikaw pa rin ang magche-check bago i-save.', 'AI will read it to fill in your profile. You still check everything before saving.'],
  'upload.choose': ['Pumili ng file', 'Choose a file'],
  'upload.drag': ['I-drag dito ang resume mo, o pumili ng file', 'Drag your resume here, or choose a file'],
  'upload.types': ['PDF o DOCX, hanggang 5 MB', 'PDF or DOCX, up to 5 MB'],
  'upload.reading': ['Binabasa ng AI ang resume mo', 'AI is reading your resume'],
  'upload.read': ['Nabasa na ng AI', 'Read by AI'],
  'upload.manual': ['Wala pa akong resume, manual na lang', 'I don’t have a resume yet, fill it in manually'],
  'upload.cta': ['Tuloy', 'Continue'],
  'review.title': ['Tama ba ’to?', 'Does this look right?'],
  'review.note': ['Na-fill ito ng AI mula sa resume mo. I-check at i-edit bago i-save.', 'AI filled this in from your resume. Check and edit before saving.'],
  'review.name': ['Pangalan', 'Name'],
  'review.course': ['Course', 'Course'],
  'review.school': ['School', 'School'],
  'review.grad': ['Graduated', 'Graduated'],
  'review.city': ['Saan ka nakatira?', 'Where do you live?'],
  'review.avail': ['Kailan ka available?', 'When are you available?'],
  'review.skills': ['Skills', 'Skills'],
  'review.addSkill': ['Add skill', 'Add skill'],
  'review.save': ['I-save ang profile', 'Save profile'],
  'review.back': ['Bumalik', 'Back'],
  'review.newSkill': ['Bagong skill', 'New skill'], // demo

  // S05 / D03
  'matches.greeting': ['Magandang umaga, {name}', 'Good morning, {name}'],
  'matches.sub': ['{n} training tracks ang swak sa skills, lugar, at schedule mo.', '{n} training tracks fit your skills, location, and schedule.'],
  'filter.all': ['Lahat', 'All'],
  'filter.near': ['Malapit sa’yo', 'Near you'],
  'filter.weekend': ['Weekend', 'Weekend'],
  'match.fit': ['swak sa’yo', 'match'],
  'match.short': ['swak', 'match'],
  'match.skills': ['Skills', 'Skills'],
  'match.location': ['Location', 'Location'],
  'match.schedule': ['Schedule', 'Schedule'],
  'pilotSlots': ['Pilot partner, {n} slots', 'Pilot partner, {n} slots'],
  'weeks': ['{n} weeks', '{n} weeks'],
  'allowance': ['{amt} allowance', '{amt} allowance'],
  'verifiedEmployer': ['Verified employer', 'Verified employer'],
  'matches.noResults': ['Walang track sa filter na ito.', 'No tracks for this filter.'], // demo
  'matches.applied': ['Na-apply-an mo na', 'Applied'], // demo

  // S06
  'track.details': ['Track details', 'Track details'],
  'track.length': ['Length', 'Length'],
  'track.allowance': ['Allowance', 'Allowance'],
  'track.schedule': ['Schedule', 'Schedule'],
  'track.location': ['Location', 'Location'],
  'track.none': ['Wala', 'None'], // demo
  'track.commitment': ['Hiring commitment', 'Hiring commitment'],
  'track.commitmentText': ['Ihahire ng {emp} ang bawat trainee na papasa, sa regular na kontrata na may SSS, PhilHealth, at Pag-IBIG.', '{emp} will hire every trainee who passes, on a regular contract with SSS, PhilHealth, and Pag-IBIG.'],
  'track.howHired': ['Paano ka mahi-hire', 'How you get hired'],
  'crit.score80': ['80% o mas mataas sa bawat module test', '80% or higher on every module test'],
  'crit.f2f': ['Pumasa sa face-to-face assessment', 'Pass the face-to-face assessment'],
  'crit.attendance': ['Kumpleto ang attendance', 'Complete attendance'],
  'track.checkReady': ['Tingnan kung handa ka na', 'Check if you’re ready'],
  'track.apply': ['Mag-apply sa track', 'Apply to this track'],
  'track.report': ['Report', 'Report'],
  'track.viewMyTrack': ['Tingnan sa My Track', 'View in My Track'], // demo
  'track.modules': ['Mga module', 'Modules'],

  // S07 / D04
  'apply.title': ['I-apply sa {track}?', 'Apply to the {track}?'],
  'apply.willSee': ['Makikita ng {emp}', '{emp} will see'],
  'apply.see1': ['Pangalan, course, at school', 'Your name, course, and school'],
  'apply.see2': ['Skills at availability', 'Your skills and availability'],
  'apply.see3': ['Resume mo', 'Your resume'],
  'apply.hidden': ['Contact number mo, hangga’t hindi ka tinatanggap', 'Your contact number, until they accept you'],
  'apply.consent': ['Pumapayag akong i-share ang profile ko sa {emp} lang.', 'I agree to share my profile with {emp} only.'],
  'apply.answer': ['Makikita mo ang sagot nila sa My Track, karaniwan within 3 days.', 'You’ll see their answer in My Track, usually within 3 days.'],
  'apply.cta': ['I-apply', 'Apply'],
  'apply.notNow': ['Hindi muna', 'Not now'],

  // S08 / D05
  'trail.applied': ['Applied', 'Applied'],
  'trail.accepted': ['Tinanggap sa track', 'Accepted into the track'],
  'trail.acceptedShort': ['Tinanggap', 'Accepted'],
  'trail.f2f': ['Face-to-face assessment', 'Face-to-face assessment'],
  'trail.f2fShort': ['Face-to-face', 'Face-to-face'],
  'trail.decision': ['Hiring decision', 'Hiring decision'],
  'trail.contract': ['Contract signed', 'Contract signed'],
  'trail.contractShort': ['Contract', 'Contract'],
  'trail.passed': ['{n}%, pasado', '{n}%, passed'],
  'trail.current': ['Ginagawa mo ngayon', 'You’re on this step'],
  'trail.currentShort': ['Ginagawa mo', 'In progress'],
  'trail.retake': ['Kailangang ulitin', 'Retake needed'], // demo
  'mytrack.inTrack': ['In track', 'In track'],
  'mytrack.waiting': ['Naghihintay', 'Waiting'], // demo
  'mytrack.hired': ['Hired', 'Hired'], // demo
  'mytrack.passedBadge': ['Pasado', 'Passed'], // demo
  'mytrack.declinedBadge': ['Hindi natanggap', 'Not accepted'], // demo
  'mytrack.step': ['Nasa {ord} hakbang ka na', 'You’re on step {n}'],
  'mytrack.deadline': ['Module {n} test, Sabado', 'Module {n} test, Saturday'],
  'mytrack.deadlineD': ['{date}, 11:59 PM. Kailangan mo ng 80% para tumuloy.', '{date}, 11:59 PM. You need 80% to move on.'],
  'mytrack.f2fCard': ['Face-to-face assessment, Sabado', 'Face-to-face assessment, Saturday'], // demo
  'mytrack.f2fCardD': ['May 1, 9 AM sa BlueHarbor Ortigas. Dalhin ang valid ID.', 'May 1, 9 AM at BlueHarbor Ortigas. Bring a valid ID.'], // demo
  'mytrack.waitTitle': ['Naghihintay ng sagot ng {emp}', 'Waiting for {emp} to reply'], // demo
  'mytrack.waitD': ['Karaniwan within 3 days. Hindi pa nila nakikita ang contact number mo.', 'Usually within 3 days. They can’t see your contact number yet.'], // demo
  'mytrack.passedTitle': ['Pasado ka sa lahat ng module!', 'You passed every module!'], // demo
  'mytrack.passedD': ['Hinihintay na lang ang hiring decision ng {emp}.', 'Now waiting for {emp}’s hiring decision.'], // demo
  'mytrack.hiredTitle': ['Hired ka na! Kumpirmahin ang kontrata.', 'You’re hired! Confirm your contract.'], // demo
  'mytrack.confirmedTitle': ['Pumirma ka na. Simula {date}.', 'Contract signed. You start {date}.'], // demo
  'mytrack.declinedTitle': ['Hindi ka natanggap sa batch na ito', 'You weren’t accepted into this batch'], // demo
  'mytrack.declinedD': ['Huwag mag-alala, may iba pang tracks na swak sa’yo.', 'Don’t worry, other tracks still fit you.'], // demo
  'mytrack.empty': ['Wala ka pang track', 'You don’t have a track yet'], // demo
  'mytrack.emptyD': ['Mag-apply sa isang track at dito mo makikita ang bawat hakbang.', 'Apply to a track and you’ll follow every step here.'], // demo
  'mytrack.seeMatches': ['Tingnan ang matches', 'See your matches'], // demo
  'mytrack.modules': ['Mga module', 'Modules'],
  'mytrack.inProgressDue': ['Ginagawa, due {date}', 'In progress, due {date}'],
  'mytrack.f2fPlace': ['May 1, BlueHarbor Ortigas', 'May 1, BlueHarbor Ortigas'],
  'mytrack.notYet': ['Hindi pa nagsisimula', 'Not started'], // demo
  'mytrack.commitment': ['Ihahire ka ng {emp} kapag pumasa ka sa lahat ng module at sa assessment.', '{emp} will hire you when you pass every module and the assessment.'],
  'mytrack.endorsements': ['Verified Endorsements', 'Verified Endorsements'],
  'mytrack.goHired': ['Kumpirmahin', 'Confirm'], // demo

  // S09 / D06
  'hired.title': ['Congrats, {name}! Hired ka na.', 'Congrats, {name}! You’re hired.'],
  'hired.sub': ['Minarkahan ka ng {emp} bilang {role}, simula {date}.', '{emp} marked you as hired for {role}, starting {date}.'],
  'hired.last': ['Isang huling hakbang', 'One last step'],
  'hired.lastD': ['Kumpirmahin na pumirma ka na ng job contract na may SSS, PhilHealth, at Pag-IBIG.', 'Confirm that you signed a job contract with SSS, PhilHealth, and Pag-IBIG.'],
  'hired.yes': ['Oo, pumirma na ako', 'Yes, I signed it'],
  'hired.no': ['Hindi pa, may problema', 'Not yet, there’s a problem'],
  'hired.doneTitle': ['Opisyal na, {name}!', 'It’s official, {name}!'], // demo
  'hired.doneD': ['Nakumpirma mo ang kontrata mo sa {emp}. Kita tayo sa {date}!', 'You confirmed your contract with {emp}. See you on {date}!'], // demo
  'hired.toTrack': ['Bumalik sa My Track', 'Back to My Track'], // demo
  'hired.notYetTitle': ['Wala pang hiring decision', 'No hiring decision yet'], // demo

  // S10
  'alerts.title': ['Alerts', 'Alerts'],
  'alerts.today': ['Ngayon', 'Today'],
  'alerts.earlier': ['Mas maaga', 'Earlier'],
  'alerts.m2Tomorrow': ['Bukas na ang Module 2 test', 'Your Module 2 test is tomorrow'],
  'alerts.need80': ['Kailangan mo ng 80% para tumuloy', 'You need 80% to move on'],
  'alerts.passedM': ['Pasado ka sa Module {n}', 'You passed Module {n}'],
  'alerts.score': ['{n}% ang score mo', 'Your score is {n}%'],
  'alerts.accepted': ['Tinanggap ka sa Back Office track', 'You’re in the Back Office track'],
  'alerts.newMatch': ['Bagong match: IT Support Trainee', 'New match: IT Support Trainee'],
  'alerts.newMatchD': ['71% swak sa’yo', '71% match'],
  'alerts.hired': ['Hired ka na ng {emp}!', '{emp} marked you as hired!'], // demo
  'alerts.hiredD': ['Kumpirmahin ang kontrata mo', 'Confirm your contract'], // demo
  'alerts.applied': ['Na-send ang application mo', 'Your application was sent'], // demo
  'alerts.howRemind': ['Paano ka namin paaalalahanan', 'How we remind you'],
  'alerts.channels': ['Email, push, Messenger, at SMS', 'Email, push, Messenger, and SMS'],

  // S11 / D07
  'profile.complete': ['Profile {n}% kumpleto', 'Profile {n}% complete'],
  'profile.addIntro': ['Magdagdag ng intro', 'Add an intro'],
  'profile.lang': ['Wika / Language', 'Wika / Language'],
  'profile.getReady': ['Ihanda ang sarili', 'Get ready'],
  'profile.inProgress': ['Ginagawa: Module {n} ng 3', 'In progress: Module {n} of 3'],
  'profile.resumeScore': ['AI resume review: 72 sa 100', 'AI resume review: 72 out of 100'],
  'profile.who': ['Sino ang nakakakita ng profile mo', 'Who can see your profile'],
  'profile.appliedOnly': ['Employers na ina-apply-an ko lang', 'Only employers I apply to'],
  'profile.default': ['Default', 'Default'],
  'profile.allVerified': ['Lahat ng verified employers', 'All verified employers'],
  'profile.allVerifiedD': ['Puwede ka nilang i-invite sa track', 'They can invite you to a track'], // demo
  'profile.report': ['Mag-report ng problema', 'Report a problem'],
  'profile.endorseCount': ['{n} endorsement', '{n} endorsements'], // demo
  'profile.reminders': ['Reminders', 'Reminders'],
  'profile.introSaved': ['Intro idinagdag', 'Intro added'], // demo
  'profile.noTrack': ['Wala pang track', 'No track yet'], // demo
  'profile.waiting': ['Naghihintay ng sagot', 'Waiting for a reply'], // demo
  'profile.hiredAt': ['Hired, simula {date}', 'Hired, starting {date}'], // demo

  // S12
  'report.title': ['Mag-report ng problema', 'Report a problem'],
  'report.what': ['Ano ang nangyari?', 'What happened?'],
  'report.money': ['Humingi ng bayad ang employer', 'The employer asked for money'],
  'report.moneyD': ['Aalisin namin ang employer sa Hakbang', 'We will remove the employer from Hakbang'],
  'report.wrong': ['Mali o iba ang job details', 'The job details are wrong or different'],
  'report.harass': ['Harassment o abuse', 'Harassment or abuse'],
  'report.other': ['Iba pa', 'Something else'],
  'report.tell': ['Ikuwento kung ano ang nangyari', 'Tell us what happened'],
  'report.review48': ['Rerebyuhin namin ang report mo within 48 hours.', 'We review every report within 48 hours.'],
  'report.submit': ['I-submit ang report', 'Submit report'],
  'report.chat': ['Chat sa support, sasagot within 24 hours', 'Chat with support, replies within 24 hours'],
  'report.sentTitle': ['Natanggap namin ang report mo', 'We received your report'], // demo
  'report.sentD': ['Rerebyuhin namin ito within 48 hours at babalitaan ka namin sa Alerts at email.', 'We’ll review it within 48 hours and update you in Alerts and by email.'], // demo
  'report.done': ['Sige', 'Done'], // demo

  // S13
  'gap.title': ['Skill-Gap Check', 'Skill-Gap Check'],
  'gap.ready': ['{a} sa {b} skills, handa ka na', 'Ready on {a} of {b} skills'],
  'gap.need': ['Kailangan sa Module 1 test, 80%', 'Needed for the Module 1 test, 80%'],
  'gap.prepare': ['Paano maghanda', 'How to prepare'],
  'gap.video': ['45-minutong video', '45-minute video'],
  'gap.sheet': ['10 tanong, may sagot', '10 questions with answers'],
  'gap.ai': ['Suggestion ito ng AI. Puwede kang mag-apply kahit hindi pa kumpleto.', 'This is an AI suggestion. You can apply even if you’re not fully ready.'],
  'gap.applyAnyway': ['Mag-apply pa rin', 'Apply anyway'],
  'gap.save': ['I-save muna, maghahanda ako', 'Save it, I’ll prepare first'],
  'gap.saved': ['Na-save. Nasa Matches pa rin ito.', 'Saved. It stays in your Matches.'], // demo

  // S14
  'plan.hi': ['Hi Marco, ga-graduate ka sa July. Simulan na natin.', 'Hi Marco, you graduate in July. Let’s get started.'],
  'plan.title': ['Para sa Junior IT Support tracks', 'For Junior IT Support tracks'],
  'plan.ready': ['{n}% handa ka na', '{n}% ready'],
  'plan.based': ['Batay sa 6 IT Support tracks ngayon', 'Based on 6 IT Support tracks open now'],
  'plan.learn': ['Pag-aralan ngayong semester', 'Learn this semester'],
  'plan.need5': ['Kailangan sa 5 ng 6 tracks', 'Needed in 5 of 6 tracks'],
  'plan.need3': ['Kailangan sa 3 ng 6 tracks', 'Needed in 3 of 6 tracks'],
  'plan.have': ['Meron ka na', 'You already have'],
  'plan.mark': ['Markahan bilang natutunan', 'Mark as learned'],
  'plan.studentNote': ['Demo: ito ang view ni Marco, isang graduating student.', 'Demo: this is Marco’s view, a graduating student.'], // demo

  // S15
  'endorse.title': ['Mga endorsement mo', 'Your endorsements'],
  'endorse.count': ['{n} Verified Endorsements', '{n} Verified Endorsements'],
  'endorse.sub': ['Nakikita ito ng employers na ina-apply-an mo, kahit hindi ka ma-hire sa track na ito.', 'Employers you apply to can see these, even if you’re not hired on this track.'],
  'endorse.because': ['Dahil sa endorsements mo', 'Because of your endorsements'],
  'endorse.suggest': ['Data Entry Specialist Track, 88% swak', 'Data Entry Specialist Track, 88% match'],
  'endorse.empty': ['Wala pang endorsement', 'No endorsements yet'], // demo
  'endorse.emptyD': ['Kapag pumasa ka sa isang module, puwede kang i-endorse ng employer. Mananatili ito sa profile mo.', 'When you pass a module, the employer can endorse you. It stays on your profile.'], // demo

  // S16
  'rem.title': ['Paano ka namin paaalalahanan?', 'How should we remind you?'],
  'rem.channels': ['Channels', 'Channels'],
  'rem.push': ['Push notification', 'Push notification'],
  'rem.pushD': ['Sa phone na ito', 'On this phone'],
  'rem.messengerD': ['Connected bilang Paolo Reyes', 'Connected as Paolo Reyes'],
  'rem.what': ['Ano ang ipapaalala', 'What to remind you about'],
  'rem.deadlines': ['Deadlines ng module', 'Module deadlines'],
  'rem.deadlinesD': ['Isang araw at isang oras bago', 'One day and one hour before'],
  'rem.sessions': ['Face-to-face sessions', 'Face-to-face sessions'],
  'rem.sessionsD': ['Gabi bago ang session', 'The night before a session'],
  'rem.results': ['Results at bagong match', 'Results and new matches'],
  'rem.quiet': ['Quiet hours', 'Quiet hours'],
  'rem.quietV': ['10 PM hanggang 7 AM', '10 PM to 7 AM'],
  'rem.top': ['Reminders', 'Reminders'],

  // S17 / S18 / D08
  'resume.top': ['AI resume review', 'AI resume review'],
  'resume.preferred': ['Preferred job mo', 'Your preferred job'],
  'resume.change': ['Palitan', 'Change'],
  'resume.score': ['Malapit na, {n} sa 100', 'Almost there, {n} out of 100'],
  'resume.scoreD': ['{a} bagay ang aayusin at 2 skill ang kulang para sa trabahong ito.', '{a} things to fix and 2 skills to build for this job.'],
  'resume.working': ['Magaling na', 'What’s working'],
  'resume.working1': ['Malinaw ang customer service experience mo', 'Your customer service experience is clear'],
  'resume.working1D': ['8 buwan sa mall, may tamang petsa', '8 months at the mall, with correct dates'],
  'resume.fix': ['Ayusin', 'Fix these'],
  'resume.fix1': ['Walang numero ang achievements mo', 'Your achievements have no numbers'],
  'resume.fix1D': ['Ilagay kung ilan at gaano kabilis', 'Add how many and how fast'],
  'resume.fix2': ['Kulang ang keywords para sa back office', 'Missing back-office keywords'],
  'resume.fix2D': ['Data entry, MS Excel, documentation', 'Data entry, MS Excel, documentation'],
  'resume.fix3': ['Masyadong mahaba ang objective', 'Your objective is too long'],
  'resume.fix3D': ['Gawing 2 pangungusap', 'Cut it to 2 sentences'],
  'resume.missing': ['Kulang pa para sa Back Office Associate', 'Still needed for Back Office Associate'],
  'resume.missing1D': ['May 45-minutong prep video', 'There’s a 45-minute prep video'],
  'resume.missing2': ['Data entry speed', 'Data entry speed'],
  'resume.missing2D': ['Wala sa resume mo; idagdag kung meron ka', 'Not on your resume; add it if you have it'],
  'resume.ai': ['Suggestion ito ng AI. Ikaw pa rin ang magdedesisyon.', 'These are AI suggestions. You decide what to change.'],
  'resume.start': ['Simulan ang pag-aayos', 'Start fixing'],
  'resume.fixN': ['Ayusin {n} ng 3', 'Fix {n} of 3'],
  'resume.fix1Why': ['Mas madaling makita ng employer ang galing mo kapag may bilang. Ilagay mo ang totoong numero, hindi kami mag-iimbento.', 'Employers see your strengths faster when there are numbers. Put in your real numbers; we never make them up.'],
  'resume.fix2Why': ['Hinahanap ng back-office employers ang mga salitang ito. Idagdag lang kung totoo sa’yo.', 'Back-office employers look for these words. Only add them if they’re true for you.'], // demo
  'resume.fix3Why': ['Mas binabasa ang maikling objective. Dalawang pangungusap lang.', 'A short objective gets read. Two sentences is enough.'], // demo
  'resume.now': ['Ngayon', 'Now'],
  'resume.suggestion': ['Suggestion ng AI', 'AI suggestion'],
  'resume.replace': ['Palitan ang mga nasa [ ] ng totoong bilang mo.', 'Replace the parts in [ ] with your real numbers.'],
  'resume.use': ['Gamitin ang suggestion', 'Use this suggestion'],
  'resume.edit': ['I-edit ko mismo', 'I’ll edit it myself'],
  'resume.applied': ['Nagamit na', 'Applied'], // demo
  'resume.next': ['Susunod', 'Next'], // demo
  'resume.done': ['Tapos', 'Done'], // demo
  'resume.preview': ['Resume mo', 'Your resume'], // demo
  'resume.forJob': ['Para sa preferred job mo: Back Office Associate', 'For your preferred job: Back Office Associate'],
  'resume.fillIn': ['Ilagay ang totoong numero', 'Type your real number'], // demo

  // shared
  'tab.matches': ['Matches', 'Matches'],
  'tab.mytrack': ['My Track', 'My Track'],
  'tab.alerts': ['Alerts', 'Alerts'],
  'tab.profile': ['Profile', 'Profile'],
  'launchFeature': ['Launch feature', 'Launch feature'],
  'back': ['Bumalik', 'Back'],
  'aiTag': ['AI', 'AI'],

  // Landing
  'l.nav.seekers': ['Para sa job seekers', 'For job seekers'],
  'l.nav.employers': ['Para sa employers', 'For employers'],
  'l.nav.how': ['Paano ito gumagana', 'How it works'],
  'l.nav.login': ['Mag-log in', 'Log in'],
  'l.nav.signup': ['Mag-sign up', 'Sign up'],
  'l.badge': ['Pilot sa Metro Manila, Abril 2027', 'Pilot in Metro Manila, April 2027'],
  'l.hero': ['Training na may trabaho sa dulo.', 'Training with a job at the end.'],
  'l.heroSub': ['Ang Hakbang ay nagme-match sa fresh grads sa libreng training mula sa verified na kumpanya. Pumasa ka, at may trabahong naghihintay.', 'Hakbang matches fresh grads with free training from verified companies. Pass the training, and a job is waiting for you.'],
  'l.find': ['Hanapin ang track mo', 'Find your track'],
  'l.forEmp': ['Para sa employers', 'For employers'],
  'l.trust1': ['Libre para sa job seekers', 'Free for job seekers'],
  'l.trust2': ['Verified ang bawat employer', 'Every employer is verified'],
  'l.trust3': ['May nakasulat na hiring commitment', 'Written hiring commitment'],
  'l.card.profile': ['Profile ni Paolo', 'Paolo’s profile'],
  'l.card.profileD': ['Na-fill ng AI, 2 minuto', 'Filled by AI in 2 minutes'],
  'l.card.passed': ['Pasado sa Module 1', 'Passed Module 1'],
  'l.card.passedD': ['88% ang score', 'Score: 88%'],
  'l.card.hired': ['Hired ka na!', 'You’re hired!'],
  'l.card.hiredD': ['Simula May 17', 'Starts May 17'],
  'l.steps': ['Apat na hakbang mula fresh grad hanggang hired', 'Four steps from fresh grad to hired'],
  'l.stepsSub': ['Walang bayad, walang hulaan. Alam mo kung saan ka na sa bawat hakbang.', 'No fees and no guessing. You always know where you stand.'],
  'l.s1': ['Gumawa ng Living Profile', 'Build your Living Profile'],
  'l.s1D': ['I-upload ang resume mo. Pupunan ng AI ang profile, ikaw ang magche-check.', 'Upload your resume. AI fills in your profile, and you check it.'],
  'l.s2': ['Ma-match sa tamang track', 'Get matched to the right track'],
  'l.s2D': ['Makikita mo ang tracks na swak sa skills, lugar, at schedule mo.', 'See tracks that fit your skills, location, and schedule.'],
  'l.s3': ['Mag-training at sundan ang progress', 'Train and follow your progress'],
  'l.s3D': ['Online modules at isang face-to-face assessment. Alam mo ang score na kailangan.', 'Online modules and one face-to-face assessment. You know the score you need.'],
  'l.s4': ['Ma-hire sa regular na trabaho', 'Get hired into a real job'],
  'l.s4D': ['Pumasa ka, at ihahire ka ng employer na may SSS, PhilHealth, at Pag-IBIG.', 'Pass, and the employer hires you with SSS, PhilHealth, and Pag-IBIG.'],
  'l.safety': ['Walang “free training” na walang trabaho', 'No more “free training” with no job'],
  'l.safetySub': ['Nadala ka na ba sa training na walang kasunod? Ginawa namin ang Hakbang para hindi na maulit iyon.', 'Been burned by training that led nowhere? We built Hakbang so it doesn’t happen again.'],
  'l.p1': ['Verified ang bawat kumpanya', 'Every company is verified'],
  'l.p1D': ['Sinusuri namin ang BIR 2303, SEC o DTI registration, at business permit bago sila makapag-post ng track.', 'We check BIR 2303, SEC or DTI registration, and the business permit before a company can post a track.'],
  'l.p2': ['Malinaw ang terms bago ka mag-apply', 'Clear terms before you apply'],
  'l.p2D': ['Haba ng training, allowance, at hiring criteria, nakasulat lahat. Pati ang hiring commitment ng employer.', 'Training length, allowance, and hiring criteria are all written down, along with the employer’s hiring commitment.'],
  'l.p3': ['Laging may report button', 'A report button, always'],
  'l.p3D': ['Rerebyuhin namin ang bawat report within 48 hours. Kapag humingi ng pera ang employer, aalisin namin sila.', 'We review every report within 48 hours. If an employer asks for money, we remove them.'],
  'l.features': ['Lahat ng kailangan mo, nasa isang app', 'Everything you need, in one app'],
  'l.featuresSub': ['Libre, at bukas sa kahit anong phone browser. Walang kailangang i-download.', 'Free, and it opens in any phone browser. Nothing to download.'],
  'l.f.profile': ['Living Profile', 'Living Profile'],
  'l.f.profileD': ['Isang profile na lumalago habang nagte-training ka. Pinupunan ng AI mula sa resume mo.', 'One profile that grows as you train. AI fills it in from your resume.'],
  'l.f.match': ['Smart Matching', 'Smart Matching'],
  'l.f.matchD': ['Tracks na swak sa skills, lugar, at schedule mo. Hindi kasama ang school o pangalan sa score.', 'Tracks that fit your skills, location, and schedule. Your school and name never count.'],
  'l.f.location': ['Lugar', 'Location'],
  'l.f.tracks': ['Train-to-Hire Tracks', 'Train-to-Hire Tracks'],
  'l.f.tracksD': ['Training na dinisenyo ng employer, na may malinaw na haba, allowance, at hiring criteria.', 'Training designed by the employer, with clear length, allowance, and hiring criteria.'],
  'l.f.4weeks': ['4 linggo', '4 weeks'],
  'l.f.satsun': ['Sabado at Linggo', 'Sat and Sun'],
  'l.f.progress': ['Progress Tracker', 'Progress Tracker'],
  'l.f.progressD': ['Bawat hakbang mula match hanggang hire, kasama ang test results at deadlines.', 'Every step from match to hire, with test results and deadlines.'],
  'l.f.assessment': ['Assessment', 'Assessment'],
  'l.f.hired': ['Hired', 'Hired'],
  'l.emp.tag': ['Para sa employers', 'For employers'],
  'l.emp.title': ['Mag-hire ng trainees na handa na. Magbayad lang kapag may na-hire.', 'Hire trainees who are ready. Pay only when you hire.'],
  'l.emp.sub': ['Mag-post ng training track, tingnan ang matched shortlist, at sundan ang progress ng bawat trainee sa isang dashboard.', 'Post a training track, review a matched shortlist, and follow every trainee’s progress in one dashboard.'],
  'l.emp.b1': ['Pre-matched na shortlist, hindi daan-daang aplikasyon', 'A pre-matched shortlist, not hundreds of applications'],
  'l.emp.b2': ['Mas kaunting dropout, dahil alam ng trainee na may trabaho', 'Fewer dropouts, because trainees know a job is waiting'],
  'l.emp.b3': ['90-day replacement guarantee sa bawat hire', 'A 90-day replacement guarantee on every hire'],
  'l.emp.pilot': ['Maging pilot partner', 'Become a pilot partner'],
  'l.emp.talk': ['Kausapin ang team', 'Talk to our team'],
  'l.price.title': ['Walang hire, walang bayad', 'No hire, no fee'],
  'l.price.per': ['bawat hire, unang batch', 'per hire, first batch'],
  'l.price.standard': ['Standard rate', 'Standard rate'],
  'l.price.volume': ['Lampas 30 hires kada quarter', 'Over 30 hires a quarter'],
  'l.price.posting': ['Pag-post ng track at shortlist', 'Posting tracks and shortlists'],
  'l.price.free': ['Libre', 'Free'],
  'l.price.note': ['Monthly billing, 30-day terms. Ang mga presyo ay planning estimate pa para sa pilot.', 'Monthly billing, 30-day terms. Prices are still planning estimates for the pilot.'],
  'l.peso': ['Career office ka ba o LGU PESO?', 'Are you a career office or LGU PESO?'],
  'l.pesoD': ['I-refer ang graduates mo nang libre at makatanggap ng buod kung ilan ang na-match, na-train, at na-hire. Summary data lang, hindi personal na profile.', 'Refer your graduates for free and get a summary of how many were matched, trained, and hired. Summary data only, never personal profiles.'],
  'l.pesoCta': ['Mag-partner sa amin', 'Partner with us'],
  'l.faq': ['Mga madalas itanong', 'Frequently asked questions'],
  'l.faqSub': ['May tanong pa? Mag-chat sa amin, sasagot kami within 24 hours.', 'Still have questions? Chat with us, we reply within 24 hours.'],
  'l.q1': ['Talaga bang libre ito para sa job seekers?', 'Is it really free for job seekers?'],
  'l.a1': ['Oo. Hindi ka magbabayad kahit kailan. Ang employers ang nagbabayad, at kapag may na-hire lang. Kapag may employer na humingi ng pera, i-report agad.', 'Yes. You never pay anything. Employers pay, and only when they hire. If an employer ever asks you for money, report it right away.'],
  'l.q2': ['Paano ko malalaman na totoo ang kumpanya?', 'How do I know a company is real?'],
  // TODO(team): FAQ answers 2–4 still need final copy from the team.
  'l.a2': ['Bawat kumpanya ay may “Verified employer” badge. Sinusuri namin ang BIR 2303, SEC o DTI registration, at business permit bago sila makapag-post.', 'Every company carries a “Verified employer” badge. We check BIR 2303, SEC or DTI registration, and the business permit before they can post.'],
  'l.q3': ['Ano ang mangyayari kapag hindi ako na-hire?', 'What happens if I’m not hired?'],
  'l.a3': ['Mananatili sa profile mo ang mga natapos mong module at endorsement, at makikita mo pa rin ang ibang tracks na swak sa’yo.', 'The modules you finished and any endorsements stay on your profile, and you still see other tracks that fit you.'],
  'l.q4': ['Kailangan ko bang mag-download ng app?', 'Do I need to download an app?'],
  'l.a4': ['Hindi. Bukas ang Hakbang sa kahit anong phone o laptop browser.', 'No. Hakbang works in any phone or laptop browser.'],
  'l.cta': ['Simulan ang unang hakbang.', 'Take the first step.'],
  'l.ctaSub': ['Libre ang pag-sign up. Bukas sa kahit anong phone o laptop browser.', 'Signing up is free. It works in any phone or laptop browser.'],
  'l.ctaBtn': ['Mag-sign up nang libre', 'Sign up for free'],
  'l.tagline': ['Isang hakbang papunta sa trabaho.', 'One step closer to a real job.'],
  'l.ft.seekers': ['Job seekers', 'Job seekers'],
  'l.ft.employers': ['Employers', 'Employers'],
  'l.ft.partners': ['Partners', 'Partners'],
  'l.ft.help': ['Tulong', 'Help'],
  'l.ft.tracks': ['Mga track', 'Tracks'],
  'l.ft.pricing': ['Pricing', 'Pricing'],
  'l.ft.empLogin': ['Employer log in', 'Employer log in'],
  'l.ft.career': ['Career offices', 'Career offices'],
  'l.ft.peso': ['LGU PESO', 'LGU PESO'],
  'l.ft.report': ['Mag-report ng problema', 'Report a problem'],
  'l.ft.privacy': ['Privacy Notice', 'Privacy Notice'],
  'l.ft.terms': ['Terms of Use', 'Terms of Use'],
  'l.copyright': ['© 2027 Hakbang, ni Team Unlad. Sumusunod sa Data Privacy Act of 2012 (RA 10173).', '© 2027 Hakbang, by Team Unlad. Compliant with the Data Privacy Act of 2012 (RA 10173).'],
  'l.heroPhoto': ['Hero photo goes here: trainees in a session', 'Hero photo goes here: trainees in a session'],
  'l.tryDemo': ['Subukan ang demo', 'Try the demo'], // demo
} as const satisfies Record<string, readonly [string, string]>;

export type StringKey = keyof typeof strings;
