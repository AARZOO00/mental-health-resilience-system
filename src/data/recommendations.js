/**
 * AI Recommendation Engine
 * Provides dynamic, tiered suggestions based on score levels.
 * Each dimension has 3 tiers: critical (0-30), low (31-55), moderate (56-74).
 * Scores ≥ 75 receive maintenance advice.
 */

export const RECOMMENDATIONS = {
  economic: {
    critical: {
      urgency: "high",
      headline: "Financial Crisis Support",
      intro: "Your economic situation poses serious risk to mental health. Immediate action is critical.",
      actions: [
        { title: "Apply for Emergency Assistance", detail: "Contact 211 (US) or your local social services for emergency rent, food, and utility assistance within 24–48 hours.", icon: "🆘" },
        { title: "Visit a Food Bank", detail: "Feeding America (feedingamerica.org) can locate food pantries within 2 miles of your zip code — no paperwork needed at most.", icon: "🥫" },
        { title: "Free Financial Counseling", detail: "NFCC.org connects you with certified counselors who offer free sessions for debt management and budgeting.", icon: "📞" },
        { title: "Explore Benefit Eligibility", detail: "BenefitsCheckUp.org will show all federal and state programs you qualify for in under 10 minutes.", icon: "✅" },
      ],
      resource: "https://www.benefitscheckup.org/",
      resourceLabel: "Check Your Benefits →",
    },
    low: {
      urgency: "medium",
      headline: "Building Financial Stability",
      intro: "Your finances are under strain. Small, consistent steps now can significantly reduce mental load.",
      actions: [
        { title: "Build a $500 Emergency Fund", detail: "Set up automatic transfer of even $10/week. This single buffer reduces financial anxiety by 40% (JPMorgan Institute, 2016).", icon: "🏦" },
        { title: "Free Vocational Training", detail: "Google Career Certificates and Coursera offer free/low-cost credentials in IT, project management, and UX — high-demand fields.", icon: "🎓" },
        { title: "Side Income Research", detail: "Explore gig work aligned with your skills: freelancing (Fiverr), delivery (DoorDash), or local services via TaskRabbit.", icon: "💼" },
        { title: "LIHEAP for Utility Bills", detail: "Low Income Home Energy Assistance Program helps cover heating/cooling — apply before winter/summer deadlines.", icon: "⚡" },
      ],
      resource: "https://grow.google/certificates/",
      resourceLabel: "Free Google Certificates →",
    },
    moderate: {
      urgency: "low",
      headline: "Optimizing Financial Wellness",
      intro: "You have a foundation — now build resilience against future shocks.",
      actions: [
        { title: "3–6 Month Emergency Fund", detail: "Grow your buffer to cover 3–6 months of expenses. High-yield savings accounts (4–5% APY) accelerate this.", icon: "🏛️" },
        { title: "Automate Retirement Savings", detail: "Increase 401k contribution by just 1% — the long-term compounding effect is dramatic and you rarely notice the difference month to month.", icon: "📈" },
        { title: "Income Diversification", detail: "Add one passive income stream: dividend stocks, digital products, or rental income to reduce single-income dependency.", icon: "🌊" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  social: {
    critical: {
      urgency: "high",
      headline: "Breaking Social Isolation",
      intro: "Severe isolation is as dangerous as smoking. Reconnecting with others is your highest priority action.",
      actions: [
        { title: "Call Someone Today", detail: "Research shows just 10 minutes of positive social contact significantly reduces cortisol. Text or call one person right now — it doesn't have to be deep.", icon: "📱" },
        { title: "Peer Support Groups", detail: "NAMI (nami.org/Support-Education/Support-Groups) and 7 Cups offer free peer support from people who understand isolation firsthand.", icon: "🫂" },
        { title: "Volunteer Once This Week", detail: "Volunteering even once creates a 'helper's high' through oxytocin release, and positions you to meet like-minded people naturally.", icon: "🤲" },
        { title: "Meetup.com", detail: "Find local groups around ANY interest — board games, hiking, coding, cooking. Low-pressure social settings with shared context.", icon: "🗺️" },
      ],
      resource: "https://www.nami.org/Support-Education/Support-Groups",
      resourceLabel: "Find NAMI Support Group →",
    },
    low: {
      urgency: "medium",
      headline: "Expanding Your Support Network",
      intro: "You have some connections but need deeper, more consistent social bonds.",
      actions: [
        { title: "Schedule Weekly Social Contact", detail: "Put one social commitment on your calendar each week — breakfast with a friend, a call with family, or a club meeting.", icon: "📅" },
        { title: "Join a Recurring Activity", detail: "Recurring groups (weekly classes, sports leagues, book clubs) build friendship through the 'exposure effect' — repeated contact grows trust.", icon: "🎯" },
        { title: "Active Listening Practice", detail: "Deepen existing relationships by practicing 'reflective listening': repeat back what someone says before responding. This builds intimacy quickly.", icon: "👂" },
        { title: "Reconnect with 3 People", detail: "Reach out to 3 people you've lost touch with. A simple 'thinking of you' message has an outsized positive impact on the receiver.", icon: "💌" },
      ],
      resource: "https://www.meetup.com/",
      resourceLabel: "Find Local Groups →",
    },
    moderate: {
      urgency: "low",
      headline: "Deepening Social Connections",
      intro: "Your social life is decent — invest in quality over quantity.",
      actions: [
        { title: "Vulnerability Practice", detail: "Share one authentic, slightly vulnerable thing with a close friend this week. Vulnerability is the engine of deep friendship (Brené Brown research).", icon: "💛" },
        { title: "Be the Connector", detail: "Introduce two people in your network who should know each other. This strengthens both relationships AND your own social standing.", icon: "🔗" },
        { title: "Mentorship (Give or Receive)", detail: "Mentorship creates meaningful, reciprocal relationships. Offer your skills to someone junior, or find a mentor in an area you're growing.", icon: "🌱" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  housing: {
    critical: {
      urgency: "high",
      headline: "Housing Crisis Resources",
      intro: "Housing instability creates chronic trauma. Immediate stabilization is the foundation for all other progress.",
      actions: [
        { title: "National Housing Hotline", detail: "Call 1-800-569-4287 (HUD-approved) for emergency housing counseling and to learn your rights as a tenant or person experiencing homelessness.", icon: "🏠" },
        { title: "Know Your Tenant Rights", detail: "Most evictions require 30–60 day notice and can be contested. Legal Aid Society provides free representation — search 'legal aid [your city]'.", icon: "⚖️" },
        { title: "Apply for Section 8 Now", detail: "Section 8 waitlists open periodically. Check HUD.gov for open enrollment periods in your area and apply immediately when available.", icon: "📝" },
        { title: "Rapid Rehousing Programs", detail: "Many cities have Rapid Rehousing programs that provide short-term rental subsidies to prevent or end homelessness quickly.", icon: "🆘" },
      ],
      resource: "https://www.hud.gov/topics/rental_assistance",
      resourceLabel: "HUD Rental Assistance →",
    },
    low: {
      urgency: "medium",
      headline: "Improving Housing Stability",
      intro: "Your housing situation is stressful. These steps can reduce uncertainty and create a safer foundation.",
      actions: [
        { title: "Create a Housing Safety Net", detail: "Save 2 months of rent in a dedicated account before anything else — this single buffer prevents the cascading crisis of missed rent.", icon: "🛡️" },
        { title: "Document Everything", detail: "Keep records of all communications with landlords. Text/email over phone calls. This protects your rights if disputes arise.", icon: "📋" },
        { title: "Renter's Insurance", detail: "For $15–20/month, renter's insurance covers your belongings and liability — often required for lease renewal and worth far more than the cost.", icon: "🔒" },
        { title: "Neighborhood Safety Assessment", detail: "Use NeighborhoodScout or local crime maps to objectively assess your area and make informed decisions about moving.", icon: "🗺️" },
      ],
      resource: null,
      resourceLabel: null,
    },
    moderate: {
      urgency: "low",
      headline: "Building Long-Term Housing Security",
      intro: "Good foundation — now build toward ownership and long-term stability.",
      actions: [
        { title: "First-Time Homebuyer Programs", detail: "FHA loans require as little as 3.5% down. Many states offer additional grants for first-time buyers — HUD.gov lists all programs.", icon: "🏡" },
        { title: "Neighborhood Investment", detail: "Get involved in your local HOA or community association to improve safety and property values — and build social connections simultaneously.", icon: "🌳" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  healthcare: {
    critical: {
      urgency: "high",
      headline: "Accessing Essential Healthcare",
      intro: "Without healthcare access, small problems become crises. Free options exist right now.",
      actions: [
        { title: "Free/Sliding-Scale Clinics", detail: "HRSA.gov/find-health-care lists 1,400+ federally qualified health centers that charge on a sliding scale based on income — many are $0.", icon: "🏥" },
        { title: "Medicaid Eligibility Check", detail: "If you earn under ~$20K (individual) you likely qualify for Medicaid. Apply at Healthcare.gov or your state marketplace — coverage starts quickly.", icon: "💊" },
        { title: "Crisis Mental Health Lines", detail: "988 Suicide & Crisis Lifeline (call or text 988) provides free 24/7 support. Crisis Text Line: text HOME to 741741.", icon: "🆘" },
        { title: "Prescription Assistance", detail: "NeedyMeds.org and GoodRx reduce medication costs by 60–80%. Many pharmaceutical companies also offer free medications for low-income patients.", icon: "💉" },
      ],
      resource: "https://findahealthcenter.hrsa.gov/",
      resourceLabel: "Find Free Health Center →",
    },
    low: {
      urgency: "medium",
      headline: "Improving Healthcare Access",
      intro: "You have some access but gaps remain. Filling these gaps prevents costly emergencies.",
      actions: [
        { title: "Establish a Primary Care Physician", detail: "Having a regular PCP means better preventive care, coordinated treatment, and someone who knows your history in a crisis.", icon: "👨‍⚕️" },
        { title: "Telehealth for Mental Health", detail: "BetterHelp, Talkspace, and Open Path (sliding scale $30–$80/session) make therapy accessible without travel or long waits.", icon: "💻" },
        { title: "Annual Preventive Screenings", detail: "Most insurance covers 100% of preventive screenings. Blood pressure, cholesterol, and diabetes screening catch problems decades before symptoms.", icon: "📊" },
        { title: "Mental Health Parity Laws", detail: "Insurers are legally required to cover mental health equally to physical health. If denied, you can appeal — free help at MentalHealthAmerica.net.", icon: "⚖️" },
      ],
      resource: "https://openpathcollective.org/",
      resourceLabel: "Affordable Therapy →",
    },
    moderate: {
      urgency: "low",
      headline: "Optimizing Your Healthcare",
      intro: "Good access — now focus on prevention and mental health maintenance.",
      actions: [
        { title: "Annual Mental Health Check-in", detail: "Schedule a proactive mental health appointment even when well. Prevention is 10× less costly than crisis treatment.", icon: "🧠" },
        { title: "Health Savings Account (HSA)", detail: "If on a high-deductible plan, an HSA lets you save pre-tax money for medical costs — triple tax advantage.", icon: "💰" },
        { title: "Learn Your Family History", detail: "Document family mental and physical health history. This enables earlier, more targeted preventive care from your providers.", icon: "📋" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  education: {
    critical: {
      urgency: "medium",
      headline: "Building Your Educational Foundation",
      intro: "Education unlocks better health, better income, and better decision-making. Free resources exist everywhere.",
      actions: [
        { title: "Adult Education Programs", detail: "Local community colleges offer free GED preparation and adult literacy programs. ProLiteracy.org can locate programs near you.", icon: "📖" },
        { title: "Health Literacy First", detail: "Start with health literacy — understanding medication labels, nutrition labels, and when to seek care saves lives. Ask your doctor to 'teach back' information.", icon: "💊" },
        { title: "Library Card = Free Learning", detail: "A library card unlocks free access to LinkedIn Learning, Kanopy (documentaries), and thousands of audiobooks and e-courses.", icon: "📚" },
      ],
      resource: "https://proliteracy.org/",
      resourceLabel: "Find Adult Ed Programs →",
    },
    low: {
      urgency: "medium",
      headline: "Expanding Knowledge & Skills",
      intro: "You have a foundation — now build health literacy and marketable skills.",
      actions: [
        { title: "Free Online Certifications", detail: "Google Career Certificates (IT, Data Analytics, UX) cost $200 total and take 6 months — employer-recognized and high-demand.", icon: "🎓" },
        { title: "Coursera Financial Aid", detail: "100% of Coursera courses offer financial aid. Apply for any course or specialization — most approvals come within a week.", icon: "🖥️" },
        { title: "Khan Academy for Foundations", detail: "Free, world-class education in math, science, finance, and more. Used by 150M+ learners worldwide — no account required.", icon: "🌍" },
        { title: "Mental Health First Aid Course", detail: "Free 8-hour certification that teaches you to identify and respond to mental health crises in yourself and others.", icon: "🩺" },
      ],
      resource: "https://grow.google/certificates/",
      resourceLabel: "Free Google Career Certs →",
    },
    moderate: {
      urgency: "low",
      headline: "Continuous Learning for Resilience",
      intro: "Keep learning — it compounds into better decisions, income, and health.",
      actions: [
        { title: "Deep Dive One Topic Per Month", detail: "Focused monthly learning outperforms scattered reading. Choose one topic, read 2 books and 5 articles on it.", icon: "🔍" },
        { title: "Teach What You Know", detail: "Teaching is the highest form of learning. Blog, create a course, or mentor someone in your area of expertise.", icon: "🎤" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  community: {
    critical: {
      urgency: "high",
      headline: "Safety & Community Connection",
      intro: "Living in unsafe or discriminatory environments creates chronic trauma. These resources can help.",
      actions: [
        { title: "Document Discrimination Incidents", detail: "If facing discrimination, document date/time/witnesses for each incident. Report to EEOC (work), HUD (housing), or your local human rights commission.", icon: "📝" },
        { title: "Safe Neighborhood Programs", detail: "Many cities have Safe Neighborhood Initiatives, block watches, and community safety mapping. Contact your city council office.", icon: "🛡️" },
        { title: "Trauma-Informed Therapy", detail: "Chronic community violence causes PTSD. Seek trauma-informed therapists (look for 'EMDR' or 'trauma-informed' in profiles).", icon: "🧠" },
        { title: "LGBTQ+ / Cultural Safety", detail: "The Trevor Project, NAACP, and local cultural centers offer safe spaces and advocacy support for marginalized communities.", icon: "🌈" },
      ],
      resource: "https://www.naacp.org/",
      resourceLabel: "Community Advocacy →",
    },
    low: {
      urgency: "medium",
      headline: "Building Community Bonds",
      intro: "Your community connection is weak. Small steps toward engagement significantly improve wellbeing.",
      actions: [
        { title: "Attend One Community Event", detail: "Neighborhood associations, local festivals, and town halls are low-pressure entry points to community. Commit to just one this month.", icon: "🎉" },
        { title: "Volunteer Locally", detail: "VolunteerMatch.org connects you with local opportunities matched to your skills and schedule — even 2 hours/month creates belonging.", icon: "🤲" },
        { title: "Know Your Neighbors", detail: "Introduce yourself to 3 neighbors this month. Research shows knowing neighbors reduces anxiety and increases actual physical safety.", icon: "🏘️" },
        { title: "Nextdoor App", detail: "Join your local Nextdoor neighborhood — stay informed about safety, share resources, and find local support during emergencies.", icon: "📱" },
      ],
      resource: "https://www.volunteermatch.org/",
      resourceLabel: "Find Volunteer Opportunities →",
    },
    moderate: {
      urgency: "low",
      headline: "Strengthening Community Impact",
      intro: "You're connected — now deepen your civic engagement for mutual benefit.",
      actions: [
        { title: "Join a Local Committee", detail: "School boards, parks committees, and city advisory groups give you direct input on your environment and build high-quality social connections.", icon: "🏛️" },
        { title: "Start Something", detail: "A running club, study group, or neighborhood project fills a gap and positions you as a connector. Even small communities have outsized impact.", icon: "🚀" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },

  lifestyle: {
    critical: {
      urgency: "high",
      headline: "Rebuilding Basic Self-Care",
      intro: "Poor lifestyle habits have a direct neurological effect on mood. Small changes have immediate impact.",
      actions: [
        { title: "Sleep is Medication — Fix It First", detail: "Set one consistent wake time (not bedtime) and maintain it 7 days/week — including weekends. This single change regulates your circadian rhythm within 2 weeks.", icon: "😴" },
        { title: "10-Minute Daily Walk", detail: "A 10-minute outdoor walk reduces cortisol by 16% and increases serotonin. Do it at the same time daily to build the habit.", icon: "🚶" },
        { title: "Box Breathing for Acute Stress", detail: "4 counts in → 4 hold → 4 out → 4 hold. Repeat 4 times. This activates the parasympathetic nervous system and reduces panic within 90 seconds.", icon: "🫁" },
        { title: "One Whole-Food Swap", detail: "Replace one ultra-processed food with a whole food this week. Don't overhaul — just one swap, repeated consistently, creates lasting change.", icon: "🥗" },
      ],
      resource: "https://www.sleepfoundation.org/sleep-hygiene",
      resourceLabel: "Sleep Hygiene Guide →",
    },
    low: {
      urgency: "medium",
      headline: "Building Sustainable Healthy Habits",
      intro: "Your lifestyle is inconsistent. Stack habits together and use environment design to make them automatic.",
      actions: [
        { title: "Habit Stacking", detail: "Attach new habits to existing ones. 'After I pour my morning coffee, I will do 5 minutes of stretching.' This removes the decision-making barrier.", icon: "🔗" },
        { title: "30-Minute Exercise 3×/Week", detail: "This specific dose is clinically proven to equal antidepressant effectiveness for mild depression. Walking, swimming, cycling, dancing — all count.", icon: "🏃" },
        { title: "Mindfulness App (10 min/day)", detail: "Headspace and Insight Timer (free) offer evidence-based mindfulness. 8 weeks of 10 min/day creates measurable brain structure changes (Harvard, 2011).", icon: "🧘" },
        { title: "Meal Prep Sundays", detail: "Prepare 3 healthy base meals on Sunday. Reduces daily decision fatigue and prevents the 'too tired to cook, ordering fast food' pattern.", icon: "🍱" },
      ],
      resource: "https://www.insighttimer.com/",
      resourceLabel: "Free Meditation App →",
    },
    moderate: {
      urgency: "low",
      headline: "Elevating Your Wellbeing Practices",
      intro: "Good foundation — now optimize for peak performance and stress resilience.",
      actions: [
        { title: "Track HRV (Heart Rate Variability)", detail: "HRV is the most accurate objective measure of stress resilience. Track it with a free Garmin or Polar app to optimize recovery and training.", icon: "📊" },
        { title: "Cold Exposure Protocol", detail: "2 minutes of cold shower daily increases norepinephrine by 300%, improving mood and alertness (Huberman Lab protocol).", icon: "🥶" },
        { title: "Time-Restricted Eating", detail: "Eating within a 8–10 hour window (e.g., 10am–6pm) improves sleep, metabolic health, and mental clarity — without calorie restriction.", icon: "⏰" },
      ],
      resource: null,
      resourceLabel: null,
    },
  },
};

/**
 * Returns tier key based on score value
 * @param {number} score - 0 to 100
 * @returns {'critical'|'low'|'moderate'|'good'}
 */
export function getRecommendationTier(score) {
  if (score <= 30) return "critical";
  if (score <= 55) return "low";
  if (score <= 74) return "moderate";
  return "good"; // ≥75: no urgent recommendations
}
