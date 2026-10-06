const fs = require('fs');
const path = require('path');
const p = (fp) => path.join('S:/LABMENTIX/1st Project/client-tts-git/server-tts/frontend_temp', fp);

// 1. main.jsx - remove AuthProvider
let main = fs.readFileSync(p('main.jsx'), 'utf-8');
main = main.replace("import { AuthProvider } from './context/AuthContext'", "");
main = main.replace("<AuthProvider>", "");
main = main.replace("</AuthProvider>", "");
fs.writeFileSync(p('main.jsx'), main);

// 2. index.css - change colors
let indexCss = fs.readFileSync(p('index.css'), 'utf-8');
indexCss = indexCss.replace('--accent: #4f46e5', '--accent: #059669'); // emerald-600
indexCss = indexCss.replace('--accent-hover: #4338ca', '--accent-hover: #047857'); // emerald-700
indexCss = indexCss.replace('--accent-soft: rgba(79, 70, 229, 0.12)', '--accent-soft: rgba(5, 150, 105, 0.12)');
indexCss = indexCss.replace('--teal: #9333ea', '--teal: #d97706'); // amber-600
indexCss = indexCss.replace('--teal-hover: #7e22ce', '--teal-hover: #b45309'); // amber-700
indexCss = indexCss.replace('--teal-soft: rgba(147, 51, 234, 0.12)', '--teal-soft: rgba(217, 119, 6, 0.12)');
fs.writeFileSync(p('index.css'), indexCss);

// 3. App.jsx - remove auth imports, landing page, history, favourites, and rewrite copy
let app = fs.readFileSync(p('App.jsx'), 'utf-8');

app = app.replace("import AuthForm from './components/AuthForm';", "");
app = app.replace("import HistoryList from './components/HistoryList';", "");
app = app.replace("import FavouritesList from './components/FavouritesList';", "");
app = app.replace("import LandingPage from './components/LandingPage';", "");
app = app.replace("import { useAuth } from './context/AuthContext';", "");
app = app.replace("getFavourites,", "");
app = app.replace("addFavourite,", "");
app = app.replace("removeFavourite,", "");
app = app.replace("const { user, accessToken, signOut } = useAuth();", "");

// Remove auth states
app = app.replace(/const \[view, setView\] = useState\('landing'\);/, "const [view, setView] = useState('dashboard');");
app = app.replace(/const \[authMode, setAuthMode\] = useState\('login'\); \/\/ 'login' \| 'signup'/, "");
app = app.replace(/const \[isGuest, setIsGuest\] = useState\(false\);/, "");
app = app.replace(/const \[activeTab, setActiveTab\] = useState\('generate'\);/, "const [activeTab, setActiveTab] = useState('generate');");
app = app.replace(/const \[favourites, setFavourites\] = useState\(\[\]\);/, "");

// Remove loadFavourites logic
app = app.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[accessToken\]\);/m, "");
app = app.replace(/const loadFavourites = async \(\) => \{[\s\S]*?\};/m, "");

// Modify generate to not use accessToken
app = app.replace(/const res = await convertToSpeech\(text, language, voice, accessToken\);/, "const res = await convertToSpeech(text, language, voice);");

// Remove fav handlers
app = app.replace(/const isFav = \(vName\) => favourites\.some\(\(f\) => f\.voice_name === vName\);/, "const isFav = () => false;");
app = app.replace(/const handleToggleFav = async \(vName\) => \{[\s\S]*?\};/m, "const handleToggleFav = () => {};");
app = app.replace(/const handleSelectFavVoice = \(vObj\) => \{[\s\S]*?\};/m, "");

// Remove signout handler
app = app.replace(/const handleSignOut = \(\) => \{[\s\S]*?\};/m, "");

// Remove view rendering for landing and auth
app = app.replace(/\/\/ ================= Stage 1: Landing Page \(Always First Screen on Load\) =================[\s\S]*?\/\/ ================= Stage 3: Application Dashboard \(Third Screen\) =================/m, "// ================= Application Dashboard =================");

// Remove user bar
app = app.replace(/<div className="user-bar"[\s\S]*?<\/div>/m, "");

// Remove HistoryList and FavouritesList from return
app = app.replace(/\{activeTab === 'history' && user && \([\s\S]*?<\/FavouritesList>\n\s*\)\}/m, "");

// Change copy
app = app.replace(/Vocalizer AI/g, "Sonic Speak");
app = app.replace(/Bring your text to life\./g, "Transform Words into Audio.");
app = app.replace(/Input your text, choose the perfect language and voice model, and generate stunning audio to preview or download\./g, "Simply type your text, select your preferred language and voice, and seamlessly convert it into high-quality speech.");
app = app.replace(/What would you like to say\?/g, "Enter text to convert");
app = app.replace(/Your audio masterpiece/g, "Generated Audio Result");
app = app.replace(/Create Audio/g, "Speech Generator");

// Remove isLoggedIn prop from VoiceSelector
app = app.replace(/isLoggedIn=\{!!user\}/g, "");

fs.writeFileSync(p('App.jsx'), app);
console.log('App.jsx modified');

// 4. Update ttsService.js
let ttsService = fs.readFileSync(p('services/ttsService.js'), 'utf-8');
ttsService = ttsService.replace(/accessToken \? \{ headers: \{ Authorization: \`Bearer \$\{accessToken\}\` \} \} : \{\}/, '{}');
fs.writeFileSync(p('services/ttsService.js'), ttsService);
console.log('ttsService.js modified');

