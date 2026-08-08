import { prisma } from '@/lib/prisma';
import { toggleAvailability } from '../actions';

export default async function AdminDashboard() {
  const hotel = await prisma.hotel.findFirst({
    include: {
      categories: { include: { items: true }, orderBy: { displayOrder: 'asc' } },
    },
  });

  if (!hotel) return <div className="p-10 text-center">No hotel found.</div>;

  return (
    <main className="min-h-screen bg-background p-6 font-sans">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="font-serif text-4xl text-charcoal">{hotel.name}</h1>
        <p className="text-charcoal/60 mt-2 tracking-wide uppercase text-sm">Kitchen Control Panel</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-linen overflow-hidden">
        {hotel.categories.map((category) => (
          <div key={category.id} className="p-8 border-b border-linen last:border-0">
            <h2 className="font-serif text-2xl text-sage mb-6 tracking-wide">{category.name}</h2>
            
            <div className="space-y-4">
              {category.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                    item.isAvailable ? 'bg-background border-linen' : 'bg-amber/5 border-amber/20'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className={`font-serif text-xl text-charcoal ${!item.isAvailable && 'line-through text-charcoal/40'}`}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-charcoal/60 mt-1 font-sans">
                      ${Number(item.price).toFixed(2)} • {item.prepTimeMins} mins prep
                    </p>
                  </div>

                  <form action={toggleAvailability.bind(null, item.id, item.isAvailable)}>
                    <button 
                      type="submit"
                      className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                        item.isAvailable 
                          ? 'bg-sage/10 border-sage text-sage hover:bg-sage hover:text-white' 
                          : 'bg-amber/10 border-amber text-amber hover:bg-amber hover:text-white'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : '86 Item'}
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