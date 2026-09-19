import React, { useState } from 'react';
import { Save, CheckCircle2, Shield, Sparkles, Church, MapPin, Phone, Instagram, Youtube } from 'lucide-react';
import { SiteSettings } from '../../types';
import { DatabaseService } from '../../services/db';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ settings, onRefresh }) => {
  const [churchName, setChurchName] = useState(settings.churchName);
  const [churchSubtitle, setChurchSubtitle] = useState(settings.churchSubtitle || settings.subtitle || '');
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [youtube, setYoutube] = useState(settings.youtube);
  const [watermarkEnabled, setWatermarkEnabled] = useState(settings.watermarkEnabled ?? settings.enableWatermarkDefault ?? true);
  const [watermarkText, setWatermarkText] = useState(settings.watermarkText || settings.defaultWatermarkText || 'AD BARRAVENTO');
  const [watermarkPosition, setWatermarkPosition] = useState(settings.watermarkPosition || 'bottom-right');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseService.saveSettings({
      churchName,
      churchSubtitle,
      subtitle: churchSubtitle,
      address,
      phone,
      whatsapp,
      instagram,
      youtube,
      watermarkEnabled,
      enableWatermarkDefault: watermarkEnabled,
      watermarkText,
      defaultWatermarkText: watermarkText,
      watermarkPosition
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Configurações Gerais do Portal & Marca D'água
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Personalize as informações da igreja, canais de contato e regras de proteção de imagem.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Marca d'água section */}
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-base">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Configuração da Marca D'água</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 leading-relaxed">
            <strong>Regra de Proteção:</strong> A marca d'água é inserida de forma elegante e sutil <strong>exclusivamente na visualização online</strong> do portal. Quando os membros ou visitantes tocam em <strong>BAIXAR</strong> ou <strong>BAIXAR ÁLBUM</strong>, o sistema entrega o arquivo original em altíssima qualidade <strong>100% sem marca d'água</strong>.
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="watermark-active-toggle"
              checked={watermarkEnabled}
              onChange={(e) => setWatermarkEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <label htmlFor="watermark-active-toggle" className="text-sm font-bold text-slate-800 cursor-pointer">
              Ativar marca d'água na exibição das fotos no site
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Texto da Marca D'água</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="AD BARRAVENTO"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-heading font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Posição da Marca</label>
              <select
                value={watermarkPosition}
                onChange={(e) => setWatermarkPosition(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              >
                <option value="bottom-right">Canto Inferior Direito (Padrão)</option>
                <option value="bottom-left">Canto Inferior Esquerdo</option>
                <option value="center">Centro da Imagem</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dados da Igreja */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Church className="w-5 h-5 text-blue-600" />
            <span>Identificação da Igreja</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nome da Igreja</label>
              <input
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subtítulo / Denominação</label>
              <input
                type="text"
                value={churchSubtitle}
                onChange={(e) => setChurchSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Endereço Completo</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Canais e Redes Sociais */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Phone className="w-5 h-5 text-blue-600" />
            <span>Contatos & Redes Sociais</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Número do WhatsApp (com DDI e DDD)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="5562999999999"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Telefone Fixo / Secretaria</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(62) 3200-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Usuário do Instagram</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@adbarravento"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Canal do YouTube</label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="ADBarraventoOficial"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              Configurações salvas com sucesso!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>SALVAR CONFIGURAÇÕES</span>
          </button>
        </div>

      </form>
    </div>
  );
};
