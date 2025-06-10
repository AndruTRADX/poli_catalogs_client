import { useParams, useNavigate } from 'react-router';
import { useForm } from '../../lib/hooks/useForm';
import { useArticles } from '../../lib/hooks/useArticles';
import { ArticleForm as ArticleFormSchema } from '../../lib/types/ArticleForm';

export default function ArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isPendingArticle, createArticle, updateArticle } = useArticles(id);
  const form = useForm(ArticleFormSchema);

  const isEditing = !!id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.validate()) {
      try {
        if (isEditing) {
          await updateArticle.mutateAsync({ id: id!, data: form.values });
        } else {
          await createArticle.mutateAsync(form.values);
        }
        navigate('/articles');
      } catch (error) {
        console.error('Error al guardar el artículo:', error);
      }
    }
  };

  if (isEditing && isPendingArticle) {
    return <div className="text-center">Cargando artículo...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={form.values.name || ''}
            onChange={(e) => form.handleChange('name', e.target.value)}
            onBlur={() => form.handleBlur('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.name && form.errors.name && (
            <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            value={form.values.category || ''}
            onChange={(e) => form.handleChange('category', e.target.value)}
            onBlur={() => form.handleBlur('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.category && form.errors.category && (
            <p className="mt-1 text-sm text-red-600">{form.errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            value={form.values.description || ''}
            onChange={(e) => form.handleChange('description', e.target.value)}
            onBlur={() => form.handleBlur('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.description && form.errors.description && (
            <p className="mt-1 text-sm text-red-600">{form.errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio
          </label>
          <input
            type="number"
            id="price"
            value={form.values.price || ''}
            onChange={(e) => form.handleChange('price', parseFloat(e.target.value))}
            onBlur={() => form.handleBlur('price')}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.price && form.errors.price && (
            <p className="mt-1 text-sm text-red-600">{form.errors.price}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={form.values.stock || ''}
            onChange={(e) => form.handleChange('stock', parseInt(e.target.value))}
            onBlur={() => form.handleBlur('stock')}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {form.touched.stock && form.errors.stock && (
            <p className="mt-1 text-sm text-red-600">{form.errors.stock}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createArticle.isPending || updateArticle.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {createArticle.isPending || updateArticle.isPending
              ? 'Guardando...'
              : isEditing
              ? 'Actualizar'
              : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
} 