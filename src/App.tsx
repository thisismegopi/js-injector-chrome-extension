import { useState, useEffect } from 'react';
import { Plus, Code, Globe, Trash2, Edit2, CheckCircle2, XCircle, ExternalLink, Settings as SettingsIcon } from 'lucide-react';
import { cn, type InjectionRule } from './lib/utils';

export default function App() {
    const [rules, setRules] = useState<InjectionRule[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingRule, setEditingRule] = useState<InjectionRule | null>(null);
    const isPopup = window.innerWidth < 600;

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['rules'], (result: { rules?: InjectionRule[] }) => {
                if (result.rules) {
                    setRules(result.rules);
                }
            });
        }
    }, []);

    const saveRules = (newRules: InjectionRule[]) => {
        setRules(newRules);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({ rules: newRules });
        }
    };

    const handleSave = (ruleData: Omit<InjectionRule, 'id' | 'active'>) => {
        try {
            new RegExp(ruleData.pattern);
            if (editingRule) {
                const updatedRules = rules.map(r => (r.id === editingRule.id ? { ...r, ...ruleData } : r));
                saveRules(updatedRules);
            } else {
                const newRule: InjectionRule = {
                    ...ruleData,
                    id: crypto.randomUUID(),
                    active: true,
                };
                saveRules([...rules, newRule]);
            }
            setIsAdding(false);
            setEditingRule(null);
            setError(null);
        } catch {
            setError('Invalid Regex pattern');
        }
    };

    const deleteRule = (id: string) => {
        saveRules(rules.filter(r => r.id !== id));
    };

    const toggleRule = (id: string) => {
        saveRules(rules.map(r => (r.id === id ? { ...r, active: !r.active } : r)));
    };

    const openOptions = () => {
        if (typeof chrome !== 'undefined' && chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open('index.html', '_blank');
        }
    };

    if (isPopup) {
        return (
            <div className='w-[350px] bg-slate-950 text-slate-50 flex flex-col overflow-hidden'>
                <header className='p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50'>
                    <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                            <Code size={18} className='text-white' />
                        </div>
                        <h1 className='font-bold text-lg bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'>JS Injector</h1>
                    </div>
                    <button onClick={openOptions} className='p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all'>
                        <SettingsIcon size={18} />
                    </button>
                </header>

                <main className='flex-1 max-h-[400px] overflow-y-auto p-3 space-y-2'>
                    {rules.length === 0 ? (
                        <div className='py-8 text-center px-4'>
                            <p className='text-slate-500 text-sm mb-4'>No rules configured yet.</p>
                            <button
                                onClick={openOptions}
                                className='w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2'
                            >
                                <Plus size={16} />
                                Configure Rules
                            </button>
                        </div>
                    ) : (
                        rules.map(rule => (
                            <div key={rule.id} className='glass rounded-lg p-3 flex items-center justify-between gap-3'>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-medium text-sm truncate'>{rule.name}</h3>
                                    <code className='text-[10px] text-slate-500 truncate block'>{rule.pattern}</code>
                                </div>
                                <button
                                    onClick={() => toggleRule(rule.id)}
                                    className={cn('w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out flex items-center', rule.active ? 'bg-indigo-600' : 'bg-slate-700')}
                                >
                                    <div className={cn('w-4 h-4 bg-white rounded-full transition-transform duration-200 absolute mx-1', rule.active ? 'translate-x-4' : 'translate-x-0')} />
                                </button>
                            </div>
                        ))
                    )}
                </main>

                <footer className='p-3 border-t border-slate-800 bg-slate-900/50'>
                    <button onClick={openOptions} className='w-full py-2 text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center justify-center gap-1 transition-colors'>
                        View Full Dashboard <ExternalLink size={12} />
                    </button>
                </footer>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-slate-950 text-slate-50 p-8'>
            <header className='max-w-4xl mx-auto flex justify-between items-center mb-12'>
                <div>
                    <h1 className='text-4xl font-extrabold bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight'>JS Injector</h1>
                    <p className='text-slate-400 mt-2 font-medium'>Inject your custom logic into any website effortlessly.</p>
                </div>
                <button
                    onClick={() => {
                        setError(null);
                        setIsAdding(true);
                    }}
                    className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all px-6 py-3 rounded-xl font-bold shadow-xl shadow-indigo-600/30 hover:-translate-y-0.5'
                >
                    <Plus size={20} />
                    Add New Rule
                </button>
            </header>

            <main className='max-w-4xl mx-auto'>
                <div className='grid gap-6'>
                    {rules.length === 0 && !isAdding ? (
                        <div className='glass rounded-3xl p-20 text-center border-dashed border-2 border-slate-800'>
                            <div className='w-20 h-20 bg-slate-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800'>
                                <Code className='text-indigo-400' size={40} />
                            </div>
                            <h2 className='text-2xl font-bold mb-3'>Your script collection is empty</h2>
                            <p className='text-slate-400 mb-8 max-w-sm mx-auto'>Start by creating a rule to target specific websites with your custom scripts.</p>
                            <button onClick={() => setIsAdding(true)} className='bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl font-semibold border border-slate-700 transition-all'>
                                Create Your First Rule
                            </button>
                        </div>
                    ) : (
                        rules.map(rule => (
                            <div key={rule.id} className='glass group rounded-2xl p-6 flex items-center justify-between border border-white/5 hover:border-white/10 transition-all hover:bg-white/4'>
                                <div className='flex items-center gap-5'>
                                    <div
                                        className={cn(
                                            'w-14 h-14 rounded-2xl flex items-center justify-center transition-all border',
                                            rule.active ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-inner shadow-indigo-500/10' : 'bg-slate-800/50 border-slate-800 text-slate-600',
                                        )}
                                    >
                                        <Globe size={28} />
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-xl flex items-center gap-3'>
                                            {rule.name}
                                            {rule.active ? (
                                                <span className='text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20'>
                                                    Active
                                                </span>
                                            ) : (
                                                <span className='text-[10px] font-black bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-slate-700'>
                                                    Disabled
                                                </span>
                                            )}
                                        </h3>
                                        <code className='text-sm text-slate-500 mt-1.5 font-mono block transition-colors group-hover:text-slate-400 truncate max-w-md'>{rule.pattern}</code>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => toggleRule(rule.id)}
                                        className={cn(
                                            'p-3 rounded-xl transition-all border',
                                            rule.active ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' : 'text-slate-500 border-slate-800 hover:bg-slate-800',
                                        )}
                                        title={rule.active ? 'Disable' : 'Enable'}
                                    >
                                        {rule.active ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingRule(rule);
                                            setIsAdding(true);
                                        }}
                                        className='p-3 text-slate-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-xl transition-all'
                                        title='Edit Rule'
                                    >
                                        <Edit2 size={22} />
                                    </button>
                                    <button
                                        onClick={() => deleteRule(rule.id)}
                                        className='p-3 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent rounded-xl transition-all'
                                        title='Delete Rule'
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Modern Modal */}
            {isAdding && (
                <div className='fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 z-100 animate-in fade-in duration-300'>
                    <div className='glass w-full max-w-2xl rounded-3xl p-10 border border-white/10 shadow-2xl shadow-indigo-500/10 flex flex-col gap-8 animate-in zoom-in-95 duration-300'>
                        <div>
                            <h2 className='text-3xl font-black mb-2 tracking-tight'>{editingRule ? 'Edit Rule' : 'Create New Rule'}</h2>
                            <p className='text-slate-400 font-medium'>{editingRule ? 'Update your injection settings.' : 'Define where and what to inject.'}</p>
                        </div>

                        <div className='space-y-6'>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-slate-300 ml-1 uppercase tracking-wider'>Rule Name</label>
                                <input
                                    type='text'
                                    placeholder='e.g., My Analytics Tool'
                                    defaultValue={editingRule?.name || ''}
                                    className='w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-600 font-medium'
                                    id='rule-name'
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-slate-300 ml-1 uppercase tracking-wider'>Match Pattern (Regex)</label>
                                <div className='relative group'>
                                    <input
                                        type='text'
                                        placeholder='e.g., ^https://www\.google\.com/.*'
                                        defaultValue={editingRule?.pattern || ''}
                                        className='w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all font-mono text-sm placeholder:text-slate-600'
                                        id='rule-pattern'
                                    />
                                    <div className='absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black bg-slate-800 text-slate-500 px-2 py-1 rounded border border-slate-700 pointer-events-none'>
                                        REGEX
                                    </div>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-sm font-bold text-slate-300 ml-1 uppercase tracking-wider'>Script Content</label>
                                <textarea
                                    placeholder="console.log('Hello World!');"
                                    defaultValue={editingRule?.script || ''}
                                    className='w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 h-48 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all font-mono text-sm placeholder:text-slate-600 resize-none'
                                    id='rule-script'
                                />
                            </div>
                        </div>

                        {error && (
                            <div className='bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 animate-in slide-in-from-top-2'>
                                <XCircle size={18} />
                                <p className='text-sm font-bold'>{error}</p>
                            </div>
                        )}

                        <div className='flex justify-end gap-4 mt-2'>
                            <button
                                onClick={() => {
                                    setError(null);
                                    setIsAdding(false);
                                    setEditingRule(null);
                                }}
                                className='px-8 py-3 text-slate-400 hover:text-white font-bold transition-all hover:bg-white/5 rounded-xl uppercase tracking-widest text-xs'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const name = (document.getElementById('rule-name') as HTMLInputElement).value;
                                    const pattern = (document.getElementById('rule-pattern') as HTMLInputElement).value;
                                    const script = (document.getElementById('rule-script') as HTMLTextAreaElement).value;
                                    if (name && pattern && script) {
                                        handleSave({ name, pattern, script });
                                    }
                                }}
                                className='bg-indigo-600 hover:bg-indigo-500 px-10 py-3 rounded-xl font-black shadow-lg shadow-indigo-600/20 transition-all active:scale-95 uppercase tracking-widest text-xs'
                            >
                                {editingRule ? 'Update Rule' : 'Save injected script'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
