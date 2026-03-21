"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, Info, TrendingDown, TrendingUp, Sparkles, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SuggestionResult {
  productName: string;
  condition: string;
  yearsUsed: number;
  suggestedPrice: number;
  averagePrice: number;
  similarAds: any[];
}

export default function PriceEstimatorPage() {
  const [productName, setProductName] = useState("");
  const [condition, setCondition] = useState("good");
  const [yearsUsed, setYearsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [error, setError] = useState("");

  const handleEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/price-estimator?productName=${encodeURIComponent(productName)}&condition=${condition}&yearsUsed=${yearsUsed}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Smart Price <span className="text-blue-600">Estimator</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Get an instant, data-driven price suggestion for any product. We analyze current listings to give you the most accurate valuation.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* FORM SECTION */}
          <div className="lg:col-span-5">
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEstimate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      What are you selling?
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="e.g. iPhone 15 Pro, Toyota Corolla"
                        className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Condition
                      </label>
                      <select
                        className="w-full h-12 rounded-md bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 px-3 focus:ring-2 focus:ring-blue-500 text-sm"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                      >
                        <option value="new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Years Used
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500"
                        value={yearsUsed}
                        onChange={(e) => setYearsUsed(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
                    disabled={loading}
                  >
                    {loading ? "Calculating..." : "Get Price Suggestion"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                <Info className="w-4 h-4" />
                How it works
              </h4>
              <p className="text-sm text-blue-700/80 dark:text-blue-300/60 leading-relaxed">
                We scan our database for similar products and calculate an average market price. We then adjust this based on the item's condition and how long you've used it.
              </p>
            </div>
          </div>

          {/* RESULTS SECTION */}
          <div className="lg:col-span-7">
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-50">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Results will appear here</h3>
                <p className="text-slate-400 text-sm mt-2">Enter your product details to see our smart estimation.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center p-10 bg-white dark:bg-slate-900/50 rounded-3xl shadow-xl">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Analyzing market data...</p>
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl text-red-600 dark:text-red-400">
                <p className="font-medium">Oops!</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {result && result.suggestedPrice && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sparkles className="w-32 h-32" />
                  </div>
                  <CardContent className="p-8">
                    <p className="text-blue-100 font-medium mb-1">Recommended Selling Price</p>
                    <h2 className="text-6xl font-black mb-6">
                      ₹{result.suggestedPrice.toLocaleString()}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-100 uppercase tracking-wider">Average Market</p>
                          <p className="font-bold">₹{result.averagePrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-100 uppercase tracking-wider">Depreciation</p>
                          <p className="font-bold">
                            -{Math.round((1 - result.suggestedPrice / result.averagePrice) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <History className="w-5 h-5 text-blue-500" />
                      Similar Ads Found
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.similarAds.map((ad) => (
                      <Link 
                        key={ad._id} 
                        href={`/dashboard/buyer/ad/${ad._id}`}
                        className="group flex gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800"
                      >
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {ad.images?.[0] ? (
                            <Image 
                              src={ad.images[0]} 
                              alt={ad.title} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-500 transition-colors">
                            {ad.title}
                          </h4>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ₹{ad.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 truncate capitalize">
                            {ad.locationName || "Unknown Location"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result && !result.suggestedPrice && (
              <div className="p-10 text-center bg-white dark:bg-slate-900/50 rounded-3xl shadow-xl">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Search className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Not enough data</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                  We couldn't find enough active listings for "{result.productName}" to give an accurate suggestion. Try a more general search term.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
