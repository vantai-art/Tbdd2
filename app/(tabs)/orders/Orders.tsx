import { Calendar, CheckCircle, ChevronRight, Clock, MapPin, Package, Phone, Truck, User } from 'lucide-react-native';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
    customerName: string;
    phone: string;
    address: string;
    createdAt: string;
}

interface OrdersProps {
    orders: Order[];
}

export default function Orders({ orders = [] }: OrdersProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return {
                    icon: Clock,
                    text: 'Chờ xác nhận',
                    color: 'bg-amber-500',
                    bgLight: 'bg-amber-50',
                    textColor: 'text-amber-700',
                    progress: 25
                };
            case 'preparing':
                return {
                    icon: Package,
                    text: 'Đang chuẩn bị',
                    color: 'bg-blue-500',
                    bgLight: 'bg-blue-50',
                    textColor: 'text-blue-700',
                    progress: 50
                };
            case 'ready':
                return {
                    icon: Truck,
                    text: 'Đang giao hàng',
                    color: 'bg-purple-500',
                    bgLight: 'bg-purple-50',
                    textColor: 'text-purple-700',
                    progress: 75
                };
            case 'delivered':
                return {
                    icon: CheckCircle,
                    text: 'Đã giao hàng',
                    color: 'bg-green-500',
                    bgLight: 'bg-green-50',
                    textColor: 'text-green-700',
                    progress: 100
                };
        }
    };

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Chưa có đơn hàng
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Các đơn hàng của bạn sẽ hiển thị ở đây
                        </p>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                            Đặt hàng ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-6 pb-24 px-4">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-2">Đơn hàng của bạn</h1>
                    <p className="text-orange-100">Theo dõi trạng thái đơn hàng</p>
                </div>
            </div>

            {/* Orders List */}
            <div className="max-w-2xl mx-auto px-4 -mt-16 pb-8">
                <div className="space-y-4">
                    {orders.map(order => {
                        const statusInfo = getStatusInfo(order.status);
                        const StatusIcon = statusInfo.icon;
                        const orderDate = new Date(order.createdAt);

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {orderDate.toLocaleDateString('vi-VN')} • {orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className={`${statusInfo.bgLight} ${statusInfo.textColor} px-4 py-2 rounded-full flex items-center gap-2 font-medium`}>
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="text-sm">{statusInfo.text}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${statusInfo.color} transition-all duration-500 rounded-full`}
                                                style={{ width: `${statusInfo.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 bg-gray-50">
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Package className="w-6 h-6 text-orange-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            SL: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="font-semibold text-gray-900 ml-4">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-medium">Tổng cộng</span>
                                            <span className="text-xl font-bold text-gray-900">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="p-4 space-y-3">
                                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h4>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Người nhận</p>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                            <p className="font-medium text-gray-900">{order.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                                            <p className="font-medium text-gray-900">{order.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Message */}
                                {order.status === 'preparing' && (
                                    <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-blue-900">Đang chuẩn bị đơn hàng</p>
                                                <p className="text-sm text-blue-700">Dự kiến giao trong 30 phút</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'ready' && (
                                    <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                                                <Truck className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-purple-900">Đang giao hàng</p>
                                                <p className="text-sm text-purple-700">Shipper đang trên đường đến bạn!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {order.status === 'delivered' && (
                                    <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-900">Đã giao hàng thành công</p>
                                                <p className="text-sm text-green-700">Cảm ơn bạn đã đặt hàng!</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <div className="p-4 pt-0">
                                    <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                        <span>Chi tiết đơn hàng</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}