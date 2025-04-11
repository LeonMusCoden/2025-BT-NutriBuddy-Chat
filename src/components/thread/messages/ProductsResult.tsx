import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion } from "framer-motion";

// Types definition for product data
interface ProductNutrients {
  base: string;
  kj: number;
  kcal: number;
  fatsG: number;
  saturatedFatsG: number;
  carbohydratesG: number;
  sugarsG: number;
  fibersG: number;
  proteinsG: number;
  saltG: number;
  sodiumMg?: number;
  fatsPrefix?: string;
  saturatedFatsPrefix?: string;
  carbohydratesPrefix?: string;
  sugarsPrefix?: string;
  fibersPrefix?: string;
  proteinsPrefix?: string;
  saltPrefix?: string;
}

interface ProductDiet {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  lactoseFree: boolean;
}

interface Product {
  id: number;
  name: string;
  category_lvl_1: string;
  category_lvl_2: string;
  brand: string;
  price: number;
  nutrients: ProductNutrients;
  nutri_score: string;
  allergens: string[];
  gtins: number[];
  image_url: string;
  retailer: string;
  is_generic: boolean;
  diet: ProductDiet;
  ingredients: string;
  productWeight: number;
  unit: string;
  storage: string | null;
}

export function ProductsResult({ data }: { data: Product[] }) {
  return (
    <div className="space-y-2 w-full">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  
  // Format price to display with 2 decimal places
  const formattedPrice = product.price ? product.price.toFixed(2) : "N/A";
  
  // Map allergen codes to human-readable text
  const allergenNames: Record<string, string> = {
    'cowMilk': 'Milk',
    'gluten': 'Gluten',
    'sesame': 'Sesame',
    'eggs': 'Eggs',
    'peanuts': 'Peanuts',
    'treeNuts': 'Nuts',
    'fish': 'Fish',
    'shellfish': 'Shellfish',
    'wheat': 'Wheat',
    'soy': 'Soy',
    'lupin': 'Lupin',
    'celery': 'Celery',
    'mustard': 'Mustard',
    'sulphites': 'Sulphites',
    'lactose': 'Lactose'
  };

  // Diet labels to display
  const dietLabels = [];
  if (product.diet.vegetarian) dietLabels.push("Vegetarian");
  if (product.diet.vegan) dietLabels.push("Vegan");
  if (product.diet.glutenFree) dietLabels.push("Gluten-Free");
  if (product.diet.lactoseFree) dietLabels.push("Lactose-Free");
  
  return (
    <div className="overflow-hidden border border-gray-200 rounded-md">
      <div className="flex flex-row">
        {/* Product image - smaller */}
        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white border-r border-gray-200">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="object-contain max-h-14 max-w-14"
            />
          ) : (
            <div className="bg-gray-100 w-10 h-10 flex items-center justify-center text-gray-400">
              <Info className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Product details - compact layout */}
        <div className="flex-1 p-2">
          <div className="flex justify-between items-start gap-2">
            {/* Name and brand */}
            <div className="flex-1">
              <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
              <p className="text-xs text-gray-500">{product.brand} • {product.productWeight}{product.unit}</p>
            </div>
            
            {/* Price */}
            <div className="font-bold text-sm whitespace-nowrap">
              CHF {formattedPrice}
            </div>
          </div>
          
          {/* Nutrition and diet info in compact row */}
          <div className="flex flex-wrap items-center mt-1 gap-x-3 gap-y-1">
            <span className="text-xs">
              <span className="font-medium">{product.nutrients.kcal}</span> kcal
            </span>
            <span className="text-xs">
              <span className="font-medium">{product.nutrients.proteinsG}g</span> protein
            </span>
            <span className="text-xs">
              <span className="font-medium">{product.nutrients.carbohydratesG}g</span> carbs
            </span>
            <span className="text-xs">
              <span className="font-medium">{product.nutrients.fatsG}g</span> fat
            </span>
          </div>
          
          {/* Diet badges and allergens in compact row */}
          <div className="flex flex-wrap gap-1 mt-1">
            {/* Diet badges */}
            {dietLabels.map(label => (
              <span key={label} className="px-1.5 py-0.5 text-xs bg-green-50 text-green-800 rounded-sm border border-green-100">
                {label}
              </span>
            ))}
            
            {/* Allergen badges */}
            {product.allergens.length > 0 && product.allergens.map(allergen => (
              <span key={allergen} className="px-1.5 py-0.5 text-xs bg-amber-50 text-amber-800 rounded-sm border border-amber-100">
                {allergenNames[allergen] || allergen}
              </span>
            ))}
          </div>
          
          {/* Expandable section - simplified */}
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-1 py-1 flex items-center justify-center text-xs text-gray-500 hover:text-gray-600 hover:bg-gray-50 transition-all ease-in-out duration-200 cursor-pointer"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                <span>Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                <span>More</span>
              </>
            )}
          </motion.button>
          
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-1 pb-2 px-1 text-xs space-y-2 border-t border-gray-100 mt-1">
              {/* General info */}
              <div className="text-gray-500">
                <div>Category: {product.category_lvl_1} › {product.category_lvl_2}</div>
                <div>Retailer: {product.retailer}</div>
                {product.storage && <div>Storage: {product.storage}</div>}
              </div>
              
              {/* Detailed nutrition in compact grid */}
              <div>
                <div className="font-medium mb-1">Nutrition (per {product.nutrients.base})</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <div>Energy: {product.nutrients.kj} kJ / {product.nutrients.kcal} kcal</div>
                  <div>Fat: {product.nutrients.fatsPrefix || ''}{product.nutrients.fatsG}g</div>
                  <div>- Saturated: {product.nutrients.saturatedFatsPrefix || ''}{product.nutrients.saturatedFatsG}g</div>
                  <div>Protein: {product.nutrients.proteinsPrefix || ''}{product.nutrients.proteinsG}g</div>
                  <div>Carbs: {product.nutrients.carbohydratesPrefix || ''}{product.nutrients.carbohydratesG}g</div>
                  <div>- Sugars: {product.nutrients.sugarsPrefix || ''}{product.nutrients.sugarsG}g</div>
                  <div>Fiber: {product.nutrients.fibersPrefix || ''}{product.nutrients.fibersG}g</div>
                  <div>Salt: {product.nutrients.saltPrefix || ''}{product.nutrients.saltG}g</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
