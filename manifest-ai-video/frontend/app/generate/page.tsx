'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, CheckCircle, Play, Download, Layers } from 'lucide-react';
import axios from 'axios';

export default function GeneratePage() {
  const [jobId, setJobId] = useState(null);
  const [stage, setStage] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  
  const { register, handleSubmit, watch } = useForm({ defaultValues: { prompt: '', duration_minutes: 2, style: 'cinematic' } });
  const duration = watch('duration_minutes');
  
  useEffect(() => {
    let interval;
    if (jobId && stage === 'processing') {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/status/${jobId}`);
          const status = res.data;
          setProgress(status.progress);
          setCurrentStage(status.current_stage);
          if (status.status === 'completed') {
            setStage('complete');
            setVideoUrl(status.video_url);
            toast.success('Your video is ready!');
            clearInterval(interval);
          } else if (status.status === 'failed') {
            setStage('idle');
            toast.error(status.error_message);
            clearInterval(interval);
          }
        } catch (e) { console.error(e); }
      }, 2000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [jobId, stage]);
  
  const onSubmit = async (data) => {
    if (!data.prompt.trim()) { toast.error('Enter your story idea'); return; }
    setStage('processing');
    try {
      const res = await axios.post('/api/generate', data);
      setJobId(res.data.job_id);
      toast.success('Generation started!');
    } catch (e) { toast.error('Failed to start'); setStage('idle'); }
  };
  
  const downloadVideo = () => { if (jobId) window.open(`/api/download/${jobId}`, '_blank'); };
  
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold manifest-gradient-text mb-8">Manifest Your Story</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm font-medium mb-2 text-cyan-400">Your Story Idea</label>
              <textarea {...register('prompt')} placeholder="A young wizard discovers a hidden magical realm..." className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-cyan-500/50" disabled={stage !== 'idle'} />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div><label className="text-sm text-cyan-400">Duration: {duration} min</label><input {...register('duration_minutes')} type="range" min={1} max={30} className="w-full accent-cyan-500" disabled={stage !== 'idle'} /></div>
                <div><label className="text-sm text-cyan-400">Style</label><select {...register('style')} className="w-full bg-black/50 border border-white/10 rounded-xl p-2" disabled={stage !== 'idle'}><option value="cinematic">Cinematic</option><option value="anime">Anime</option><option value="realistic">Realistic</option></select></div>
              </div>
              <button type="submit" disabled={stage !== 'idle'} className="w-full mt-6 manifest-button py-3 disabled:opacity-50">{stage === 'idle' ? <span className="flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" /> Manifest Video</span> : <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>}</button>
            </form>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-cyan-400" /> Progress</h3>
            {stage === 'processing' && (<><div className="mb-4"><div className="flex justify-between text-sm"><span>{currentStage}</span><span>{Math.round(progress)}%</span></div><div className="w-full bg-black/50 rounded-full h-2"><motion.div className="h-full manifest-gradient rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div></div><div className="space-y-3">{['Analyzing', 'Scripting', 'Designing', 'Generating', 'Audio', 'Final'].map((step, i) => (<div key={step} className="flex items-center gap-3"><div className={`w-6 h-6 rounded-full flex items-center justify-center ${progress > i * 16 ? 'bg-green-500/20 text-green-400' : progress >= i * 16 ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' : 'bg-gray-800'}`}>{progress > i * 16 ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}</div><span className={`text-sm ${progress >= i * 16 ? 'text-white' : 'text-gray-500'}`}>{step}</span></div>))}</div></>)}
            {stage === 'complete' && videoUrl && (<div className="text-center"><div className="mb-4 p-4 bg-green-500/10 rounded-lg"><CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" /><p className="font-semibold">Your video is ready!</p></div><button onClick={downloadVideo} className="manifest-button w-full py-2 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download Video</button></div>)}
            {stage === 'idle' && (<div className="text-center py-12 text-gray-500"><Play className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Enter your story above to begin</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
