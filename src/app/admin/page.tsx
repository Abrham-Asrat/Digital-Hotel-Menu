import { prisma } from '@/lib/prisma';
import { toggleAvailability } from '../actions';

export default async function AdminDashboard() {
  // Fetch the first hotel in the database (for MVP simplicity)
  const hotel = await prisma.hotel.findFirst({
    include: {
      categories: {
        include: { items: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!hotel) return <div className="p-10 text-center">No hotel found. Run the seed script!</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage menu for {hotel.name}</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {hotel.categories.map((category) => (
          <div key={category.id} className="p-6 border-b border-gray-200 last:border-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{category.name}</h2>
            
            <div className="space-y-3">
              {category.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.isAvailable ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-semibold ${!item.isAvailable && 'line-through text-gray-500'}`}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)} • {item.prepTimeMins} mins</p>
                  </div>

                  {/* The Toggle Form */}
                  <form action={toggleAvailability.bind(null, item.id, item.isAvailable)}>
                    <button 
                      type="submit"
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}