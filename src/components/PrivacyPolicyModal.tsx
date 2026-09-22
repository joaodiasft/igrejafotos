import React, { useState } from 'react';
import { X, Shield, Lock, EyeOff, MessageCircle, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onOpenWhatsApp?: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenWhatsApp
}) => {
  const [photoInfo, setPhotoInfo] = useState('');
  const [personName, setPersonName] = useState('');
  const [requested, setRequested] = useState(false);

  if (!isOpen) return null;

  const handleRequestRemoval = (e: React.FormEvent) => {
    e.preventDefault();
    setRequested(true);
    onOpenWhatsApp?.();
  };

  return (
    <div 
      id="privacy-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="privacy-modal-box"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6 animate-in zoom-in-95 duration-200 text-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Política de Privacidade & Imagem
              </h3>
              <p className="text-xs text-slate-400">
                Igreja Assembleia de Deus Barravento • Lei Geral de Proteção de Dados (LGPD)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Highlights */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <EyeOff className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Sem Reconhecimento Facial ou Rastreamento</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Nosso portal não utiliza biometria, inteligência artificial de reconhecimento facial nem coleta dados sensíveis dos visitantes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Acesso e Download Livres de Cadastro</h4>
              <p className="text-slate-600 text-xs mt-0.5">
                Nenhum visitante é obrigado a criar conta, preencher dados pessoais ou fazer login para visualizar e baixar suas fotos das celebrações.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-slate-600 text-xs">
            <p>
              <strong>1. Finalidade Institucional:</strong> As fotografias e filmagens realizadas durante os cultos e eventos públicos da Igreja AD Barravento possuem caráter exclusivamente ministerial, litúrgico e de memória comunitária.
            </p>
            <p>
              <strong>2. Tempo de publicação:</strong> As fotos permanecem no portal por cerca de 1 mês. Depois disso, a galeria é retirada. Baixe o que quiser guardar enquanto estiver disponível.
            </p>
            <p>
              <strong>3. Direito de remoção:</strong> Se você ou um dependente aparecer em uma foto e desejar a retirada antes desse prazo, use o formulário abaixo. O WhatsApp oficial ainda será criado; enquanto isso, a equipe também atende pelo Instagram @ad_barravento.
            </p>
          </div>

          {/* Quick Removal Request Form */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              Solicitar remoção de foto
            </h4>

            {requested ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recebemos seu pedido. O WhatsApp oficial ainda será criado — fale também pelo Instagram @ad_barravento.</span>
              </div>
            ) : (
              <form onSubmit={handleRequestRemoval} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nome do evento ou link da foto"
                    value={photoInfo}
                    onChange={(e) => setPhotoInfo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enviar Pedido de Remoção via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            Entendido e Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
