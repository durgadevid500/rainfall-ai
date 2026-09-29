import React, { useEffect, useMemo, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import i18n from "./i18n";
import { loadAllDistricts } from "vardhan-maps/data";
import { IndiaMap } from "vardhan-maps/react";
import "leaflet/dist/leaflet.css";
import "./styles.css";

/* =========================================================
   SYNTHETIC DISTRICT DATA
========================================================= */

const districts = [
  {
    name: "Chennai",
    state: "Tamil Nadu",
    rainfall: 82,
    corrected: 91,
    risk: 78,
    regime: "Coastal",
  },
  {
    name: "Cuddalore",
    state: "Tamil Nadu",
    rainfall: 126,
    corrected: 142,
    risk: 91,
    regime: "Active Monsoon",
  },
  {
    name: "Coimbatore",
    state: "Tamil Nadu",
    rainfall: 34,
    corrected: 39,
    risk: 28,
    regime: "Orographic",
  },
  {
    name: "Madurai",
    state: "Tamil Nadu",
    rainfall: 18,
    corrected: 21,
    risk: 15,
    regime: "Break Monsoon",
  },
  {
    name: "Kochi",
    state: "Kerala",
    rainfall: 142,
    corrected: 158,
    risk: 94,
    regime: "Active Monsoon",
  },
  {
    name: "Wayanad",
    state: "Kerala",
    rainfall: 168,
    corrected: 181,
    risk: 97,
    regime: "Orographic",
  },
  {
    name: "Mumbai Suburban",
    state: "Maharashtra",
    rainfall: 118,
    corrected: 132,
    risk: 89,
    regime: "Coastal",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    rainfall: 42,
    corrected: 47,
    risk: 35,
    regime: "Break Monsoon",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    rainfall: 96,
    corrected: 108,
    risk: 82,
    regime: "Active Monsoon",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getDistrict(name) {
  return districts.find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  );
}

function deterministicRainfall(name) {
  const district = getDistrict(name);

  if (district) {
    return district.rainfall;
  }

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return 15 + Math.abs(hash % 150);
}

function getRainfallColor(rainfall) {
  if (rainfall >= 115.6) return "#ef4444";
  if (rainfall >= 64.5) return "#f97316";
  if (rainfall >= 15.6) return "#facc15";
  return "#22c55e";
}

function getFallbackDistrict(name) {
  const rainfall = deterministicRainfall(name);

  const risk = Math.min(
    98,
    Math.round(rainfall * 0.72)
  );

  let regime = "Break Monsoon";

  if (rainfall >= 115) {
    regime = "Active Monsoon";
  } else if (rainfall >= 65) {
    regime = "Coastal";
  } else if (rainfall >= 35) {
    regime = "Orographic";
  }

  return {
    name,
    rainfall,
    corrected: Math.round(rainfall * 1.12),
    risk,
    regime,
  };
}

/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {
  en: {
    language: "Language",
    location: "LOCATION",
    date: "DATE",
    forecast: "FORECAST",
    dataSource: "DATA SOURCE",
    offlineReady: "Offline Ready",
    india: "India",
    dateValue: "28 Sep 2026",
    hours: "Hours",
    syntheticNwp: "Synthetic NWP",
    brand: "AI RAINFALL POST-PROCESSING SYSTEM",
    subtitle:
      "NWP-Based District-Level Rainfall Forecast Improvement",
    developmentMode: "DEVELOPMENT MODE",
    nwpInput: "NWP INPUT",
    regime: "REGIME",
    aiCorrection: "AI CORRECTION",
    heavyRain: "HEAVY RAIN",
    district: "DISTRICT",
    verify: "VERIFY",
    alert: "ALERT",
    weatherRegime: "WEATHER REGIME",
    rawNwp: "RAW NWP",
    aiCorrected: "AI CORRECTED",
    heavyRainProbability: "HEAVY RAIN PROBABILITY",
    indiaDistrictRainfall: "India District Rainfall",
    districtForecastMap:
      "District-level AI corrected rainfall forecast",
    low: "Low",
    moderate: "Moderate",
    heavy: "Heavy",
    veryHeavy: "Very Heavy",
    districtForecast: "District Forecast",
    aiPostProcessed: "AI post-processed prediction",
    selectedDistrict: "SELECTED DISTRICT",
    rainfallForecast: "RAINFALL FORECAST",
    heavyRainRisk: "Heavy Rain Risk",
    normalConditions: "NORMAL RAINFALL CONDITIONS",
    activeAlerts: "ACTIVE ALERTS",

alertVeryHeavy: "Very Heavy",

alertHeavy: "Heavy",

alertModerate: "Moderate",

alertNormal: "Normal",
    heavyRainfallAlert: "HEAVY RAINFALL ALERT",
    rawVsCorrected: "Raw NWP vs AI Corrected",
    postProcessingImpact: "Rainfall post-processing impact",
    weatherRegimeClassification:
      "Weather Regime Classification",
    detectedRainfallRegime: "Detected rainfall regime",
    detectedRegime: "DETECTED REGIME",
    regimeCorrectionActivated:
      "Regime-specific correction model activated",
    explainableAI: "Explainable AI — SHAP Analysis",
    shapDescription:
      "Key meteorological factors influencing the corrected rainfall forecast",
    precipitableWater: "Precipitable Water",
    humidity: "Humidity",
    windConvergence: "Wind Convergence",
    temperature: "Temperature",
    forecastVerification: "Forecast Verification",
    modelPerformance: "Model performance indicators",
    developmentWarning:
      "DEVELOPMENT MODE — Verification values are demonstration values and must be replaced with real evaluation results.",
    emergencyAlert: "Emergency Alert System",
    edgeAlert:
      "Edge-ready alert generation using ONNX inference.",
    highRainfallRisk: "HIGH RAINFALL RISK",
    monitoring: "MONITORING",
    voiceAssistant: "Voice Assistant",
    askAbout:
      "Ask about rainfall, regime or alerts.",
    askWeather: "🎙️ Ask Weather Assistant",
    rainfall: "Rainfall",
    millimeters: "millimeters",
    probability: "Heavy rainfall probability",
    percent: "percent",
    weatherRegimeVoice: "Weather regime",
    activeMonsoon: "Active Monsoon",
    breakMonsoon: "Break Monsoon",
    coastal: "Coastal",
    orographic: "Orographic",
  },

  ta: {
    language: "மொழி",
    location: "இடம்",
    date: "தேதி",
    forecast: "முன்னறிவிப்பு",
    dataSource: "தரவு மூலம்",
    offlineReady: "ஆஃப்லைன் தயார்",
    india: "இந்தியா",
    dateValue: "28 செப் 2026",
    hours: "மணிநேரம்",
    syntheticNwp: "செயற்கை NWP",
    brand: "AI மழைப்பொழிவு முன்னறிவிப்பு மேம்பாட்டு அமைப்பு",
    subtitle:
      "NWP அடிப்படையிலான மாவட்ட அளவிலான மழைப்பொழிவு முன்னறிவிப்பு மேம்பாடு",
    developmentMode: "மேம்பாட்டு நிலை",
    nwpInput: "NWP உள்ளீடு",
    regime: "வானிலை நிலை",
    aiCorrection: "AI திருத்தம்",
    heavyRain: "கனமழை",
    district: "மாவட்டம்",
    verify: "சரிபார்ப்பு",
    alert: "எச்சரிக்கை",
    weatherRegime: "வானிலை நிலை",
    rawNwp: "மூல NWP",
    aiCorrected: "AI திருத்திய கணிப்பு",
    heavyRainProbability: "கனமழை நிகழ்தகவு",
    indiaDistrictRainfall: "இந்திய மாவட்ட மழைப்பொழிவு",
    districtForecastMap:
      "மாவட்ட அளவிலான AI திருத்திய மழைப்பொழிவு முன்னறிவிப்பு",
    low: "குறைவு",
    moderate: "மிதமான",
    heavy: "கனமழை",
    veryHeavy: "மிக கனமழை",
    districtForecast: "மாவட்ட முன்னறிவிப்பு",
    aiPostProcessed: "AI மூலம் திருத்தப்பட்ட கணிப்பு",
    selectedDistrict: "தேர்ந்தெடுக்கப்பட்ட மாவட்டம்",
    rainfallForecast: "மழைப்பொழிவு முன்னறிவிப்பு",
    heavyRainRisk: "கனமழை அபாயம்",
    normalConditions: "சாதாரண மழைப்பொழிவு நிலை",
    heavyRainfallAlert: "கனமழை எச்சரிக்கை",
    rawVsCorrected: "மூல NWP மற்றும் AI திருத்தம்",
    postProcessingImpact:
      "மழைப்பொழிவு திருத்தத்தின் தாக்கம்",
    weatherRegimeClassification:
      "வானிலை நிலை வகைப்பாடு",
    detectedRainfallRegime:
      "கண்டறியப்பட்ட மழைப்பொழிவு நிலை",
    detectedRegime: "கண்டறியப்பட்ட நிலை",
    regimeCorrectionActivated:
      "வானிலை நிலைக்கேற்ற திருத்த மாதிரி செயல்படுத்தப்பட்டது",
    explainableAI: "விளக்கக்கூடிய AI — SHAP பகுப்பாய்வு",
    shapDescription:
      "திருத்திய மழைப்பொழிவு முன்னறிவிப்பை பாதிக்கும் முக்கிய வானிலை காரணிகள்",
    precipitableWater: "வளிமண்டல நீராவி அளவு",
    humidity: "ஈரப்பதம்",
    windConvergence: "காற்று சங்கமம்",
    temperature: "வெப்பநிலை",
    forecastVerification: "முன்னறிவிப்பு சரிபார்ப்பு",
    modelPerformance: "மாதிரி செயல்திறன் குறியீடுகள்",
    developmentWarning:
      "மேம்பாட்டு நிலை — சரிபார்ப்பு மதிப்புகள் விளக்கத்திற்கானவை. உண்மையான மதிப்பீட்டு முடிவுகளால் மாற்றப்பட வேண்டும்.",
    emergencyAlert: "அவசர எச்சரிக்கை அமைப்பு",
    edgeAlert:
      "ONNX inference மூலம் Edge-ready எச்சரிக்கை உருவாக்கம்.",
    highRainfallRisk: "அதிக மழைப்பொழிவு அபாயம்",
    monitoring: "கண்காணிப்பு",
    voiceAssistant: "குரல் உதவியாளர்",
    askAbout:
      "மழைப்பொழிவு, வானிலை நிலை அல்லது எச்சரிக்கைகள் பற்றி கேட்கவும்.",
    askWeather: "🎙️ வானிலை தகவலைக் கேட்கவும்",
    rainfall: "மழைப்பொழிவு",
    millimeters: "மில்லிமீட்டர்",
    probability: "கனமழை நிகழ்தகவு",
    percent: "சதவீதம்",
    weatherRegimeVoice: "வானிலை நிலை",
    activeMonsoon: "செயலில் உள்ள பருவமழை",
    breakMonsoon: "இடைநிறுத்த பருவமழை",
    coastal: "கடலோர நிலை",
    orographic: "மலை சார்ந்த நிலை",
  },

  hi: {
    language: "भाषा",
    location: "स्थान",
    date: "तारीख",
    forecast: "पूर्वानुमान",
    dataSource: "डेटा स्रोत",
    offlineReady: "ऑफ़लाइन तैयार",
    india: "भारत",
    dateValue: "28 सितम्बर 2026",
    hours: "घंटे",
    syntheticNwp: "सिंथेटिक NWP",
    brand: "AI वर्षा पूर्वानुमान सुधार प्रणाली",
    subtitle:
      "NWP आधारित जिला-स्तरीय वर्षा पूर्वानुमान सुधार",
    developmentMode: "विकास मोड",
    nwpInput: "NWP इनपुट",
    regime: "मौसम स्थिति",
    aiCorrection: "AI सुधार",
    heavyRain: "भारी वर्षा",
    district: "जिला",
    verify: "सत्यापन",
    alert: "चेतावनी",
    weatherRegime: "मौसम स्थिति",
    rawNwp: "मूल NWP",
    aiCorrected: "AI संशोधित",
    heavyRainProbability: "भारी वर्षा की संभावना",
    indiaDistrictRainfall: "भारत जिला वर्षा",
    districtForecastMap:
      "जिला-स्तरीय AI संशोधित वर्षा पूर्वानुमान",
    low: "कम",
    moderate: "मध्यम",
    heavy: "भारी",
    veryHeavy: "बहुत भारी",
    districtForecast: "जिला पूर्वानुमान",
    aiPostProcessed: "AI द्वारा संशोधित पूर्वानुमान",
    selectedDistrict: "चयनित जिला",
    rainfallForecast: "वर्षा पूर्वानुमान",
    heavyRainRisk: "भारी वर्षा जोखिम",
    normalConditions: "सामान्य वर्षा स्थिति",
    heavyRainfallAlert: "भारी वर्षा चेतावनी",
    rawVsCorrected: "मूल NWP बनाम AI संशोधित",
    postProcessingImpact:
      "वर्षा पोस्ट-प्रोसेसिंग प्रभाव",
    weatherRegimeClassification: "मौसम स्थिति वर्गीकरण",
    detectedRainfallRegime: "पता चली वर्षा स्थिति",
    detectedRegime: "पता चली स्थिति",
    regimeCorrectionActivated:
      "स्थिति-आधारित सुधार मॉडल सक्रिय किया गया",
    explainableAI: "व्याख्येय AI — SHAP विश्लेषण",
    shapDescription:
      "संशोधित वर्षा पूर्वानुमान को प्रभावित करने वाले प्रमुख मौसम संबंधी कारक",
    precipitableWater: "वायुमंडलीय जल",
    humidity: "आर्द्रता",
    windConvergence: "पवन अभिसरण",
    temperature: "तापमान",
    forecastVerification: "पूर्वानुमान सत्यापन",
    modelPerformance: "मॉडल प्रदर्शन संकेतक",
    developmentWarning:
      "विकास मोड — सत्यापन मान प्रदर्शन के लिए हैं और वास्तविक मूल्यांकन परिणामों से बदले जाने चाहिए।",
    emergencyAlert: "आपातकालीन चेतावनी प्रणाली",
    edgeAlert:
      "ONNX inference का उपयोग करके Edge-ready चेतावनी निर्माण।",
    highRainfallRisk: "उच्च वर्षा जोखिम",
    monitoring: "निगरानी",
    voiceAssistant: "वॉइस असिस्टेंट",
    askAbout:
      "वर्षा, मौसम स्थिति या चेतावनी के बारे में पूछें।",
    askWeather: "🎙️ मौसम जानकारी पूछें",
    rainfall: "वर्षा",
    millimeters: "मिलीमीटर",
    probability: "भारी वर्षा की संभावना",
    percent: "प्रतिशत",
    weatherRegimeVoice: "मौसम स्थिति",
    activeMonsoon: "सक्रिय मानसून",
    breakMonsoon: "ब्रेक मानसून",
    coastal: "तटीय स्थिति",
    orographic: "पर्वतीय स्थिति",
  },

  te: {
    language: "భాష",
    location: "స్థానం",
    date: "తేదీ",
    forecast: "అంచనా",
    dataSource: "డేటా మూలం",
    offlineReady: "ఆఫ్‌లైన్ సిద్ధంగా ఉంది",
    india: "భారతదేశం",
    dateValue: "28 సెప్టెంబర్ 2026",
    hours: "గంటలు",
    syntheticNwp: "సింథటిక్ NWP",
    brand: "AI వర్షపాతం అంచనా మెరుగుదల వ్యవస్థ",
    subtitle:
      "NWP ఆధారిత జిల్లా స్థాయి వర్షపాతం అంచనా మెరుగుదల",
    developmentMode: "అభివృద్ధి మోడ్",
    nwpInput: "NWP ఇన్‌పుట్",
    regime: "వాతావరణ పరిస్థితి",
    aiCorrection: "AI సవరణ",
    heavyRain: "భారీ వర్షం",
    district: "జిల్లా",
    verify: "ధృవీకరణ",
    alert: "హెచ్చరిక",
    weatherRegime: "వాతావరణ పరిస్థితి",
    rawNwp: "మూల NWP",
    aiCorrected: "AI సరిచేసిన అంచనా",
    heavyRainProbability: "భారీ వర్షం సంభావ్యత",
    indiaDistrictRainfall: "భారత జిల్లా వర్షపాతం",
    districtForecastMap:
      "జిల్లా స్థాయి AI సరిచేసిన వర్షపాతం అంచనా",
    low: "తక్కువ",
    moderate: "మధ్యస్థ",
    heavy: "భారీ",
    veryHeavy: "అతి భారీ",
    districtForecast: "జిల్లా అంచనా",
    aiPostProcessed: "AI ద్వారా సరిచేసిన అంచనా",
    selectedDistrict: "ఎంచుకున్న జిల్లా",
    rainfallForecast: "వర్షపాతం అంచనా",
    heavyRainRisk: "భారీ వర్షం ప్రమాదం",
    normalConditions: "సాధారణ వర్షపాతం పరిస్థితులు",
    heavyRainfallAlert: "భారీ వర్షపాతం హెచ్చరిక",
    rawVsCorrected: "మూల NWP vs AI సరిచేసిన అంచనా",
    postProcessingImpact:
      "వర్షపాతం పోస్ట్-ప్రాసెసింగ్ ప్రభావం",
    weatherRegimeClassification:
      "వాతావరణ పరిస్థితి వర్గీకరణ",
    detectedRainfallRegime:
      "గుర్తించిన వర్షపాతం పరిస్థితి",
    detectedRegime: "గుర్తించిన పరిస్థితి",
    regimeCorrectionActivated:
      "పరిస్థితి ఆధారిత సవరణ మోడల్ సక్రియం చేయబడింది",
    explainableAI: "వివరణాత్మక AI — SHAP విశ్లేషణ",
    shapDescription:
      "సరిచేసిన వర్షపాతం అంచనాను ప్రభావితం చేసే ముఖ్య వాతావరణ కారకాలు",
    precipitableWater: "వాతావరణ నీటి ఆవిరి",
    humidity: "తేమ",
    windConvergence: "గాలి సంగమం",
    temperature: "ఉష్ణోగ్రత",
    forecastVerification: "అంచనా ధృవీకరణ",
    modelPerformance: "మోడల్ పనితీరు సూచికలు",
    developmentWarning:
      "అభివృద్ధి మోడ్ — ధృవీకరణ విలువలు ప్రదర్శన కోసం మాత్రమే. నిజమైన మూల్యాంకన ఫలితాలతో మార్చాలి.",
    emergencyAlert: "అత్యవసర హెచ్చరిక వ్యవస్థ",
    edgeAlert:
      "ONNX inference ఉపయోగించి Edge-ready హెచ్చరిక తయారీ.",
    highRainfallRisk: "అధిక వర్షపాతం ప్రమాదం",
    monitoring: "పర్యవేక్షణ",
    voiceAssistant: "వాయిస్ అసిస్టెంట్",
    askAbout:
      "వర్షపాతం, వాతావరణ పరిస్థితి లేదా హెచ్చరికల గురించి అడగండి.",
    askWeather: "🎙️ వాతావరణ సమాచారం అడగండి",
    rainfall: "వర్షపాతం",
    millimeters: "మిల్లీమీటర్లు",
    probability: "భారీ వర్షం సంభావ్యత",
    percent: "శాతం",
    weatherRegimeVoice: "వాతావరణ పరిస్థితి",
    activeMonsoon: "చురుకైన రుతుపవనాలు",
    breakMonsoon: "విరామ రుతుపవనాలు",
    coastal: "తీర ప్రాంత పరిస్థితి",
    orographic: "పర్వత ప్రాంత పరిస్థితి",
  },

  kn: {
    language: "ಭಾಷೆ",
    location: "ಸ್ಥಳ",
    date: "ದಿನಾಂಕ",
    forecast: "ಮುನ್ಸೂಚನೆ",
    dataSource: "ಡೇಟಾ ಮೂಲ",
    offlineReady: "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ",
    india: "ಭಾರತ",
    dateValue: "28 ಸೆಪ್ಟೆಂಬರ್ 2026",
    hours: "ಗಂಟೆಗಳು",
    syntheticNwp: "ಸಿಂಥೆಟಿಕ್ NWP",
    brand: "AI ಮಳೆ ಮುನ್ಸೂಚನೆ ಸುಧಾರಣಾ ವ್ಯವಸ್ಥೆ",
    subtitle:
      "NWP ಆಧಾರಿತ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಮಳೆ ಮುನ್ಸೂಚನೆ ಸುಧಾರಣೆ",
    developmentMode: "ಅಭಿವೃದ್ಧಿ ಮೋಡ್",
    nwpInput: "NWP ಇನ್‌ಪುಟ್",
    regime: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    aiCorrection: "AI ತಿದ್ದುಪಡಿ",
    heavyRain: "ಭಾರಿ ಮಳೆ",
    district: "ಜಿಲ್ಲೆ",
    verify: "ಪರಿಶೀಲನೆ",
    alert: "ಎಚ್ಚರಿಕೆ",
    weatherRegime: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    rawNwp: "ಮೂಲ NWP",
    aiCorrected: "AI ತಿದ್ದುಪಡಿ",
    heavyRainProbability: "ಭಾರಿ ಮಳೆಯ ಸಾಧ್ಯತೆ",
    indiaDistrictRainfall: "ಭಾರತ ಜಿಲ್ಲಾ ಮಳೆ",
    districtForecastMap:
      "ಜಿಲ್ಲಾ ಮಟ್ಟದ AI ತಿದ್ದುಪಡಿ ಮಳೆ ಮುನ್ಸೂಚನೆ",
    low: "ಕಡಿಮೆ",
    moderate: "ಮಧ್ಯಮ",
    heavy: "ಭಾರಿ",
    veryHeavy: "ಅತಿ ಭಾರಿ",
    districtForecast: "ಜಿಲ್ಲಾ ಮುನ್ಸೂಚನೆ",
    aiPostProcessed: "AI ಮೂಲಕ ತಿದ್ದುಪಡಿ ಮಾಡಿದ ಮುನ್ಸೂಚನೆ",
    selectedDistrict: "ಆಯ್ಕೆ ಮಾಡಿದ ಜಿಲ್ಲೆ",
    rainfallForecast: "ಮಳೆ ಮುನ್ಸೂಚನೆ",
    heavyRainRisk: "ಭಾರಿ ಮಳೆ ಅಪಾಯ",
    normalConditions: "ಸಾಮಾನ್ಯ ಮಳೆ ಪರಿಸ್ಥಿತಿಗಳು",
    heavyRainfallAlert: "ಭಾರಿ ಮಳೆ ಎಚ್ಚರಿಕೆ",
    rawVsCorrected: "ಮೂಲ NWP ವಿರುದ್ಧ AI ತಿದ್ದುಪಡಿ",
    postProcessingImpact:
      "ಮಳೆ ಪೋಸ್ಟ್-ಪ್ರೊಸೆಸಿಂಗ್ ಪರಿಣಾಮ",
    weatherRegimeClassification:
      "ಹವಾಮಾನ ಸ್ಥಿತಿ ವರ್ಗೀಕರಣ",
    detectedRainfallRegime: "ಪತ್ತೆಯಾದ ಮಳೆ ಸ್ಥಿತಿ",
    detectedRegime: "ಪತ್ತೆಯಾದ ಸ್ಥಿತಿ",
    regimeCorrectionActivated:
      "ಸ್ಥಿತಿ ಆಧಾರಿತ ತಿದ್ದುಪಡಿ ಮಾದರಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ",
    explainableAI: "ವಿವರಣಾತ್ಮಕ AI — SHAP ವಿಶ್ಲೇಷಣೆ",
    shapDescription:
      "ತಿದ್ದುಪಡಿ ಮಾಡಿದ ಮಳೆ ಮುನ್ಸೂಚನೆಯನ್ನು ಪ್ರಭಾವಿಸುವ ಪ್ರಮುಖ ಹವಾಮಾನ ಅಂಶಗಳು",
    precipitableWater: "ವಾತಾವರಣದ ನೀರಿನ ಆವಿ",
    humidity: "ಆರ್ದ್ರತೆ",
    windConvergence: "ಗಾಳಿ ಸಂಗಮ",
    temperature: "ತಾಪಮಾನ",
    forecastVerification: "ಮುನ್ಸೂಚನೆ ಪರಿಶೀಲನೆ",
    modelPerformance: "ಮಾದರಿ ಕಾರ್ಯಕ್ಷಮತೆ ಸೂಚಕಗಳು",
    developmentWarning:
      "ಅಭಿವೃದ್ಧಿ ಮೋಡ್ — ಪರಿಶೀಲನಾ ಮೌಲ್ಯಗಳು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ನೈಜ ಮೌಲ್ಯಮಾಪನ ಫಲಿತಾಂಶಗಳಿಂದ ಬದಲಾಯಿಸಬೇಕು.",
    emergencyAlert: "ತುರ್ತು ಎಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ",
    edgeAlert:
      "ONNX inference ಬಳಸಿ Edge-ready ಎಚ್ಚರಿಕೆ ಸೃಷ್ಟಿ.",
    highRainfallRisk: "ಹೆಚ್ಚಿನ ಮಳೆ ಅಪಾಯ",
    monitoring: "ಮೇಲ್ವಿಚಾರಣೆ",
    voiceAssistant: "ಧ್ವನಿ ಸಹಾಯಕ",
    askAbout:
      "ಮಳೆ, ಹವಾಮಾನ ಸ್ಥಿತಿ ಅಥವಾ ಎಚ್ಚರಿಕೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
    askWeather: "🎙️ ಹವಾಮಾನ ಮಾಹಿತಿ ಕೇಳಿ",
    rainfall: "ಮಳೆ",
    millimeters: "ಮಿಲಿಮೀಟರ್",
    probability: "ಭಾರಿ ಮಳೆಯ ಸಾಧ್ಯತೆ",
    percent: "ಶೇಕಡಾ",
    weatherRegimeVoice: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    activeMonsoon: "ಸಕ್ರಿಯ ಮುಂಗಾರು",
    breakMonsoon: "ವಿರಾಮ ಮುಂಗಾರು",
    coastal: "ಕರಾವಳಿ ಸ್ಥಿತಿ",
    orographic: "ಪರ್ವತ ಪ್ರದೇಶದ ಸ್ಥಿತಿ",
  },

  ml: {
    language: "ഭാഷ",
    location: "സ്ഥലം",
    date: "തീയതി",
    forecast: "പ്രവചനം",
    dataSource: "ഡാറ്റ ഉറവിടം",
    offlineReady: "ഓഫ്‌ലൈൻ തയ്യാറാണ്",
    india: "ഇന്ത്യ",
    dateValue: "28 സെപ്റ്റംബർ 2026",
    hours: "മണിക്കൂർ",
    syntheticNwp: "സിന്തറ്റിക് NWP",
    brand: "AI മഴ പ്രവചന മെച്ചപ്പെടുത്തൽ സംവിധാനം",
    subtitle:
      "NWP അടിസ്ഥാനമാക്കിയുള്ള ജില്ലാ തല മഴ പ്രവചന മെച്ചപ്പെടുത്തൽ",
    developmentMode: "വികസന മോഡ്",
    nwpInput: "NWP ഇൻപുട്ട്",
    regime: "കാലാവസ്ഥാ സ്ഥിതി",
    aiCorrection: "AI തിരുത്തൽ",
    heavyRain: "കനത്ത മഴ",
    district: "ജില്ല",
    verify: "പരിശോധന",
    alert: "മുന്നറിയിപ്പ്",
    weatherRegime: "കാലാവസ്ഥാ സ്ഥിതി",
    rawNwp: "മൂല NWP",
    aiCorrected: "AI തിരുത്തിയ പ്രവചനം",
    heavyRainProbability: "കനത്ത മഴയ്ക്കുള്ള സാധ്യത",
    indiaDistrictRainfall: "ഇന്ത്യ ജില്ലാ മഴ",
    districtForecastMap:
      "ജില്ലാ തലത്തിലുള്ള AI തിരുത്തിയ മഴ പ്രവചനം",
    low: "കുറവ്",
    moderate: "മിതമായ",
    heavy: "കനത്ത",
    veryHeavy: "വളരെ കനത്ത",
    districtForecast: "ജില്ലാ പ്രവചനം",
    aiPostProcessed: "AI ഉപയോഗിച്ച് തിരുത്തിയ പ്രവചനം",
    selectedDistrict: "തിരഞ്ഞെടുത്ത ജില്ല",
    rainfallForecast: "മഴ പ്രവചനം",
    heavyRainRisk: "കനത്ത മഴ അപകടസാധ്യത",
    normalConditions: "സാധാരണ മഴ സാഹചര്യം",
    heavyRainfallAlert: "കനത്ത മഴ മുന്നറിയിപ്പ്",
    rawVsCorrected: "മൂല NWP vs AI തിരുത്തിയത്",
    postProcessingImpact:
      "മഴ പോസ്റ്റ്-പ്രോസസ്സിംഗ് പ്രഭാവം",
    weatherRegimeClassification:
      "കാലാവസ്ഥാ സ്ഥിതി വർഗ്ഗീകരണം",
    detectedRainfallRegime:
      "കണ്ടെത്തിയ മഴയുടെ സ്ഥിതി",
    detectedRegime: "കണ്ടെത്തിയ സ്ഥിതി",
    regimeCorrectionActivated:
      "സ്ഥിതി അടിസ്ഥാനമാക്കിയുള്ള തിരുത്തൽ മോഡൽ സജീവമാക്കി",
    explainableAI: "വിശദീകരിക്കാവുന്ന AI — SHAP വിശകലനം",
    shapDescription:
      "തിരുത്തിയ മഴ പ്രവചനത്തെ സ്വാധീനിക്കുന്ന പ്രധാന കാലാവസ്ഥാ ഘടകങ്ങൾ",
    precipitableWater: "അന്തരീക്ഷ ജലവാഷ്പം",
    humidity: "ഈർപ്പം",
    windConvergence: "കാറ്റിന്റെ സംഗമം",
    temperature: "താപനില",
    forecastVerification: "പ്രവചന പരിശോധന",
    modelPerformance: "മോഡൽ പ്രകടന സൂചകങ്ങൾ",
    developmentWarning:
      "വികസന മോഡ് — പരിശോധനാ മൂല്യങ്ങൾ പ്രദർശനത്തിനായി മാത്രമാണ്. യഥാർത്ഥ വിലയിരുത്തൽ ഫലങ്ങൾ ഉപയോഗിച്ച് മാറ്റണം.",
    emergencyAlert: "അടിയന്തര മുന്നറിയിപ്പ് സംവിധാനം",
    edgeAlert:
      "ONNX inference ഉപയോഗിച്ച് Edge-ready മുന്നറിയിപ്പ് സൃഷ്ടിക്കൽ.",
    highRainfallRisk: "ഉയർന്ന മഴ അപകടസാധ്യത",
    monitoring: "നിരീക്ഷണം",
    voiceAssistant: "വോയ്സ് അസിസ്റ്റന്റ്",
    askAbout:
      "മഴ, കാലാവസ്ഥാ സ്ഥിതി അല്ലെങ്കിൽ മുന്നറിയിപ്പുകൾ ചോദിക്കുക.",
    askWeather: "🎙️ കാലാവസ്ഥാ വിവരം ചോദിക്കുക",
    rainfall: "മഴ",
    millimeters: "മില്ലിമീറ്റർ",
    probability: "കനത്ത മഴയ്ക്കുള്ള സാധ്യത",
    percent: "ശതമാനം",
    weatherRegimeVoice: "കാലാവസ്ഥാ സ്ഥിതി",
    activeMonsoon: "സജീവ മൺസൂൺ",
    breakMonsoon: "ഇടവേള മൺസൂൺ",
    coastal: "തീരപ്രദേശത്തെ സ്ഥിതി",
    orographic: "പർവത പ്രദേശത്തെ സ്ഥിതി",
  },

  bn: {
    language: "ভাষা",
    location: "অবস্থান",
    date: "তারিখ",
    forecast: "পূর্বাভাস",
    dataSource: "ডেটা উৎস",
    offlineReady: "অফলাইন প্রস্তুত",
    india: "ভারত",
    dateValue: "28 সেপ্টেম্বর 2026",
    hours: "ঘণ্টা",
    syntheticNwp: "সিন্থেটিক NWP",
    brand: "AI বৃষ্টিপাত পূর্বাভাস উন্নয়ন ব্যবস্থা",
    subtitle:
      "NWP ভিত্তিক জেলা-স্তরের বৃষ্টিপাত পূর্বাভাস উন্নয়ন",
    developmentMode: "উন্নয়ন মোড",
    nwpInput: "NWP ইনপুট",
    regime: "আবহাওয়ার অবস্থা",
    aiCorrection: "AI সংশোধন",
    heavyRain: "ভারী বৃষ্টি",
    district: "জেলা",
    verify: "যাচাই",
    alert: "সতর্কতা",
    weatherRegime: "আবহাওয়ার অবস্থা",
    rawNwp: "মূল NWP",
    aiCorrected: "AI সংশোধিত পূর্বাভাস",
    heavyRainProbability: "ভারী বৃষ্টির সম্ভাবনা",
    indiaDistrictRainfall: "ভারত জেলা বৃষ্টিপাত",
    districtForecastMap:
      "জেলা-স্তরের AI সংশোধিত বৃষ্টিপাতের পূর্বাভাস",
    low: "কম",
    moderate: "মাঝারি",
    heavy: "ভারী",
    veryHeavy: "অতি ভারী",
    districtForecast: "জেলা পূর্বাভাস",
    aiPostProcessed: "AI দ্বারা সংশোধিত পূর্বাভাস",
    selectedDistrict: "নির্বাচিত জেলা",
    rainfallForecast: "বৃষ্টিপাতের পূর্বাভাস",
    heavyRainRisk: "ভারী বৃষ্টির ঝুঁকি",
    normalConditions: "স্বাভাবিক বৃষ্টিপাতের অবস্থা",
    heavyRainfallAlert: "ভারী বৃষ্টিপাতের সতর্কতা",
    rawVsCorrected: "মূল NWP বনাম AI সংশোধিত",
    postProcessingImpact:
      "বৃষ্টিপাত পোস্ট-প্রসেসিংয়ের প্রভাব",
    weatherRegimeClassification:
      "আবহাওয়ার অবস্থা শ্রেণিবিন্যাস",
    detectedRainfallRegime: "শনাক্ত করা বৃষ্টির অবস্থা",
    detectedRegime: "শনাক্ত করা অবস্থা",
    regimeCorrectionActivated:
      "অবস্থা-ভিত্তিক সংশোধন মডেল সক্রিয় করা হয়েছে",
    explainableAI: "ব্যাখ্যাযোগ্য AI — SHAP বিশ্লেষণ",
    shapDescription:
      "সংশোধিত বৃষ্টিপাতের পূর্বাভাসকে প্রভাবিত করা প্রধান আবহাওয়াগত কারণ",
    precipitableWater: "বায়ুমণ্ডলীয় জলীয়বাষ্প",
    humidity: "আর্দ্রতা",
    windConvergence: "বায়ু সংঘর্ষ",
    temperature: "তাপমাত্রা",
    forecastVerification: "পূর্বাভাস যাচাই",
    modelPerformance: "মডেল কর্মক্ষমতা সূচক",
    developmentWarning:
      "উন্নয়ন মোড — যাচাইয়ের মানগুলি প্রদর্শনের জন্য। প্রকৃত মূল্যায়নের ফলাফল দিয়ে পরিবর্তন করতে হবে।",
    emergencyAlert: "জরুরি সতর্কতা ব্যবস্থা",
    edgeAlert:
      "ONNX inference ব্যবহার করে Edge-ready সতর্কতা তৈরি।",
    highRainfallRisk: "উচ্চ বৃষ্টিপাতের ঝুঁকি",
    monitoring: "পর্যবেক্ষণ",
    voiceAssistant: "ভয়েস সহকারী",
    askAbout:
      "বৃষ্টিপাত, আবহাওয়ার অবস্থা বা সতর্কতা সম্পর্কে জিজ্ঞাসা করুন।",
    askWeather: "🎙️ আবহাওয়ার তথ্য জিজ্ঞাসা করুন",
    rainfall: "বৃষ্টিপাত",
    millimeters: "মিলিমিটার",
    probability: "ভারী বৃষ্টির সম্ভাবনা",
    percent: "শতাংশ",
    weatherRegimeVoice: "আবহাওয়ার অবস্থা",
    activeMonsoon: "সক্রিয় মৌসুমী বায়ু",
    breakMonsoon: "বিরতি মৌসুমী বায়ু",
    coastal: "উপকূলীয় অবস্থা",
    orographic: "পার্বত্য এলাকার অবস্থা",
  },
};

/* =========================================================
   DISTRICT TRANSLATION
========================================================= */

function getTranslatedDistrictName(name, language) {
  const districtNames = {
    Cuddalore: {
      ta: "கடலூர்",
      hi: "कुड्डालोर",
      te: "కడలూరు",
      kn: "ಕಡಲೂರು",
      ml: "കടലൂർ",
      bn: "কুড্ডালোর",
      en: "Cuddalore",
    },

    Chennai: {
      ta: "சென்னை",
      hi: "चेन्नई",
      te: "చెన్నై",
      kn: "ಚೆನ್ನೈ",
      ml: "ചെന്നൈ",
      bn: "চেন্নাই",
      en: "Chennai",
    },

    Coimbatore: {
      ta: "கோயம்புத்தூர்",
      hi: "कोयंबटूर",
      te: "కోయంబత్తూరు",
      kn: "ಕೊಯಮತ್ತೂರು",
      ml: "കോയമ്പത്തൂർ",
      bn: "কোয়েম্বাটোর",
      en: "Coimbatore",
    },

    Madurai: {
      ta: "மதுரை",
      hi: "मदुरै",
      te: "మదురై",
      kn: "ಮದುರೈ",
      ml: "മധുര",
      bn: "মাদুরাই",
      en: "Madurai",
    },

    Kochi: {
      ta: "கொச்சி",
      hi: "कोच्चि",
      te: "కొచ్చి",
      kn: "ಕೊಚ್ಚಿ",
      ml: "കൊച്ചി",
      bn: "কোচি",
      en: "Kochi",
    },

    Wayanad: {
      ta: "வயநாடு",
      hi: "वायनाड",
      te: "వయనాడ్",
      kn: "ವಯನಾಡ್",
      ml: "വയനാട്",
      bn: "ওয়ানাড",
      en: "Wayanad",
    },

    Hyderabad: {
      ta: "ஹைதராபாத்",
      hi: "हैदराबाद",
      te: "హైదరాబాద్",
      kn: "ಹೈದರಾಬಾದ್",
      ml: "ഹൈദരാബാദ്",
      bn: "হায়দ্রাবাদ",
      en: "Hyderabad",
    },

    Kolkata: {
      ta: "கொல்கத்தா",
      hi: "कोलकाता",
      te: "కోల్‌కతా",
      kn: "ಕೊಲ್ಕತ್ತಾ",
      ml: "കൊൽക്കത്ത",
      bn: "কলকাতা",
      en: "Kolkata",
    },

    "Mumbai Suburban": {
      ta: "மும்பை புறநகர்",
      hi: "मुंबई उपनगर",
      te: "ముంబై సబర్బన్",
      kn: "ಮುಂಬೈ ಉಪನಗರ",
      ml: "മുംബൈ സബർബൻ",
      bn: "মুম্বাই শহরতলি",
      en: "Mumbai Suburban",
    },
  };

  return (
    districtNames[name]?.[language] ||
    name
  );
}

/* =========================================================
   REGIME TRANSLATION
========================================================= */

function getTranslatedRegime(regime, t) {
  if (regime === "Active Monsoon") {
    return t.activeMonsoon;
  }

  if (regime === "Break Monsoon") {
    return t.breakMonsoon;
  }

  if (regime === "Coastal") {
    return t.coastal;
  }

  if (regime === "Orographic") {
    return t.orographic;
  }

  return regime;
}

/* =========================================================
   BULLETIN TEXT
========================================================= */

function getBulletinText(
  language,
  selectedData,
  districtName,
  translatedRegime,
  t
) {
  const rainfall =
    selectedData.corrected;

  const risk =
    selectedData.risk;

  const isHighRisk =
    risk >= 80;

  if (language === "ta") {
    return isHighRisk
      ? `${districtName} பகுதியில் அடுத்த 24 மணிநேரத்தில் ${rainfall} மில்லிமீட்டர் வரை மழைப்பொழிவு எதிர்பார்க்கப்படுகிறது. கனமழை நிகழ்தகவு ${risk} சதவீதம். ${translatedRegime} நிலை காணப்படுகிறது. தாழ்வான பகுதிகளில் வசிக்கும் மக்கள் எச்சரிக்கையுடன் இருக்குமாறு அறிவுறுத்தப்படுகிறார்கள்.`
      : `${districtName} பகுதியில் அடுத்த 24 மணிநேரத்தில் ${rainfall} மில்லிமீட்டர் மழைப்பொழிவு எதிர்பார்க்கப்படுகிறது. கனமழை நிகழ்தகவு ${risk} சதவீதம். ${translatedRegime} நிலை காணப்படுகிறது.`;
  }

  if (language === "hi") {
    return isHighRisk
      ? `${districtName} जिले में अगले 24 घंटों में ${rainfall} मिलीमीटर तक वर्षा होने की संभावना है। भारी वर्षा की संभावना ${risk} प्रतिशत है। ${translatedRegime} की स्थिति देखी जा रही है। निचले इलाकों में रहने वाले लोगों को सतर्क रहने की सलाह दी जाती है।`
      : `${districtName} जिले में अगले 24 घंटों में ${rainfall} मिलीमीटर वर्षा होने की संभावना है। भारी वर्षा की संभावना ${risk} प्रतिशत है। ${translatedRegime} की स्थिति देखी जा रही है।`;
  }

  if (language === "te") {
    return isHighRisk
      ? `${districtName} ప్రాంతంలో రాబోయే 24 గంటల్లో ${rainfall} మిల్లీమీటర్ల వరకు వర్షపాతం నమోదయ్యే అవకాశం ఉంది. భారీ వర్షం సంభావ్యత ${risk} శాతం. ${translatedRegime} పరిస్థితి ఉంది. లోతట్టు ప్రాంతాల్లో నివసించే ప్రజలు అప్రమత్తంగా ఉండాలని సూచించబడింది.`
      : `${districtName} ప్రాంతంలో రాబోయే 24 గంటల్లో ${rainfall} మిల్లీమీటర్ల వర్షపాతం నమోదయ్యే అవకాశం ఉంది. భారీ వర్షం సంభావ్యత ${risk} శాతం. ${translatedRegime} పరిస్థితి ఉంది.`;
  }

  if (language === "kn") {
    return isHighRisk
      ? `${districtName} ಜಿಲ್ಲೆಯಲ್ಲಿ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ${rainfall} ಮಿಲಿಮೀಟರ್ ವರೆಗೆ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಭಾರಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ${risk} ಶೇಕಡಾ. ${translatedRegime} ಪರಿಸ್ಥಿತಿ ಕಂಡುಬರುತ್ತಿದೆ. ತಗ್ಗು ಪ್ರದೇಶಗಳ ಜನರು ಎಚ್ಚರಿಕೆಯಿಂದ ಇರಲು ಸೂಚಿಸಲಾಗಿದೆ.`
      : `${districtName} ಜಿಲ್ಲೆಯಲ್ಲಿ ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ${rainfall} ಮಿಲಿಮೀಟರ್ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಭಾರಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ${risk} ಶೇಕಡಾ. ${translatedRegime} ಪರಿಸ್ಥಿತಿ ಕಂಡುಬರುತ್ತಿದೆ.`;
  }

  if (language === "ml") {
    return isHighRisk
      ? `${districtName} ജില്ലയിൽ അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ ${rainfall} മില്ലിമീറ്റർ വരെ മഴ ലഭിക്കാൻ സാധ്യതയുണ്ട്. കനത്ത മഴയ്ക്കുള്ള സാധ്യത ${risk} ശതമാനമാണ്. ${translatedRegime} സാഹചര്യം നിലനിൽക്കുന്നു. താഴ്ന്ന പ്രദേശങ്ങളിലുള്ളവർ ജാഗ്രത പാലിക്കാൻ നിർദ്ദേശിക്കുന്നു.`
      : `${districtName} ജില്ലയിൽ അടുത്ത 24 മണിക്കൂറിനുള്ളിൽ ${rainfall} മില്ലിമീറ്റർ മഴ ലഭിക്കാൻ സാധ്യതയുണ്ട്. കനത്ത മഴയ്ക്കുള്ള സാധ്യത ${risk} ശതമാനമാണ്. ${translatedRegime} സാഹചര്യം നിലനിൽക്കുന്നു.`;
  }

  if (language === "bn") {
    return isHighRisk
      ? `${districtName} জেলায় আগামী 24 ঘণ্টায় ${rainfall} মিলিমিটার পর্যন্ত বৃষ্টিপাতের সম্ভাবনা রয়েছে। ভারী বৃষ্টির সম্ভাবনা ${risk} শতাংশ। ${translatedRegime} পরিস্থিতি বিরাজ করছে। নিচু এলাকার বাসিন্দাদের সতর্ক থাকার পরামর্শ দেওয়া হচ্ছে।`
      : `${districtName} জেলায় আগামী 24 ঘণ্টায় ${rainfall} মিলিমিটার বৃষ্টিপাতের সম্ভাবনা রয়েছে। ভারী বৃষ্টির সম্ভাবনা ${risk} শতাংশ। ${translatedRegime} পরিস্থিতি বিরাজ করছে।`;
  }

  return isHighRisk
    ? `Significant rainfall of up to ${rainfall} millimeters is expected in ${districtName} during the next 24 hours. The probability of heavy rainfall is ${risk} percent. The current weather regime is ${translatedRegime}. People in low-lying areas are advised to remain alert and follow local authorities' instructions.`
    : `Rainfall of around ${rainfall} millimeters is expected in ${districtName} during the next 24 hours. The probability of heavy rainfall is ${risk} percent. The current weather regime is ${translatedRegime}.`;
}
function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("rainfall_token");
  const role = localStorage.getItem("rainfall_role");

  if (
    !token ||
    (role !== "ADMIN" && role !== "AUTHORITY")
  ) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  return children;
}
/* =========================================================
   APP
========================================================= */


function App() {
  
  const [language, setLanguage] =
    useState(i18n.language || "en");

  const t = translations[language];

  const [selectedDistrict, setSelectedDistrict] =
    useState("Cuddalore");

  const [allDistrictMeta, setAllDistrictMeta] =
    useState([]);

  const [selectedState, setSelectedState] =
    useState("All India");

  const [voiceLoading, setVoiceLoading] =
    useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState(new Date());
const [forecastValidUntil, setForecastValidUntil] = useState(
  new Date(Date.now() + 6 * 60 * 60 * 1000)
);

  const [bulletinGenerated, setBulletinGenerated] =
    useState(false);
    useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);

  /* =======================================================
     LOAD DISTRICTS
  ======================================================= */

  useEffect(() => {
    loadAllDistricts()
      .then((data) => {
        console.log(
          "DISTRICT DATA:",
          data
        );

        if (Array.isArray(data.features)) {
          setAllDistrictMeta(
            data.features.map(
              (feature) => ({
                name:
                  feature.properties.name,

                state:
                  feature.properties.state,
              })
            )
          );
        }
      })
      .catch((error) => {
        console.error(
          "District loading error:",
          error
        );
      });
  }, []);

  /* =======================================================
     STATES
  ======================================================= */

  const states = useMemo(() => {
    const uniqueStates = [
      ...new Set(
        allDistrictMeta
          .map((d) => d.state)
          .filter(Boolean)
      ),
    ];

    return uniqueStates.sort();
  }, [allDistrictMeta]);

  /* =======================================================
     FILTERED DISTRICTS
  ======================================================= */

  const filteredDistricts = useMemo(() => {
    if (
      selectedState === "All India"
    ) {
      return allDistrictMeta;
    }

    return allDistrictMeta.filter(
      (d) =>
        d.state ===
        selectedState
    );
  }, [
    allDistrictMeta,
    selectedState,
  ]);

  /* =======================================================
     SELECTED DATA
  ======================================================= */

  const selectedData = useMemo(() => {
    const existingDistrict =
      getDistrict(
        selectedDistrict
      );

    if (existingDistrict) {
      return existingDistrict;
    }

    const fallback =
      getFallbackDistrict(
        selectedDistrict
      );

    const meta =
      allDistrictMeta.find(
        (d) =>
          d?.name?.toLowerCase() ===
          selectedDistrict.toLowerCase()
      );

    return {
      ...fallback,
      state:
        meta?.state ||
        "India",
    };
  }, [
    selectedDistrict,
    allDistrictMeta,
  ]);
  const alertSummary = useMemo(() => {
  let veryHeavy = 0;
  let heavy = 0;
  let moderate = 0;
  let normal = 0;

  allDistrictMeta.forEach((district) => {
    const rainfall = Number(
      district.rainfall ??
      district.rainfallMm ??
      district.precipitation ??
      0
    );

    if (rainfall > 115.5) {
      veryHeavy++;
    } else if (rainfall > 64.5) {
      heavy++;
    } else if (rainfall >= 15.5) {
      moderate++;
    } else {
      normal++;
    }
  });

  return {
    veryHeavy,
    heavy,
    moderate,
    normal,
  };
}, [allDistrictMeta]);

  /* =======================================================
     TRANSLATED REGIME
  ======================================================= */

  const translatedRegime =
    getTranslatedRegime(
      selectedData.regime,
      t
    );

  /* =======================================================
     BULLETIN GENERATOR
  ======================================================= */

  const generateBulletin = () => {
    setBulletinGenerated(true);
  };

  /* =======================================================
     VOICE FUNCTION
  ======================================================= */

  const handleVoice = async () => {
    if (voiceLoading) {
      return;
    }

    const voiceDistrict =
      getTranslatedDistrictName(
        selectedData.name,
        language
      );

    const voiceRegime =
      getTranslatedRegime(
        selectedData.regime,
        t
      );

    let text = "";

    if (language === "ta") {
      text =
        `${voiceDistrict} மாவட்டத்திற்கான மழைப்பொழிவு முன்னறிவிப்பு. ` +
        `மழைப்பொழிவு ${selectedData.corrected} மில்லிமீட்டர். ` +
        `கனமழை நிகழ்தகவு ${selectedData.risk} சதவீதம். ` +
        `வானிலை நிலை ${voiceRegime}.`;
    }

    else if (language === "hi") {
      text =
        `${voiceDistrict} जिले के लिए वर्षा पूर्वानुमान। ` +
        `वर्षा ${selectedData.corrected} मिलीमीटर है। ` +
        `भारी वर्षा की संभावना ${selectedData.risk} प्रतिशत है। ` +
        `मौसम स्थिति ${voiceRegime} है।`;
    }

    else if (language === "te") {
      text =
        `${voiceDistrict} జిల్లాకు వర్షపాతం అంచనా. ` +
        `వర్షపాతం ${selectedData.corrected} మిల్లీమీటర్లు. ` +
        `భారీ వర్షం సంభావ్యత ${selectedData.risk} శాతం. ` +
        `వాతావరణ పరిస్థితి ${voiceRegime}.`;
    }

    else if (language === "kn") {
      text =
        `${voiceDistrict} ಜಿಲ್ಲೆಗೆ ಮಳೆ ಮುನ್ಸೂಚನೆ. ` +
        `ಮಳೆ ${selectedData.corrected} ಮಿಲಿಮೀಟರ್. ` +
        `ಭಾರಿ ಮಳೆಯ ಸಾಧ್ಯತೆ ${selectedData.risk} ಶೇಕಡಾ. ` +
        `ಹವಾಮಾನ ಸ್ಥಿತಿ ${voiceRegime}.`;
    }

    else if (language === "ml") {
      text =
        `${voiceDistrict} ജില്ലയ്ക്കുള്ള മഴ പ്രവചനം. ` +
        `മഴ ${selectedData.corrected} മില്ലിമീറ്റർ ആണ്. ` +
        `കനത്ത മഴയ്ക്കുള്ള സാധ്യത ${selectedData.risk} ശതമാനമാണ്. ` +
        `കാലാവസ്ഥാ സ്ഥിതി ${voiceRegime}.`;
    }

    else if (language === "bn") {
      text =
        `${voiceDistrict} জেলার জন্য বৃষ্টিপাতের পূর্বাভাস। ` +
        `বৃষ্টিপাত ${selectedData.corrected} মিলিমিটার। ` +
        `ভারী বৃষ্টির সম্ভাবনা ${selectedData.risk} শতাংশ। ` +
        `আবহাওয়ার অবস্থা ${voiceRegime}।`;
    }

    else {
      text =
        `Forecast for ${voiceDistrict}. ` +
        `Rainfall is ${selectedData.corrected} millimeters. ` +
        `Heavy rainfall probability is ${selectedData.risk} percent. ` +
        `Weather regime is ${voiceRegime}.`;
    }

    try {
      setVoiceLoading(true);

      const response =
        await fetch(
          "http://localhost:5000/api/voice",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              text,
              language,
            }),
          }
        );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Voice generation failed"
        );
      }

      const audioBlob =
        await response.blob();

      const audioUrl =
        URL.createObjectURL(
          audioBlob
        );

      const audio =
        new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(
          audioUrl
        );

        setVoiceLoading(false);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(
          audioUrl
        );

        setVoiceLoading(false);

        alert(
          "Audio playback failed."
        );
      };

      await audio.play();

    } catch (error) {
      console.error(
        "Piper voice error:",
        error
      );

      setVoiceLoading(false);

      alert(
        error.message ||
        "Voice generation failed. Please check the backend."
      );
    }
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="app">

      {/* HEADER */}

      <header className="top-header">

        <div className="rainfall-branding">
  <div className="rainfall-logo">
    🌧️
  </div>

  <div>
    <h1>RAINFALL AI</h1>
    <p>
      AI-Powered Rainfall Intelligence & Early Warning System
    </p>
  </div>
</div>

        <div className="system-status">

  <div>
    <span className="online-dot"></span>
    SYSTEM OPERATIONAL
  </div>

  <div>
    DATA UPDATED:{" "}
    {lastUpdated
      ? lastUpdated.toLocaleTimeString()
      : "Loading..."}
  </div>

  <div>
    FORECAST VALID: NEXT 24 HOURS
  </div>

</div>

        <select
          value={language}
          onChange={(e) => {

            const newLanguage =
              e.target.value;

            setLanguage(
              newLanguage
            );

            i18n.changeLanguage(
              newLanguage
            );

          }}
        >

          <option value="en">
            English
          </option>

          <option value="ta">
            தமிழ்
          </option>

          <option value="hi">
            हिन्दी
          </option>

          <option value="te">
            తెలుగు
          </option>

          <option value="kn">
            ಕನ್ನಡ
          </option>

          <option value="ml">
            മലയാളം
          </option>

          <option value="bn">
            বাংলা
          </option>

        </select>

      </header>

      {/* CONTROLS */}

      <section className="controls">

        <div className="control">

          <label>
            {t.location}
          </label>

          <strong>
            {t.india}
          </strong>

        </div>

        <div className="control">

          <label>
            {t.date}
          </label>

          <strong>
            {t.dateValue}
          </strong>

        </div>

        <div className="control">

          <label>
            {t.forecast}
          </label>

          <strong>
            24 {t.hours}
          </strong>

        </div>

        <div className="control">

          <label>
            {t.dataSource}
          </label>

          <strong>
            {t.syntheticNwp}
          </strong>

        </div>

        <div className="offline-control">

          <span className="offline-dot"></span>

          {isOnline ? "Online" : "Offline Mode"}

        </div>
        <div
  className="data-freshness"
  style={{
    marginTop: "12px",
  }}
>

  <div>
    <span>Last Updated</span>
    <strong>{lastUpdated.toLocaleTimeString()}</strong>
  </div>

  <div>
    <span>Forecast Valid Until</span>
    <strong>{forecastValidUntil.toLocaleTimeString()}</strong>
  </div>

  <div>
    <span>Data Status</span>
    <strong>{isOnline ? "Online / Synced" : "Cached Offline"}</strong>
  </div>
</div>

      </section>

      {/* PIPELINE */}

      <section className="pipeline">

        <div className="pipeline-step active">
          <span>01</span>
          {t.nwpInput}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>02</span>
          {t.regime}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>03</span>
          {t.aiCorrection}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>04</span>
          {t.heavyRain}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>05</span>
          {t.district}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>06</span>
          {t.verify}
        </div>

        <div className="arrow">→</div>

        <div className="pipeline-step">
          <span>07</span>
          {t.alert}
        </div>

      </section>

      {/* KPI */}

      <section className="kpi-grid">

        <div className="kpi-card regime-card">

          <span className="kpi-icon">🌦️</span>

          <div>

            <p>
              {t.weatherRegime}
            </p>

            <h2>
              {translatedRegime}
            </h2>

          </div>

        </div>

        <div className="kpi-card">

          <span className="kpi-icon">🌧️</span>

          <div>

            <p>
              {t.rawNwp}
            </p>

            <h2>
              {selectedData.rainfall} mm
            </h2>

          </div>

        </div>

        <div className="kpi-card correction-card">

          <span className="kpi-icon">🤖</span>

          <div>

            <p>
              {t.aiCorrected}
            </p>

            <h2>
              {selectedData.corrected} mm
            </h2>

          </div>

        </div>

        <div className="kpi-card risk-card">

          <span className="kpi-icon">⚠️</span>

          <div>

            <p>
              {t.heavyRainProbability}
            </p>

            <h2>
              {selectedData.risk}%
            </h2>

          </div>

        </div>

      </section>

      {/* MAIN GRID */}

      <section className="main-grid">

        {/* MAP */}

        <div className="panel map-panel">

          <div className="panel-header">

            <div>

              <h2>
                🇮🇳{" "}
                {t.indiaDistrictRainfall}
              </h2>

              <p>
                {t.districtForecastMap}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >

                <select
                  value={selectedState}
                  onChange={(e) => {

                    const state =
                      e.target.value;

                    setSelectedState(
                      state
                    );

                    if (
                      state ===
                      "All India"
                    ) {

                      setSelectedDistrict(
                        "Cuddalore"
                      );

                      return;
                    }

                    const firstDistrict =
                      allDistrictMeta.find(
                        (d) =>
                          d.state ===
                          state
                      );

                    if (
                      firstDistrict
                    ) {

                      setSelectedDistrict(
                        firstDistrict.name
                      );

                    }

                  }}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color: "white",
                    fontSize: "14px",
                    minWidth: "180px",
                  }}
                >

                  <option value="All India">
                    🇮🇳 {t.india}
                  </option>

                  {states.map(
                    (state) => (

                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>

                    )
                  )}

                </select>

                <select
                  value={
                    selectedDistrict
                  }
                  onChange={(e) => {
                    setSelectedDistrict(
                      e.target.value
                    );

                    setBulletinGenerated(
                      false
                    );
                  }}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color: "white",
                    fontSize: "14px",
                    minWidth: "230px",
                  }}
                >

                  {filteredDistricts.map(
                    (
                      district,
                      index
                    ) => (

                      <option
                        key={`${district.state}-${district.name}-${index}`}
                        value={
                          district.name
                        }
                      >
                        {district.name} —{" "}
                        {district.state}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>

            <div className="legend">

              <span>
                <i className="green"></i>
                {t.low}
              </span>

              <span>
                <i className="yellow"></i>
                {t.moderate}
              </span>

              <span>
                <i className="orange"></i>
                {t.heavy}
              </span>

              <span>
                <i className="red"></i>
                {t.veryHeavy}
              </span>

            </div>

          </div>

          <div className="map-container">

            <IndiaMap
              mode="leaflet"
              level="both"
              resolution="low"
              style={{
                height: "560px",
                width: "100%",
              }}
              labels={false}
              districtFill={(name) => {

                const rainfall =
                  deterministicRainfall(
                    name
                  );

                const isSelected =
                  name.toLowerCase() ===
                  selectedDistrict.toLowerCase();

                return {
                  fillColor:
                    getRainfallColor(
                      rainfall
                    ),

                  fillOpacity:
                    isSelected
                      ? 0.95
                      : 0.75,

                  color: "#ffffff",

                  weight:
                    isSelected
                      ? 3
                      : 1,
                };

              }}
              tooltip={(feature) => {

                const rainfall =
                  deterministicRainfall(
                    feature.name
                  );

                return (
                  <div>

                    <strong>
                      {feature.name}
                    </strong>

                    <br />

                    {t.rainfall}:{" "}
                    {rainfall} mm

                  </div>
                );

              }}
              onDistrictClick={(name) => {

                setSelectedDistrict(
                  name
                );

                setBulletinGenerated(
                  false
                );

              }}
            />

          </div>

        </div>

        {/* DISTRICT PANEL */}

        <div className="panel district-panel">
          <div className="alert-summary">
  <div className="alert-summary-title">
    🚨 ACTIVE ALERTS
  </div>

  <div className="alert-summary-grid">
    <div className="alert-box very-heavy">
      <span>🔴</span>
      <div>
        <strong>{alertSummary.veryHeavy}</strong>
        <small>Very Heavy</small>
      </div>
    </div>

    <div className="alert-box heavy">
      <span>🟠</span>
      <div>
        <strong>{alertSummary.heavy}</strong>
        <small>Heavy</small>
      </div>
    </div>

    <div className="alert-box moderate">
      <span>🟡</span>
      <div>
        <strong>{alertSummary.moderate}</strong>
        <small>Moderate</small>
      </div>
    </div>

    <div className="alert-box normal">
      <span>🟢</span>
      <div>
        <strong>{alertSummary.normal}</strong>
        <small>Normal</small>
      </div>
    </div>
  </div>
</div>

          <div className="panel-header">

            <div>

              <h2>
                {t.districtForecast}
              </h2>

              <p>
                {t.aiPostProcessed}
              </p>

            </div>

          </div>

          <div className="selected-location">

            <span>
              {t.selectedDistrict}
            </span>

            <h1>
              {getTranslatedDistrictName(
                selectedData.name,
                language
              )}
            </h1>

            <p>
              {selectedData.state ||
                t.india}
            </p>

          </div>

          <div className="big-rain">

            <span>🌧️</span>

            <div>

              <small>
                {t.rainfallForecast}
              </small>

              <strong>
                {selectedData.corrected} mm
              </strong>

            </div>

          </div>

          <div className="district-metrics">

            <div>

              <span>
                {t.rawNwp}
              </span>

              <strong>
                {selectedData.rainfall} mm
              </strong>

            </div>

            <div>

              <span>
                {t.aiCorrected}
              </span>

              <strong>
                {selectedData.corrected} mm
              </strong>

            </div>

            <div>

              <span>
                {t.heavyRainRisk}
              </span>

              <strong>
                {selectedData.risk}%
              </strong>

            </div>

            <div>

              <span>
                {t.weatherRegime}
              </span>

              <strong>
                {translatedRegime}
              </strong>

            </div>

          </div>

          <div
            className={
              selectedData.risk >= 80
                ? "alert danger"
                : "alert safe"
            }
          >

            {selectedData.risk >= 80
              ? `⚠️ ${t.heavyRainfallAlert}`
              : `✓ ${t.normalConditions}`}

          </div>

        </div>

      </section>

      {/* FORECAST ANALYSIS */}

      <section className="analysis-grid">

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                📈{" "}
                {t.rawVsCorrected}
              </h2>

              <p>
                {t.postProcessingImpact}
              </p>

            </div>

          </div>

          <div className="comparison">

            <div className="bar-row">

              <span>
                {t.rawNwp}
              </span>

              <div className="bar-background">

                <div
                  className="bar raw"
                  style={{
                    width: `${Math.min(
                      selectedData.rainfall / 2,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

              <strong>
                {selectedData.rainfall} mm
              </strong>

            </div>

            <div className="bar-row">

              <span>
                {t.aiCorrected}
              </span>

              <div className="bar-background">

                <div
                  className="bar corrected"
                  style={{
                    width: `${Math.min(
                      selectedData.corrected / 2,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

              <strong>
                {selectedData.corrected} mm
              </strong>

            </div>

          </div>

        </div>

        <div className="panel">

          <div className="panel-header">

            <div>

              <h2>
                🌦️{" "}
                {t.weatherRegimeClassification}
              </h2>

              <p>
                {t.detectedRainfallRegime}
              </p>

            </div>

          </div>

          <div className="regime-display">

            <div className="regime-circle">
              🌧️
            </div>

            <div>

              <span>
                {t.detectedRegime}
              </span>

              <h2>
                {translatedRegime}
              </h2>

              <p>
                {t.regimeCorrectionActivated}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* SHAP */}

      <section className="panel shap-panel">

        <div className="panel-header">

          <div>

            <h2>
              🧠{" "}
              {t.explainableAI}
            </h2>

            <p>
              {t.shapDescription}
            </p>

          </div>

        </div>

        <div className="shap-grid">

          <div className="shap-item">

            <span>
              {t.precipitableWater}
            </span>

            <div className="shap-bar">

              <div
                style={{
                  width: "86%",
                }}
              ></div>

            </div>

            <strong>
              +0.86
            </strong>

          </div>

          <div className="shap-item">

            <span>
              {t.humidity}
            </span>

            <div className="shap-bar">

              <div
                style={{
                  width: "72%",
                }}
              ></div>

            </div>

            <strong>
              +0.72
            </strong>

          </div>

          <div className="shap-item">

            <span>
              {t.windConvergence}
            </span>

            <div className="shap-bar">

              <div
                style={{
                  width: "61%",
                }}
              ></div>

            </div>

            <strong>
              +0.61
            </strong>

          </div>

          <div className="shap-item">

            <span>
              {t.temperature}
            </span>

            <div className="shap-bar">

              <div
                style={{
                  width: "38%",
                }}
              ></div>

            </div>

            <strong>
              +0.38
            </strong>

          </div>

        </div>

      </section>

      {/* VERIFICATION */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <h2>
              📊{" "}
              {t.forecastVerification}
            </h2>

            <p>
              {t.modelPerformance}
            </p>

          </div>

        </div>

        <div className="verification-grid">

          <div>
            <span>RMSE</span>
            <strong>18.4</strong>
            <small>mm</small>
          </div>

          <div>
            <span>CSI</span>
            <strong>0.72</strong>
          </div>

          <div>
            <span>POD</span>
            <strong>0.81</strong>
          </div>

          <div>
            <span>FAR</span>
            <strong>0.18</strong>
          </div>

          <div>
            <span>FSS</span>
            <strong>0.76</strong>
          </div>

        </div>

        <div className="synthetic-warning">
          ⚠️ {t.developmentWarning}
        </div>

      </section>

      {/* =====================================================
          BULLETIN GENERATOR
      ===================================================== */}

      <section className="panel bulletin-panel">

        <div className="panel-header">

          <div>

            <h2>
              📰 Bulletin Generator
            </h2>

            <p>
              Generate an automated district weather bulletin
            </p>

          </div>

          <button
            className="generate-bulletin-btn"
            onClick={
              generateBulletin
            }
          >
            📰 Generate Bulletin
          </button>

        </div>

        {bulletinGenerated && (

          <div className="bulletin-card">

  <div className="bulletin-official-header">

  <div className="bulletin-logo-area">
    <div className="bulletin-cloud-logo">🌧️</div>

    <div>
      <strong>RAINFALL AI</strong>
      <span>
        AI-POWERED RAINFALL INTELLIGENCE SYSTEM
      </span>
      <span>
        EARLY WARNING & DISTRICT FORECAST SERVICES
      </span>
    </div>
  </div>

  <div className="bulletin-meta">
    <strong>
      AI WEATHER SUMMARY AND FORECAST BULLETIN
    </strong>

    <span>
      Date: {new Date().toLocaleDateString()}
    </span>

    <span>
      Time of Issue: {new Date().toLocaleTimeString()}
    </span>

    <span>
      Forecast: Next 24 Hours
    </span>
  </div>

</div>

<div className="bulletin-main-title">
  DISTRICT WEATHER SUMMARY AND FORECAST BULLETIN
</div>

  <div className="bulletin-section-title">
    SIGNIFICANT WEATHER FEATURES
  </div>

  <div className="bulletin-header">

              <div>

                <span>
                  WEATHER BULLETIN
                </span>

                <h2>
                  {getTranslatedDistrictName(
                    selectedData.name,
                    language
                  )}
                </h2>

                <p>
                  {selectedData.state ||
                    t.india}
                </p>

              </div>

              <div
                className={
                  selectedData.risk >= 80
                    ? "bulletin-alert high"
                    : selectedData.risk >= 50
                    ? "bulletin-alert moderate"
                    : "bulletin-alert normal"
                }
              >

                {selectedData.risk >= 80
                  ? "⚠️ HIGH RISK"
                  : selectedData.risk >= 50
                  ? "⚠️ MODERATE RISK"
                  : "✓ NORMAL"}

              </div>

            </div>

            <div className="bulletin-metrics">

              <div>

                <span>
                  RAINFALL
                </span>

                <strong>
                  {selectedData.corrected} mm
                </strong>

              </div>

              <div>

                <span>
                  RISK
                </span>

                <strong>
                  {selectedData.risk}%
                </strong>

              </div>

              <div>

                <span>
                  REGIME
                </span>

                <strong>
                  {translatedRegime}
                </strong>

              </div>

            </div>

            <div className="bulletin-message">

              <h3>

                {selectedData.risk >= 80
                  ? `⚠️ ${t.heavyRainfallAlert}`
                  : `✓ ${t.normalConditions}`}

              </h3>

              <p>

                {getBulletinText(
                  language,
                  selectedData,
                  getTranslatedDistrictName(
                    selectedData.name,
                    language
                  ),
                  translatedRegime,
                  t
                )}

              </p>

            </div>

            <div className="bulletin-footer">

              <span>
                📍 {selectedData.name}
              </span>

              <span>
                📅 {t.dateValue}
              </span>

              <span>
                🤖 AI Post-Processed
              </span>

            </div>

          </div>

        )}

      </section>

      {/* ALERT + VOICE */}

      <section className="bottom-grid">

        {/* ALERT */}

        <div className="panel alert-panel">

          <h2>
            🚨 {t.emergencyAlert}
          </h2>

          <p>
            {t.edgeAlert}
          </p>

          <div className="alert-status">

            <span className="pulse"></span>

            <div>

              <strong>
                {selectedData.risk >= 80
                  ? t.highRainfallRisk
                  : t.monitoring}
              </strong>

              <small>
                {t.district}:{" "}
                {getTranslatedDistrictName(
                  selectedData.name,
                  language
                )}
              </small>

            </div>

          </div>

        </div>

        {/* VOICE */}

        <div className="panel voice-panel">

          <h2>
            🎙️ {t.voiceAssistant}
          </h2>

          <p>
            {t.askAbout}
          </p>

          <button
            onClick={handleVoice}
            disabled={voiceLoading}
          >

            {voiceLoading
              ? "🔊 Generating voice..."
              : t.askWeather}

          </button>

        </div>

      </section>

    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRouter;