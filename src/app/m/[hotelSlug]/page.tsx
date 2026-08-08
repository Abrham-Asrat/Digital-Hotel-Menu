import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function GuestMenu({ params }: { params: Promise<{ hotelSlug: string }> }) {
  const { hotelSlug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        orderBy: { displayOrder: 'asc' },
        include: { items: { orderBy: { displayOrder: 'asc' } } },
      },
    },
  });

  if (!hotel) return notFound();

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Elegant Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-linen p-8 text-center sticky top-0 z-10">
        <h1 className="font-serif text-4xl text-charcoal mb-1">{hotel.name}</h1>
        <div className="w-16 h-1 bg-amber mx-auto rounded-full"></div>
        <p className="text-sm text-charcoal/60 mt-3 font-sans tracking-wide uppercase">Digital Menu</p>
      </header>

      {/* Menu Content */}
      <div className="p-6 space-y-12 max-w-2xl mx-auto">
        {hotel.categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-linen"></div>
              <h2 className="font-serif text-2xl text-sage tracking-wide">
                {category.name}
              </h2>
              <div className="flex-1 h-px bg-linen"></div>
            </div>
            
            <div className="space-y-8">
              {category.items.map((item) => {
                const isSoldOut = !item.isAvailable;
                
                return (
                  <article 
                    key={item.id} 
                    className={`flex gap-6 transition-all ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
                  >
                    {/* Smart Image with fallback */}
                    <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-linen shadow-sm">
                      {item.imageUrl ? (
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber/20 to-sage/20 flex items-center justify-center">
                          <span className="font-serif text-3xl text-charcoal/40">{item.name.charAt(0)}</span>
                        </div>
                      )}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
                          <span className="text-background text-xs font-bold uppercase tracking-widest">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="font-serif text-xl text-charcoal leading-tight">
                          {item.name}
                        </h3>
                        <span className="font-serif text-lg text-amber font-semibold whitespace-nowrap">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-charcoal/70 mt-2 leading-relaxed font-sans">
                        {item.description}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-sage/80 flex items-center gap-1 font-sans">
                          ⏱️ {item.prepTimeMins} min
                        </span>
                        {item.dietaryTags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[10px] uppercase tracking-wider border border-sage/30 text-sage px-2 py-0.5 rounded-full font-sans"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}