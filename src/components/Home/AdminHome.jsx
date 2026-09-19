import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Items from "../../utills/Items";
import Spin from "../../utills/Spin";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // number of rows per page

  const fetchData = async () => {
    try {
      const response = await axios.get("https://qalib.cloud/api/users");
      setUsers(response.data.users || []); // use response.data.users
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`https://qalib.cloud/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); // update UI
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mt-10 mb-3">
        <Items name={`Users (${users.length})`} />
      </div>

      <table className="min-w-full border border-gray-300 table-fixed">
        <thead className="bg-sky-300 text-gray-800 font-normal">
          <tr>
            {["Name", "Email", "Gender", "Age", "Residence", "Education", "Delete"].map(
              (header, index) => (
                <th key={index} className="px-4 py-2 text-center w-24">
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700 text-sm">
          {loading ? (
            <tr>
              <td colSpan="7">
                <div className="flex items-center justify-center min-h-[350px]">
                  <Spin />
                </div>
              </td>
            </tr>
          ) : currentItems.length > 0 ? (
            currentItems.map((user, index) => (
              <tr
                key={index}
                className="bg-white hover:bg-gray-50 text-sm cursor-pointer transition"
              >
                <td className="px-2 py-1 text-start">{user.name}</td>
                <td className="px-2 py-1 text-start">{user.email}</td>
                <td className="px-2 py-1 text-center">{user.demographics?.gender || "-"}</td>
                <td className="px-2 py-1 text-center">{user.demographics?.age || "-"}</td>
                <td className="px-2 py-1 text-center">
                  {user.demographics?.place_of_residence || "-"}
                </td>
                <td className="px-2 py-1 text-center">
                  {user.demographics?.education_level || "-"}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-50 hover:bg-gray-100 text-red-500 px-4 py-2 rounded text-sm transition"
                  >
                    <Trash size={15} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination flex justify-end space-x-2 p-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border shadow rounded-lg ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
          }`}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 border rounded-lg transition-colors ${
              currentPage === index + 1 ? "bg-red-500 text-white" : "hover:bg-blue-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border shadow rounded-lg ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
