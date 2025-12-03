import { Clock, Flame, Plus, Search, Star, X } from 'lucide-react-native';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'food' | 'drink' | 'dessert';
    popular?: boolean;
}

interface MenuProps {
    onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'drink' | 'dessert'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const products: Product[] = [
        {
            id: '1',
            name: 'Phở Bò',
            description: 'Phở bò truyền thống với nước dùng đậm đà, thịt bò mềm',
            price: 55000,
            image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?w=400',
            category: 'food',
            popular: true,
        },
        {
            id: '2',
            name: 'Bánh Mì Thịt',
            description: 'Bánh mì giòn với thịt nguội và rau sống tươi ngon',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06?w=400',
            category: 'food',
            popular: true,
        },
        {
            id: '3',
            name: 'Gỏi Cuốn',
            description: 'Gỏi cuốn tươi với tôm và rau thơm, chấm tương',
            price: 35000,
            image: 'https://images.unsplash.com/photo-1656945843375-207bb6e47750?w=400',
            category: 'food',
        },
        {
            id: '4',
            name: 'Cơm Gà Xối Mỡ',
            description: 'Cơm gà thơm ngon với nước mắm gừng đặc biệt',
            price: 45000,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            category: 'food',
        },
        {
            id: '5',
            name: 'Trà Sữa Trân Châu',
            description: 'Trà sữa thơm ngon với trân châu đen dai ngon',
            price: 30000,
            image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
            category: 'drink',
            popular: true,
        },
        {
            id: '6',
            name: 'Cà Phê Sữa Đá',
            description: 'Cà phê phin truyền thống với sữa đá mát lạnh',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1471922597728-92f81bfe2445?w=400',
            category: 'drink',
        },
        {
            id: '7',
            name: 'Sinh Tố Bơ',
            description: 'Sinh tố bơ sánh mịn, bổ dưỡng, giàu dinh dưỡng',
            price: 35000,
            image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400',
            category: 'drink',
        },
        {
            id: '8',
            name: 'Nước Chanh Dây',
            description: 'Nước chanh dây tươi mát, giải nhiệt hiệu quả',
            price: 20000,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400',
            category: 'drink',
        },
        {
            id: '9',
            name: 'Kem Dừa',
            description: 'Kem dừa mát lạnh, thơm ngon, làm từ dừa tươi',
            price: 25000,
            image: 'https://images.unsplash.com/photo-1673551494246-0ea345ddbf86?w=400',
            category: 'dessert',
        },
        {
            id: '10',
            name: 'Bánh Flan',
            description: 'Bánh flan caramel mềm mịn, vị ngọt dịu',
            price: 20000,
            image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400',
            category: 'dessert',
        },
        {
            id: '11',
            name: 'Chè Thái',
            description: 'Chè thái với nhiều loại trái cây tươi ngon',
            price: 30000,
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
            category: 'dessert',
        },
        {
            id: '12',
            name: 'Bánh Bông Lan Trứng Muối',
            description: 'Bánh bông lan mềm với nhân trứng muối béo ngậy',
            price: 35000,
            image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400',
            category: 'dessert',
            popular: true,
        },
    ];

    const categories = [
        { id: 'all' as const, name: 'Tất cả', icon: '🍽️', count: products.length },
        { id: 'food' as const, name: 'Đồ ăn', icon: '🍜', count: products.filter(p => p.category === 'food').length },
        { id: 'drink' as const, name: 'Đồ uống', icon: '🧋', count: products.filter(p => p.category === 'drink').length },
        { id: 'dessert' as const, name: 'Tráng miệng', icon: '🍰', count: products.filter(p => p.category === 'dessert').length },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const popularProducts = products.filter(p => p.popular);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAddToCart = (product: Product) => {
        onAddToCart(product);
        // Show toast notification (optional)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-8 pb-6 px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">Thực đơn</h1>
                    <p className="text-orange-100">Chọn món yêu thích của bạn</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 -mt-4 pb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm món ăn, đồ uống..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label="Xóa tìm kiếm"
                            title="Xóa tìm kiếm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all font-medium ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                                }`}
                        >
                            <span className="text-xl">{category.icon}</span>
                            <span>{category.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id
                                    ? 'bg-white/20'
                                    : 'bg-gray-100'
                                }`}>
                                {category.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Popular Products Section */}
                {selectedCategory === 'all' && !searchQuery && popularProducts.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <h3 className="text-lg font-bold text-gray-900">Món phổ biến</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {popularProducts.slice(0, 2).map(product => (
                                <div
                                    key={product.id}
                                    className="flex gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200"
                                >
                                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                                        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                                            <span className="text-2xl">🍜</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-orange-500 font-bold">{formatPrice(product.price)}</span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-lg hover:shadow-md transition-all flex items-center gap-1"
                                                aria-label={`Thêm ${product.name} vào giỏ hàng`}
                                                title={`Thêm ${product.name} vào giỏ hàng`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span className="text-sm font-medium">Thêm</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div>
                    {searchQuery && (
                        <div className="mb-3 text-gray-600">
                            Tìm thấy <span className="font-semibold text-gray-900">{filteredProducts.length}</span> món
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="relative">
                                    {/* Product Image */}
                                    <div className="w-full h-36 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                        <span className="text-5xl">🍜</span>
                                    </div>

                                    {/* Popular Badge */}
                                    {product.popular && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                            <Flame className="w-3 h-3" />
                                            <span className="text-xs font-bold">Hot</span>
                                        </div>
                                    )}

                                    {/* Quick Add Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                        aria-label={`Thêm ${product.name} vào giỏ hàng`}
                                        title={`Thêm ${product.name} vào giỏ hàng`}
                                    >
                                        <Plus className="w-5 h-5 text-orange-500" />
                                    </button>
                                </div>

                                <div className="p-3">
                                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-orange-500 font-bold">{formatPrice(product.price)}</span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            <span>15-20p</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Không tìm thấy món nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thử tìm kiếm với từ khóa khác nhé!
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-medium"
                            >
                                Xem tất cả món
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Spacing */}
                <div className="h-20"></div>
            </div>

            {/* Product Detail Modal (Optional - for future) */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl p-6 w-full max-w-2xl">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                            aria-label="Đóng"
                            title="Đóng"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {/* Product detail content */}
                    </div>
                </div>
            )}
        </div>
    );
}