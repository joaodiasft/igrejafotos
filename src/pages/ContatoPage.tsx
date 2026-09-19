import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Youtube, 
  Clock, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { SiteSettings } from '../types';

interface ContatoPageProps {
  settings: SiteSettings;
}

export const ContatoPage: React.FC<ContatoPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá AD Barravento!\n\nNome: ${name}\nTelefone: ${phone}\nMensagem: ${message}`;
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSent(true);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-heading">
            Atendimento & Comunhão
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Fale com a Igreja AD Barravento
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Tire suas dúvidas, solicite oração, saiba como chegar aos nossos cultos ou entre em contato com nossa equipe ministerial.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Cards */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Endereço da Igreja
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    WhatsApp Oficial
                  </h3>
                  <p className="text-sm text-slate-600">
                    +{settings.whatsapp}
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-bold text-emerald-600 hover:underline pt-1"
                  >
                    Conversar no WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Instagram className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Instagram Oficial
                  </h3>
                  <p className="text-sm text-slate-600">
                    {settings.instagram}
                  </p>
                  <a
                    href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs font-bold text-pink-600 hover:underline pt-1"
                  >
                    Seguir no Instagram →
                  </a>
                </div>
              </div>

            </div>

            {/* Cultos Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Horários de Culto</span>
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {(settings.cultSchedule || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/10 last:border-0">
                    <span className="text-slate-300">{item.day} - {item.title}</span>
                    <span className="font-mono text-blue-300 font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Envie uma Mensagem ou Pedido de Oração
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Sua mensagem será encaminhada diretamente para nossa equipe pastoral via WhatsApp.
                </p>
              </div>

              {sent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 space-y-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base">Mensagem Encaminhada!</h4>
                  <p className="text-xs text-emerald-700">
                    O WhatsApp foi aberto com o seu texto. Agradecemos o contato e responderemos em breve!
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setMessage('');
                    }}
                    className="mt-3 text-xs font-bold text-emerald-800 underline"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Seu Nome</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Lucas Silva"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(62) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Sua Mensagem ou Pedido</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escreva sua dúvida, pedido de oração ou solicitação..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR MENSAGEM VIA WHATSAPP</span>
                  </button>
                </form>
              )}
            </div>

            {/* Google Maps Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-white">
              <div className="p-4 bg-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Localização da Igreja no Mapa
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.churchName + ' ' + settings.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Abrir no Google Maps →
                </a>
              </div>
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.427774577884!2d-49.32415122424043!3d-16.655452844810763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef33a4666f435%3A0xb36ef8e8e3d09a25!2sGoi%C3%A2nia%2C%20GO!5e0!3m2!1spt-BR!2sbr!4v1710800000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
