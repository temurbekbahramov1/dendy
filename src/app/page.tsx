'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, ShoppingCart, Phone, X, Settings, LogIn, XCircle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { sendTelegramMessage, formatOrderMessage } from '@/lib/telegram';

interface FoodItem {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  isSpecial: boolean;
  isAvailable: boolean;
  category: {
    name: string;
    nameUz: string;
    nameRu: string;
  };
}

interface CartItem {
  id: string;
  itemId: string;
  item: FoodItem;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
}

export default function Home() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [language, setLanguage] = useState<'uz' | 'ru'>('uz');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const { toast } = useToast();

  // Fetch food items and categories
  useEffect(() => {
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

    fetchData();
  }, []);

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? foodItems 
    : foodItems.filter(item => item.category.id === selectedCategory);

  // Add item to cart
  const addToCart = (item: FoodItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.itemId === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.itemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, {
        id: Date.now().toString(),
        itemId: item.id,
        item,
        quantity: 1
      }];
    });

    toast({
      title: language === 'uz' ? 'Qo\'shildi' : 'Добавлено',
      description: language === 'uz' ? `${item.nameUz} savatchaga qo\'shildi` : `${item.nameRu} добавлен в корзину`,
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.itemId !== itemId));
  };

  // Update quantity
  const updateQuantity = (itemId: string, change: number) => {
    setCart(prevCart => {
      const item = prevCart.find(cartItem => cartItem.itemId === itemId);
      if (!item) return prevCart;

      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        return prevCart.filter(cartItem => cartItem.itemId !== itemId);
      }

      return prevCart.map(cartItem =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
    });
  };

  // Calculate total
  const total = cart.reduce((sum, item) => {
    const price = item.item.discountedPrice || item.item.price;
    return sum + (price * item.quantity);
  }, 0);

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) return;

    // Validate phone number
    if (!customerPhone.trim()) {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Iltimos, telefon raqamingizni kiriting' : 'Пожалуйста, введите ваш номер телефона',
        variant: 'destructive',
      });
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.item.discountedPrice || item.item.price,
          item: {
            nameUz: item.item.nameUz,
            nameRu: item.item.nameRu
          }
        })),
        totalPrice: total,
        paymentMethod: paymentMethod.toUpperCase(),
        customerPhone: customerPhone.trim()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Send Telegram notification
        const telegramMessage = formatOrderMessage(orderData);
        const telegramSent = await sendTelegramMessage(telegramMessage);
        
        if (telegramSent) {
          console.log('Telegram notification sent successfully');
        } else {
          console.log('Failed to send Telegram notification, but order was placed successfully');
        }

        setIsOrderConfirmationOpen(true);
        setCart([]);
        setIsCheckoutOpen(false);
        setCustomerPhone('');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Buyurtma berishda xatolik yuz berdi' : 'Произошла ошибка при оформлении заказа',
        variant: 'destructive',
      });
    }
  };

  // Make phone call
  const makePhoneCall = () => {
    window.open('tel:+998884591819', '_self');
  };

  // Handle admin login
  const handleAdminLogin = () => {
    if (adminUsername === 'dendyuz' && adminPassword === 'parolyoq') {
      // Redirect to admin panel
      window.open('/admin', '_self');
      setIsAdminLoginOpen(false);
      setAdminUsername('');
      setAdminPassword('');
    } else {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' ? 'Login yoki parol noto\'g\'ri' : 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  const getText = (uz: string, ru: string) => language === 'uz' ? uz : ru;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">DendyFood</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
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

              {/* Admin Login */}
              <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    {getText('Admin', 'Админ')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{getText('Admin Kirish', 'Вход в админ панель')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">{getText('Foydalanuvchi nomi', 'Имя пользователя')}</Label>
                      <Input
                        id="admin-username"
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder={getText('Login', 'Логин')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">{getText('Parol', 'Пароль')}</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder={getText('Parol', 'Пароль')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleAdminLogin} className="w-full bg-orange-600 hover:bg-orange-700">
                        <LogIn className="h-4 w-4 mr-2" />
                        {getText('Kirish', 'Войти')}
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsAdminLoginOpen(false);
                            setAdminUsername('');
                            setAdminPassword('');
                          }}
                          className="flex-1"
                        >
                          {getText('Bekor qilish', 'Отмена')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => {
                            setIsAdminLoginOpen(false);
                            setAdminUsername('');
                            setAdminPassword('');
                          }}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {getText('Chiqish', 'Выход')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Cart */}
              <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>{getText('Savatcha', 'Корзина')}</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-500">{getText('Savatcha bo\'sh', 'Корзина пуста')}</p>
                    ) : (
                      <>
                        {cart.map((cartItem) => (
                          <div key={cartItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{cartItem.item.nameUz}</h4>
                              <div className="flex items-center gap-2">
                                {cartItem.item.discountedPrice ? (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">
                                      {cartItem.item.price.toLocaleString()} so'm
                                    </span>
                                    <span className="text-sm font-medium text-red-600">
                                      {cartItem.item.discountedPrice.toLocaleString()} so'm
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500">
                                    {cartItem.item.price.toLocaleString()} so'm
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(cartItem.itemId, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{cartItem.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(cartItem.itemId, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(cartItem.itemId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{getText('Jami', 'Итого')}:</span>
                            <span className="text-xl font-bold text-orange-600">{total.toLocaleString()} so'm</span>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>{getText('To\'lov usuli', 'Способ оплаты')}</Label>
                            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card')}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash">{getText('Naqd pul', 'Наличные')}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card">{getText('Karta orqali', 'Картой')}</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">{getText('Telefon raqamingiz', 'Ваш номер телефона')}</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="+998 xx xxx xx xx"
                              className="text-center"
                            />
                          </div>
                          
                          {paymentMethod === 'card' && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">{getText('Karta raqamiga pul tashlang', 'Переведите деньги на номер карты')}</p>
                              <p className="font-mono text-lg">9860 3501 4506 8143</p>
                              <p className="text-sm text-gray-600">Otabek Narimanov</p>
                            </div>
                          )}
                          
                          <Button 
                            onClick={placeOrder}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            {getText('Buyurtma berish', 'Оформить заказ')}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {getText('Barchasi', 'Все')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.nameUz}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                {item.isSpecial && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {getText('Aksiya', 'Акция')}
                  </Badge>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">{getText('Mavjud emas', 'Нет в наличии')}</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.nameUz}</h3>
                    <p className="text-sm text-gray-500">{item.nameRu}</p>
                  </div>
                  <div className="text-right">
                    {item.discountedPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 line-through">
                          {item.price.toLocaleString()} so'm
                        </span>
                        <span className="text-xl font-bold text-red-600">
                          {item.discountedPrice.toLocaleString()} so'm
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-orange-600">
                        {item.price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => addToCart(item)}
                  disabled={!item.isAvailable}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {getText('Qo\'shish', 'Добавить')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Phone Call Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={makePhoneCall}
            size="lg"
            className="bg-green-600 hover:bg-green-700 rounded-full p-4 shadow-lg"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </main>

      {/* Order Confirmation Dialog */}
      <Dialog open={isOrderConfirmationOpen} onOpenChange={setIsOrderConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getText('Rahmat!', 'Спасибо!')}
              </h3>
              <p className="text-gray-600">
                {getText('Buyurtmangiz 30-35 daqiqa ichida yetkazib beriladi', 'Ваш заказ будет доставлен в течение 30-35 минут')}
              </p>
            </div>
            <Button 
              onClick={() => setIsOrderConfirmationOpen(false)}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {getText('Bajarildi', 'Готово')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}