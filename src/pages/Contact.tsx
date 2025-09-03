import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const res = await apiClient.post('/contact/', formData);
      const msgId = res.data.id;

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const fd = new FormData();
          fd.append('file', files[i]);
          await apiClient.post(`/contact/${msgId}/upload-file/`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      setStatus({ loading: false, error: '', success: "Xabaringiz yuborildi!" });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFiles(null);
    } catch (err: any) {
      setStatus({ loading: false, error: err?.response?.data?.detail || "Xatolik yuz berdi.", success: '' });
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Bog‘lanish</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Xabar yuborish</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ismingiz</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-md border border-gray-300"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-md border border-gray-300"/>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Mavzu</label>
                <input type="text" id="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 rounded-md border border-gray-300"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Xabar</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 rounded-md border border-gray-300"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fayl (pdf/doc/docx, ixtiyoriy)</label>
                <input type="file" multiple accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
              </div>
              {status.success && <p className="text-green-600">{status.success}</p>}
              {status.error && <p className="text-red-600">{status.error}</p>}
              <button type="submit" disabled={status.loading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {status.loading ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </form>
          </div>
          {/* o'ng panel o‘sha holicha */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Bog‘lanish ma’lumotlari</h2>
              <div className="space-y-5">
                <div className="flex items-start"><MapPin className="h-6 w-6 text-green-600 mr-4 mt-1"/><div><h3 className="font-semibold text-lg">Manzil</h3><p className="text-gray-600">100004, Toshkent sh., Shayxontohur t., А.Navoiy k., 44-uy.</p></div></div>
                <div className="flex items-start"><Mail className="h-6 w-6 text-green-600 mr-4 mt-1"/><div><h3 className="font-semibold text-lg">E-mail</h3><p className="text-gray-600">qxjurnal@mail.ru</p></div></div>
                <div className="flex items-start"><Phone className="h-6 w-6 text-green-600 mr-4 mt-1"/><div><h3 className="font-semibold text-lg">Telefon</h3><p className="text-gray-600">+998 71 242-13-54</p><p className="text-gray-600">+998 90 946-22-42</p><p className="text-gray-600">+998 93 500-54-99</p></div></div>
                <div className="flex items-start"><Clock className="h-6 w-6 text-green-600 mr-4 mt-1"/><div><h3 className="font-semibold text-lg">Ish vaqti</h3><p className="text-gray-600">Dushanba - Juma: 9:00 - 18:00</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;