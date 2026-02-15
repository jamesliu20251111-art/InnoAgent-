
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Compass, 
  Zap, 
  Eye, 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  Settings, 
  Star,
  ChevronRight,
  Send,
  Loader2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import MagicCircle from './components/MagicCircle';
import { Project, AppState, Message, Feedback } from './types';
import { getProjectCoachFeedback, chatWithStrange, generateBrainstormingIdeas } from './services/geminiService';

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<AppState>(AppState.HOME);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [brainstormResults, setBrainstormResults] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      status: 'ideation',
      lastModified: Date.now(),
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setActiveState(AppState.DASHBOARD);
  };

  const handleAnalyze = async () => {
    if (!currentProject) return;
    setIsTyping(true);
    try {
      const result = await getProjectCoachFeedback(currentProject);
      setFeedback(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBrainstorm = async (prompt: string) => {
    setIsTyping(true);
    try {
      const results = await generateBrainstormingIdeas(prompt);
      setBrainstormResults(results);
      setActiveState(AppState.MIRROR_DIMENSION);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatWithStrange(messages, inputValue);
      const modelMsg: Message = { role: 'model', text: response.text || '我无法感知这个维度的回应...' };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center px-4">
      <div className="relative">
        <MagicCircle size={400} />
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://picsum.photos/seed/doctor/200/200" 
            alt="Doctor Strange" 
            className="w-32 h-32 rounded-full border-4 border-orange-500/50 shadow-[0_0_20px_rgba(255,157,0,0.5)]" 
          />
        </div>
      </div>
      
      <div className="max-w-2xl">
        <h1 className="text-5xl font-magic font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
          InnoAgent: 奇异博士
        </h1>
        <p className="text-xl text-gray-400 italic mb-8">
          "我已经看过 14,000,605 个可能的未来，只有在这个应用中，你的项目才能颠覆世界。"
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setActiveState(AppState.PROJECT_CREATION)}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-bold text-white shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <PlusCircle size={20} />
            开启新项目
          </button>
          <button 
            onClick={() => setActiveState(AppState.DASHBOARD)}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-bold text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <LayoutDashboard size={20} />
            圣殿档案
          </button>
        </div>
      </div>
    </div>
  );

  const renderProjectCreation = () => (
    <div className="max-w-xl mx-auto py-12 px-4">
      <button onClick={() => setActiveState(AppState.HOME)} className="flex items-center gap-2 text-orange-400 mb-8 hover:underline">
        <ArrowLeft size={18} /> 返回主页
      </button>
      <div className="p-8 bg-zinc-900/50 rounded-2xl border border-orange-500/20 shadow-2xl backdrop-blur-md">
        <h2 className="text-2xl font-magic font-bold text-orange-400 mb-6 flex items-center gap-2">
          <Sparkles /> 描绘你的现实
        </h2>
        <form onSubmit={createProject} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">项目名称</label>
            <input 
              name="name" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
              placeholder="例如: 维度穿梭能源系统"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">所属行业</label>
            <input 
              name="industry" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
              placeholder="例如: 清洁能源"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">核心描述</label>
            <textarea 
              name="description" 
              required
              rows={4}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
              placeholder="详细描述你的创新之处..."
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition-colors"
          >
            召唤项目
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-magic font-bold text-white mb-2">至尊圣所档案馆</h2>
          <p className="text-gray-400">你正在监视的所有现实项目</p>
        </div>
        <button 
          onClick={() => setActiveState(AppState.PROJECT_CREATION)}
          className="p-3 bg-orange-600/20 text-orange-400 rounded-lg border border-orange-500/30 flex items-center gap-2 hover:bg-orange-600/30"
        >
          <PlusCircle size={20} />
          增加现实分支
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-500">尚无活跃的项目维度。点击“开启新项目”来召唤一个。</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div 
              key={p.id}
              onClick={() => {
                setCurrentProject(p);
                setActiveState(AppState.SANCTUM);
              }}
              className="p-6 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Compass className="text-orange-500" />
                </div>
                <span className="text-xs uppercase tracking-widest text-orange-400 px-2 py-1 bg-orange-400/10 rounded">
                  {p.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{p.name}</h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{p.description}</p>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-xs text-gray-500">
                <span>行业: {p.industry}</span>
                <span>最后观测: {new Date(p.lastModified).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSanctum = () => (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto flex flex-col md:flex-row p-4 gap-6">
      {/* Sidebar Info */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/10">
          <h3 className="text-orange-400 font-magic font-bold text-xl mb-4 flex items-center gap-2">
            <Eye size={20} /> 项目观测
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">当前焦点</p>
              <p className="font-bold text-white">{currentProject?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">关键指数</p>
              <div className="mt-1 h-2 bg-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-red-600" 
                  style={{ width: `${feedback?.score || 10}%` }}
                />
              </div>
              <p className="text-right text-xs text-orange-400 mt-1">{feedback?.score || '未评估'}% 现实度</p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isTyping}
              className="w-full py-2 bg-orange-600/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-600/30 transition-colors flex justify-center items-center gap-2"
            >
              {isTyping ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
              深度分析项目
            </button>
          </div>
        </div>

        {feedback && (
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-900/30 rounded-2xl border border-white/10 text-sm space-y-6">
             <div>
               <h4 className="text-green-400 font-bold mb-2">优势 (光明面)</h4>
               <ul className="list-disc list-inside text-gray-400">
                 {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
             </div>
             <div>
               <h4 className="text-red-400 font-bold mb-2">威胁 (多元宇宙变量)</h4>
               <ul className="list-disc list-inside text-gray-400">
                 {feedback.threats.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
             </div>
             <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
               <h4 className="text-blue-400 font-bold mb-1">至尊建议</h4>
               <p className="text-gray-300 italic">"{feedback.recommendations[0]}"</p>
             </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-900/50 rounded-3xl border border-white/10 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <MagicCircle size={150} rotating={false} className="opacity-20" />
              <p className="text-gray-500 max-w-sm">
                “你想要了解关于这个项目的什么？时间是流动的，但我的忠告是坚实的。”
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                m.role === 'user' 
                ? 'bg-orange-600 text-white rounded-br-none' 
                : 'bg-zinc-800 text-gray-200 border border-white/5 rounded-bl-none shadow-xl'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 p-4 rounded-2xl border border-white/5 rounded-bl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 flex gap-2">
          <button 
            onClick={() => handleBrainstorm(currentProject?.description || '')}
            className="p-3 bg-zinc-800 text-orange-400 rounded-xl hover:bg-zinc-700" title="进入镜像空间"
          >
            <Sparkles size={20} />
          </button>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="询问你的教练..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-orange-500"
          />
          <button 
            onClick={sendMessage}
            className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMirrorDimension = () => (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={() => setActiveState(AppState.SANCTUM)} className="flex items-center gap-2 text-orange-400 hover:underline">
          <ArrowLeft size={18} /> 返回圣殿
        </button>
        <h2 className="text-3xl font-magic font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          镜像空间: 灵感维度
        </h2>
      </div>

      <div className="grid gap-6">
        {brainstormResults.map((idea, i) => (
          <div 
            key={i}
            className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-500/20 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <MagicCircle size={100} rotating />
            </div>
            <div className="flex gap-4">
              <div className="text-4xl font-magic text-blue-500/30">#{i+1}</div>
              <p className="text-lg text-gray-200 leading-relaxed">{idea}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 text-center bg-zinc-900/50 border border-white/10 rounded-2xl">
        <p className="text-gray-400 mb-4 italic">“在镜像空间，你的每一个想法都会折射出成千上万种形态。”</p>
        <button 
          onClick={() => handleBrainstorm(currentProject?.description || '')}
          className="px-6 py-2 border border-blue-500 text-blue-400 rounded-full hover:bg-blue-500/10 transition-colors"
        >
          重新折射灵感
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen portal-bg pb-12">
      {/* Navigation Bar */}
      <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveState(AppState.HOME)}
        >
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Compass className="text-white" />
          </div>
          <span className="text-xl font-magic font-bold tracking-wider text-orange-500">InnoAgent</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-semibold text-gray-400">
          <button 
            onClick={() => setActiveState(AppState.DASHBOARD)}
            className={`hover:text-orange-500 transition-colors ${activeState === AppState.DASHBOARD ? 'text-orange-500' : ''}`}
          >
            档案库
          </button>
          <button 
            onClick={() => {
              if (currentProject) setActiveState(AppState.SANCTUM);
              else alert('请先选择或创建一个项目');
            }}
            className={`hover:text-orange-500 transition-colors ${activeState === AppState.SANCTUM ? 'text-orange-500' : ''}`}
          >
            圣殿教练
          </button>
          <button className="hover:text-orange-500 transition-colors">多重宇宙设置</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 font-bold">斯特兰奇勋爵</p>
            <p className="text-[10px] text-orange-500/80">至尊创新大师</p>
          </div>
          <img src="https://picsum.photos/seed/face/40/40" alt="Profile" className="w-10 h-10 rounded-full border border-orange-500" />
        </div>
      </nav>

      {/* Page Content */}
      <main className="animate-[fadeIn_0.5s_ease-out]">
        {activeState === AppState.HOME && renderHome()}
        {activeState === AppState.PROJECT_CREATION && renderProjectCreation()}
        {activeState === AppState.DASHBOARD && renderDashboard()}
        {activeState === AppState.SANCTUM && renderSanctum()}
        {activeState === AppState.MIRROR_DIMENSION && renderMirrorDimension()}
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
