// ========== RECIPE DATABASE ==========
// Each recipe includes: name, category, emoji, servings, macros, ingredients, instructions, storage notes
// Nutritional data sourced from USDA FoodData Central and Cronometer-equivalent databases

const RECIPES_DB = [
    // ==================== BREAKFAST ====================
    {
        id: 'b1',
        name: 'Greek Yogurt Protein Bowl',
        category: 'breakfast',
        emoji: '🥣',
        servings: 1,
        calories: 420,
        protein: 40,
        carbs: 38,
        fat: 14,
        fiber: 5,
        ingredients: [
            '200g Greek yogurt (full fat)',
            '30g rolled oats',
            '1 scoop (30g) protein powder or 2 tbsp almond butter',
            '80g blackberries',
            '1 tbsp raw honey',
            '1 tbsp chia seeds',
            'Pinch of cinnamon'
        ],
        instructions: [
            'Add Greek yogurt to a bowl.',
            'Top with rolled oats and chia seeds.',
            'Add blackberries and drizzle with honey.',
            'Add almond butter or protein powder.',
            'Sprinkle with cinnamon and serve.'
        ],
        storage: 'Prep overnight: mix yogurt, oats, and chia in a jar. Refrigerate up to 3 days. Add fresh berries and honey before eating.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'b2',
        name: 'High-Protein Scrambled Eggs',
        category: 'breakfast',
        emoji: '🍳',
        servings: 1,
        calories: 450,
        protein: 38,
        carbs: 22,
        fat: 24,
        fiber: 4,
        ingredients: [
            '3 large eggs',
            '2 egg whites',
            '30g shredded mozzarella cheese',
            '1/2 avocado (50g)',
            '1 slice whole grain toast',
            '1 tsp clarified butter (ghee)',
            'Salt, black pepper',
            'Fresh chives for garnish'
        ],
        instructions: [
            'Whisk eggs and egg whites with a pinch of salt.',
            'Heat ghee in a non-stick pan over medium-low heat.',
            'Pour in eggs, gently stir with a spatula as they set.',
            'When nearly done, fold in mozzarella.',
            'Serve on toast with sliced avocado.',
            'Garnish with chives and pepper.'
        ],
        storage: 'Best eaten fresh. Scrambled eggs can be refrigerated 1-2 days; reheat gently in microwave 30s. Toast separately.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'b3',
        name: 'Arepa with Eggs & Cheese',
        category: 'breakfast',
        emoji: '🫓',
        servings: 1,
        calories: 480,
        protein: 32,
        carbs: 40,
        fat: 20,
        fiber: 3,
        ingredients: [
            '80g arepa flour (pre-cooked cornmeal)',
            '2 large eggs',
            '30g shredded mozzarella',
            '1/2 avocado (50g)',
            '1 tsp safflower oil',
            'Salt to taste',
            'Valentina hot sauce (optional)'
        ],
        instructions: [
            'Mix arepa flour with 120ml warm water and a pinch of salt. Knead into a smooth dough.',
            'Form into 2 patties about 1cm thick.',
            'Cook arepas in a lightly oiled skillet over medium heat, 4-5 min per side until golden.',
            'Meanwhile, fry or scramble eggs in safflower oil.',
            'Split arepas open, stuff with eggs, cheese, and avocado.',
            'Add hot sauce if desired.'
        ],
        storage: 'Cooked arepas keep 3 days in fridge or 1 month frozen. Reheat in toaster oven. Fill fresh when serving.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'b4',
        name: 'Protein Oat Pancakes',
        category: 'breakfast',
        emoji: '🥞',
        servings: 1,
        calories: 410,
        protein: 35,
        carbs: 42,
        fat: 12,
        fiber: 5,
        ingredients: [
            '50g rolled oats (blended into flour)',
            '1 large egg',
            '150g Greek yogurt',
            '1 banana (mashed)',
            '1/2 tsp baking powder',
            '1/2 tsp cinnamon',
            '1/2 tsp vanilla extract',
            '1 tbsp almond butter (topping)',
            '1 tsp raw honey (topping)'
        ],
        instructions: [
            'Blend oats into a flour in a blender.',
            'Mix oat flour, egg, Greek yogurt, mashed banana, baking powder, cinnamon, and vanilla.',
            'Heat a non-stick pan over medium heat with a tiny bit of coconut oil.',
            'Pour 1/4 cup batter per pancake. Cook 2-3 min per side.',
            'Top with almond butter and a drizzle of honey.'
        ],
        storage: 'Stack cooked pancakes with parchment between layers. Fridge 3 days, freezer 1 month. Reheat in toaster or microwave 45s.',
        source: 'USDA FoodData Central'
    },

    // ==================== LUNCH ====================
    {
        id: 'l1',
        name: 'Chicken & Lentil Power Bowl',
        category: 'lunch',
        emoji: '🍗',
        servings: 1,
        calories: 520,
        protein: 45,
        carbs: 48,
        fat: 14,
        fiber: 12,
        ingredients: [
            '150g chicken breast (grilled/baked)',
            '80g cooked lentils (dry weight ~35g)',
            '100g brown rice (cooked)',
            '1/2 avocado (50g)',
            '50g cherry tomatoes',
            '1 tbsp tahini',
            '1 tsp olive oil',
            'Juice of 1/2 lime',
            'Salt, pepper, garlic powder, cumin'
        ],
        instructions: [
            'Season chicken breast with garlic powder, cumin, salt, and pepper.',
            'Grill or bake at 200°C/400°F for 18-22 min until cooked through.',
            'Cook lentils according to package directions (about 20 min).',
            'Prepare brown rice.',
            'Slice chicken and arrange in a bowl with rice, lentils, avocado, and tomatoes.',
            'Drizzle with tahini mixed with lime juice and olive oil.'
        ],
        storage: 'Meal prep friendly! Store chicken, lentils, and rice separately for up to 4 days. Add avocado and dressing fresh. Reheat protein and grains 2 min in microwave.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'l2',
        name: 'Tuna & Chickpea Salad',
        category: 'lunch',
        emoji: '🥗',
        servings: 1,
        calories: 430,
        protein: 42,
        carbs: 30,
        fat: 16,
        fiber: 8,
        ingredients: [
            '1 can (140g drained) tuna in water',
            '100g cooked chickpeas',
            '1 tbsp Dijon mustard',
            '1 tbsp mayonnaise',
            '2 tbsp capers',
            '50g mixed greens',
            '1/4 red onion, diced',
            '1 tbsp olive oil',
            '1 tbsp red wine vinegar',
            'Salt, pepper'
        ],
        instructions: [
            'Drain tuna and flake into a bowl.',
            'Add chickpeas, capers, and diced onion.',
            'Mix Dijon mustard, mayo, olive oil, and vinegar for dressing.',
            'Toss tuna mixture with dressing.',
            'Serve over mixed greens.'
        ],
        storage: 'Tuna salad (without greens) keeps 2 days in fridge. Add greens fresh when serving. Do not freeze.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'l3',
        name: 'Egg & Potato Curry (Kichari-inspired)',
        category: 'lunch',
        emoji: '🍛',
        servings: 2,
        calories: 460,
        protein: 28,
        carbs: 45,
        fat: 18,
        fiber: 6,
        ingredients: [
            '4 hard-boiled eggs',
            '200g potatoes, cubed',
            '80g cooked lentils',
            '1 can (200ml) coconut milk (light)',
            '1 tbsp coconut oil',
            '1 tsp turmeric',
            '1 tsp garam masala',
            '1 tsp curry powder',
            '1/2 tsp ginger powder',
            '2 cloves garlic, minced',
            'Salt to taste',
            'Fresh parsley for garnish'
        ],
        instructions: [
            'Boil eggs for 10 min, peel and halve.',
            'Boil potato cubes until tender, about 12 min.',
            'Heat coconut oil in a pan. Sauté garlic 1 min.',
            'Add turmeric, garam masala, curry powder, and ginger. Stir 30s.',
            'Add coconut milk and lentils. Simmer 5 min.',
            'Add potatoes and eggs. Simmer 5 more min.',
            'Season with salt and garnish with parsley.'
        ],
        storage: 'Refrigerate up to 4 days. Reheat on stovetop or microwave 2-3 min. Eggs may get slightly rubbery — add a splash of water when reheating.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'l4',
        name: 'High-Protein Pasta with Chicken',
        category: 'lunch',
        emoji: '🍝',
        servings: 2,
        calories: 510,
        protein: 42,
        carbs: 52,
        fat: 13,
        fiber: 4,
        ingredients: [
            '120g angel hair pasta (dry)',
            '200g chicken breast, sliced',
            '2 cloves garlic, minced',
            '1 tbsp basil paste',
            '1 tbsp tomato paste',
            '1 tbsp olive oil',
            '30g parmesan cheese, grated',
            '50g cherry tomatoes, halved',
            'Red pepper flakes',
            'Salt, pepper'
        ],
        instructions: [
            'Cook pasta according to package. Reserve 1/2 cup pasta water.',
            'Season chicken with salt, pepper, and garlic powder. Sauté in olive oil until golden, 5-6 min.',
            'In the same pan, sauté garlic 30s. Add basil paste, tomato paste, and a splash of pasta water.',
            'Toss in cooked pasta and cherry tomatoes.',
            'Top with parmesan and red pepper flakes.'
        ],
        storage: 'Fridge up to 3 days. Reheat with a splash of water in microwave 2 min or on stovetop. Pasta may absorb sauce — add extra pasta water.',
        source: 'USDA FoodData Central'
    },

    // ==================== DINNER ====================
    {
        id: 'd1',
        name: 'Baked Salmon with Brown Rice',
        category: 'dinner',
        emoji: '🐟',
        servings: 1,
        calories: 530,
        protein: 42,
        carbs: 40,
        fat: 20,
        fiber: 4,
        ingredients: [
            '150g salmon fillet',
            '100g brown rice (cooked)',
            '100g steamed broccoli',
            '1 tsp toasted sesame oil',
            '1 tbsp soy sauce',
            '1 tsp ginger powder',
            'Furikake powder for garnish',
            'Lime wedge'
        ],
        instructions: [
            'Preheat oven to 200°C/400°F.',
            'Place salmon on a lined baking sheet. Season with soy sauce, sesame oil, and ginger.',
            'Bake 12-15 min until salmon flakes easily.',
            'Steam broccoli until bright green and tender-crisp, 4-5 min.',
            'Serve salmon over brown rice with broccoli.',
            'Sprinkle furikake and squeeze lime on top.'
        ],
        storage: 'Cooked salmon keeps 2-3 days in fridge. Reheat gently at 150°C/300°F for 8 min or microwave 1 min. Overcooking dries it out.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'd2',
        name: 'Turkey & Black Bean Burrito Bowl',
        category: 'dinner',
        emoji: '🌯',
        servings: 1,
        calories: 490,
        protein: 40,
        carbs: 45,
        fat: 15,
        fiber: 10,
        ingredients: [
            '150g ground turkey (93% lean)',
            '80g black beans (canned, drained)',
            '80g basmati rice (cooked)',
            '50g corn kernels',
            '30g shredded mozzarella',
            '2 tbsp Greek yogurt (as sour cream)',
            '1/2 avocado (50g)',
            '1 tbsp achiote seasoning',
            'Fresh jalapeño slices',
            'Lime juice, salt'
        ],
        instructions: [
            'Cook basmati rice according to package.',
            'Brown ground turkey in a pan with achiote seasoning, salt, 5-6 min.',
            'Add black beans and corn, cook 3 more min.',
            'Build bowl: rice, turkey-bean mix, avocado, cheese, yogurt.',
            'Top with jalapeño and lime juice.'
        ],
        storage: 'Meal prep: store turkey-bean mix and rice separately up to 4 days. Add fresh avocado, yogurt, and jalapeño when serving.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'd3',
        name: 'Stir-Fry Rice Noodles with Shrimp',
        category: 'dinner',
        emoji: '🍜',
        servings: 1,
        calories: 440,
        protein: 35,
        carbs: 50,
        fat: 12,
        fiber: 3,
        ingredients: [
            '150g shrimp (peeled)',
            '80g stir-fry rice noodles (dry)',
            '1 egg',
            '50g bean sprouts',
            '2 tbsp soy sauce',
            '1 tbsp fish sauce',
            '1 tsp toasted sesame oil',
            '1 clove garlic, minced',
            'Lime wedge',
            'Crushed red pepper'
        ],
        instructions: [
            'Soak rice noodles in warm water 10-15 min until pliable. Drain.',
            'Heat sesame oil in a wok or large pan over high heat.',
            'Sauté garlic 30s, add shrimp. Cook 2-3 min until pink.',
            'Push shrimp aside, scramble egg in the pan.',
            'Add noodles, soy sauce, and fish sauce. Toss everything together.',
            'Add bean sprouts, toss 1 min.',
            'Serve with lime and crushed red pepper.'
        ],
        storage: 'Best eaten fresh. Leftovers keep 1-2 days in fridge. Reheat in a hot pan with a splash of water — microwave makes noodles mushy.',
        source: 'USDA FoodData Central'
    },
    {
        id: 'd4',
        name: 'Chicken Tikka with Basmati Rice',
        category: 'dinner',
        emoji: '🍢',
        servings: 2,
        calories: 500,
        protein: 44,
        carbs: 42,
        fat: 16,
        fiber: 3,
        ingredients: [
            '300g chicken breast, cubed',
            '100g Greek yogurt (marinade)',
            '100g basmati rice (dry)',
            '1 tbsp garam masala',
            '1 tsp turmeric',
            '1 tsp cayenne pepper',
            '1 tsp coriander powder',
            '2 cloves garlic, minced',
            '1 tsp ginger powder',
            '1 tbsp olive oil',
            'Salt',
            'Fresh parsley or cilantro'
        ],
        instructions: [
            'Mix yogurt, garam masala, turmeric, cayenne, coriander, garlic, ginger, and salt.',
            'Coat chicken cubes in marinade. Refrigerate 30 min to 24 hours.',
            'Cook basmati rice according to package.',
            'Thread chicken on skewers (optional). Grill or bake at 220°C/425°F for 15-18 min.',
            'Alternatively, cook in a hot skillet with olive oil.',
            'Serve over rice with fresh herbs.'
        ],
        storage: 'Marinated raw chicken keeps 24h in fridge. Cooked chicken + rice: fridge 4 days, freezer 2 months. Reheat in microwave 2 min.',
        source: 'USDA FoodData Central'
    },

    // ==================== SNACKS ====================
    {
        id: 's1',
        name: 'Protein Energy Balls',
        category: 'snack',
        emoji: '🟤',
        servings: 6,
        calories: 150,
        protein: 10,
        carbs: 15,
        fat: 7,
        fiber: 3,
        ingredients: [
            '100g rolled oats',
            '60g almond butter',
            '2 tbsp raw honey',
            '2 tbsp cacao powder',
            '2 tbsp chia seeds',
            'Pinch of cinnamon',
            'Pinch of salt'
        ],
        instructions: [
            'Mix all ingredients in a bowl until well combined.',
            'Roll into 12 small balls (about 1 tbsp each).',
            'Refrigerate for at least 30 min to firm up.',
            'Serve 2 balls per snack portion.'
        ],
        storage: 'Fridge up to 1 week, freezer up to 1 month. No reheating needed — eat cold or at room temp.',
        source: 'USDA FoodData Central'
    },
    {
        id: 's2',
        name: 'Cottage Cheese & Fruit',
        category: 'snack',
        emoji: '🧀',
        servings: 1,
        calories: 180,
        protein: 20,
        carbs: 18,
        fat: 3,
        fiber: 2,
        ingredients: [
            '150g cottage cheese (low-fat)',
            '60g blackberries or banana slices',
            '1 tsp raw honey',
            'Pinch of cinnamon'
        ],
        instructions: [
            'Scoop cottage cheese into a bowl.',
            'Top with fruit.',
            'Drizzle honey and sprinkle cinnamon.'
        ],
        storage: 'Eat immediately. Do not prep ahead with fruit — it gets watery.',
        source: 'USDA FoodData Central'
    },
    {
        id: 's3',
        name: 'RX Bar + Banana',
        category: 'snack',
        emoji: '🍌',
        servings: 1,
        calories: 310,
        protein: 14,
        carbs: 50,
        fat: 9,
        fiber: 4,
        ingredients: [
            '1 RX Protein Bar',
            '1 medium banana'
        ],
        instructions: [
            'Unwrap bar. Peel banana. Eat.'
        ],
        storage: 'RX bars keep at room temp. Bananas at room temp until ripe.',
        source: 'Product label + USDA FoodData Central'
    },
    {
        id: 's4',
        name: 'Greek Yogurt with Honey & Nuts',
        category: 'snack',
        emoji: '🍯',
        servings: 1,
        calories: 200,
        protein: 18,
        carbs: 16,
        fat: 8,
        fiber: 1,
        ingredients: [
            '150g Greek yogurt',
            '1 tbsp raw honey',
            '10g almonds or walnuts, chopped',
            'Pinch of cardamom'
        ],
        instructions: [
            'Spoon yogurt into a bowl.',
            'Top with honey, chopped nuts, and cardamom.'
        ],
        storage: 'Eat immediately for best texture.',
        source: 'USDA FoodData Central'
    },
    {
        id: 's5',
        name: 'Hard-Boiled Eggs with Everything',
        category: 'snack',
        emoji: '🥚',
        servings: 1,
        calories: 160,
        protein: 13,
        carbs: 1,
        fat: 11,
        fiber: 0,
        ingredients: [
            '2 hard-boiled eggs',
            'Pinch of furikake powder',
            'Pinch of salt and pepper',
            'Valentina hot sauce (optional)'
        ],
        instructions: [
            'Boil eggs for 10 min. Ice bath to cool.',
            'Peel and halve.',
            'Season with furikake, salt, pepper, and hot sauce.'
        ],
        storage: 'Hard-boiled eggs (peeled or unpeeled) keep 5 days in fridge.',
        source: 'USDA FoodData Central'
    }
];

// ========== PANTRY DATA (from Notion) ==========
const PANTRY_DATA = {
    'Spices & Seasonings': {
        icon: '🧂',
        items: ['Crushed red pepper', 'Black pepper', 'White pepper', 'Garlic salt', 'Garlic powder', 'Onion powder', 'Kosher sea salt', 'Herbs de Provence', 'Rosemary', 'Parsley', 'Thyme', 'Tarragon', 'Chives', 'Basil', 'Mustard seeds', 'Fennel seeds', 'Cardamom', 'Coriander powder', 'Umami seasoning blend', 'Salmon broth blend', 'Furikake powder', 'Garam masala', 'Curry powder', 'Smoky chili powder', 'Hot chili powder', 'Cayenne pepper', 'Red pepper flakes', 'Paprika', 'Peperoncino & aglio oil', 'Kichari spice mix', 'Balinese fondue spice mix', 'Achiote', 'Maggi beef flavor bouillon', 'Nutmeg', 'Ginger powder', 'Triphala', 'Brahmi', 'Turmeric', 'Saffron', 'Tonka extract', 'Cinnamon', 'Vanilla extract', 'Orange extract', 'Baking powder']
    },
    'Condiments & Sauces': {
        icon: '🫕',
        items: ['Maggi condiment', 'Fish sauce', 'Soy sauce', 'Dijon mustard', 'Mayonnaise', 'Tahini', 'Valentina spicy sauce', 'Capers', 'Green olives', 'Basil paste', 'Tomato paste', 'Jalapeños']
    },
    'Vinegars & Oils': {
        icon: '🫒',
        items: ['Balsamic vinegar', 'White wine vinegar', 'Red wine vinegar', 'Organic avocado oil', 'Coconut oil', 'Safflower oil', 'Olive oil', 'Almond oil', 'White truffle oil', 'Toasted sesame oil']
    },
    'Pasta & Noodles': {
        icon: '🍝',
        items: ['Angel hair', 'Lasagna noodles', 'Ditalini pasta', 'Stir-fry rice noodles (2x)']
    },
    'Rice & Legumes': {
        icon: '🍚',
        items: ['Basmati rice', 'Brown rice', 'Lentils', 'Chickpeas']
    },
    'Flours & Baking': {
        icon: '🧁',
        items: ['Arepa flour', 'All-purpose flour', 'Almond flour', 'Monk fruit sweetener', 'Raw cane sugar', 'Cacao powder', 'Rolled oats']
    },
    'Beverages': {
        icon: '🫖',
        items: ['Coffee (2x)', 'Green tea', 'Black tea', 'Hibiscus tea', 'Chai tea']
    },
    'Snacks': {
        icon: '🍫',
        items: ['RX protein bars', 'Raw honey']
    },
    'Produce': {
        icon: '🥑',
        items: ['Avocados (1)', 'Limes (3)', 'Garlic', 'Jalapeños (fresh)', 'Potatoes', 'Sprout seeds', 'Bananas', 'Blackberries']
    },
    'Dairy & Alternatives': {
        icon: '🧈',
        items: ['Butter', 'Clarified butter (ghee)', 'Greek yogurt', 'Parmesan cheese', 'Mozzarella pearls', 'Shredded mozzarella cheese', 'Oat milk']
    },
    'Protein': {
        icon: '🥚',
        items: ['Eggs']
    },
    'Nut Butters & Spreads': {
        icon: '🥜',
        items: ['Almond butter']
    }
};
