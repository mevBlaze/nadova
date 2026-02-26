# Dubai Demo Plan — Voice-First AI Health Concierge
## Target: $2M USD Investment | Demo Date: March 8, 2026

---

## THE MISSION

Build a voice-first AI health concierge that talks to a Dubai gym owner about his body using his real biometric data, while a living dashboard materializes behind it — and makes him feel what Bryan Johnson sells for $1M, delivered through his gym at $200/month per member.

**Key constraint:** He never touches anything. 100% voice controlled. The moment he has to tap a button, the spell breaks.

---

## THE TEAM (Consumer-Facing Personas)

One Claude instance (Mira) behind the scenes. UI shows team of specialists.

| Name | Role | Domain | Voice Vibe |
|------|------|--------|------------|
| **Mira** | Coordinator | Sees everything, primary voice | Warm, confident, authoritative but not clinical |
| **Kai** | Trainer | Workouts, intensity, progress | Direct, energetic, no-nonsense |
| **Sage** | Nutritionist | Meals, macros, timing | Calm, nurturing, precise |
| **Eden** | Recovery | Rest, strain, when to skip | Gentle, observant, wise |
| **Luna** | Sleep | Optimization, quality, protocols | Soothing, peaceful, firm when needed |

---

## THE ARCHITECTURE

```
Browser (React)
├── Mic Input ──► WebSocket ──► Local Backend (Node.js)
│                                    │
│                              Deepgram STT (cloud)
│                                    │
│                              Claude Opus 4.6 (cloud)
│                                    ├── text ──► ElevenLabs TTS ──► Speaker
│                                    └── tool_use ──► Dashboard State
│
└── Dashboard UI ◄── WebSocket ◄── Tool Calls
```

**All runs localhost on MacBook. No deployment.**

---

## TECH STACK

| Component | Choice | Why |
|-----------|--------|-----|
| STT | Deepgram Nova-3 | 150ms latency, streaming, $0.0077/min |
| LLM | Claude Opus 4.6 | Maximum intelligence for demo day |
| TTS | ElevenLabs Flash v2.5 | Best voice quality, 75ms latency |
| Frontend | React + Framer Motion + Recharts | Animations, data viz |
| Backend | Node.js | Thin orchestration |
| Transport | WebSocket | Real-time audio + tool calls |

**Latency budget:** ~525-625ms end-to-end (conversational)

---

## THE EXPERIENCE (Beat by Beat)

### Scene 1: The Arrival (0-30s)
- **Visual:** Black screen, particle animation, breathing orb
- **Mira:** "Good evening, [Name]. I'm Mira — I coordinate your health team. I've had Kai, Sage, Eden, and Luna reviewing your biometric data from the past 90 days. Before we dive in... how are you feeling today?"

### Scene 2: The Team Appears (30s - 2min)
- **Visual:** Dashboard frame materializes, four cards (Kai, Sage, Eden, Luna)
- **Luna:** Sleep data + chart
- **Kai:** Training load + chart
- **Eden:** Recovery patterns + timeline

### Scene 3: The Holy Shit Moment (2-4min)
- **Visual:** Split screen materializes
- **Left:** "How you feel: Energized, strong"
- **Right:** "What your body says: Recovery deficit, HRV suppressed 48hrs"
- **Eden:** "Your body is compensating. The endorphin response masks what's actually happening."

### Scene 4: The Protocol (4-6min)
- **Visual:** Protocol card with specific recommendations
- **Kai:** Training restructure
- **Sage:** Nutrition adjustments
- **Luna:** Sleep protocol
- **Eden:** Expected improvements with timeline

### Scene 5: The Business Vision (6-8min)
- **Mira:** "Now imagine every single member of your gym gets this."
- **Visual:** Dashboard transforms → Business view
- Member health heatmap
- Revenue attribution
- ROI calculator

### Scene 6: The Close (8-10min)
- **Mira:** "What questions do you have for us?"
- Handle questions conversationally

---

## 15-DAY SPRINT

### Week 1: Foundation (Feb 21-27)

**Days 1-2: Data + Knowledge**
- [ ] Parse WHOOP CSV / Apple Health XML → JSON
- [ ] Build health knowledge corpus
- [ ] Pre-identify the "holy shit" insight
- [ ] Write full system prompt (Mira + team personas)

**Days 3-4: Voice Pipeline**
- [ ] Deepgram streaming STT
- [ ] Claude API with tool_use
- [ ] ElevenLabs streaming TTS
- [ ] Wire together: speak → transcribe → think → speak

**Days 5-7: Dashboard + Integration**
- [ ] React scaffold with WebSocket
- [ ] Dashboard components (HRV, sleep, recovery, protocol, business)
- [ ] Framer Motion animations
- [ ] Tool calls → state transitions → animations
- [ ] End-to-end test

### Week 2: Polish + Rehearsal (Feb 28 - Mar 7)

**Days 8-9: Holy Shit Moment**
- [ ] Split-screen discrepancy view
- [ ] Perfect the timing
- [ ] Make it land emotionally

**Days 10-11: Business Dashboard**
- [ ] Member heatmap
- [ ] Revenue attribution
- [ ] ROI calculator

**Days 12-13: Rehearsal**
- [ ] Voice timing polish
- [ ] Animation polish
- [ ] 5+ full run-throughs
- [ ] Record backup video
- [ ] Test with throttled network

**Day 14: Final Polish**
- [ ] Fix all bugs from rehearsal
- [ ] Prepare pitch deck (5-7 slides)
- [ ] 90-second highlight reel

**Day 15 (Mar 7): Ship Day**
- [ ] Final end-to-end test
- [ ] Pack everything
- [ ] Prepare offline fallback

**Mar 8: Demo Day**

---

## DATA REQUIREMENTS

**24-48 hours before demo, get from prospect:**
- WHOOP data export (CSV) OR Apple Health export (XML)
- Basic info: age, training schedule, goals, known issues

**We pre-process into:**
- 90-day health profile JSON
- Pre-identified key insight (the discrepancy)
- Personalized protocol recommendations

---

## SUCCESS CRITERIA

| Metric | Target |
|--------|--------|
| Voice latency | <600ms perceived |
| Tool call sync | Visuals appear as AI mentions them |
| Touch interactions | Zero (100% voice) |
| Holy shit moment | He leans forward |
| Time to ROI | <7 minutes |
| Outcome | Verbal commitment or next meeting |

---

## FALLBACKS

| Risk | Mitigation |
|------|------------|
| Voice latency issues | Pre-recorded backup audio for key moments |
| WebSocket fails | Pre-cached data, offline-capable visuals |
| API outage | Backup video of full demo |
| No real data from prospect | Synthetic data matching his profile |

---

## COSTS

| Item | Cost |
|------|------|
| Deepgram | $0 (free $200 credit) |
| Claude API | ~$50-100 |
| ElevenLabs Pro | $99/mo |
| **Total** | ~$150-200 |

---

## THE PITCH STRUCTURE

**Tiered Ask:**
- **$2M:** Full 12-month buildout, his gym as flagship, Dubai/GCC regional license option
- **$500K:** 6-month runway, his gym live in 90 days, option to invest more as traction proves

**Why him:**
- Already has distribution (gym members)
- Already has services infrastructure
- In Dubai — global nexus for luxury health tourism
- Becomes "Bryan Johnson of Dubai"

---

## RELATED CONTEXT

This demo is built on:
- Inside Out architecture (see Oracle: "Inside Out as AGI Architecture")
- Bryan Johnson gap analysis (see Oracle: "Bryan Johnson Has Brand + Data, Needs Tech")
- Architecture B decision (see Oracle: "Own the Pipeline vs Rent It")

---

*Last updated: 2026-02-21*
*Sprint start: 2026-02-21*
*Demo date: 2026-03-08*
