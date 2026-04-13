import React, { useState, useEffect } from 'react';
import { adminAPI, songsAPI } from '../../services/api';

const ManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', artist: '', genre: '', url: '', coverUrl: '', lyrics: ''
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await songsAPI.getAll(); // get all songs doesn't require admin role directly, anyone can fetch, but we manage it here
      setSongs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (song = null) => {
    if (song) {
      setEditId(song._id);
      setFormData({
        title: song.title,
        artist: song.artist,
        genre: song.genre || '',
        url: song.url,
        coverUrl: song.coverUrl,
        lyrics: song.lyrics || ''
      });
    } else {
      setEditId(null);
      setFormData({
        title: '', artist: '', genre: '', url: '', coverUrl: '', lyrics: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminAPI.updateSong(editId, formData);
      } else {
        await adminAPI.createSong(formData);
      }
      handleCloseModal();
      await fetchSongs();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài hát "${title}" không?`)) {
      try {
        await adminAPI.deleteSong(id);
        await fetchSongs();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-3xl font-bold">🎵 Quản lý Bài hát</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105"
        >
          + Thêm Bài Hát Mới
        </button>
      </div>
      
      {loading ? (
        <p className="text-[#b3b3b3]">Đang tải dữ liệu...</p>
      ) : (
        <div className="bg-[#282828] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3E3E3E] text-[#b3b3b3]">
                <th className="p-4">Bìa</th>
                <th className="p-4">Tiêu đề - Ca sĩ</th>
                <th className="p-4">Thể loại</th>
                <th className="p-4">Lượt nghe</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(s => (
                <tr key={s._id} className="border-b border-[#3E3E3E] hover:bg-[#333333] transition-colors">
                  <td className="p-4">
                    <img src={s.coverUrl || 'https://via.placeholder.com/40'} alt={s.title} className="w-10 h-10 rounded object-cover" />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{s.title}</p>
                    <p className="text-sm text-[#b3b3b3]">{s.artist}</p>
                  </td>
                  <td className="p-4 text-[#b3b3b3]">{s.genre || '-'}</td>
                  <td className="p-4 text-[#b3b3b3]">{s.plays || 0}</td>
                  <td className="p-4 flex gap-2 justify-center h-full items-center mt-2">
                    <button 
                      onClick={() => handleOpenModal(s)}
                      className="px-3 py-1.5 text-sm rounded bg-[#333] hover:bg-[#444] font-semibold text-white transition-colors border border-gray-600"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(s._id, s.title)}
                      className="px-3 py-1.5 text-sm rounded bg-red-600/80 hover:bg-red-500 font-semibold text-white transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#282828] w-full max-w-xl p-6 rounded-xl border border-[#3E3E3E]">
            <h3 className="text-xl font-bold mb-4">{editId ? 'Sửa bài hát' : 'Thêm bài hát mới'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#b3b3b3] mb-1">Tên bài hát *</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm text-[#b3b3b3] mb-1">Ca sĩ *</label>
                  <input required value={formData.artist} onChange={e=>setFormData({...formData, artist: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#b3b3b3] mb-1">Thể loại</label>
                <input value={formData.genre} onChange={e=>setFormData({...formData, genre: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm text-[#b3b3b3] mb-1">Audio URL (Liên kết MP3) *</label>
                <input required value={formData.url} onChange={e=>setFormData({...formData, url: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" placeholder="https://example.com/song.mp3" />
              </div>
              <div>
                <label className="block text-sm text-[#b3b3b3] mb-1">Image URL (Hình ảnh Album)</label>
                <input required value={formData.coverUrl} onChange={e=>setFormData({...formData, coverUrl: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm text-[#b3b3b3] mb-1">Lời bài hát</label>
                <textarea rows="4" value={formData.lyrics} onChange={e=>setFormData({...formData, lyrics: e.target.value})} className="w-full bg-[#3E3E3E] px-3 py-2 rounded text-white outline-none focus:ring-1 focus:ring-green-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 font-semibold text-white hover:text-gray-300">Hủy</button>
                <button type="submit" className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-6 py-2 rounded-full transform transition-all hover:scale-105">Lưu bài hát</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSongs;
