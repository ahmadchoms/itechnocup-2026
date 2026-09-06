import { Sparkles, Loader2 } from "lucide-react";

export default function MatchLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 pb-20">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm max-w-md w-full text-center space-y-6">
        
        {/* Animated Icon Container */}
        <div className="relative w-20 h-20 mx-auto">
          {/* Pulsing background */}
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
          
          {/* Static center background */}
          <div className="relative w-full h-full bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-100">
            {/* Spinning Loader */}
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            
            {/* Absolute little sparkle for visual flair */}
            <Sparkles className="w-5 h-5 text-emerald-400 absolute top-2 right-2 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Sedang Mencocokkan...
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            AI kami sedang menganalisis material Anda dan mencari pengepul terdekat dengan penawaran terbaik. Mohon tunggu sebentar.
          </p>
        </div>

      </div>
    </div>
  );
}
