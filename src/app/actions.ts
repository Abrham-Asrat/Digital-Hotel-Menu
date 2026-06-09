'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// This function runs securely on the server
export async function toggleAvailability(itemId: string, currentStatus: boolean) {
  await prisma.menuItem.update({
    where: { id: itemId },
    data: { isAvailable: !currentStatus }, // Flips the boolean
  });

  // MAGIC: This instantly clears the Next.js cache for these pages.
  // The Admin dashboard updates, AND the Guest menu updates instantly!
  revalidatePath('/admin');
  revalidatePath('/m/[hotelSlug]'); 
}