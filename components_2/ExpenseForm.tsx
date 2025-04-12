import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, Check, DollarSign, Tag, FileText, Calendar } from 'lucide-react';

interface FormState {
  amount: string;
  category: string;
  description: string;
  date: string;
}

interface FormError {
  field: keyof FormState;
  message: string;
}

const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Other'
];

export default function ExpenseForm() {
  const [formState, setFormState] = useState<FormState>({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<FormError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): FormError[] => {
    const newErrors: FormError[] = [];

    if (!formState.amount || isNaN(Number(formState.amount)) || Number(formState.amount) <= 0) {
      newErrors.push({ field: 'amount', message: 'Please enter a valid amount greater than 0' });
    }

    if (!formState.category) {
      newErrors.push({ field: 'category', message: 'Please select a category' });
    }

    if (!formState.date) {
      newErrors.push({ field: 'date', message: 'Please select a date' });
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setErrors(errors.filter(error => error.field !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('expenses').insert([
        {
          user_id: user.id,
          amount: Number(formState.amount),
          category: formState.category,
          description: formState.description.trim() || null,
          date: formState.date
        }
      ]);

      if (error) throw error;

      setSuccessMessage('Expense added successfully!');
      setFormState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      setErrors([{ field: 'amount', message: 'Failed to add expense. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: keyof FormState) => 
    errors.find(error => error.field === fieldName)?.message;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Expense</h2>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                value={formState.amount}
                onChange={handleInputChange}
                className={`pl-10 w-full rounded-lg border ${
                  getFieldError('amount') ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="0.00"
              />
            </div>
            {getFieldError('amount') && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('amount')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                className={`pl-10 w-full rounded-lg border ${
                  getFieldError('category') ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              >
                <option value="">Select a category</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {getFieldError('category') && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('category')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add a description"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleInputChange}
                className={`pl-10 w-full rounded-lg border ${
                  getFieldError('date') ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>
            {getFieldError('date') && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('date')}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            } transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding Expense...
              </span>
            ) : (
              'Add Expense'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}