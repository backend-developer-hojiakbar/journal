import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosConfig';
import Modal from './components/Modal';
import { Plus, Edit, Trash2, X } from 'lucide-react';

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
      { language: 'uz', title: '', abstract: '' } as Translation,
      { language: 'ru', title: '', abstract: '' } as Translation,
      { language: 'en', title: '', abstract: '' } as Translation
    ],
    author_ids: [] as number[],
    keyword_ids: [] as number[],
    references: ''
  };
  const [formData, setFormData] = useState<any>(initialFormData);
  const [newAuthor, setNewAuthor] = useState({ first_name: '', last_name: '', organization: '', position: '' });
  const [newKeyword, setNewKeyword] = useState('');
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false);
  const [showNewKeywordForm, setShowNewKeywordForm] = useState(false);

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
      const existingTranslations = item.translations?.length ? item.translations : [];
      const fullTranslations = [
        existingTranslations.find((t:any) => t.language === 'uz') || {language:'uz',title:'',abstract:''},
        existingTranslations.find((t:any) => t.language === 'ru') || {language:'ru',title:'',abstract:''},
        existingTranslations.find((t:any) => t.language === 'en') || {language:'en',title:'',abstract:''}
      ];
      setFormData({
        issue: item.issue,
        pages: item.pages,
        doi: item.doi || '',
        article_file: null,
        translations: fullTranslations,
        author_ids: item.authors?.map((a:any)=>a.id) || [],
        keyword_ids: item.keywords?.map((k:any)=>k.id) || [],
        references: item.references || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setStep(1);
    setIsModalOpen(true);
    setShowNewAuthorForm(false);
    setShowNewKeywordForm(false);
    setNewAuthor({ first_name: '', last_name: '', organization: '', position: '' });
    setNewKeyword('');
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

  const addNewAuthor = async () => {
    if (!newAuthor.first_name || !newAuthor.last_name) {
      alert('Ism va familiya kiritilishi shart!');
      return;
    }
    try {
      const response = await apiClient.post('/authors/', newAuthor);
      const createdAuthor = response.data;
      setAuthors(prev => [...prev, createdAuthor]);
      setFormData((p:any) => ({
        ...p,
        author_ids: [...p.author_ids, createdAuthor.id]
      }));
      setNewAuthor({ first_name: '', last_name: '', organization: '', position: '' });
      setShowNewAuthorForm(false);
      // Success feedback
      const successMsg = `✅ Muallif "${createdAuthor.last_name} ${createdAuthor.first_name}" muvaffaqiyatli qo'shildi va avtomatik tanlandi!`;
      alert(successMsg);
    } catch (error) {
      console.error('Error creating author:', error);
      alert('❌ Muallif qo\'shishda xatolik yuz berdi!');
    }
  };

  const addNewKeyword = async () => {
    if (!newKeyword.trim()) {
      alert('Kalit so\'z kiritilishi shart!');
      return;
    }
    try {
      const response = await apiClient.post('/keywords/', { name: newKeyword.trim() });
      const createdKeyword = response.data;
      setKeywords(prev => [...prev, createdKeyword]);
      setFormData((p:any) => ({
        ...p,
        keyword_ids: [...p.keyword_ids, createdKeyword.id]
      }));
      setNewKeyword('');
      setShowNewKeywordForm(false);
      // Success feedback
      const successMsg = `✅ Kalit so'z "${createdKeyword.name}" muvaffaqiyatli qo'shildi va avtomatik tanlandi!`;
      alert(successMsg);
    } catch (error) {
      console.error('Error creating keyword:', error);
      alert('❌ Kalit so\'z qo\'shishda xatolik yuz berdi!');
    }
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
              <h3 className="text-lg font-semibold">Sarlavhalar (3 tilda)</h3>
              {formData.translations.map((tr:Translation, idx:number)=>(
                <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
                  <div className="flex gap-3 items-center">
                    <span className="font-medium text-sm px-2 py-1 bg-blue-100 rounded">
                      {tr.language === 'uz' ? "O'zbek" : tr.language === 'ru' ? 'Rus' : 'Ingliz'}
                    </span>
                  </div>
                  <input value={tr.title} onChange={(e)=>handleTranslationChange(idx,'title',e.target.value)} placeholder={`Maqola sarlavhasi (${tr.language === 'uz' ? "O'zbek" : tr.language === 'ru' ? 'Rus' : 'Ingliz'})`} required className="w-full border rounded px-3 py-2"/>
                </div>
              ))}
            </div>
          )}

          {step===3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold">Annotatsiyalar, Mualliflar va Kalit so'zlar (3 tilda)</h3>
              
              {/* Annotations for all 3 languages */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Annotatsiyalar:</h4>
                {formData.translations.map((tr:Translation, idx:number)=>(
                  <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
                    <label className="font-medium text-sm text-blue-600">
                      {tr.language === 'uz' ? "O'zbek tili" : tr.language === 'ru' ? 'Rus tili' : 'Ingliz tili'}
                    </label>
                    <textarea value={tr.abstract} onChange={(e)=>handleTranslationChange(idx,'abstract',e.target.value)} rows={4} required className="w-full border rounded px-3 py-2" placeholder={`Annotatsiya (${tr.language === 'uz' ? "O'zbek" : tr.language === 'ru' ? 'Rus' : 'Ingliz'})`}/>
                  </div>
                ))}
              </div>

              {/* Authors Section with Add Button */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Mualliflar ({formData.author_ids.length} tanlangan):</h4>
                  <button type="button" onClick={() => setShowNewAuthorForm(!showNewAuthorForm)} className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    <Plus size={16} className="mr-1" /> Yangi muallif qo'shish
                  </button>
                </div>
                
                {/* Selected Authors Display */}
                {formData.author_ids.length > 0 && (
                  <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800 mb-2 font-medium">Tanlangan mualliflar:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.author_ids.map((id: number) => {
                        const author = authors.find(a => a.id === id);
                        return author ? (
                          <span key={id} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {author.last_name} {author.first_name}
                            <button type="button" onClick={() => toggleAuthor(id)} className="ml-1 text-green-600 hover:text-green-800">
                              <X size={14} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                {/* New Author Form */}
                {showNewAuthorForm && (
                  <div className="mb-4 p-4 border-2 border-green-300 rounded bg-green-50">
                    <h5 className="font-medium text-green-800 mb-3">Yangi muallif qo'shish:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ism *</label>
                        <input type="text" placeholder="Muallifning ismi" value={newAuthor.first_name} onChange={(e) => setNewAuthor({...newAuthor, first_name: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Familiya *</label>
                        <input type="text" placeholder="Muallifning familiyasi" value={newAuthor.last_name} onChange={(e) => setNewAuthor({...newAuthor, last_name: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tashkilot</label>
                        <input type="text" placeholder="Ish joyi" value={newAuthor.organization} onChange={(e) => setNewAuthor({...newAuthor, organization: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lavozim</label>
                        <input type="text" placeholder="Lavozimi" value={newAuthor.position} onChange={(e) => setNewAuthor({...newAuthor, position: e.target.value})} className="w-full border rounded px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={addNewAuthor} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        <Plus size={16} className="inline mr-1" /> Muallif qo'shish
                      </button>
                      <button type="button" onClick={() => setShowNewAuthorForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Authors Selection */}
                <div className="border rounded bg-white">
                  <div className="p-2 bg-gray-50 border-b">
                    <p className="text-sm font-medium text-gray-700">Mavjud mualliflardan tanlang:</p>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3">
                    {authors.length > 0 ? (
                      authors.map((a:any)=>(
                        <label key={a.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          formData.author_ids.includes(a.id) 
                            ? 'bg-green-100 border-green-300 border' 
                            : 'hover:bg-gray-100 border border-gray-200'
                        }`}>
                          <input type="checkbox" checked={formData.author_ids.includes(a.id)} onChange={()=>toggleAuthor(a.id)} className="text-green-600" />
                          <div className="text-sm">
                            <div className="font-medium">{a.last_name} {a.first_name}</div>
                            {a.organization && <div className="text-gray-500 text-xs">{a.organization}</div>}
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-4 text-gray-500">
                        <p className="text-sm">Hozircha mualliflar yo'q.</p>
                        <p className="text-xs mt-1">Yuqoridagi "Yangi muallif qo'shish" tugmasini bosing.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Keywords Section with Add Button */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Kalit so'zlar ({formData.keyword_ids.length} tanlangan):</h4>
                  <button type="button" onClick={() => setShowNewKeywordForm(!showNewKeywordForm)} className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    <Plus size={16} className="mr-1" /> Yangi kalit so'z qo'shish
                  </button>
                </div>
                
                {/* Selected Keywords Display */}
                {formData.keyword_ids.length > 0 && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800 mb-2 font-medium">Tanlangan kalit so'zlar:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.keyword_ids.map((id: number) => {
                        const keyword = keywords.find(k => k.id === id);
                        return keyword ? (
                          <span key={id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {keyword.name}
                            <button type="button" onClick={() => toggleKeyword(id)} className="ml-1 text-blue-600 hover:text-blue-800">
                              <X size={14} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                
                {/* New Keyword Form */}
                {showNewKeywordForm && (
                  <div className="mb-4 p-4 border-2 border-blue-300 rounded bg-blue-50">
                    <h5 className="font-medium text-blue-800 mb-3">Yangi kalit so'z qo'shish:</h5>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Kalit so'z nomi *</label>
                        <input 
                          type="text" 
                          placeholder="Yangi kalit so'z kiriting" 
                          value={newKeyword} 
                          onChange={(e) => setNewKeyword(e.target.value)} 
                          className="w-full border rounded px-3 py-2 text-sm" 
                          onKeyPress={(e) => e.key === 'Enter' && addNewKeyword()}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={addNewKeyword} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        <Plus size={16} className="inline mr-1" /> Kalit so'z qo'shish
                      </button>
                      <button type="button" onClick={() => setShowNewKeywordForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Keywords Selection */}
                <div className="border rounded bg-white">
                  <div className="p-2 bg-gray-50 border-b">
                    <p className="text-sm font-medium text-gray-700">Mavjud kalit so'zlardan tanlang:</p>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 max-h-40 overflow-y-auto">
                    {keywords.length > 0 ? (
                      keywords.map((k:any)=>(
                        <button 
                          type="button" 
                          key={k.id} 
                          onClick={()=>toggleKeyword(k.id)}
                          className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                            formData.keyword_ids.includes(k.id)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          {k.name}
                        </button>
                      ))
                    ) : (
                      <div className="w-full text-center py-4 text-gray-500">
                        <p className="text-sm">Hozircha kalit so'zlar yo'q.</p>
                        <p className="text-xs mt-1">Yuqoridagi "Yangi kalit so'z qo'shish" tugmasini bosing.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step===4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold">Qo'shimcha ma'lumotlar</h3>
              
              {/* Selected Authors Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">Tanlangan mualliflar ({formData.author_ids.length}):</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50 min-h-[40px]">
                  {formData.author_ids.length > 0 ? (
                    formData.author_ids.map((id: number) => {
                      const author = authors.find(a => a.id === id);
                      return author ? (
                        <span key={id} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {author.last_name} {author.first_name}
                          <button type="button" onClick={() => toggleAuthor(id)} className="ml-1 text-green-600 hover:text-green-800">
                            <X size={14} />
                          </button>
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-gray-500 text-sm">Hech qanday muallif tanlanmagan</span>
                  )}
                </div>
              </div>
              
              {/* Selected Keywords Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">Tanlangan kalit so'zlar ({formData.keyword_ids.length}):</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50 min-h-[40px]">
                  {formData.keyword_ids.length > 0 ? (
                    formData.keyword_ids.map((id: number) => {
                      const keyword = keywords.find(k => k.id === id);
                      return keyword ? (
                        <span key={id} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {keyword.name}
                          <button type="button" onClick={() => toggleKeyword(id)} className="ml-1 text-blue-600 hover:text-blue-800">
                            <X size={14} />
                          </button>
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-gray-500 text-sm">Hech qanday kalit so'z tanlanmagan</span>
                  )}
                </div>
              </div>
              
              {/* References */}
              <div>
                <label className="block text-sm font-medium mb-1">Foydalanilgan adabiyotlar</label>
                <textarea name="references" value={formData.references} onChange={handleBasicChange} rows={8} className="w-full border rounded px-3 py-2" placeholder="Adabiyotlar ro'yxatini kiriting..."/>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <button type="button" disabled={step===1} onClick={()=>setStep(step-1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors">Oldingi</button>
            <div className="text-sm text-gray-500">
              Bosqich {step} / 4
            </div>
            {step<4 ? (
              <button type="button" onClick={()=>setStep(step+1)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Keyingi</button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center">
                <Plus size={16} className="mr-1" />
                Saqlash
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageArticles;