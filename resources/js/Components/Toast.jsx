import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }
    }, [flash]);

    // Hilangkan otomatis setelah 4 detik
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible || !message) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm">
            {type === 'success' ? (
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            ) : (
                <div className="p-1.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                    <AlertCircle className="w-5 h-5" />
                </div>
            )}

            <p className="text-xs font-semibold text-slate-200 flex-1">{message}</p>

            <button
                onClick={() => setVisible(false)}
                className="p-1 text-slate-500 hover:text-slate-300 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}