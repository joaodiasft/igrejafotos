import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Calendar, Clock, MapPin, X } from 'lucide-react';
import { ChurchEvent } from '../../types';
import { DatabaseService } from '../../services/db';

interface AdminEventsTabProps {
  events: ChurchEvent[];
  onRefresh: () => void;
}

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({ events, onRefresh }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('Templo Sede');
  const [category, setCategory] = useState('Cultos');
  const [description, setDescription] = useState('');
  const [dayNumber, setDayNumber] = useState('20');
  const [dayOfWeek, setDayOfWeek] = useState('DOM');
  const [month, setMonth] = useState('SET');
  const [featured, setFeatured] = useState(false);

  const openCreate = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('19:30');
    setLocation('Templo Sede');
    setCategory('Cultos');
    setDescription('');
    setDayNumber('20');
    setDayOfWeek('DOM');
    setMonth('SET');
    setFeatured(false);
  };

  const openEdit = (e: ChurchEvent) => {
    setEditingEvent(e);
    setIsCreating(false);
    setTitle(e.title);
    setDate(e.date);
    setTime(e.time);
    setLocation(e.location);
    setCategory(e.category);
    setDescription(e.description);
    setDayNumber(e.dayNumber);
    setDayOfWeek(e.dayOfWeek);
    setMonth(e.month);
    setFeatured(!!e.featured);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      DatabaseService.createEvent({
        title,
        date,
        time,
        location,
        category,
        description,
        dayNumber,
        dayOfWeek,
        month,
        featured
      });
    } else if (editingEvent) {
      DatabaseService.updateEvent(editingEvent.id, {
        title,
        date,
        time,
        location,
        category,
        description,
        dayNumber,
        dayOfWeek,
        month,
        featured
      });
    }
    setIsCreating(false);
    setEditingEvent(null);
    onRefresh();
  };

  const handleDelete = (id: string, eventTitle: string) => {
    if (window.confirm(`Excluir evento "${eventTitle}"?`)) {
      DatabaseService.deleteEvent(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Gerenciador da Agenda de Eventos & Cultos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cadastre celebrações, congressos, vigílias e cultos de ensino.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NOVO EVENTO</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-blue-200">{ev.month}</span>
                <span className="text-lg font-black leading-none">{ev.dayNumber}</span>
                <span className="text-[8px] tracking-wider uppercase text-blue-100">{ev.dayOfWeek}</span>
              </div>

              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                  {ev.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{ev.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{ev.time}</span> • <span>{ev.location}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => openEdit(ev)}
                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Editar"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(ev.id, ev.title)}
                className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {(isCreating || editingEvent) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isCreating ? 'Novo Evento na Agenda' : 'Editar Evento'}
              </h3>
              <button onClick={() => { setIsCreating(false); setEditingEvent(null); }}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dia (Número)</label>
                  <input
                    type="text"
                    required
                    value={dayNumber}
                    onChange={(e) => setDayNumber(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dia Semana</label>
                  <input
                    type="text"
                    required
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    placeholder="DOM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mês</label>
                  <input
                    type="text"
                    required
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="SET"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data Completa</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horário</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="19:30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Local</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ev-featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <label htmlFor="ev-featured" className="font-semibold text-slate-700">
                  Destacar evento na página inicial
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingEvent(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
