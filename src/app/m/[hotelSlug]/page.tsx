import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// This is a Server Component. It runs on the server, fetches data, and sends pure HTML to the phone.
export default async function GuestMenu({ params }: { params: Promise<{ hotelSlug: string }> }) {
  // In Next.js 15, params is a Promise. We await it to get the slug.
  const { hotelSlug } = await params;

  // 1. Fetch the hotel and its menu directly from the database
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      categories: {
        orderBy: { displayOrder: 'asc' },
        include: {
          items: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
    },
  });

  // If the hotel doesn't exist, show a 404 page
  if (!hotel) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm p-6 text-center sticky top-0 z-10">
        {hotel.logoUrl && (
          <Image 
            src={hotel.logoUrl} 
            alt={hotel.name} 
            width={60} 
            height={60} 
            className="mx-auto rounded-full mb-2 object-cover" 
          />
        )}
        <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome! Scan complete.</p>
      </header>

      {/* Menu Categories */}
      <div className="p-4 space-y-8 max-w-2xl mx-auto">
        {hotel.categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-amber-500 pb-2">
              {category.name}
            </h2>
            
            <div className="space-y-4">
              {category.items.map((item) => {
                const isSoldOut = !item.isAvailable;
                
                return (
                  <div 
                    key={item.id} 
                    className={`flex gap-4 bg-white p-4 rounded-xl shadow-sm border transition-all ${
                      isSoldOut ? 'opacity-60 border-gray-200' : 'border-transparent hover:shadow-md'
                    }`}
                  >
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                        <span className="font-bold text-amber-600 text-lg ml-2 whitespace-nowrap">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                      
                      <div className="mt-auto pt-2 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          ⏱️ {item.prepTimeMins} mins
                        </span>
                        {item.dietaryTags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}