'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  description?: string;
  isAvailable: boolean;
  isSpecial: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    nameUz: string;
    nameRu: string;
  };
}

interface Category {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  description?: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameUz: '',
    nameRu: '',
    price: '',
    discountedPrice: '',
    categoryId: '',
    description: '',
    image: '',
    isAvailable: true,
    isSpecial: false,
  });
  const [language, setLanguage] = useState<'uz' | 'ru'>('uz');
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/food-items'),
        fetch('/api/categories')
      ]);

      if (itemsRes.ok && categoriesRes.ok) {
        const itemsData = await itemsRes.json();
        const categoriesData = await categoriesRes.json();
        setFoodItems(itemsData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = () => {
    if (username === 'dendyuz' && password === 'parolyoq') {
      setIsLoggedIn(true);
      toast({
        title: language === 'uz' ? 'Muvaffaqiyatli kirish' : 'Успешный вход',
        description: language === 'uz' ? 'Admin panelga xush kelibsiz' : 'Добро пожаловать в админ панель',
      });
    } else {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Login yoki parol noto\'g\'ri' : 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingItem ? `/api/food-items/${editingItem.id}` : '/api/food-items';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: language === 'uz' ? 'Muvaffaqiyatli' : 'Успешно',
          description: language === 'uz' 
            ? (editingItem ? 'Mahsulot yangilandi' : 'Mahsulot qo\'shildi')
            : (editingItem ? 'Продукт обновлен' : 'Продукт добавлен'),
        });
        
        setIsAddItemOpen(false);
        setEditingItem(null);
        setFormData({
          name: '',
          nameUz: '',
          nameRu: '',
          price: '',
          categoryId: '',
          description: '',
          image: '',
          isAvailable: true,
          isSpecial: false,
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Saqlashda xatolik yuz berdi' : 'Ошибка при сохранении',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameUz: item.nameUz,
      nameRu: item.nameRu,
      price: item.price.toString(),
      discountedPrice: item.discountedPrice?.toString() || '',
      categoryId: item.categoryId,
      description: item.description || '',
      image: item.image || '',
      isAvailable: item.isAvailable,
      isSpecial: item.isSpecial,
    });
    setIsAddItemOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === 'uz' ? 'Rostdan ham o\'chirmoqchimisiz?' : 'Вы действительно хотите удалить?')) {
      return;
    }

    try {
      const response = await fetch(`/api/food-items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: language === 'uz' ? 'O\'chirildi' : 'Удалено',
          description: language === 'uz' ? 'Mahsulot muvaffaqiyatli o\'chirildi' : 'Продукт успешно удален',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'O\'chirishda xatolik yuz berdi' : 'Ошибка при удалении',
        variant: 'destructive',
      });
    }
  };

  const getText = (uz: string, ru: string) => language === 'uz' ? uz : ru;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-orange-600">DendyFood Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('uz')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'uz' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'ru' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                RU
              </button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">{getText('Foydalanuvchi nomi', 'Имя пользователя')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={getText('Foydalanuvchi nomi', 'Имя пользователя')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{getText('Parol', 'Пароль')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={getText('Parol', 'Пароль')}
              />
            </div>
            
            <Button onClick={handleLogin} className="w-full bg-orange-600 hover:bg-orange-700">
              {getText('Kirish', 'Войти')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">DendyFood Admin</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('uz')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'uz' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  UZ
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'ru' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  RU
                </button>
              </div>
              
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                {getText('Chiqish', 'Выход')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{getText('Mahsulotlar', 'Продукты')}</h2>
          
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                {getText('Mahsulot qo\'shish', 'Добавить продукт')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? getText('Mahsulotni tahrirlash', 'Редактировать продукт') : getText('Yangi mahsulot', 'Новый продукт')}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{getText('Nomi (Inglizcha)', 'Название (Английский)')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameUz">{getText('Nomi (O\'zbekcha)', 'Название (Узбекский)')}</Label>
                  <Input
                    id="nameUz"
                    value={formData.nameUz}
                    onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameRu">{getText('Nomi (Ruscha)', 'Название (Русский)')}</Label>
                  <Input
                    id="nameRu"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">{getText('Narxi', 'Цена')}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                
                {formData.isSpecial && (
                  <div className="space-y-2">
                    <Label htmlFor="discountedPrice">{getText('Chegirma narxi', 'Цена со скидкой')}</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      placeholder={getText('Chegirma narxini kiriting (ixtiyoriy)', 'Введите цену со скидкой (необязательно)')}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="category">{getText('Kategoriya', 'Категория')}</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={getText('Kategoriyani tanlang', 'Выберите категорию')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameUz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{getText('Tavsif', 'Описание')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">{getText('Rasm URL', 'URL изображения')}</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                    />
                    <Label htmlFor="isAvailable">{getText('Mavjud', 'Доступен')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isSpecial"
                      checked={formData.isSpecial}
                      onCheckedChange={(checked) => setFormData({ ...formData, isSpecial: checked })}
                    />
                    <Label htmlFor="isSpecial">{getText('Aksiya', 'Акция')}</Label>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    {editingItem ? getText('Yangilash', 'Обновить') : getText('Qo\'shish', 'Добавить')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddItemOpen(false);
                      setEditingItem(null);
                      setFormData({
                        name: '',
                        nameUz: '',
                        nameRu: '',
                        price: '',
                        categoryId: '',
                        description: '',
                        image: '',
                        isAvailable: true,
                        isSpecial: false,
                      });
                    }}
                  >
                    {getText('Bekor qilish', 'Отмена')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.nameUz}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                    <span className="text-4xl">🍔</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.isSpecial && (
                    <Badge className="bg-red-500">
                      {getText('Aksiya', 'Акция')}
                    </Badge>
                  )}
                  {!item.isAvailable && (
                    <Badge variant="destructive">
                      {getText('Mavjud emas', 'Нет в наличии')}
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.nameUz}</h3>
                    <p className="text-sm text-gray-500">{item.nameRu}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-orange-600">{item.price.toLocaleString()} so'm</span>
                    <Badge variant="outline">{item.category.nameUz}</Badge>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {getText('Tahrirlash', 'Редактировать')}
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}