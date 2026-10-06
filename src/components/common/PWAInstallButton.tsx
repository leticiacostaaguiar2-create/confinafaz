import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'settings' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode (already installed), hide
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Aplicativo PWA instalado neste dispositivo.</span>
        </div>
      );
    }
    return null;
  }

  // Handle click
  const handleClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General prompt guidance
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'settings' ? (
        <button
          onClick={handleClick}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Instalar Vale Forte no Dispositivo (PWA)</span>
        </button>
      ) : variant === 'banner' ? (
        <button
          onClick={handleClick}
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar App</span>
        </button>
      ) : (
        <button
          onClick={handleClick}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          title="Instalar aplicativo para uso offline no curral"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      )}

      {/* iOS or Manual Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-200 text-stone-900 select-none">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center text-xl font-bold">
                  🐂
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                    Instalar Vale Forte
                  </h3>
                  <p className="text-[11px] text-stone-500">Acesso offline rápido no campo</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <p className="font-bold text-stone-900">
                Como instalar no seu celular ou tablet:
              </p>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  No navegador (Safari no iPhone ou Chrome no Android), toque no botão de{' '}
                  <strong className="text-stone-900">Compartilhar</strong> (ícone com seta para cima <Share className="w-3.5 h-3.5 inline text-emerald-700" />) ou menu <strong>⋮</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Role e toque na opção{' '}
                  <strong className="text-emerald-800">
                    "Adicionar à Tela de Início" <PlusSquare className="w-3.5 h-3.5 inline text-emerald-700" />
                  </strong>{' '}
                  ou "Instalar Aplicativo".
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  Pronto! O sistema funcionará como um aplicativo nativo mesmo sem conexão com a internet.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
