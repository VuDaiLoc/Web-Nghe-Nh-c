import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      if (currentRole === 'admin' && currentUser._id === id) {
        if (!window.confirm("CẢNH BÁO: Bạn đang tự hạ quyền của chính mình. Sau khi hạ quyền, bạn sẽ TRỞ LẠI GIAO DIỆN NGHE NHẠC và mất quyền Admin. Tiếp tục?")) {
          return;
        }
      }
      await adminAPI.updateUserRole(id, newRole);
      
      // Rerender list or redirect if self
      if (currentUser._id === id) {
        window.location.href = '/';
      } else {
        await fetchUsers();
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) {
      alert("Bạn không thể xóa chính tài khoản Admin đang đăng nhập!");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này vĩnh viễn khỏi hệ thống không?")) {
      try {
        await adminAPI.deleteUser(id);
        await fetchUsers();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">👥 Quản lý Người dùng</h2>
      
      {loading ? (
        <p className="text-[#b3b3b3]">Đang tải dữ liệu...</p>
      ) : (
        <div className="bg-[#282828] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3E3E3E] text-[#b3b3b3]">
                <th className="p-4">Avatar</th>
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Facebook ID</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-[#3E3E3E] hover:bg-[#333333] transition-colors">
                  <td className="p-4">
                    <img src={u.avatar || 'https://via.placeholder.com/40'} alt={u.name} className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="p-4 font-medium">{u.name} {u._id === currentUser._id && <span className="text-xs ml-2 text-green-500">(Bạn)</span>}</td>
                  <td className="p-4 text-[#b3b3b3]">{u.email || 'N/A'}</td>
                  <td className="p-4 text-[#b3b3b3]">{u.facebookId}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button 
                      onClick={() => handleRoleChange(u._id, u.role)}
                      className="px-3 py-1.5 text-sm rounded bg-[#1DB954] hover:bg-[#1ed760] font-semibold text-black transition-colors"
                    >
                      {u.role === 'admin' ? 'Hạ quyền' : 'Cấp Admin'}
                    </button>
                    <button 
                      onClick={() => handleDelete(u._id)}
                      className="px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-500 font-semibold text-white transition-colors"
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
    </div>
  );
}

export default ManageUsers;
