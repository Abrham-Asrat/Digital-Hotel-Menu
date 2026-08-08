export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  calories: number;
  dietary: ("vegetarian" | "vegan" | "gluten-free" | "spicy" | "chef-special" | "halal")[];
  ingredients: string[];
  allergens: string[];
  options?: {
    name: string;
    choices: { label: string; extraPrice?: number }[];
  }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Items", icon: "Utensils", description: "Browse our entire culinary collection" },
  { id: "chef-special", name: "Chef's Specials", icon: "Sparkles", description: "Curated signature dishes by Executive Chef Marco Rossi" },
  { id: "starters", name: "Starters & Salads", icon: "Salad", description: "Light, appetizing bites to begin your culinary journey" },
  { id: "mains", name: "Mains & Grills", icon: "Beef", description: "Artisanal cuts, fresh seafood, and crafted main courses" },
  { id: "pizza-pasta", name: "Pasta & Pizza", icon: "Pizza", description: "Handcrafted pasta & wood-fired artisanal pizzas" },
  { id: "breakfast", name: "Breakfast & Brunch", icon: "Coffee", description: "Served daily from 6:30 AM to 11:30 AM" },
  { id: "desserts", name: "Desserts", icon: "Cake", description: "Decadent sweet endings crafted by our master pastry chef" },
  { id: "drinks", name: "Wines & Cocktails", icon: "GlassWater", description: "Sommelier wine pairings & bespoke craft cocktails" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "truffle-risotto",
    name: "Wild Mushroom & Truffle Risotto",
    category: "chef-special",
    description: "Creamy Carnaroli arborio rice, shaved black truffles, porcini mushrooms, 24-month aged Parmigiano Reggiano.",
    longDescription: "Our signature dish prepared with slow-simmered Carnaroli rice, infused with fragrant black truffle butter, pan-seared wild porcini mushrooms, and finished with fresh shaved Umbrian black truffles and micro herbs.",
    price: 32,
    image: "/images/truffle_risotto.png",
    rating: 4.9,
    reviewsCount: 142,
    prepTimeMinutes: 20,
    calories: 580,
    dietary: ["chef-special", "vegetarian", "gluten-free"],
    ingredients: ["Carnaroli Rice", "Umbrian Black Truffles", "Porcini Mushrooms", "Parmigiano Reggiano", "White Wine", "Shallots", "Truffle Butter"],
    allergens: ["Dairy", "Sulfites"],
    options: [
      {
        name: "Truffle Intensity",
        choices: [
          { label: "Standard Black Truffle" },
          { label: "Extra Shaved Truffle (+ $8)", extraPrice: 8 },
        ],
      },
      {
        name: "Cheese Preference",
        choices: [
          { label: "Classic Parmigiano" },
          { label: "Light Cheese" },
          { label: "Lactose-Free Aged Cheese" },
        ],
      },
    ],
  },
  {
    id: "wagyu-ribeye",
    name: "A5 Japanese Wagyu Ribeye",
    category: "mains",
    description: "6oz seared A5 Wagyu beef, smoked sea salt, roasted garlic clove, micro rosemary, red wine jus reduction.",
    longDescription: "Prized A5 Miyazaki Wagyu ribeye, masterfully seared over white oak charcoal. Unmatched marbling delivers a velvety, melt-in-your-mouth texture paired with rich bone marrow demi-glace.",
    price: 88,
    image: "/images/wagyu_steak.png",
    rating: 4.98,
    reviewsCount: 98,
    prepTimeMinutes: 25,
    calories: 740,
    dietary: ["chef-special", "gluten-free", "halal"],
    ingredients: ["A5 Miyazaki Wagyu Beef", "Smoked Maldon Sea Salt", "Fresh Rosemary", "Roasted Elephant Garlic", "Pinot Noir Reduction"],
    allergens: ["Sulfites"],
    options: [
      {
        name: "Doneness",
        choices: [
          { label: "Rare (Recommended)" },
          { label: "Medium Rare" },
          { label: "Medium" },
        ],
      },
      {
        name: "Side Selection",
        choices: [
          { label: "Truffle Mashed Potatoes" },
          { label: "Grilled Asparagus (+ $4)", extraPrice: 4 },
          { label: "Wild Mushroom Saute (+ $6)", extraPrice: 6 },
        ],
      },
    ],
  },
  {
    id: "lobster-pasta",
    name: "Butter-Poached Lobster Fettuccine",
    category: "pizza-pasta",
    description: "Handcrafted squid ink pasta, Maine lobster tail, saffron lobster cream, heirloom cherry tomatoes.",
    longDescription: "Freshly handmade squid-ink fettuccine tossed in a velvet saffron cream sauce, featuring generous chunks of butter-poached Maine lobster tail, blistered sweet tomatoes, and fresh garden basil.",
    price: 42,
    image: "/images/lobster_pasta.png",
    rating: 4.85,
    reviewsCount: 116,
    prepTimeMinutes: 22,
    calories: 690,
    dietary: ["chef-special"],
    ingredients: ["Maine Lobster", "Squid Ink Pasta", "Spanish Saffron", "Heavy Cream", "Heirloom Tomatoes", "Basil", "Garlic"],
    allergens: ["Crustacean", "Gluten", "Dairy", "Mollusks"],
    options: [
      {
        name: "Spice Level",
        choices: [
          { label: "Mild Saffron Cream" },
          { label: "Touch of Calabrian Chili" },
        ],
      },
    ],
  },
  {
    id: "burrata-salad",
    name: "Artisanal Burrata & Heirloom Salad",
    category: "starters",
    description: "Pugliese burrata, organic heirloom tomatoes, basil oil, aged Modena balsamic glaze, toasted pine nuts.",
    longDescription: "Creamy fresh Italian burrata paired with colorful organic heirloom tomatoes, hand-picked basil leaves, extra virgin olive oil, crisp pine nuts, and a 12-year barrel-aged Modena balsamic reduction.",
    price: 24,
    image: "/images/burrata_salad.png",
    rating: 4.78,
    reviewsCount: 84,
    prepTimeMinutes: 12,
    calories: 420,
    dietary: ["vegetarian", "gluten-free"],
    ingredients: ["Fresh Burrata", "Organic Heirloom Tomatoes", "Fresh Basil", "Extra Virgin Olive Oil", "Modena Balsamic Glaze", "Toasted Pine Nuts"],
    allergens: ["Dairy", "Tree Nuts"],
    options: [
      {
        name: "Add Bread",
        choices: [
          { label: "No Bread" },
          { label: "Warm Garlic Focaccia (+ $4)", extraPrice: 4 },
        ],
      },
    ],
  },
  {
    id: "gold-chocolate-souffle",
    name: "24K Gold Chocolate Lava Soufflé",
    category: "desserts",
    description: "Valrhona 70% dark chocolate molten center, edible 24K gold leaf, organic raspberry coulis, Tahitian vanilla gelato.",
    longDescription: "An indulgent warm chocolate soufflé with a rich flowing center of pure Valrhona dark chocolate. Crowned with genuine 24K edible gold leaf and paired with tart raspberry coulis and hand-churned vanilla bean ice cream.",
    price: 18,
    image: "/images/chocolate_dessert.png",
    rating: 4.95,
    reviewsCount: 167,
    prepTimeMinutes: 15,
    calories: 520,
    dietary: ["vegetarian"],
    ingredients: ["Valrhona 70% Dark Chocolate", "Fresh Eggs", "Butter", "Organic Raspberries", "Tahitian Vanilla Beans", "24K Edible Gold Leaf"],
    allergens: ["Dairy", "Eggs", "Gluten"],
    options: [
      {
        name: "Ice Cream Flavor",
        choices: [
          { label: "Tahitian Vanilla Bean" },
          { label: "Pistachio Gelato (+ $2)", extraPrice: 2 },
          { label: "Salted Caramel Gelato" },
        ],
      },
    ],
  },
  {
    id: "smoked-old-fashioned",
    name: "Royal Smoked Old Fashioned",
    category: "drinks",
    description: "Woodford Reserve Bourbon, smoked rosemary sprig, Angostura bitters, hand-carved crystal ice sphere, orange oils.",
    longDescription: "Our signature cocktail presented under a glass cloche infused with fragrant rosemary applewood smoke. Crafted with single-barrel bourbon, house aromatic bitters, and cold-pressed Valencia orange oils.",
    price: 22,
    image: "/images/craft_cocktail.png",
    rating: 4.92,
    reviewsCount: 210,
    prepTimeMinutes: 8,
    calories: 190,
    dietary: ["vegan", "gluten-free"],
    ingredients: ["Woodford Reserve Bourbon", "Angostura & Orange Bitters", "Raw Sugar Cane", "Smoked Rosemary", "Orange Peel"],
    allergens: [],
  },
  {
    id: "truffle-avocado-toast",
    name: "Truffle Avocado & Poached Egg Toast",
    category: "breakfast",
    description: "Artisan sourdough, smashed Hass avocado, poached organic eggs, micro radish, black truffle oil.",
    longDescription: "Fresh toasted sourdough loaded with citrus-marinated avocado, two perfectly soft-poached pasture-raised eggs, pink sea salt flakes, micro radishes, and a drizzle of white truffle oil.",
    price: 21,
    image: "/images/burrata_salad.png",
    rating: 4.82,
    reviewsCount: 75,
    prepTimeMinutes: 14,
    calories: 460,
    dietary: ["vegetarian"],
    ingredients: ["Sourdough Bread", "Hass Avocado", "Organic Eggs", "Micro Radish", "White Truffle Oil", "Lemon"],
    allergens: ["Gluten", "Eggs"],
    options: [
      {
        name: "Add Protein",
        choices: [
          { label: "None" },
          { label: "Smoked Salmon (+ $6)", extraPrice: 6 },
          { label: "Crispy Bacon (+ $4)", extraPrice: 4 },
        ],
      },
    ],
  },
  {
    id: "tartufo-pizza",
    name: "Wood-Fired Pizza Tartufo e Funghi",
    category: "pizza-pasta",
    description: "Slow-fermented sourdough crust, truffle cream, fior di latte, roasted mushrooms, fresh thyme.",
    longDescription: "Baked at 850°F in our stone wood-fire oven. Made with 72-hour fermented Neapolitan dough topped with velvet black truffle cream, fresh fior di latte mozzarella, and wild thyme.",
    price: 28,
    image: "/images/truffle_risotto.png",
    rating: 4.88,
    reviewsCount: 130,
    prepTimeMinutes: 18,
    calories: 820,
    dietary: ["vegetarian"],
    ingredients: ["Neapolitan Dough", "Black Truffle Cream", "Fior di Latte Mozzarella", "Chanterelle & Oyster Mushrooms", "Thyme"],
    allergens: ["Gluten", "Dairy"],
  },
];

export const UNIVERSAL_MENU_INFO = {
  venueName: "Linen & Lace | Grand Hotel Dining",
  qrCodeToken: "ALL-TABLES-UNIVERSAL-MENU",
  qrUrl: "https://linen-lace.menu",
  tagline: "One Universal QR Code for All Tables",
};
