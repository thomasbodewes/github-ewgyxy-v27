export const consentFormContent = {
  en: {
    title: "Treatment Consent Form",
    description: "Botox is a type A botulinum toxin preparation that, through injection, can temporarily reduce muscle activity by blocking nerve signals to the muscles. This causes a temporary relaxation of the muscles, softening expression lines such as frown lines, crow's feet, and forehead wrinkles, resulting in a softer and more relaxed appearance. In addition to cosmetic applications, botox is also used for medical purposes, such as treating excessive sweating, headaches, and teeth grinding.",
    treatment: {
      title: "Treatment and expected results",
      text: "The treatment consists of one or two sessions. Results are usually noticeable within a few days and generally last 3 to 4 months, depending on factors such as age, skin type, and muscle activity. After this period, the botox is fully broken down by the body, and the muscle recovers from the temporary relaxation."
    },
    risks: {
      title: "Risks and side effects",
      text: "I have been informed by the physician about possible alternative treatments. I understand that every medical treatment involves certain risks, and the final result may not fully meet my expectations. The following reactions may occur around the injection site:",
      effects: [
        "Minimal bleeding at the injection site",
        "Localized redness of the skin",
        "Localized swelling of the skin",
        "Bruising at the injection site"
      ],
      additionalInfo: "These symptoms usually disappear within a few days (bruising may last longer). Other common side effects may include temporary headaches or flu-like symptoms. In rare cases, a nearby muscle may be unintentionally weakened, which could lead to a drooping eyebrow, asymmetry, or a drooping eyelid. This side effect is temporary. A (localized) allergic reaction or infection may also occur. Not every possible risk is discussed, but I understand that these risks exist."
    },
    declaration: {
      title: "Declaration and consent",
      text: "The treating physician has explained the procedure to me, including its effects, possible side effects, choice of procedure, and the pros and cons compared to other methods. All my questions have been answered to my satisfaction. I have carefully considered my decision and do not need additional time to reflect. I hereby give consent for the botox treatment (botulinum toxin type A) through injection.\n\nI understand that the desired result cannot be guaranteed by the physician's medical efforts. I am aware that I may withdraw this consent prior to the treatment without giving any reason and confirm that I am 18 years of age or older."
    },
    privacy: {
      title: "Privacy and record-keeping",
      text: "I am aware that my medical information is retained to ensure proper (medical) record-keeping. Your data is securely stored and intended solely for internal use. The legal retention period for these data is 20 years (in accordance the Medical Treatment Contracts Act - WGBO, Article 7:454, paragraph 1 of the Dutch Civil Code), after which your data will be destroyed."
    },
    agreementText: "I give permission for the treatment with botox (botulinum toxin) by the treating physician - T.C.F. Bodewes.",
    dataProcessingText: "By entering into this treatment agreement, I give consent to process my data."
  },
  nl: {
    title: "Behandelovereenkomst",
    description: "Botox is een preparaat van botuline toxine type A dat, door middel van injectie, de spieractiviteit tijdelijk kan verminderen door de zenuwsignalen naar de spieren te blokkeren. Dit zorgt voor een tijdelijke ontspanning van de spieren en verzacht expressierimpels zoals fronsrimpels, kraaienpootjes en voorhoofdrimpels. Dit resulteert in een zachtere en meer ontspannen uitstraling. Naast cosmetische toepassingen wordt botox ook gebruikt voor medische doeleinden, zoals de behandeling van overmatig transpireren, hoofdpijn en tandenknarsen.",
    treatment: {
      title: "Behandeling en verwachte resultaten",
      text: "De behandeling bestaat uit één of twee sessies. De resultaten worden meestal zichtbaar binnen enkele dagen en houden gemiddeld 3 tot 4 maanden aan, afhankelijk van factoren zoals leeftijd, huidtype en spieractiviteit. Na deze periode is de botox volledig afgebroken door het lichaam en herstelt de spier zich van de tijdelijke ontspanning."
    },
    risks: {
      title: "Risico's en bijwerkingen",
      text: "Ik ben door de arts geïnformeerd over mogelijke alternatieve behandelmethoden. Ik begrijp dat elke medische behandeling risico's met zich meebrengt en dat het uiteindelijke resultaat mogelijk niet volledig aan mijn verwachtingen kan voldoen. De volgende reacties kunnen optreden rond de injectieplaats:",
      effects: [
        "Minimale bloeding op de injectieplaats",
        "Lokale roodheid van de huid",
        "Lokale zwelling van de huid",
        "Blauwe plekken op de injectieplaats"
      ],
      additionalInfo: "Deze symptomen verdwijnen meestal binnen enkele dagen (blauwe plekken kunnen iets langer aanhouden). Andere mogelijke bijwerkingen zijn een tijdelijke hoofdpijn of griepachtige symptomen. In zeldzame gevallen kan een nabijgelegen spier onbedoeld verzwakken, wat kan leiden tot bijvoorbeeld een afhangende wenkbrauw, asymmetrie of een hangend ooglid. Deze bijwerking is tijdelijk van aard. Een (lokale) allergische reactie of infectie kan ook optreden. Niet elk algemeen risico is besproken, maar ik begrijp dat deze risico's bestaan."
    },
    declaration: {
      title: "Verklaring en toestemming",
      text: "De behandelend arts heeft mij de procedure uitgelegd, inclusief het effect, mogelijke bijwerkingen, keuze van de procedure, en de voordelen en nadelen in vergelijking met andere methoden. Al mijn vragen zijn naar tevredenheid beantwoord. Ik heb mijn beslissing zorgvuldig overwogen en heb geen extra bedenktijd nodig. Ik geef hierbij toestemming voor de botox behandeling (botuline toxine type A) via injectie.\n\nIk ben mij ervan bewust dat het bereiken van het gewenste resultaat door de inspanningen van de behandelend arts niet kan worden gegarandeerd. Ik begrijp dat ik deze toestemming kan intrekken voor de behandeling zonder opgave van reden en bevestig dat ik 18 jaar of ouder ben."
    },
    privacy: {
      title: "Privacy en dossierbeheer",
      text: "Ik ben op de hoogte dat mijn medische gegevens, ter goede (medische) dossiervoering, worden bewaard. Uw gegevens zijn beveiligd opgeslagen en uitsluitend bestemd voor intern gebruik. De wettelijke bewaartermijn van deze gegevens is 20 jaar (volgens de Wet op de Geneeskundige Behandelingsovereenkomst - WGBO artikel 7:454 lid 1 BW), waarna uw gegevens worden vernietigd."
    },
    agreementText: "Ik geef toestemming voor de behandeling met botox (botuline toxine) door de behandelend arts - T.C.F. Bodewes.",
    dataProcessingText: "Door het afsluiten van deze behandelingsovereenkomst geef ik toestemming om mijn gegevens te verwerken."
  }
} as const

export type ConsentFormLanguage = keyof typeof consentFormContent