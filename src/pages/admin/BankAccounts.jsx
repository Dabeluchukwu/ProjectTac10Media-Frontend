import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getBankAccounts, 
  createBankAccount, 
  updateBankAccount, 
  deleteBankAccount,
  toggleBankAccountStatus 
} from "../../api/paymentApi";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const BankAccounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["bank-accounts"],
    queryFn: getBankAccounts,
  });

  // ✅ accounts is the array directly (from updated API)
  const accountList = accounts || [];

  const createMutation = useMutation({
    mutationFn: createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["bank-accounts"]);
      toast.success("Bank account created successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create bank account");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBankAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["bank-accounts"]);
      toast.success("Bank account updated successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update bank account");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["bank-accounts"]);
      toast.success("Bank account deleted");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete bank account");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleBankAccountStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["bank-accounts"]);
      toast.success("Account status updated");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        bankName: account.bankName,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
      });
    } else {
      setEditingAccount(null);
      setFormData({ bankName: "", accountName: "", accountNumber: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({ bankName: "", accountName: "", accountNumber: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage bank accounts for manual payments
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {accountList.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-xl text-center border border-neutral-800">
          <div className="text-6xl mb-4">🏦</div>
          <p className="text-gray-400 text-lg">No bank accounts added yet</p>
          <button
            onClick={() => openModal()}
            className="mt-4 bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Add Bank Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountList.map((account) => (
            <div
              key={account._id}
              className={`bg-neutral-900 rounded-xl border p-6 ${
                account.isActive ? "border-neutral-800" : "border-red-500/20 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{account.bankName}</h3>
                  <p className="text-gray-400 text-sm">{account.accountName}</p>
                  <p className="text-amber-400 font-mono text-lg mt-1">{account.accountNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleMutation.mutate(account._id)}
                    className={`p-2 rounded-lg transition ${
                      account.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    } hover:bg-opacity-30`}
                    title={account.isActive ? "Deactivate" : "Activate"}
                  >
                    {account.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openModal(account)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${account.bankName} account?`)) {
                        deleteMutation.mutate(account._id);
                      }
                    }}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  account.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {account.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingAccount ? "Edit Bank Account" : "Add Bank Account"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., GTBank"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g., 0123456789"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                  >
                    {editingAccount ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-neutral-800 text-gray-400 py-2 rounded-lg font-semibold hover:bg-neutral-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccounts;