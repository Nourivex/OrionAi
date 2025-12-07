import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRightLeft, Ruler, Weight, Thermometer, Clock } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature' | 'time';

interface Unit {
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const units: Record<Category, Unit[]> = {
  length: [
    { name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  ],
  temperature: [
    { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  time: [
    { name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
    { name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { name: 'Hours', symbol: 'hr', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { name: 'Weeks', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
  ],
};

const categoryIcons: Record<Category, React.ReactNode> = {
  length: <Ruler size={18} />,
  weight: <Weight size={18} />,
  temperature: <Thermometer size={18} />,
  time: <Clock size={18} />,
};

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const convert = (value: string, from: number, to: number) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    
    const currentUnits = units[category];
    const baseValue = currentUnits[from].toBase(num);
    const result = currentUnits[to].fromBase(baseValue);
    
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  useEffect(() => {
    setToValue(convert(fromValue, fromUnit, toUnit));
  }, [fromValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setFromUnit(0);
    setToUnit(1);
    setFromValue('1');
  };

  const currentUnits = units[category];

  return (
    <div className="p-6 bg-theme-bg min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/tool" className="p-2 rounded-lg hover:bg-theme-surface/60 transition-colors text-theme-text/70 hover:text-theme-text">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Unit Converter</h1>
            <p className="text-sm text-theme-text/60">Convert length, weight, temperature & time</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(Object.keys(units) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-theme-primary text-theme-onPrimary shadow-lg'
                  : 'bg-theme-surface/40 text-theme-text/70 hover:bg-theme-surface hover:text-theme-text'
              }`}
            >
              {categoryIcons[cat]}
              <span className="capitalize font-medium">{cat}</span>
            </button>
          ))}
        </div>

        <div className="bg-theme-surface/40 border border-theme-primary-dark/10 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-theme-text/70 mb-2">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(Number(e.target.value))}
                className="w-full px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary/30 mb-3"
              >
                {currentUnits.map((unit, i) => (
                  <option key={i} value={i}>{unit.name} ({unit.symbol})</option>
                ))}
              </select>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                className="w-full px-4 py-4 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-2xl text-theme-text font-mono focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
                placeholder="0"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center py-4">
              <button
                onClick={swapUnits}
                className="p-3 bg-theme-primary/10 hover:bg-theme-primary/20 rounded-full text-theme-primary transition-colors"
              >
                <ArrowRightLeft size={20} />
              </button>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-theme-text/70 mb-2">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(Number(e.target.value))}
                className="w-full px-4 py-3 bg-theme-bg border border-theme-primary-dark/10 rounded-xl text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary/30 mb-3"
              >
                {currentUnits.map((unit, i) => (
                  <option key={i} value={i}>{unit.name} ({unit.symbol})</option>
                ))}
              </select>
              <div className="w-full px-4 py-4 bg-theme-primary/10 border border-theme-primary/20 rounded-xl text-2xl text-theme-primary font-mono">
                {toValue || '0'}
              </div>
            </div>
          </div>

          {/* Result Summary */}
          <div className="mt-6 p-4 bg-theme-bg/50 rounded-xl text-center">
            <p className="text-theme-text/80">
              <span className="font-mono font-bold">{fromValue || '0'}</span>{' '}
              <span className="text-theme-text/50">{currentUnits[fromUnit].symbol}</span>
              {' = '}
              <span className="font-mono font-bold text-theme-primary">{toValue || '0'}</span>{' '}
              <span className="text-theme-text/50">{currentUnits[toUnit].symbol}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
