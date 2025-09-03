import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Translation = { language: 'uz'|'ru'|'en'; title: string; abstract: string; };

const ManageArticles = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [issues, setIssues] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);

  const [step, setStep] = useState<number>(1);
  const initialFormData = {
    issue: '',
    pages: '',
    doi: '',
    article_file: null as File | null,
    translations: [
      { language: 'uz', title: '', abstract: '' } as Translation
    ],
    author_ids: [] as number[],
    keyword_ids: [] as number[],
    references: ''
  };
  const [formData, setFormData] = useState<any>(initialFormData);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesRes, issuesRes, authorsRes, keywordsRes] = await Promise.all([
        apiClient.get('/articles/'),
        apiClient.get('/issues/'),
        apiClient.get('/authors/'),
        apiClient.get('/keywords/'),
      ]);
      setItems(articlesRes.data);
      setIssues(issuesRes.data);
      setAuthors(authorsRes.data);
      setKeywords(keywordsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (item: any = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        issue: item.issue,
        pages: item.pages,
        doi: item.doi || '',
        article_file: null,
        translations: item.translations?.length ? item.translations.map((t:any)=>({language:t.language, title:t.title, abstract:t.abstract})) : [{language:'uz',title:'',abstract:''}],
        author_ids: item.authors?.map((a:any)=>a.id) || [],
        keyword_ids: item.keywords?.map((k:any)=>k.id) || [],
        references: item.references || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setStep(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const f = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((p:any)=>({...p, [name]: f}));
    } else {
      setFormData((p:any)=>({...p, [name]: value}));
    }
  };

  const addTranslation = () => {
    setFormData((p:any)=>({
      ...p,
      translations: [...p.translations, {language:'ru', title:'', abstract:''}]
    }));
  };

  const removeTranslation = (idx:number) => {
    setFormData((p:any)=>({
      ...p,
      translations: p.translations.filter((_:any,i:number)=> i!==idx)
    }));
  };

  const handleTranslationChange = (idx:number, field:'language'|'title'|'abstract', value:string) => {
    setFormData((p:any)=>{
      const arr = [...p.translations];
      arr[idx] = {...arr[idx], [field]: value};
      return {...p, translations: arr};
    });
  };

  const toggleAuthor = (id:number) => {
    setFormData((p:any)=>{
      const set = new Set(p.author_ids);
      set.has(id) ? set.delete(id) : set.add(id);
      return {...p, author_ids: Array.from(set)};
    });
  };

  const toggleKeyword = (id:number) => {
    setFormData((p:any)=>{
      const set = new Set(p.keyword_ids);
      set.has(id) ? set.delete(id) : set.add(id);
      return {...p, keyword_ids: Array.from(set)};
    });
  };

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('issue', formData.issue);
    data.append('pages', formData.pages);
    data.append('doi', formData.doi || '');
    data.append('references', formData.references || '');
    if (formData.article_file) {
      data.append('article_file', formData.article_file);
    }
    
    formData.author_ids.forEach((id: number) => data.append('authors', String(id)));
    formData.keyword_ids.forEach((id: number) => data.append('keywords', String(id)));
    
    data.append('translations_payload', JSON.stringify(formData.translations));

    try {
      const config = { headers: {'Content-Type':'multipart/form-data'} };
      if (editingItem) {
        await apiClient.patch(`/articles/${editingItem.id}/`, data, config);
      } else {
        await apiClient.post('/articles/', data, config);
      }
      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Maqolani saqlashda xatolik yuz berdi!");
    }
  };

  const handleDelete = async (id:number) => {
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      try {
        await apiClient.delete(`/articles/${id}/`);
        setItems(items.filter(i=>i.id!==id));
      } catch {
        alert("Xatolik yuz berdi!");
      }
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maqolalarni Boshqarish</h1>
        <button onClick={()=>openModal()} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
          <Plus className="mr-2" size={18}/> Yangi maqola
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm">Sarlavha</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Nashr</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Sahifalar</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {items.map((item:any)=>(
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{item.translations?.[0]?.title || 'Nomsiz'}</td>
                <td className="py-3 px-4">{issues.find(i => i.id === item.issue)?.title || item.issue}</td>
                <td className="py-3 px-4">{item.pages}</td>
                <td className="py-3 px-4 space-x-2 text-right">
                  <button onClick={()=>openModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={18}/></button>
                  <button onClick={()=>handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? "Maqolani Tahrirlash" : "Yangi Maqola Qo'shish"}>
        <form onSubmit={submitArticle} className="space-y-6">
          <div className="flex gap-2 border-b pb-2">
            {[1,2,3,4].map(n=>(
              <button key={n} type="button" onClick={()=>setStep(n)}
                className={`px-3 py-1 rounded-md text-sm ${step===n?'bg-blue-600 text-white':'bg-gray-200 hover:bg-gray-300'}`}>Bosqich {n}</button>
            ))}
          </div>

          {step===1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold">Asosiy ma'lumotlar</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Nashr</label>
                <select name="issue" value={formData.issue} onChange={handleBasicChange} required className="w-full border rounded px-3 py-2 bg-white">
                  <option value="" disabled>Nashrni tanlang</option>
                  {issues.map((it:any)=>(
                    <option key={it.id} value={it.id}>{it.journal_name} - {it.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sahifalar</label>
                <input name="pages" value={formData.pages} onChange={handleBasicChange} required className="w-full border rounded px-3 py-2" placeholder="11-15" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DOI (ixtiyoriy)</label>
                <input name="doi" value={formData.doi} onChange={handleBasicChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maqola fayli (PDF)</label>
                <input type="file" name="article_file" accept="application/pdf" onChange={handleBasicChange}/>
              </div>
            </div>
          )}

          {step===2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sarlavhalar</h3>
                {formData.translations.length < 3 && <button type="button" onClick={addTranslation} className="px-3 py-1 bg-green-600 text-white rounded text-sm">+ Qo'shish</button>}
              </div>
              {formData.translations.map((tr:Translation, idx:number)=>(
                <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
                  <div className="flex gap-3 items-center">
                    <select value={tr.language} onChange={(e)=>handleTranslationChange(idx,'language',e.target.value)} className="border rounded px-2 py-1 bg-white">
                      <option value="uz">O'zbek</option>
                      <option value="ru">Rus</option>
                      <option value="en">Ingliz</option>
                    </select>
                    {formData.translations.length > 1 && (
                      <button type="button" onClick={()=>removeTranslation(idx)} className="text-red-600 hover:underline text-sm">O‘chirish</button>
                    )}
                  </div>
                  <input value={tr.title} onChange={(e)=>handleTranslationChange(idx,'title',e.target.value)} placeholder="Maqola sarlavhasi" required className="w-full border rounded px-3 py-2"/>
                </div>
              ))}
            </div>
          )}

          {step===3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold">Annotatsiyalar</h3>
              {formData.translations.map((tr:Translation, idx:number)=>(
                <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
                  <label className="font-medium text-sm text-gray-600">Til: {tr.language.toUpperCase()}</label>
                  <textarea value={tr.abstract} onChange={(e)=>handleTranslationChange(idx,'abstract',e.target.value)} rows={6} required className="w-full border rounded px-3 py-2" placeholder="Annotatsiya..."/>
                </div>
              ))}
            </div>
          )}

          {step===4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold mb-2">Mualliflar</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
                  {authors.map((a:any)=>(
                    <label key={a.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-100 cursor-pointer">
                      <input type="checkbox" checked={formData.author_ids.includes(a.id)} onChange={()=>toggleAuthor(a.id)} />
                      <span className="text-sm">{a.last_name} {a.first_name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Kalit so‘zlar</h3>
                <div className="flex flex-wrap gap-2 border p-2 rounded">
                  {keywords.map((k:any)=>(
                      <button type="button" key={k.id} onClick={()=>toggleKeyword(k.id)}
                        className={`px-2 py-1 rounded-full text-sm border ${formData.keyword_ids.includes(k.id)?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700'}`}>
                        {k.name}
                      </button>
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Foydalanilgan adabiyotlar</label>
                <textarea name="references" value={formData.references} onChange={handleBasicChange} rows={6} className="w-full border rounded px-3 py-2"/>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <button type="button" disabled={step===1} onClick={()=>setStep(step-1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Oldingi</button>
            {step<4 ? (
              <button type="button" onClick={()=>setStep(step+1)} className="px-4 py-2 bg-blue-600 text-white rounded">Keyingi</button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Saqlash</button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageArticles;